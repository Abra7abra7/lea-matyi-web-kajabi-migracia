import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ShoppingBag, Calendar, CreditCard } from 'lucide-react'

// Force dynamic - používa cookies
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Moje objednávky',
}

export default async function ObjednavkyPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/prihlasenie')
  }

  // TODO: Fetch orders from database
  const orders: any[] = []

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-4xl">
        {/* Back button */}
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Späť na dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900">
            Moje objednávky
          </h1>
          <p className="mt-2 text-gray-600">
            Prehľad všetkých vašich nákupov
          </p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-16">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Zatiaľ žiadne objednávky
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Po zakúpení kurzu sa tu zobrazia vaše objednávky.
                </p>
                <Link
                  href="/kurzy"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors"
                >
                  Prezrieť kurzy
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <Card key={order.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Objednávka #{order.id.slice(-6).toUpperCase()}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.createdAt).toLocaleDateString('sk-SK')}
                      </CardDescription>
                    </div>
                    <Badge variant={order.status === 'completed' ? 'success' : 'secondary'}>
                      {order.status === 'completed' ? 'Dokončená' : 'Čaká na platbu'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.course?.title || 'Kurz'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Online kurz
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {(order.amount / 100).toFixed(2)} €
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

