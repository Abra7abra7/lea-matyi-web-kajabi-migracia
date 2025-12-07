import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections - budú pridané v Fáze 2
// import { Users } from './collections/Users'
// import { Courses } from './collections/Courses'
// import { Orders } from './collections/Orders'
// import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: ' | Beauty Academy Admin',
    },
  },
  
  collections: [
    // Základná Users kolekcia - rozšírime v Fáze 2
    {
      slug: 'users',
      auth: true,
      admin: {
        useAsTitle: 'email',
      },
      fields: [],
    },
  ],
  
  editor: lexicalEditor(),
  
  secret: process.env.PAYLOAD_SECRET || 'DEVELOPMENT_SECRET_CHANGE_ME',
  
  typescript: {
    outputFile: path.resolve(dirname, 'types/payload-types.ts'),
  },
  
  // SQLite pre lokálny vývoj (neskôr PostgreSQL)
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || 'file:./database.db',
    },
  }),
})

