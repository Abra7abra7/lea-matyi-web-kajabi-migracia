import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections
import { Users } from '@/collections/Users'
import { Media } from '@/collections/Media'
import { Courses } from '@/collections/Courses'
import { Orders } from '@/collections/Orders'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // ═══════════════════════════════════════════════════════════
  // ADMIN KONFIGURÁCIA
  // ═══════════════════════════════════════════════════════════
  admin: {
    user: 'users',
    
    meta: {
      titleSuffix: ' | Beauty Academy Admin',
    },
    
    // Custom komponenty
    components: {
      // Branding
      graphics: {
        Logo: '@/components/admin/Logo',
        Icon: '@/components/admin/Icon',
      },
      // Before login screen
      beforeLogin: [
        '@/components/admin/BeforeLogin',
      ],
      // Dashboard stats
      afterDashboard: [
        '@/components/admin/DashboardStats',
      ],
    },
    
    // Dátumový formát
    dateFormat: 'dd.MM.yyyy HH:mm',
  },
  
  // ═══════════════════════════════════════════════════════════
  // COLLECTIONS - poradie v navigácii
  // ═══════════════════════════════════════════════════════════
  collections: [Courses, Orders, Users, Media],
  
  // ═══════════════════════════════════════════════════════════
  // EDITOR
  // ═══════════════════════════════════════════════════════════
  editor: lexicalEditor(),
  
  // ═══════════════════════════════════════════════════════════
  // BEZPEČNOSŤ
  // ═══════════════════════════════════════════════════════════
  secret: process.env.PAYLOAD_SECRET || 'DEVELOPMENT_SECRET_CHANGE_ME',
  
  // ═══════════════════════════════════════════════════════════
  // TYPESCRIPT
  // ═══════════════════════════════════════════════════════════
  typescript: {
    outputFile: path.resolve(dirname, 'types/payload-types.ts'),
  },
  
  // ═══════════════════════════════════════════════════════════
  // DATABÁZA - PostgreSQL (Neon.tech)
  // ═══════════════════════════════════════════════════════════
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  
  // ═══════════════════════════════════════════════════════════
  // UPLOAD
  // ═══════════════════════════════════════════════════════════
  upload: {
    limits: {
      fileSize: 50000000, // 50MB
    },
  },
  
  // ═══════════════════════════════════════════════════════════
  // CORS
  // ═══════════════════════════════════════════════════════════
  cors: [
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ],
})
