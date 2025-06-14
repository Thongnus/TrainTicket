import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
  
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
} 