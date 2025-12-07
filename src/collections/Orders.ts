import { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  
  admin: {
    useAsTitle: 'orderNumber',
    group: 'Predaje',
    defaultColumns: ['orderNumber', 'customer', 'course', 'total', 'status', 'createdAt'],
  },
  
  fields: [
    // Číslo objednávky
    {
      name: 'orderNumber',
      type: 'text',
      label: 'Číslo objednávky',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
        description: 'Automaticky generované',
      },
    },
    
    // Zákazník
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      label: 'Zákazník',
      required: true,
    },
    
    // Email zákazníka (pre prípad keď user nie je v systéme)
    {
      name: 'customerEmail',
      type: 'email',
      label: 'Email zákazníka',
      required: true,
    },
    
    // Kurz
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      label: 'Kurz',
      required: true,
    },
    
    // Cenové údaje
    {
      type: 'row',
      fields: [
        {
          name: 'total',
          type: 'number',
          label: 'Celková suma',
          required: true,
          admin: {
            width: '33%',
          },
        },
        {
          name: 'currency',
          type: 'select',
          label: 'Mena',
          defaultValue: 'EUR',
          options: [
            { label: 'EUR', value: 'EUR' },
            { label: 'CZK', value: 'CZK' },
            { label: 'USD', value: 'USD' },
          ],
          admin: {
            width: '33%',
          },
        },
        {
          name: 'discount',
          type: 'number',
          label: 'Zľava',
          defaultValue: 0,
          admin: {
            width: '33%',
          },
        },
      ],
    },
    
    // Stav objednávky
    {
      name: 'status',
      type: 'select',
      label: 'Stav',
      defaultValue: 'pending',
      required: true,
      options: [
        { label: '⏳ Čaká na platbu', value: 'pending' },
        { label: '✅ Zaplatená', value: 'paid' },
        { label: '❌ Zrušená', value: 'cancelled' },
        { label: '↩️ Vrátená', value: 'refunded' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    
    // Stripe údaje
    {
      name: 'stripePaymentIntentId',
      type: 'text',
      label: 'Stripe Payment Intent ID',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'stripeCheckoutSessionId',
      type: 'text',
      label: 'Stripe Checkout Session ID',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    
    // Fakturačné údaje
    {
      name: 'billingDetails',
      type: 'group',
      label: 'Fakturačné údaje',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Meno / Firma',
        },
        {
          name: 'address',
          type: 'text',
          label: 'Adresa',
        },
        {
          name: 'city',
          type: 'text',
          label: 'Mesto',
        },
        {
          name: 'postalCode',
          type: 'text',
          label: 'PSČ',
        },
        {
          name: 'country',
          type: 'text',
          label: 'Krajina',
          defaultValue: 'SK',
        },
        {
          name: 'ico',
          type: 'text',
          label: 'IČO',
        },
        {
          name: 'dic',
          type: 'text',
          label: 'DIČ',
        },
      ],
    },
    
    // Poznámky
    {
      name: 'notes',
      type: 'textarea',
      label: 'Interné poznámky',
      admin: {
        description: 'Poznámky pre admina',
      },
    },
  ],
  
  // Hook pre generovanie čísla objednávky
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create' && !data.orderNumber) {
          // Generuj číslo objednávky: BA-YYYYMMDD-XXXX
          const date = new Date()
          const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
          const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
          data.orderNumber = `BA-${dateStr}-${random}`
        }
        return data
      },
    ],
  },
  
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      // Zákazník vidí len svoje objednávky
      return { customer: { equals: user?.id } }
    },
    create: () => true, // Webhook môže vytvárať
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  
  timestamps: true,
}

