import { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  
  admin: {
    useAsTitle: 'email',
    group: 'Používatelia',
    defaultColumns: ['email', 'firstName', 'lastName', 'role', 'createdAt'],
  },
  
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7, // 7 dní
    verify: false, // Email verifikácia - môžeme zapnúť neskôr
    maxLoginAttempts: 5,
    lockTime: 600000, // 10 minút lockout
  },
  
  fields: [
    // Základné údaje
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
    
    // Telefónne číslo
    {
      name: 'phone',
      type: 'text',
      label: 'Telefón',
    },
    
    // Rola používateľa
    {
      name: 'role',
      type: 'select',
      label: 'Rola',
      defaultValue: 'customer',
      required: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Zákazník', value: 'customer' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    
    // Stripe Customer ID
    {
      name: 'stripeCustomerId',
      type: 'text',
      label: 'Stripe Customer ID',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Automaticky vytvorené pri prvej platbe',
      },
    },
    
    // Zakúpené kurzy
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
    
    // Progress v kurzoch
    {
      name: 'courseProgress',
      type: 'array',
      label: 'Progress v kurzoch',
      admin: {
        description: 'Sledovanie postupu v jednotlivých kurzoch',
      },
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
          admin: {
            description: 'Array: ["0-0", "0-1", "1-0"] = modul-lekcia indexy',
          },
        },
        {
          name: 'lastWatchedLesson',
          type: 'text',
          label: 'Posledná sledovaná lekcia',
          admin: {
            description: 'Format: "modul-lekcia" (napr. "0-2")',
          },
        },
        {
          name: 'percentComplete',
          type: 'number',
          label: 'Percento dokončenia',
          min: 0,
          max: 100,
          defaultValue: 0,
        },
      ],
    },
    
    // Avatar
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Profilová fotka',
    },
    
    // Marketingový súhlas
    {
      name: 'marketingConsent',
      type: 'checkbox',
      label: 'Súhlas s marketingom',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
  
  // Access control
  access: {
    // Admin môže všetko
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      // Používateľ môže čítať len seba
      return { id: { equals: user?.id } }
    },
    update: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      return { id: { equals: user?.id } }
    },
    delete: ({ req: { user } }) => user?.role === 'admin',
    create: () => true, // Registrácia
  },
  
  timestamps: true,
}

