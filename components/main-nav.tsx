"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Train } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Train className="h-6 w-6 text-green-600" />
        <span className="hidden font-bold sm:inline-block">THONG-RAIL</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/" ? "text-foreground" : "text-foreground/60",
          )}
        >
          Trang chủ
        </Link>
        <Link
          href="/search"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/search") ? "text-foreground" : "text-foreground/60",
          )}
        >
          Tìm vé
        </Link>
    
        <Link
          href="/news"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/news") ? "text-foreground" : "text-foreground/60",
          )}
        >
          Tin tức
        </Link>
        <Link
          href="/chatbot"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/chatbot") ? "text-foreground" : "text-foreground/60",
          )}
        >
          Chat Bot
        </Link>
        <Link
          href="/terms"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/terms") ? "text-foreground" : "text-foreground/60",
          )}
        >
          Chính sách
        </Link>
      </nav>
    </div>
  )
}
