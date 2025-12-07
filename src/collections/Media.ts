import { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  
  labels: {
    singular: 'Médium',
    plural: 'Médiá',
  },
  
  admin: {
    group: 'Systém',
    description: 'Obrázky a súbory',
  },
  
  upload: {
    staticDir: 'media',
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
        height: 432,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/avif', 'application/pdf'],
  },
  
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alternatívny text (SEO)',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Popis',
    },
  ],
  
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
}

