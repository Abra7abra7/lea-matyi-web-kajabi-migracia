import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections
import { Users, Media, Courses, Orders } from './collections'

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
      // Logo v navigácii
      graphics: {
        Logo: '@/components/admin/Logo',
        Icon: '@/components/admin/Icon',
      },
      
      // Before login - branding
      beforeLogin: [
        '@/components/admin/BeforeLogin',
      ],
      
      // After dashboard - stats
      afterDashboard: [
        '@/components/admin/DashboardStats',
      ],
    },
    
    // Dátumový formát
    dateFormat: 'dd.MM.yyyy HH:mm',
  },
  
  // ═══════════════════════════════════════════════════════════
  // COLLECTIONS
  // ═══════════════════════════════════════════════════════════
  collections: [Users, Media, Courses, Orders],
  
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
  // DATABÁZA - SQLite pre lokálny vývoj
  // ═══════════════════════════════════════════════════════════
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || 'file:./database.db',
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
