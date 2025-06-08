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
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            <MainNav />
            <div className="flex items-center space-x-4">
              <UserNav />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Hồ sơ của tôi</h1>
            <p className="text-base sm:text-lg text-muted-foreground mt-2">Quản lý thông tin cá nhân và lịch sử đặt vé</p>
          </div>

          <div className="grid gap-6 sm:gap-8">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-10 sm:h-12">
                <TabsTrigger value="profile" className="text-sm sm:text-base">Hồ sơ</TabsTrigger>
                <TabsTrigger value="edit" className="text-sm sm:text-base">Sửa hồ sơ</TabsTrigger>
                <TabsTrigger value="password" className="text-sm sm:text-base">Đổi mật khẩu</TabsTrigger>
                <TabsTrigger value="history" className="text-sm sm:text-base">Lịch sử đặt vé</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-6 sm:mt-8">
                <Card className="shadow-lg">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-xl sm:text-2xl">Thông tin cá nhân</CardTitle>
                    <CardDescription className="text-sm sm:text-base">Xem thông tin cá nhân của bạn</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <UserProfile user={user} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="edit" className="mt-6 sm:mt-8">
                <Card className="shadow-lg">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-xl sm:text-2xl">Cập nhật thông tin</CardTitle>
                    <CardDescription className="text-sm sm:text-base">Cập nhật thông tin cá nhân của bạn</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <EditProfile user={user} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="password" className="mt-6 sm:mt-8">
                <Card className="shadow-lg">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-xl sm:text-2xl">Đổi mật khẩu</CardTitle>
                    <CardDescription className="text-sm sm:text-base">Cập nhật mật khẩu tài khoản của bạn</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <ChangePassword />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="mt-6 sm:mt-8">
                <Card className="shadow-lg">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-xl sm:text-2xl">Lịch sử đặt vé</CardTitle>
                    <CardDescription className="text-sm sm:text-base">Xem lịch sử đặt vé của bạn</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
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