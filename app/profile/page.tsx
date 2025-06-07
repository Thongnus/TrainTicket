"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { UserNav } from "@/components/user-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserProfile } from "@/components/profile/user-profile"
import { EditProfile } from "@/components/profile/edit-profile"
import { ChangePassword } from "@/components/profile/change-password"
import { BookingHistory } from "@/components/profile/booking-history"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (!userStr) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userStr))
  }, [router])

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-6 md:py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Hồ sơ của tôi</h1>
            <p className="text-muted-foreground">Quản lý thông tin cá nhân và lịch sử đặt vé</p>
          </div>

          <div className="grid gap-6">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">Hồ sơ</TabsTrigger>
                <TabsTrigger value="edit">Sửa hồ sơ</TabsTrigger>
                <TabsTrigger value="password">Đổi mật khẩu</TabsTrigger>
                <TabsTrigger value="history">Lịch sử đặt vé</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin cá nhân</CardTitle>
                    <CardDescription>Xem thông tin cá nhân của bạn</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UserProfile user={user} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="edit">
                <Card>
                  <CardHeader>
                    <CardTitle>Cập nhật thông tin</CardTitle>
                    <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EditProfile user={user} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="password">
                <Card>
                  <CardHeader>
                    <CardTitle>Đổi mật khẩu</CardTitle>
                    <CardDescription>Cập nhật mật khẩu tài khoản của bạn</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChangePassword />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Lịch sử đặt vé</CardTitle>
                    <CardDescription>Xem lịch sử đặt vé của bạn</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BookingHistory />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 