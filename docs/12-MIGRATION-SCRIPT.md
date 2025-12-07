# 🔄 Migrácia z Kajabi

## Prehľad

Migračný skript importuje používateľov z Kajabi CSV exportu a:
1. Vytvorí používateľské účty
2. Priradí zakúpené kurzy
3. Odošle welcome email s linkom na reset hesla

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Kajabi    │────▶│   Script    │────▶│   Payload   │
│    CSV      │     │  (Node.js)  │     │     DB      │
└─────────────┘     └─────────────┘     └─────────────┘
                          │
                          ▼
                    ┌─────────────┐
                    │   Resend    │
                    │   (Email)   │
                    └─────────────┘
```

---

## 1. Export z Kajabi

### Krok 1: Export Používateľov

1. Kajabi Admin → People → All People
2. Export → CSV
3. Vybrať polia:
   - Email
   - First Name
   - Last Name
   - Products (zakúpené produkty)

### Krok 2: Formát CSV

```csv
Email,First Name,Last Name,Products
jana.novakova@email.sk,Jana,Nováková,"Permanentný Makeup, Nail Art"
peter.kral@email.sk,Peter,Kráľ,Permanentný Makeup
maria.horvathova@email.sk,Mária,Horváthová,
```

**Poznámky:**
- Products môže byť prázdne (používateľ bez kurzov)
- Products sú oddelené čiarkou v úvodzovkách
- Názvy produktov musia zodpovedať názvom v Payload CMS

---

## 2. Migračný Skript

### Inštalácia Závislostí

```bash
npm install csv-parse dotenv
```

### Skript

```typescript
// scripts/migrate-kajabi-users.ts
import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../src/payload.config'
import { parse } from 'csv-parse/sync'
import * as fs from 'fs'
import * as crypto from 'crypto'
import { sendMigrationWelcomeEmail } from '../src/lib/email-service'

interface KajabiUser {
  Email: string
  'First Name': string
  'Last Name': string
  Products: string
}

interface MigrationResult {
  email: string
  status: 'created' | 'skipped' | 'error'
  message?: string
  coursesAssigned?: string[]
}

