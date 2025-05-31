"use client"

import type React from "react"

import { useState } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Plus, Search, Trash2, ArrowRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"

interface Route {
  id: number
  routeName: string
  originStation: string
  destinationStation: string
  distance: number
  description: string
  status: string
  createdAt: string
}

export default function RoutesManagement() {
  const { toast } = useToast()
  const [routes, setRoutes] = useState<Route[]>([
    {
      id: 3,
      routeName: "Hà Nội - Sài Gòn",
      originStation: "Ga Hà Nội",
      destinationStation: "Ga Sài Gòn",
      distance: 1726,
      description: "Tuyến tàu Thống Nhất Bắc Nam - qua các ga lớn xuyên Việt",
      status: "active",
      createdAt: "2025-05-19T16:47:14Z",
    },
    {
      id: 4,
      routeName: "Sài Gòn - Hà Nội",
      originStation: "Ga Sài Gòn",
      destinationStation: "Ga Hà Nội",
      distance: 1726,
      description: "Tuyến tàu Thống Nhất Bắc Nam chiều ngược lại",
      status: "active",
      createdAt: "2025-05-19T16:47:14Z",
    },
    {
      id: 5,
      routeName: "Hà Nội - Vinh",
      originStation: "Ga Hà Nội",
      destinationStation: "Ga Vinh",
      distance: 319,
      description: "Tuyến ngắn Hà Nội - Vinh",
      status: "active",
      createdAt: "2025-05-19T17:00:59Z",
    },
    {
      id: 6,
      routeName: "Vinh - Hà Nội",
      originStation: "Ga Vinh",
      destinationStation: "Ga Hà Nội",
      distance: 319,
      description: "Tuyến ngắn Vinh - Hà Nội",
      status: "maintenance",
      createdAt: "2025-05-19T17:02:04Z",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRoute, setEditingRoute] = useState<Route | null>(null)
  const [formData, setFormData] = useState({
    routeName: "",
    originStation: "",
    destinationStation: "",
    distance: "",
    description: "",
    status: "active",
  })

  const stations = [
    "Ga Hà Nội",
    "Ga Phủ Lý",
    "Ga Nam Định",
    "Ga Ninh Bình",
    "Ga Thanh Hóa",
    "Ga Vinh",
    "Ga Đồng Hới",
    "Ga Đông Hà",
    "Ga Huế",
    "Ga Đà Nẵng",
    "Ga Tam Kỳ",
    "Ga Quảng Ngãi",
    "Ga Diêu Trì",
    "Ga Nha Trang",
    "Ga Tháp Chàm",
    "Ga Biên Hòa",
    "Ga Sài Gòn",
  ]

  const statusOptions = [
    { value: "active", label: "Hoạt động", color: "bg-green-100 text-green-800" },
    { value: "inactive", label: "Tạm dừng", color: "bg-yellow-100 text-yellow-800" },
    { value: "maintenance", label: "Bảo trì", color: "bg-red-100 text-red-800" },
  ]

  const filteredRoutes = routes.filter(
    (route) =>
      route.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.originStation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.destinationStation.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingRoute) {
      setRoutes(
        routes.map((route) =>
          route.id === editingRoute.id
            ? { ...route, ...formData, distance: Number.parseFloat(formData.distance) }
            : route,
        ),
      )
      toast({
        title: "Cập nhật thành công",
        description: "Thông tin tuyến đường đã được cập nhật.",
      })
    } else {
      const newRoute: Route = {
        id: Math.max(...routes.map((r) => r.id)) + 1,
        ...formData,
        distance: Number.parseFloat(formData.distance),
        createdAt: new Date().toISOString(),
      }
      setRoutes([...routes, newRoute])
      toast({
        title: "Thêm thành công",
        description: "Tuyến đường mới đã được thêm vào hệ thống.",
      })
    }

    setIsDialogOpen(false)
    setEditingRoute(null)
    setFormData({
      routeName: "",
      originStation: "",
      destinationStation: "",
      distance: "",
      description: "",
      status: "active",
    })
  }

  const handleEdit = (route: Route) => {
    setEditingRoute(route)
    setFormData({
      routeName: route.routeName,
      originStation: route.originStation,
      destinationStation: route.destinationStation,
      distance: route.distance.toString(),
      description: route.description,
      status: route.status,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (routeId: number) => {
    setRoutes(routes.filter((route) => route.id !== routeId))
    toast({
      title: "Xóa thành công",
      description: "Tuyến đường đã được xóa khỏi hệ thống.",
    })
  }

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find((option) => option.value === status)
    return <Badge className={statusOption?.color}>{statusOption?.label}</Badge>
  }

  return (
    <div className="flex min-h-screen flex-col items-center">
      <AdminHeader />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Quản lý tuyến đường</h2>
            <p className="text-muted-foreground">Quản lý các tuyến đường tàu hỏa trong hệ thống</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingRoute(null)
                  setFormData({
                    routeName: "",
                    originStation: "",
                    destinationStation: "",
                    distance: "",
                    description: "",
                    status: "active",
                  })
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Thêm tuyến đường
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingRoute ? "Chỉnh sửa tuyến đường" : "Thêm tuyến đường mới"}</DialogTitle>
                <DialogDescription>
                  {editingRoute ? "Cập nhật thông tin tuyến đường" : "Nhập thông tin tuyến đường mới"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="routeName" className="text-right">
                      Tên tuyến
                    </Label>
                    <Input
                      id="routeName"
                      value={formData.routeName}
                      onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="originStation" className="text-right">
                      Ga đi
                    </Label>
                    <Select
                      value={formData.originStation}
                      onValueChange={(value) => setFormData({ ...formData, originStation: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Chọn ga đi" />
                      </SelectTrigger>
                      <SelectContent>
                        {stations.map((station) => (
                          <SelectItem key={station} value={station}>
                            {station}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="destinationStation" className="text-right">
                      Ga đến
                    </Label>
                    <Select
                      value={formData.destinationStation}
                      onValueChange={(value) => setFormData({ ...formData, destinationStation: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Chọn ga đến" />
                      </SelectTrigger>
                      <SelectContent>
                        {stations.map((station) => (
                          <SelectItem key={station} value={station}>
                            {station}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="distance" className="text-right">
                      Khoảng cách (km)
                    </Label>
                    <Input
                      id="distance"
                      type="number"
                      step="0.1"
                      value={formData.distance}
                      onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Mô tả
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="col-span-3"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Trạng thái
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">{editingRoute ? "Cập nhật" : "Thêm mới"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách tuyến đường</CardTitle>
            <CardDescription>Tổng cộng {routes.length} tuyến đường trong hệ thống</CardDescription>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm tuyến đường..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên tuyến</TableHead>
                  <TableHead>Lộ trình</TableHead>
                  <TableHead>Khoảng cách</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoutes.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell className="font-medium">{route.routeName}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{route.originStation}</span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{route.destinationStation}</span>
                      </div>
                    </TableCell>
                    <TableCell>{route.distance} km</TableCell>
                    <TableCell className="max-w-xs truncate">{route.description}</TableCell>
                    <TableCell>{getStatusBadge(route.status)}</TableCell>
                    <TableCell>{new Date(route.createdAt).toLocaleDateString("vi-VN")}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Mở menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(route)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(route.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
