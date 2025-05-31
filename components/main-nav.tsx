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
        <span className="hidden font-bold sm:inline-block">VietRail</span>
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
          href="/schedule"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/schedule") ? "text-foreground" : "text-foreground/60",
          )}
        >
          Lịch trình
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
          href="/admin"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/admin") ? "text-foreground" : "text-foreground/60",
          )}
        >
          Quản trị
        </Link>
      </nav>
    </div>
  )
}
