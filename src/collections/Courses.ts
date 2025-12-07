import { CollectionConfig } from 'payload'

export const Courses: CollectionConfig = {
  slug: 'courses',
  
  admin: {
    useAsTitle: 'title',
    group: 'Kurzy',
    defaultColumns: ['title', 'status', 'price', 'updatedAt'],
  },
  
  fields: [
    // Základné info - Tab
    {
      type: 'tabs',
      tabs: [
        // TAB 1: Základné informácie
        {
          label: 'Základné info',
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
                description: 'URL adresa kurzu (napr. "permanentny-makeup-zaklady")',
              },
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              label: 'Krátky popis',
              maxLength: 200,
              admin: {
                description: 'Zobrazuje sa v kartách kurzov (max 200 znakov)',
              },
            },
            {
              name: 'description',
              type: 'richText',
              label: 'Dlhý popis',
              admin: {
                description: 'Plný popis kurzu pre detailnú stránku',
              },
            },
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Titulný obrázok',
              required: true,
            },
            {
              name: 'previewVideoId',
              type: 'text',
              label: 'Preview Video ID (Cloudflare)',
              admin: {
                description: 'Cloudflare Stream Video ID pre ukážkové video',
              },
            },
          ],
        },
        
        // TAB 2: Cena a predaj
        {
          label: 'Cena a predaj',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'price',
                  type: 'number',
                  label: 'Cena (EUR)',
                  required: true,
                  min: 0,
                  admin: {
                    width: '33%',
                  },
                },
                {
                  name: 'originalPrice',
                  type: 'number',
                  label: 'Pôvodná cena (EUR)',
                  admin: {
                    width: '33%',
                    description: 'Pre zobrazenie zľavy',
                  },
                },
                {
                  name: 'stripePriceId',
                  type: 'text',
                  label: 'Stripe Price ID',
                  admin: {
                    width: '33%',
                    description: 'ID ceny zo Stripe Dashboard',
                  },
                },
              ],
            },
            {
              name: 'status',
              type: 'select',
              label: 'Stav',
              defaultValue: 'draft',
              required: true,
              options: [
                { label: '📝 Rozpracovaný', value: 'draft' },
                { label: '✅ Publikovaný', value: 'published' },
                { label: '📦 Archivovaný', value: 'archived' },
              ],
            },
          ],
        },
        
        // TAB 3: Obsah kurzu (Moduly a Lekcie)
        {
          label: 'Obsah kurzu',
          fields: [
            {
              name: 'modules',
              type: 'array',
              label: 'Moduly',
              admin: {
                description: 'Rozdeľte kurz do logických modulov',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Názov modulu',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Popis modulu',
                },
                {
                  name: 'lessons',
                  type: 'array',
                  label: 'Lekcie',
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      label: 'Názov lekcie',
                      required: true,
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                      label: 'Popis lekcie',
                    },
                    {
                      name: 'videoId',
                      type: 'text',
                      label: 'Cloudflare Video ID',
                      required: true,
                      admin: {
                        description: 'ID videa z Cloudflare Stream',
                      },
                    },
                    {
                      name: 'duration',
                      type: 'number',
                      label: 'Dĺžka (minúty)',
                      min: 0,
                    },
                    {
                      name: 'isFree',
                      type: 'checkbox',
                      label: 'Voľne dostupná lekcia',
                      defaultValue: false,
                      admin: {
                        description: 'Ukážková lekcia zadarmo',
                      },
                    },
                    // Materiály na stiahnutie
                    {
                      name: 'resources',
                      type: 'array',
                      label: 'Materiály na stiahnutie',
                      fields: [
                        {
                          name: 'title',
                          type: 'text',
                          label: 'Názov súboru',
                          required: true,
                        },
                        {
                          name: 'file',
                          type: 'upload',
                          relationTo: 'media',
                          label: 'Súbor',
                          required: true,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        
        // TAB 4: SEO
        {
          label: 'SEO',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              label: 'Meta Title',
              admin: {
                description: 'SEO nadpis pre vyhľadávače',
              },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              label: 'Meta Description',
              maxLength: 160,
              admin: {
                description: 'SEO popis (max 160 znakov)',
              },
            },
            {
              name: 'keywords',
              type: 'text',
              label: 'Kľúčové slová',
              admin: {
                description: 'Oddelené čiarkou',
              },
            },
          ],
        },
      ],
    },
    
    // Sidebar fields
    {
      name: 'instructor',
      type: 'text',
      label: 'Lektor',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'totalDuration',
      type: 'number',
      label: 'Celková dĺžka (min)',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Automaticky vypočítané',
      },
    },
    {
      name: 'lessonsCount',
      type: 'number',
      label: 'Počet lekcií',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Automaticky vypočítané',
      },
    },
    {
      name: 'difficulty',
      type: 'select',
      label: 'Obtiažnosť',
      options: [
        { label: '🟢 Začiatočník', value: 'beginner' },
        { label: '🟡 Mierne pokročilý', value: 'intermediate' },
        { label: '🔴 Pokročilý', value: 'advanced' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Kategória',
      options: [
        { label: 'Permanentný makeup', value: 'pmu' },
        { label: 'Nechty', value: 'nails' },
        { label: 'Kozmetika', value: 'cosmetics' },
        { label: 'Líčenie', value: 'makeup' },
        { label: 'Vlasy', value: 'hair' },
        { label: 'Iné', value: 'other' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
  
  // Hooks pre automatické výpočty
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Vypočítaj celkovú dĺžku a počet lekcií
        let totalDuration = 0
        let lessonsCount = 0
        
        if (data.modules && Array.isArray(data.modules)) {
          data.modules.forEach((module: any) => {
            if (module.lessons && Array.isArray(module.lessons)) {
              lessonsCount += module.lessons.length
              module.lessons.forEach((lesson: any) => {
                if (lesson.duration) {
                  totalDuration += lesson.duration
                }
              })
            }
          })
        }
        
        data.totalDuration = totalDuration
        data.lessonsCount = lessonsCount
        
        return data
      },
    ],
  },
  
  access: {
    read: ({ req: { user } }) => {
      // Admin vidí všetko
      if (user?.role === 'admin') return true
      // Ostatní vidia len publikované
      return { status: { equals: 'published' } }
    },
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  
  timestamps: true,
}

