import { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  
  labels: {
    singular: 'Používateľ',
    plural: 'Používatelia',
  },
  
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName', 'role', 'purchasedCourses', 'createdAt'],
    description: 'Zákazníci a administrátori systému',
    listSearchableFields: ['email', 'firstName', 'lastName'],
    group: 'Používatelia',
  },
  
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7, // 7 dní
    verify: false,
    maxLoginAttempts: 5,
    lockTime: 600000, // 10 minút lockout
  },
  
  fields: [
    // ═══════════════════════════════════════════════════════════
    // ZÁKLADNÉ ÚDAJE
    // ═══════════════════════════════════════════════════════════
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          label: 'Meno',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'lastName',
          type: 'text',
          label: 'Priezvisko',
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
          name: 'phone',
          type: 'text',
          label: 'Telefón',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'role',
          type: 'select',
          label: 'Rola',
          defaultValue: 'customer',
          required: true,
          options: [
            { label: '👤 Zákazník', value: 'customer' },
            { label: '🔑 Admin', value: 'admin' },
          ],
          admin: {
            width: '50%',
          },
        },
      ],
    },
    
    // ═══════════════════════════════════════════════════════════
    // ZAKÚPENÉ KURZY
    // ═══════════════════════════════════════════════════════════
    {
      name: 'purchasedCourses',
      type: 'relationship',
      label: 'Zakúpené kurzy',
      relationTo: 'courses',
      hasMany: true,
      admin: {
        description: 'Kurzy ku ktorým má používateľ prístup',
      },
    },
    
    // ═══════════════════════════════════════════════════════════
    // PROGRESS (collapsible)
    // ═══════════════════════════════════════════════════════════
    {
      type: 'collapsible',
      label: 'Progress v kurzoch',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'courseProgress',
          type: 'array',
          label: 'Sledovanie postupu',
          fields: [
            {
              name: 'course',
              type: 'relationship',
              relationTo: 'courses',
              required: true,
              label: 'Kurz',
            },
            {
              name: 'completedLessons',
              type: 'json',
              label: 'Dokončené lekcie',
            },
            {
              name: 'lastWatchedLesson',
              type: 'text',
              label: 'Posledná lekcia',
            },
            {
              name: 'percentComplete',
              type: 'number',
              label: 'Percento',
              min: 0,
              max: 100,
              defaultValue: 0,
            },
          ],
        },
      ],
    },
    
    // ═══════════════════════════════════════════════════════════
    // SIDEBAR
    // ═══════════════════════════════════════════════════════════
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Fotka',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'stripeCustomerId',
      type: 'text',
      label: 'Stripe ID',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'marketingConsent',
      type: 'checkbox',
      label: 'Marketing súhlas',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
  
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      return { id: { equals: user?.id } }
    },
    update: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      return { id: { equals: user?.id } }
    },
    delete: ({ req: { user } }) => user?.role === 'admin',
    create: () => true,
  },
  
  timestamps: true,
}
