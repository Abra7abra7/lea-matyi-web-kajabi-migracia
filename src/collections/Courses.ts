import { CollectionConfig } from 'payload'

export const Courses: CollectionConfig = {
  slug: 'courses',
  
  labels: {
    singular: 'Kurz',
    plural: 'Kurzy',
  },
  
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'price', 'lessonsCount', 'updatedAt'],
    description: 'Správa online kurzov',
    listSearchableFields: ['title', 'slug', 'instructor'],
  },
  
  fields: [
    // ═══════════════════════════════════════════════════════════
    // TABS LAYOUT
    // ═══════════════════════════════════════════════════════════
    {
      type: 'tabs',
      tabs: [
        // TAB 1: ZÁKLADNÉ INFO
        {
          label: '📋 Základné info',
          description: 'Hlavné údaje o kurze',
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
                description: 'napr. "permanentny-makeup-zaklady"',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'price',
                  type: 'number',
                  label: '💰 Cena (EUR)',
                  required: true,
                  min: 0,
                  admin: { width: '25%' },
                },
                {
                  name: 'originalPrice',
                  type: 'number',
                  label: 'Pôvodná cena',
                  admin: { width: '25%', description: 'Pre zľavu' },
                },
                {
                  name: 'status',
                  type: 'select',
                  label: '📊 Stav',
                  defaultValue: 'draft',
                  required: true,
                  options: [
                    { label: '📝 Rozpracovaný', value: 'draft' },
                    { label: '✅ Publikovaný', value: 'published' },
                    { label: '📦 Archivovaný', value: 'archived' },
                  ],
                  admin: { width: '25%' },
                },
                {
                  name: 'category',
                  type: 'select',
                  label: '📁 Kategória',
                  options: [
                    { label: 'Permanentný makeup', value: 'pmu' },
                    { label: 'Nechty', value: 'nails' },
                    { label: 'Kozmetika', value: 'cosmetics' },
                    { label: 'Líčenie', value: 'makeup' },
                    { label: 'Vlasy', value: 'hair' },
                    { label: 'Iné', value: 'other' },
                  ],
                  admin: { width: '25%' },
                },
              ],
            },
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              label: '🖼️ Titulný obrázok',
              required: true,
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              label: 'Krátky popis',
              maxLength: 200,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'difficulty',
                  type: 'select',
                  label: '📈 Obtiažnosť',
                  options: [
                    { label: '🟢 Začiatočník', value: 'beginner' },
                    { label: '🟡 Mierne pokročilý', value: 'intermediate' },
                    { label: '🔴 Pokročilý', value: 'advanced' },
                  ],
                  admin: { width: '50%' },
                },
                {
                  name: 'instructor',
                  type: 'text',
                  label: '👩‍🏫 Lektor',
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        
        // TAB 2: OBSAH KURZU
        {
          label: '🎬 Obsah kurzu',
          description: 'Moduly a video lekcie',
          fields: [
            {
              name: 'modules',
              type: 'array',
              label: '📚 Moduly',
              labels: { singular: 'Modul', plural: 'Moduly' },
              admin: {
                description: 'Každý modul obsahuje video lekcie. Kliknite na "+ Pridať Modul"',
                initCollapsed: false,
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: '📁 Názov modulu',
                  required: true,
                  admin: {
                    placeholder: 'napr. Modul 1: Úvod',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Popis modulu',
                },
                {
                  name: 'lessons',
                  type: 'array',
                  label: '🎬 Lekcie',
                  labels: { singular: 'Lekcia', plural: 'Lekcie' },
                  admin: {
                    initCollapsed: true,
                    description: 'Video lekcie v module',
                  },
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      label: '🎬 Názov lekcie',
                      required: true,
                      admin: {
                        placeholder: 'napr. Lekcia 1: Základy',
                      },
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'videoId',
                          type: 'text',
                          label: '📹 Video ID',
                          required: true,
                          admin: {
                            width: '50%',
                            description: 'Z Cloudflare Stream',
                          },
                        },
                        {
                          name: 'duration',
                          type: 'number',
                          label: '⏱️ Dĺžka (min)',
                          min: 0,
                          admin: { width: '25%' },
                        },
                        {
                          name: 'isFree',
                          type: 'checkbox',
                          label: '🆓 Zadarmo',
                          defaultValue: false,
                          admin: { width: '25%' },
                        },
                      ],
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                      label: 'Popis lekcie',
                    },
                    {
                      type: 'collapsible',
                      label: '📎 Materiály na stiahnutie',
                      admin: { initCollapsed: true },
                      fields: [
                        {
                          name: 'resources',
                          type: 'array',
                          label: 'Súbory',
                          labels: { singular: 'Súbor', plural: 'Súbory' },
                          fields: [
                            {
                              type: 'row',
                              fields: [
                                {
                                  name: 'title',
                                  type: 'text',
                                  label: 'Názov',
                                  required: true,
                                  admin: { width: '50%' },
                                },
                                {
                                  name: 'file',
                                  type: 'upload',
                                  relationTo: 'media',
                                  label: 'Súbor',
                                  required: true,
                                  admin: { width: '50%' },
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        
        // TAB 3: POPIS
        {
          label: '📝 Popis',
          fields: [
            {
              name: 'description',
              type: 'richText',
              label: 'Detailný popis kurzu',
            },
          ],
        },
        
        // TAB 4: NASTAVENIA
        {
          label: '⚙️ Nastavenia',
          fields: [
            {
              name: 'stripePriceId',
              type: 'text',
              label: '💳 Stripe Price ID',
              admin: { description: 'Pre online platby' },
            },
            {
              name: 'previewVideoId',
              type: 'text',
              label: '🎥 Preview Video ID',
            },
            {
              type: 'collapsible',
              label: '🔍 SEO',
              admin: { initCollapsed: true },
              fields: [
                { name: 'metaTitle', type: 'text', label: 'Meta Title' },
                { name: 'metaDescription', type: 'textarea', label: 'Meta Description', maxLength: 160 },
                { name: 'keywords', type: 'text', label: 'Kľúčové slová' },
              ],
            },
          ],
        },
      ],
    },
    
    // SIDEBAR
    {
      name: 'totalDuration',
      type: 'number',
      label: '⏱️ Celková dĺžka',
      admin: { position: 'sidebar', readOnly: true, description: 'minút' },
    },
    {
      name: 'lessonsCount',
      type: 'number',
      label: '🎬 Počet lekcií',
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
  
  // Hooks pre automatické výpočty
  hooks: {
    beforeChange: [
      ({ data }) => {
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
      if (user?.role === 'admin') return true
      return { status: { equals: 'published' } }
    },
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  
  timestamps: true,
}
