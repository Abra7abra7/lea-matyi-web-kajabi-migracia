'use client'

import React, { useEffect, useState } from 'react'

interface Stats {
  users: number
  courses: number
  orders: number
  revenue: number
}

export const DashboardStats: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    users: 0,
    courses: 0,
    orders: 0,
    revenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch counts from Payload API
        const [usersRes, coursesRes, ordersRes] = await Promise.all([
          fetch('/api/users?limit=0'),
          fetch('/api/courses?limit=0'),
          fetch('/api/orders?limit=0'),
        ])

        const [usersData, coursesData, ordersData] = await Promise.all([
          usersRes.json(),
          coursesRes.json(),
          ordersRes.json(),
        ])

        // Calculate revenue from orders
        let totalRevenue = 0
        if (ordersData.docs) {
          totalRevenue = ordersData.docs.reduce((sum: number, order: any) => {
            return sum + (order.amount || 0)
          }, 0)
        }

        setStats({
          users: usersData.totalDocs || 0,
          courses: coursesData.totalDocs || 0,
          orders: ordersData.totalDocs || 0,
          revenue: totalRevenue / 100, // Convert from cents
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      label: 'Používatelia',
      value: stats.users,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)',
    },
    {
      label: 'Kurzy',
      value: stats.courses,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
        </svg>
      ),
      color: '#ec4899',
      bgColor: 'rgba(236, 72, 153, 0.1)',
    },
    {
      label: 'Objednávky',
      value: stats.orders,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="8" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
      ),
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
    },
    {
      label: 'Celkové tržby',
      value: `${stats.revenue.toFixed(2)} €`,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)',
    },
  ]

  return (
    <div style={{ marginTop: '32px' }}>
      {/* Section Title */}
      <h2 style={{
        fontSize: '18px',
        fontWeight: 600,
        color: 'var(--theme-text)',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3v18h18" />
          <path d="m19 9-5 5-4-4-3 3" />
        </svg>
        Prehľad
      </h2>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
      }}>
        {statCards.map((card, index) => (
          <div
            key={index}
            style={{
              background: 'var(--theme-elevation-50)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid var(--theme-elevation-100)',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}>
              <div>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--theme-elevation-500)',
                  marginBottom: '8px',
                  fontWeight: 500,
                }}>
                  {card.label}
                </p>
                <p style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: 'var(--theme-text)',
                  lineHeight: 1,
                }}>
                  {loading ? '...' : card.value}
                </p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: card.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: card.color,
              }}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 style={{
        fontSize: '18px',
        fontWeight: 600,
        color: 'var(--theme-text)',
        marginTop: '32px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
        Rýchle akcie
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
      }}>
        {[
          { label: 'Pridať kurz', href: '/admin/collections/courses/create', color: '#ec4899' },
          { label: 'Všetci používatelia', href: '/admin/collections/users', color: '#3b82f6' },
          { label: 'Objednávky', href: '/admin/collections/orders', color: '#10b981' },
          { label: 'Médiá', href: '/admin/collections/media', color: '#8b5cf6' },
        ].map((action, index) => (
          <a
            key={index}
            href={action.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: 'var(--theme-elevation-50)',
              borderRadius: '10px',
              border: '1px solid var(--theme-elevation-100)',
              textDecoration: 'none',
              color: 'var(--theme-text)',
              fontWeight: 500,
              fontSize: '14px',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: action.color,
            }} />
            {action.label}
          </a>
        ))}
      </div>
    </div>
  )
}

export default DashboardStats

