import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { siteConfig } from '@/config'
import { BookOpen, PlayCircle, Award, Settings, ChevronRight } from 'lucide-react'

// Force dynamic - používa cookies
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Dashboard',
}

export default async function DashboardPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/prihlasenie')
  }

  // TODO: Fetch user's courses from database
  const purchasedCourses: any[] = []

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900">
            Vitajte, {user.firstName || 'študent'}! 👋
          </h1>
          <p className="mt-2 text-gray-600">
            Váš vzdelávací prehľad
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {purchasedCourses.length}
                </p>
                <p className="text-sm text-gray-500">Zakúpené kurzy</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <PlayCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-500">Dokončených lekcií</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-500">Certifikátov</p>
              </div>
            </div>
          </div>
        </div>

        {/* Moje kurzy */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-semibold text-gray-900">
              Moje kurzy
            </h2>
            <Link 
              href="/kurzy" 
              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
            >
              Prezrieť všetky kurzy
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {purchasedCourses.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {siteConfig.content.empty.noOwnedCourses}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {siteConfig.content.empty.noOwnedCoursesDescription}
              </p>
              <Link
                href="/kurzy"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors"
              >
                Prezrieť kurzy
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* TODO: Render purchased courses */}
            </div>
          )}
        </section>

        {/* Pokračovať v učení */}
        {purchasedCourses.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-heading font-semibold text-gray-900 mb-6">
              Pokračovať v učení
            </h2>
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <p className="text-gray-500">
                Žiadna rozpracovaná lekcia
              </p>
            </div>
          </section>
        )}

        {/* Účet */}
        <section>
          <h2 className="text-xl font-heading font-semibold text-gray-900 mb-6">
            Nastavenia účtu
          </h2>
          <div className="bg-white rounded-xl divide-y divide-gray-100 border border-gray-100">
            <Link 
              href="/dashboard/profil"
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-900">Upraviť profil</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
            <Link 
              href="/dashboard/objednavky"
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-900">Moje objednávky</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}

