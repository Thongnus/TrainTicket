"use client"

import { useState } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  Users,
  Train,
  Ticket,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
} from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  const [stats] = useState({
    totalRevenue: 352500000,
    totalBookings: 1234,
    activeTrains: 42,
    totalUsers: 15678,
    todayBookings: 89,
    pendingBookings: 12,
    delayedTrips: 3,
    completedTrips: 156,
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price)
  }

  const quickActions = [
    {
      title: "Quản lý tàu",
      description: "Thêm, sửa, xóa thông tin tàu",
      href: "/admin/trains",
      icon: Train,
      color: "bg-blue-500",
    },
    {
      title: "Quản lý tuyến đường",
      description: "Thiết lập các tuyến đường",
      href: "/admin/routes",
      icon: BarChart3,
      color: "bg-green-500",
    },
    {
      title: "Quản lý chuyến tàu",
      description: "Lập lịch và theo dõi chuyến tàu",
      href: "/admin/trips",
      icon: Clock,
      color: "bg-orange-500",
    },
    {
      title: "Quản lý đặt vé",
      description: "Xử lý đơn đặt vé",
      href: "/admin/bookings",
      icon: Ticket,
      color: "bg-purple-500",
    },
    {
      title: "Quản lý người dùng",
      description: "Quản lý tài khoản người dùng",
      href: "/admin/users",
      icon: Users,
      color: "bg-red-500",
    },
    {
      title: "Báo cáo & Thống kê",
      description: "Xem báo cáo chi tiết",
      href: "/admin/dashboard",
      icon: TrendingUp,
      color: "bg-indigo-500",
    },
  ]

  const recentActivities = [
    {
      id: 1,
      type: "booking",
      message: "Đơn đặt vé BK20250530001 đã được xác nhận",
      time: "5 phút trước",
      status: "success",
    },
    {
      id: 2,
      type: "delay",
      message: "Chuyến SE9-20250530 bị trễ 15 phút",
      time: "10 phút trước",
      status: "warning",
    },
    {
      id: 3,
      type: "user",
      message: "Người dùng mới đăng ký: nguyenvana@email.com",
      time: "15 phút trước",
      status: "info",
    },
    {
      id: 4,
      type: "payment",
      message: "Thanh toán 800.000đ đã được xử lý",
      time: "20 phút trước",
      status: "success",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <Ticket className="h-4 w-4" />
      case "delay":
        return <AlertTriangle className="h-4 w-4" />
      case "user":
        return <Users className="h-4 w-4" />
      case "payment":
        return <DollarSign className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  const getActivityColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "info":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center items-center">
      <AdminHeader />
      <div className="flex-1 space-y-6 p-8 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Trang quản trị</h1>
            <p className="text-muted-foreground">Chào mừng bạn đến với hệ thống quản lý VietRail</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-green-600">
              Hệ thống hoạt động bình thường
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}đ</div>
              <p className="text-xs text-muted-foreground">+20.1% so với tháng trước</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng đặt vé</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">+{stats.todayBookings} vé hôm nay</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tàu hoạt động</CardTitle>
              <Train className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeTrains}</div>
              <p className="text-xs text-muted-foreground">{stats.delayedTrips} chuyến bị trễ</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Người dùng</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(stats.totalUsers)}</div>
              <p className="text-xs text-muted-foreground">Đăng ký trong tháng</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Truy cập nhanh</CardTitle>
                <CardDescription>Các chức năng quản lý chính của hệ thống</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {quickActions.map((action) => (
                    <Link key={action.href} href={action.href}>
                      <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                        <CardContent className="flex items-center space-x-4 p-4">
                          <div className={`rounded-lg p-2 ${action.color}`}>
                            <action.icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{action.title}</h3>
                            <p className="text-sm text-muted-foreground">{action.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
              <CardDescription>Các sự kiện mới nhất trong hệ thống</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`mt-1 ${getActivityColor(activity.status)}`}>{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Đặt vé chờ xử lý</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.pendingBookings}</div>
              <p className="text-sm text-muted-foreground">Cần xác nhận</p>
              <Link href="/admin/bookings">
                <Button variant="outline" size="sm" className="mt-2">
                  Xem chi tiết
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Chuyến tàu trễ</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.delayedTrips}</div>
              <p className="text-sm text-muted-foreground">Cần cập nhật</p>
              <Link href="/admin/trips">
                <Button variant="outline" size="sm" className="mt-2">
                  Xem chi tiết
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Chuyến hoàn thành</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.completedTrips}</div>
              <p className="text-sm text-muted-foreground">Hôm nay</p>
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm" className="mt-2">
                  Xem báo cáo
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
