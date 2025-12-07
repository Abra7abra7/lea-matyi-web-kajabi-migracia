import Link from 'next/link'
import { siteConfig, themeConfig } from '@/config'
import { Play, ChevronRight, Award, Clock, Smartphone, FileText } from 'lucide-react'
import { JsonLd, generateOrganizationSchema, generateWebPageSchema } from '@/lib/seo'

export default function HomePage() {
  // Schema.org pre SEO
  const organizationSchema = generateOrganizationSchema()
  const webPageSchema = generateWebPageSchema({
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    url: siteConfig.url,
  })
  const { content } = siteConfig
  const { hero, stats, cta, benefits } = content

  const iconMap: Record<number, React.ReactNode> = {
    0: <Clock className="w-6 h-6" />,
    1: <Award className="w-6 h-6" />,
    2: <Smartphone className="w-6 h-6" />,
    3: <FileText className="w-6 h-6" />,
  }

  return (
    <>
      {/* Schema.org JSON-LD pre AI vyhľadávače */}
      <JsonLd data={[organizationSchema, webPageSchema]} />
      
      <main className="min-h-screen">
      {/* ═══════════════════════════════════════════════════════════
          HERO SEKCIA
          ═══════════════════════════════════════════════════════════ */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${themeConfig.gradients.hero}`}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }} />
        </div>
        
        <div className="relative container-custom py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              {hero.badge}
            </div>
            
            {/* Nadpis */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-gray-900 mb-6">
              {hero.title}{' '}
              <span className={`text-gradient bg-gradient-to-r ${themeConfig.gradients.text}`}>
                {hero.titleHighlight}
              </span>
            </h1>
            
            {/* Podnadpis */}
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              {hero.subtitle}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/kurzy"
                className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r ${themeConfig.gradients.button} text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300`}
              >
                {cta.viewCourses}
                <ChevronRight className="w-5 h-5" />
              </Link>
              
              <button 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-gray-900 font-semibold border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
              >
                <Play className="w-5 h-5 text-primary-500" />
                {cta.watchDemo}
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-16 pt-16 border-t border-gray-200">
              {Object.values(stats).map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl sm:text-4xl font-heading font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          BENEFITY SEKCIA
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-4">
              Prečo si vybrať nás?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Naše kurzy sú navrhnuté tak, aby ste sa mohli učiť efektívne a profesionálne.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, i) => (
              <div 
                key={i}
                className="group p-6 rounded-2xl bg-gray-50 hover:bg-gradient-to-br hover:from-primary-50 hover:to-rose-50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center mb-4 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
                  {iconMap[i]}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CTA SEKCIA
          ═══════════════════════════════════════════════════════════ */}
      <section className={`py-24 bg-gradient-to-br ${themeConfig.gradients.hero}`}>
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-6">
              Pripravená začať svoju cestu v beauty?
            </h2>
            <p className="text-lg text-gray-600 mb-10">
              Pridajte sa k stovkám spokojných študentov, ktorí už začali budovať svoju kariéru.
            </p>
            <Link
              href="/kurzy"
              className={`inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full bg-gradient-to-r ${themeConfig.gradients.button} text-white text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300`}
            >
              Prezrieť kurzy
              <ChevronRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════ */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Logo & popis */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-heading font-bold mb-4">
                {siteConfig.name}
              </h3>
              <p className="text-gray-400 mb-6 max-w-md">
                {content.footer.description}
              </p>
              {/* Social links */}
              <div className="flex gap-4">
                {siteConfig.social.instagram && (
                  <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                    <span className="sr-only">Instagram</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                )}
                {siteConfig.social.facebook && (
                  <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                    <span className="sr-only">Facebook</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                )}
                {siteConfig.social.youtube && (
                  <a href={siteConfig.social.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                    <span className="sr-only">YouTube</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                )}
              </div>
            </div>
            
            {/* Navigácia */}
            <div>
              <h4 className="font-semibold mb-4">Navigácia</h4>
              <ul className="space-y-2">
                {siteConfig.navigation.main.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Právne */}
            <div>
              <h4 className="font-semibold mb-4">Právne informácie</h4>
              <ul className="space-y-2">
                {siteConfig.navigation.footer.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Bottom bar */}
          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              {content.footer.copyright
                .replace('{year}', new Date().getFullYear().toString())
                .replace('{company}', siteConfig.company.legalName)}
            </p>
            <p className="text-gray-500 text-sm">
              IČO: {siteConfig.company.ico} | DIČ: {siteConfig.company.dic}
            </p>
          </div>
        </div>
      </footer>
    </main>
    </>
  )
}

