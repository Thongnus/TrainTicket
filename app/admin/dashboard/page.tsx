"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"
import { BarChart, LineChart, PieChart } from "lucide-react"
import { AdminHeader } from "@/components/admin-header"

export default function AdminDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="flex min-h-screen flex-col items-center">
      <AdminHeader />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Bảng điều khiển</h2>
          <div className="flex items-center space-x-2">
            <Button>Tải xuống báo cáo</Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="analytics">Phân tích</TabsTrigger>
            <TabsTrigger value="reports">Báo cáo</TabsTrigger>
            <TabsTrigger value="notifications">Thông báo</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">352.500.000đ</div>
                  <p className="text-xs text-muted-foreground">+20.1% so với tháng trước</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Vé đã bán</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+180 vé trong 24 giờ qua</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tỷ lệ hủy vé</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12.5%</div>
                  <p className="text-xs text-muted-foreground">-2.5% so với tháng trước</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Chuyến tàu hoạt động</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">42</div>
                  <p className="text-xs text-muted-foreground">+3 chuyến so với tuần trước</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Doanh thu theo ngày</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px] flex items-center justify-center">
                    <LineChart className="h-16 w-16 text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Biểu đồ doanh thu theo ngày</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Tuyến đường phổ biến</CardTitle>
                  <CardDescription>Top 5 tuyến đường được đặt nhiều nhất</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <PieChart className="h-16 w-16 text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Biểu đồ tuyến đường phổ biến</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Lịch</CardTitle>
                  <CardDescription>Lịch chuyến tàu và sự kiện</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
                </CardContent>
              </Card>
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Phân bổ loại vé</CardTitle>
                  <CardDescription>Thống kê theo loại toa và ghế</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px] flex items-center justify-center">
                    <BarChart className="h-16 w-16 text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Biểu đồ phân bổ loại vé</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Phân tích doanh thu</CardTitle>
                  <CardDescription>Phân tích chi tiết doanh thu theo thời gian</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center">
                    <LineChart className="h-16 w-16 text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Biểu đồ phân tích doanh thu</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Phân tích khách hàng</CardTitle>
                  <CardDescription>Thông tin về khách hàng và hành vi đặt vé</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center">
                    <PieChart className="h-16 w-16 text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Biểu đồ phân tích khách hàng</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Báo cáo doanh thu</CardTitle>
                <CardDescription>Xem và tải xuống báo cáo doanh thu</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Báo cáo doanh thu tháng 5/2025</h3>
                        <p className="text-sm text-muted-foreground">Tạo ngày: 01/06/2025</p>
                      </div>
                      <Button variant="outline">Tải xuống</Button>
                    </div>
                  </div>
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Báo cáo doanh thu tháng 4/2025</h3>
                        <p className="text-sm text-muted-foreground">Tạo ngày: 01/05/2025</p>
                      </div>
                      <Button variant="outline">Tải xuống</Button>
                    </div>
                  </div>
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Báo cáo doanh thu tháng 3/2025</h3>
                        <p className="text-sm text-muted-foreground">Tạo ngày: 01/04/2025</p>
                      </div>
                      <Button variant="outline">Tải xuống</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Thông báo hệ thống</CardTitle>
                <CardDescription>Quản lý thông báo và cảnh báo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-yellow-500 pl-4 py-2">
                    <h3 className="font-medium">Cảnh báo: Tỷ lệ hủy vé cao</h3>
                    <p className="text-sm text-muted-foreground">
                      Tỷ lệ hủy vé cho tuyến Hà Nội - Sài Gòn đang cao hơn bình thường.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">30/05/2025 15:37:45</p>
                  </div>
                  <Separator />
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h3 className="font-medium">Thông báo: Cập nhật hệ thống</h3>
                    <p className="text-sm text-muted-foreground">
                      Hệ thống sẽ được nâng cấp vào ngày 02/06/2025 từ 00:00 - 03:00.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">29/05/2025 10:15:22</p>
                  </div>
                  <Separator />
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h3 className="font-medium">Thông báo: Khuyến mãi mới</h3>
                    <p className="text-sm text-muted-foreground">
                      Khuyến mãi mùa hè 2025 đã được kích hoạt. Giảm 20% cho tất cả các chuyến.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">28/05/2025 09:45:12</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