async function migrateUsers(csvPath: string, dryRun = false) {
  console.log('🚀 Spúšťam migráciu z Kajabi...')
  console.log(`📁 CSV súbor: ${csvPath}`)
  console.log(`🔧 Dry run: ${dryRun ? 'ÁNO (bez zmien)' : 'NIE (produkčná migrácia)'}`)
  console.log('─'.repeat(50))

  // Inicializácia Payload
  const payload = await getPayload({ config: configPromise })

  // Načítanie CSV
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ Súbor neexistuje: ${csvPath}`)
    process.exit(1)
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8')
  const records: KajabiUser[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  })

  console.log(`📊 Nájdených ${records.length} používateľov v CSV`)

  // Načítanie všetkých kurzov pre mapovanie názvov na ID
  const coursesResult = await payload.find({
    collection: 'courses',
    limit: 100,
    pagination: false,
  })

  const courseMap = new Map<string, string>()
  coursesResult.docs.forEach((course) => {
    // Mapovanie podľa názvu (case insensitive)
    courseMap.set(course.title.toLowerCase().trim(), course.id)
  })

  console.log(`📚 Načítaných ${courseMap.size} kurzov z databázy`)
  console.log('─'.repeat(50))

  // Štatistiky
  const results: MigrationResult[] = []
  let created = 0
  let skipped = 0
  let errors = 0

  // Spracovanie používateľov
  for (let i = 0; i < records.length; i++) {
    const record = records[i]
    const email = record.Email?.toLowerCase().trim()

    if (!email) {
      console.log(`⚠️ Riadok ${i + 2}: Prázdny email, preskakujem`)
      continue
    }

    console.log(`\n[${i + 1}/${records.length}] Spracovávam: ${email}`)

    try {
      // Kontrola, či používateľ už existuje
      const existingUsers = await payload.find({
        collection: 'users',
        where: { email: { equals: email } },
        limit: 1,
      })

      if (existingUsers.docs.length > 0) {
        console.log(`  ⏭️ Preskakujem - používateľ už existuje`)
        results.push({
          email,
          status: 'skipped',
          message: 'Používateľ už existuje',
        })
        skipped++
        continue
      }

      // Mapovanie kurzov
      const purchasedCourses: string[] = []
      const courseNames: string[] = []

      if (record.Products) {
        const productNames = record.Products.split(',').map((p) => 
          p.trim().toLowerCase()
        )

        for (const productName of productNames) {
          if (productName) {
            const courseId = courseMap.get(productName)
            if (courseId) {
              purchasedCourses.push(courseId)
              courseNames.push(productName)
            } else {
              console.log(`  ⚠️ Kurz nenájdený: "${productName}"`)
            }
          }
        }
      }

      if (dryRun) {
        console.log(`  ✅ [DRY RUN] Bol by vytvorený:`)
        console.log(`     Meno: ${record['First Name']} ${record['Last Name']}`)
        console.log(`     Kurzy: ${courseNames.length > 0 ? courseNames.join(', ') : 'žiadne'}`)
        results.push({
          email,
          status: 'created',
          message: 'Dry run - nebol vytvorený',
          coursesAssigned: courseNames,
        })
        created++
        continue
      }

      // Generovanie náhodného hesla
      const tempPassword = crypto.randomBytes(16).toString('hex')

      // Vytvorenie používateľa
      const newUser = await payload.create({
        collection: 'users',
        data: {
          email,
          password: tempPassword,
          firstName: record['First Name'] || '',
          lastName: record['Last Name'] || '',
          purchasedCourses,
          roles: ['customer'],
        },
      })

      console.log(`  ✅ Vytvorený používateľ ID: ${newUser.id}`)
      console.log(`     Kurzy: ${courseNames.length > 0 ? courseNames.join(', ') : 'žiadne'}`)

      // Odoslanie welcome emailu
      try {
        await sendMigrationWelcomeEmail(
          email,
          record['First Name'],
          courseNames
        )
        console.log(`  📧 Welcome email odoslaný`)
      } catch (emailError) {
        console.log(`  ⚠️ Email sa nepodarilo odoslať: ${emailError}`)
      }

      results.push({
        email,
        status: 'created',
        coursesAssigned: courseNames,
      })
      created++

      // Rate limiting - pauza medzi vytváraním
      await sleep(100)

    } catch (error: any) {
      console.log(`  ❌ Chyba: ${error.message}`)
      results.push({
        email,
        status: 'error',
        message: error.message,
      })
      errors++
    }
  }

  // Súhrn
  console.log('\n' + '═'.repeat(50))
  console.log('📋 SÚHRN MIGRÁCIE')
  console.log('═'.repeat(50))
  console.log(`✅ Vytvorených: ${created}`)
  console.log(`⏭️ Preskočených: ${skipped}`)
  console.log(`❌ Chýb: ${errors}`)
  console.log('═'.repeat(50))

  // Export výsledkov do JSON
  const reportPath = `./migration-report-${Date.now()}.json`
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2))
  console.log(`\n📄 Report uložený: ${reportPath}`)

  // Exit
  process.exit(errors > 0 ? 1 : 0)
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// CLI
const csvPath = process.argv[2] || './kajabi-export.csv'
const dryRun = process.argv.includes('--dry-run')

migrateUsers(csvPath, dryRun).catch((error) => {
  console.error('Kritická chyba:', error)
  process.exit(1)
})
```

---

## 3. Spustenie Migrácie

### Krok 1: Príprava

```bash
# Uistite sa, že máte správny .env súbor
cp .env.example .env.local

# Nahrajte CSV do root adresára
# kajabi-export.csv
```

### Krok 2: Dry Run (Test)

```bash
# Spustiť bez vykonania zmien
npx ts-node scripts/migrate-kajabi-users.ts ./kajabi-export.csv --dry-run
```

**Výstup:**
```
🚀 Spúšťam migráciu z Kajabi...
📁 CSV súbor: ./kajabi-export.csv
🔧 Dry run: ÁNO (bez zmien)
──────────────────────────────────────────────────
📊 Nájdených 150 používateľov v CSV
📚 Načítaných 5 kurzov z databázy
──────────────────────────────────────────────────

[1/150] Spracovávam: jana.novakova@email.sk
  ✅ [DRY RUN] Bol by vytvorený:
     Meno: Jana Nováková
     Kurzy: permanentný makeup, nail art
...
```

### Krok 3: Produkčná Migrácia

```bash
# Skutočná migrácia
npx ts-node scripts/migrate-kajabi-users.ts ./kajabi-export.csv
```

---

## 4. Mapovanie Kurzov

### Ak sa názvy nezhodujú

Ak názvy kurzov v Kajabi nezodpovedajú názvom v Payload CMS, vytvorte mapovací súbor:

```typescript
// scripts/course-mapping.ts
export const COURSE_MAPPING: Record<string, string> = {
  // Kajabi názov -> Payload názov (lowercase)
  'permanentny makeup kurz': 'permanentný makeup',
  'permanent makeup complete': 'permanentný makeup',
  'nail art masterclass': 'nail art',
  'manikura zaklady': 'manikúra základy',
}
```

A v migračnom skripte:

```typescript
import { COURSE_MAPPING } from './course-mapping'

// V mappingu kurzov
let mappedName = productName
if (COURSE_MAPPING[productName]) {
  mappedName = COURSE_MAPPING[productName]
}
const courseId = courseMap.get(mappedName)
```

---

## 5. Welcome Email Template

Email odoslaný migrovaným používateľom:

```typescript
// src/emails/MigrationWelcomeEmail.tsx
// (Už definované v 07-EMAIL-SYSTEM.md)
```

**Obsah emailu:**
- Informácia o novej platforme
- Zoznam prenesených kurzov
- Link na reset hesla
- Kontaktné informácie pre podporu

---

## 6. Post-Migrácia

### Verifikácia

```bash
# Počet používateľov v databáze
SELECT COUNT(*) FROM users;

# Používatelia s kurzami
SELECT 
  u.email, 
  COUNT(uc.course_id) as courses_count
FROM users u
LEFT JOIN users_purchased_courses uc ON u.id = uc.user_id
GROUP BY u.email
ORDER BY courses_count DESC;
```

### Rollback (Ak Potrebné)

```bash
# Vymazanie migrovaných používateľov (opatrne!)
# Len ak nemajú žiadne objednávky

DELETE FROM users 
WHERE created_at > '2024-01-01' 
AND id NOT IN (SELECT user_id FROM orders);
```

---

## 7. Troubleshooting

### Duplicitné Emaily

```
Error: duplicate key value violates unique constraint
```

**Riešenie:** Používateľ už existuje, skript ho automaticky preskočí.

### Kurz Nenájdený

```
⚠️ Kurz nenájdený: "permanentný makeup"
```

**Riešenie:** Pridajte mapovanie do `COURSE_MAPPING` alebo upravte názov kurzu v Payload CMS.

### Email Chyba

```
⚠️ Email sa nepodarilo odoslať: rate limit exceeded
```

**Riešenie:** Zvýšte delay medzi vytváraním používateľov alebo rozdeľte migráciu na dávky.

---

## 8. Batch Migrácia

Pre veľký počet používateľov (1000+):

```typescript
// scripts/migrate-batch.ts
async function migrateBatch(startIndex: number, batchSize: number) {
  // Spracovať len časť CSV
  const batch = records.slice(startIndex, startIndex + batchSize)
  // ...
}

// Spustenie po dávkach
// npx ts-node scripts/migrate-batch.ts 0 100    # Prvých 100
// npx ts-node scripts/migrate-batch.ts 100 100  # Ďalších 100
```

---

## 📋 Checklist Migrácie

### Pred Migráciou
- [ ] CSV export z Kajabi
- [ ] Kurzy vytvorené v Payload CMS
- [ ] Mapovanie názvov kurzov (ak potrebné)
- [ ] Resend API key nakonfigurovaný
- [ ] Testovací dry run úspešný

### Počas Migrácie
- [ ] Monitorovanie výstupu
- [ ] Kontrola emailov (prvých pár)
- [ ] Sledovanie error rate

### Po Migrácii
- [ ] Verifikácia počtu používateľov
- [ ] Verifikácia priradených kurzov
- [ ] Test prihlásenia ako migrovaný user
- [ ] Kontrola prijatia welcome emailov
- [ ] Uloženie migration report

---

*Migračný skript pre bezproblémový prechod z Kajabi na novú platformu.*


