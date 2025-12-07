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
  admin: {
    user: 'users',
    meta: {
      titleSuffix: ' | Beauty Academy Admin',
    },
    components: {
      // Môžeme pridať vlastné komponenty
    },
  },
  
  collections: [Users, Media, Courses, Orders],
  
  editor: lexicalEditor(),
  
  secret: process.env.PAYLOAD_SECRET || 'DEVELOPMENT_SECRET_CHANGE_ME',
  
  typescript: {
    outputFile: path.resolve(dirname, 'types/payload-types.ts'),
  },
  
  // SQLite pre lokálny vývoj
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || 'file:./database.db',
    },
  }),
  
  // Upload directory
  upload: {
    limits: {
      fileSize: 50000000, // 50MB
    },
  },
  
  // CORS
  cors: [
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ],
})
