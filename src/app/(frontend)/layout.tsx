import { Header } from '@/components/Header'

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </>
  )
}
