# 🗄️ Databázové Schémy (Payload CMS)

## Prehľad Kolekcií

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Users     │────▶│   Orders     │◀────│   Courses    │
│  (customers) │     │  (purchases) │     │  (products)  │
└──────────────┘     └──────────────┘     └──────────────┘
       │                                         │
       │              ┌──────────────┐           │
       └─────────────▶│    Media     │◀──────────┘
                      │   (files)    │
                      └──────────────┘
```

---

## 1. Users (Používatelia)

Rozšírenie defaultnej `users` kolekcie s autentifikáciou.

### Schéma

| Pole | Typ | Povinné | Popis |
|------|-----|---------|-------|
| `email` | Email | ✅ | Prihlasovací email |
| `password` | Text (hashed) | ✅ | Heslo (auto) |
| `firstName` | Text | ❌ | Meno |
| `lastName` | Text | ❌ | Priezvisko |
| `stripeCustomerId` | Text | ❌ | Stripe Customer ID |
| `purchasedCourses` | Relationship → Courses | ❌ | Zakúpené kurzy |
| `roles` | Select (multi) | ✅ | admin / customer |
| `avatar` | Upload → Media | ❌ | Profilová fotka |
| `createdAt` | Date | ✅ | Auto timestamp |
| `updatedAt` | Date | ✅ | Auto timestamp |

### Payload Kolekcia

```typescript
// src/collections/Users.ts
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true, // Povolí autentifikáciu
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName', 'roles', 'createdAt'],
    group: 'Používatelia',
  },
  access: {
    // Kto môže čo
    read: ({ req: { user } }) => {
      if (user?.roles?.includes('admin')) return true
      return { id: { equals: user?.id } }
    },
    create: () => true, // Registrácia
    update: ({ req: { user } }) => {
      if (user?.roles?.includes('admin')) return true
      return { id: { equals: user?.id } }
    },
    delete: ({ req: { user } }) => user?.roles?.includes('admin') ?? false,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          label: 'Meno',
        },
        {
          name: 'lastName',
          type: 'text',
          label: 'Priezvisko',
        },
      ],
    },
    {
      name: 'stripeCustomerId',
      type: 'text',
      label: 'Stripe Customer ID',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Automaticky generované pri prvej platbe',
      },
    },
    {
      name: 'purchasedCourses',
      type: 'relationship',
      relationTo: 'courses',
      hasMany: true,
      label: 'Zakúpené kurzy',
      admin: {
        description: 'Kurzy, ku ktorým má užívateľ prístup',
      },
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['customer'],
      label: 'Role',
      options: [
        { label: 'Administrátor', value: 'admin' },
        { label: 'Zákazník', value: 'customer' },
      ],
      access: {
        // Len admin môže meniť role
        update: ({ req: { user } }) => user?.roles?.includes('admin') ?? false,
      },
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Profilová fotka',
    },
  ],
  timestamps: true,
}
```

---

## 2. Courses (Kurzy)

Hlavná kolekcia pre produkty (kurzy).

### Schéma

| Pole | Typ | Povinné | Popis |
|------|-----|---------|-------|
| `title` | Text | ✅ | Názov kurzu |
| `slug` | Text | ✅ | URL slug (unique) |
| `description` | RichText | ❌ | Popis kurzu |
| `shortDescription` | Textarea | ❌ | Krátky popis |
| `coverImage` | Upload → Media | ✅ | Titulný obrázok |
| `price` | Number | ✅ | Cena v EUR |
| `priceId` | Text | ✅ | Stripe Price ID |
| `status` | Select | ✅ | draft / published |
| `modules` | Array | ✅ | Moduly kurzu |
| `modules.title` | Text | ✅ | Názov modulu |
| `modules.lessons` | Array | ✅ | Lekcie v module |
| `modules.lessons.title` | Text | ✅ | Názov lekcie |
| `modules.lessons.videoCloudflareId` | Text | ❌ | Cloudflare Video ID |
| `modules.lessons.duration` | Number | ❌ | Dĺžka v minútach |
| `modules.lessons.content` | RichText | ❌ | Text pod videom |
| `modules.lessons.resources` | Upload → Media | ❌ | PDF na stiahnutie |
| `modules.lessons.isFree` | Checkbox | ❌ | Bezplatná ukážka |

### Payload Kolekcia

```typescript
// src/collections/Courses.ts
import type { CollectionConfig } from 'payload'
import { slugField } from '@/fields/slug'

