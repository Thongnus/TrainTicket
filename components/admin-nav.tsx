"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BarChart, CreditCard, Home, LayoutDashboard, Menu, Package, Settings, Train, Users } from "lucide-react"
import { useState } from "react"

interface AdminNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AdminNav({ className, ...props }: AdminNavProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const routes = [
    {
      href: "/admin/dashboard",
      label: "Bảng điều khiển",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      active: pathname === "/admin/dashboard",
    },
    {
      href: "/admin/trains",
      label: "Quản lý tàu",
      icon: <Train className="mr-2 h-4 w-4" />,
      active: pathname === "/admin/trains",
    },
    {
      href: "/admin/routes",
      label: "Tuyến đường",
      icon: <Package className="mr-2 h-4 w-4" />,
      active: pathname === "/admin/routes",
    },
    {
      href: "/admin/trips",
      label: "Chuyến tàu",
      icon: <CreditCard className="mr-2 h-4 w-4" />,
      active: pathname === "/admin/trips",
    },
    {
      href: "/admin/bookings",
      label: "Đặt vé",
      icon: <BarChart className="mr-2 h-4 w-4" />,
      active: pathname === "/admin/bookings",
    },
    {
      href: "/admin/users",
      label: "Người dùng",
      icon: <Users className="mr-2 h-4 w-4" />,
      active: pathname === "/admin/users",
    },
    {
      href: "/admin/settings",
      label: "Cài đặt",
      icon: <Settings className="mr-2 h-4 w-4" />,
      active: pathname === "/admin/settings",
    },
  ]

  return (
    <div className={cn("flex h-screen", className)} {...props}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed left-4 top-4 z-40">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <ScrollArea className="h-full py-6">
            <div className="flex items-center px-6 py-4">
              <Link href="/" className="flex items-center">
                <Train className="h-6 w-6 text-green-600" />
                <span className="ml-2 text-lg font-bold">VietRail Admin</span>
              </Link>
            </div>
            <div className="space-y-1 px-3">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm rounded-md",
                    route.active ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                  )}
                >
                  {route.icon}
                  {route.label}
                </Link>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4">
            <Link href="/" className="flex items-center">
              <Train className="h-6 w-6 text-green-600" />
              <span className="ml-2 text-lg font-bold">VietRail Admin</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                    route.active ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                  )}
                >
                  {route.icon}
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Link href="/">
              <Button variant="outline" className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Về trang chủ
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
