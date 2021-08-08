interface Plan {
  title: string
  description: string
  features: string[]
}

type Terms = {
  ppm: string
  plans: Record<string, Plan>
}

export const TERMS: Terms = {
  ppm: '/month',
  plans: {
    free: {
      title: 'Free',
      description: 'Free forever',
      features: ['Basic templates', 'Unlimited employees', '1 User'],
    },
    starter: {
      title: 'Starter',
      description: 'Add some personality',
      features: [
        'All templates',
        'Unlimited employees',
        '3 Users',
        'Team members can upload profile pictures',
      ],
    },
    premium: {
      title: 'Premium',
      description: 'Integrate to your SAML',
      features: [
        'All templates',
        'Unlimited employees',
        '5 Users',
        'Team members can upload profile pictures',
        'API route with webhooks',
      ],
    },
  },
}