export const Courses: CollectionConfig = {
  slug: 'courses',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'status', 'updatedAt'],
    group: 'Obsah',
    preview: (doc) => {
      if (doc?.slug) {
        return `${process.env.NEXT_PUBLIC_APP_URL}/kurzy/${doc.slug}`
      }
      return null
    },
  },
  access: {
    read: ({ req: { user } }) => {
      // Admin vidí všetko, ostatní len published
      if (user?.roles?.includes('admin')) return true
      return { status: { equals: 'published' } }
    },
    create: ({ req: { user } }) => user?.roles?.includes('admin') ?? false,
    update: ({ req: { user } }) => user?.roles?.includes('admin') ?? false,
    delete: ({ req: { user } }) => user?.roles?.includes('admin') ?? false,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Názov kurzu',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL Slug',
      required: true,
      unique: true,
      admin: {
        description: 'Automaticky generované z názvu (napr. permanentny-makeup)',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Krátky popis',
      admin: {
        description: 'Zobrazí sa na kartičke kurzu (max 200 znakov)',
      },
      maxLength: 200,
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Detailný popis',
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Titulný obrázok',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'number',
          required: true,
          label: 'Cena (EUR)',
          min: 0,
          admin: {
            width: '50%',
            description: 'Cena pre zobrazenie na webe',
          },
        },
        {
          name: 'priceId',
          type: 'text',
          required: true,
          label: 'Stripe Price ID',
          admin: {
            width: '50%',
            description: 'Skopírujte z Stripe Dashboard (price_xxx)',
          },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      label: 'Stav',
      options: [
        { label: 'Koncept', value: 'draft' },
        { label: 'Publikovaný', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    // MODULY A LEKCIE
    {
      name: 'modules',
      type: 'array',
      label: 'Moduly',
      admin: {
        description: 'Štruktúra kurzu - moduly obsahujú lekcie',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Názov modulu',
        },
        {
          name: 'lessons',
          type: 'array',
          label: 'Lekcie',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Názov lekcie',
            },
            {
              name: 'videoCloudflareId',
              type: 'text',
              label: 'Cloudflare Video ID',
              admin: {
                description: 'ID videa z Cloudflare Stream (nie URL!)',
              },
            },
            {
              name: 'duration',
              type: 'number',
              label: 'Dĺžka (minúty)',
              min: 0,
            },
            {
              name: 'content',
              type: 'richText',
              label: 'Textový obsah',
              admin: {
                description: 'Zobrazí sa pod videom',
              },
            },
            {
              name: 'resources',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: 'Materiály na stiahnutie',
            },
            {
              name: 'isFree',
              type: 'checkbox',
              defaultValue: false,
              label: 'Bezplatná ukážka',
              admin: {
                description: 'Ak zaškrtnuté, lekcia je dostupná bez nákupu',
              },
            },
          ],
        },
      ],
    },
    // Metadata
    {
      name: 'totalDuration',
      type: 'number',
      label: 'Celková dĺžka (minúty)',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Automaticky počítané',
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            let total = 0
            data?.modules?.forEach((module: any) => {
              module?.lessons?.forEach((lesson: any) => {
                total += lesson?.duration || 0
              })
            })
            return total
          },
        ],
      },
    },
    {
      name: 'lessonsCount',
      type: 'number',
      label: 'Počet lekcií',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            let count = 0
            data?.modules?.forEach((module: any) => {
              count += module?.lessons?.length || 0
            })
            return count
          },
        ],
      },
    },
  ],
  timestamps: true,
}
```

---

## 3. Orders (Objednávky)

História nákupov - generované webhookom.

### Schéma

| Pole | Typ | Povinné | Popis |
|------|-----|---------|-------|
| `stripeCheckoutId` | Text | ✅ | Stripe Checkout Session ID |
| `stripePaymentIntentId` | Text | ❌ | Payment Intent ID |
| `user` | Relationship → Users | ✅ | Zákazník |
| `course` | Relationship → Courses | ✅ | Zakúpený kurz |
| `amount` | Number | ✅ | Suma v centoch |
| `currency` | Text | ✅ | Mena (eur) |
| `status` | Select | ✅ | paid / refunded / failed |
| `customerEmail` | Email | ❌ | Email zákazníka |

### Payload Kolekcia

```typescript
// src/collections/Orders.ts
import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'stripeCheckoutId',
    defaultColumns: ['user', 'course', 'amount', 'status', 'createdAt'],
    group: 'Obchod',
  },
  access: {
    // Len na čítanie pre admina
    read: ({ req: { user } }) => {
      if (user?.roles?.includes('admin')) return true
      return { user: { equals: user?.id } }
    },
    create: () => false, // Len cez webhook
    update: ({ req: { user } }) => user?.roles?.includes('admin') ?? false,
    delete: () => false, // Nikdy nemazať
  },
  fields: [
    {
      name: 'stripeCheckoutId',
      type: 'text',
      required: true,
      unique: true,
      label: 'Stripe Checkout ID',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'stripePaymentIntentId',
      type: 'text',
      label: 'Payment Intent ID',
      admin: {
        readOnly: true,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
          label: 'Zákazník',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'course',
          type: 'relationship',
          relationTo: 'courses',
          required: true,
          label: 'Kurz',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'amount',
          type: 'number',
          required: true,
          label: 'Suma (centy)',
          admin: {
            readOnly: true,
            width: '33%',
            description: 'Suma v centoch',
          },
        },
        {
          name: 'currency',
          type: 'text',
          defaultValue: 'eur',
          label: 'Mena',
          admin: {
            readOnly: true,
            width: '33%',
          },
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'paid',
          label: 'Stav',
          options: [
            { label: 'Zaplatené', value: 'paid' },
            { label: 'Vrátené', value: 'refunded' },
            { label: 'Zlyhalo', value: 'failed' },
          ],
          admin: {
            width: '33%',
          },
        },
      ],
    },
    {
      name: 'customerEmail',
      type: 'email',
      label: 'Email zákazníka',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
  hooks: {
    afterRead: [
      // Formátovaná suma pre admin panel
      ({ doc }) => {
        if (doc.amount) {
          doc.formattedAmount = `€${(doc.amount / 100).toFixed(2)}`
        }
        return doc
      },
    ],
  },
}
```

---

## 4. Media (Súbory)

Nahrané súbory (obrázky, PDF).

### Payload Kolekcia

```typescript
// src/collections/Media.ts
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Obsah',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.roles?.includes('admin') ?? false,
    update: ({ req: { user } }) => user?.roles?.includes('admin') ?? false,
    delete: ({ req: { user } }) => user?.roles?.includes('admin') ?? false,
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*', 'application/pdf'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 576,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        position: 'centre',
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt text',
      admin: {
        description: 'Popis obrázku pre accessibility',
      },
    },
  ],
}
```

---

## 📊 Vzťahy Medzi Kolekciami

```
Users
  │
  ├──< purchasedCourses ──> Courses (Many-to-Many)
  │
  └──< orders ──> Orders (One-to-Many)
                    │
                    └──> course ──> Courses (Many-to-One)

Courses
  │
  ├──> coverImage ──> Media (Many-to-One)
  │
  └──> modules[].lessons[].resources ──> Media (Many-to-Many)
```

---

## 🔐 Access Control Súhrn

| Kolekcia | Create | Read | Update | Delete |
|----------|--------|------|--------|--------|
| **Users** | Anyone | Own + Admin | Own + Admin | Admin |
| **Courses** | Admin | Published + Admin | Admin | Admin |
| **Orders** | Webhook only | Own + Admin | Admin | Never |
| **Media** | Admin | Anyone | Admin | Admin |

---

*Schémy sú optimalizované pre Payload CMS 3.0 s PostgreSQL.*


