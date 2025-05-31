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
import { Edit, MoreHorizontal, Plus, Search, Trash2, Eye, Lock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface User {
  id: number
  username: string
  fullName: string
  email: string
  phone: string
  address: string
  idCard: string
  dateOfBirth: string
  role: string
  status: string
  createdAt: string
  lastLogin: string
}

export default function UsersManagement() {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      username: "nguyenvana",
      fullName: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      phone: "0912345671",
      address: "123 Lý Thường Kiệt, Hà Nội",
      idCard: "987654321001",
      dateOfBirth: "1990-05-15",
      role: "customer",
      status: "active",
      createdAt: "2025-05-13T11:19:49Z",
      lastLogin: "2025-05-30T10:15:30Z",
    },
    {
      id: 2,
      username: "tranb",
      fullName: "Trần Thị B",
      email: "tran.b@email.com",
      phone: "0912345672",
      address: "456 Nguyễn Trãi, TP.HCM",
      idCard: "987654321002",
      dateOfBirth: "1995-08-20",
      role: "customer",
      status: "active",
      createdAt: "2025-05-13T11:19:49Z",
      lastLogin: "2025-05-29T14:22:15Z",
    },
    {
      id: 3,
      username: "staff_lec",
      fullName: "Lê Văn C",
      email: "staff.lec@railway.com",
      phone: "0912345673",
      address: "789 Hai Bà Trưng, Đà Nẵng",
      idCard: "987654321003",
      dateOfBirth: "1988-03-10",
      role: "staff",
      status: "active",
      createdAt: "2025-05-13T11:19:49Z",
      lastLogin: "2025-05-30T09:45:22Z",
    },
    {
      id: 4,
      username: "thong",
      fullName: "Bá Thông",
      email: "bathong448@gmail.com",
      phone: "0987654321",
      address: "Hà Nội",
      idCard: "123456789",
      dateOfBirth: "1995-01-01",
      role: "admin",
      status: "active",
      createdAt: "2025-05-14T10:38:39Z",
      lastLogin: "2025-05-30T11:30:45Z",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    idCard: "",
    dateOfBirth: "",
    role: "customer",
    status: "active",
  })

  const roles = [
    { value: "customer", label: "Khách hàng", color: "bg-blue-100 text-blue-800" },
    { value: "staff", label: "Nhân viên", color: "bg-green-100 text-green-800" },
    { value: "admin", label: "Quản trị viên", color: "bg-purple-100 text-purple-800" },
  ]

  const statusOptions = [
    { value: "active", label: "Hoạt động", color: "bg-green-100 text-green-800" },
    { value: "inactive", label: "Tạm khóa", color: "bg-yellow-100 text-yellow-800" },
    { value: "banned", label: "Bị cấm", color: "bg-red-100 text-red-800" },
  ]

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingUser) {
      setUsers(users.map((user) => (user.id === editingUser.id ? { ...user, ...formData } : user)))
      toast({
        title: "Cập nhật thành công",
        description: "Thông tin người dùng đã được cập nhật.",
      })
    } else {
      const newUser: User = {
        id: Math.max(...users.map((u) => u.id)) + 1,
        ...formData,
        createdAt: new Date().toISOString(),
        lastLogin: "",
      }
      setUsers([...users, newUser])
      toast({
        title: "Thêm thành công",
        description: "Người dùng mới đã được thêm vào hệ thống.",
      })
    }

    setIsDialogOpen(false)
    setEditingUser(null)
    setFormData({
      username: "",
      fullName: "",
      email: "",
      phone: "",
      address: "",
      idCard: "",
      dateOfBirth: "",
      role: "customer",
      status: "active",
    })
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      idCard: user.idCard,
      dateOfBirth: user.dateOfBirth,
      role: user.role,
      status: user.status,
    })
    setIsDialogOpen(true)
  }

  const handleViewDetails = (user: User) => {
    setSelectedUser(user)
    setIsDetailDialogOpen(true)
  }

  const handleDelete = (userId: number) => {
    setUsers(users.filter((user) => user.id !== userId))
    toast({
      title: "Xóa thành công",
      description: "Người dùng đã được xóa khỏi hệ thống.",
    })
  }

  const handleToggleStatus = (userId: number) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: user.status === "active" ? "inactive" : "active" } : user,
      ),
    )
    toast({
      title: "Cập nhật thành công",
      description: "Trạng thái người dùng đã được thay đổi.",
    })
  }

  const getRoleBadge = (role: string) => {
    const roleOption = roles.find((option) => option.value === role)
    return <Badge className={roleOption?.color}>{roleOption?.label}</Badge>
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
            <h2 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h2>
            <p className="text-muted-foreground">Quản lý thông tin người dùng trong hệ thống</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingUser(null)
                  setFormData({
                    username: "",
                    fullName: "",
                    email: "",
                    phone: "",
                    address: "",
                    idCard: "",
                    dateOfBirth: "",
                    role: "customer",
                    status: "active",
                  })
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Thêm người dùng
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}</DialogTitle>
                <DialogDescription>
                  {editingUser ? "Cập nhật thông tin người dùng" : "Nhập thông tin người dùng mới"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Tên đăng nhập
                    </Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="fullName" className="text-right">
                      Họ và tên
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Số điện thoại
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="idCard" className="text-right">
                      CMND/CCCD
                    </Label>
                    <Input
                      id="idCard"
                      value={formData.idCard}
                      onChange={(e) => setFormData({ ...formData, idCard: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dateOfBirth" className="text-right">
                      Ngày sinh
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      Vai trò
                    </Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  <Button type="submit">{editingUser ? "Cập nhật" : "Thêm mới"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách người dùng</CardTitle>
            <CardDescription>Tổng cộng {users.length} người dùng trong hệ thống</CardDescription>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả vai trò</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên đăng nhập</TableHead>
                  <TableHead>Họ và tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Đăng nhập cuối</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString("vi-VN") : "Chưa đăng nhập"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Mở menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(user)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(user.id)}>
                            <Lock className="mr-2 h-4 w-4" />
                            {user.status === "active" ? "Khóa tài khoản" : "Mở khóa"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(user.id)} className="text-red-600">
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

        {/* User Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Chi tiết người dùng</DialogTitle>
              <DialogDescription>Thông tin chi tiết về người dùng {selectedUser?.username}</DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Thông tin cá nhân</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Họ và tên:</span> {selectedUser.fullName}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span> {selectedUser.email}
                      </p>
                      <p>
                        <span className="font-medium">Số điện thoại:</span> {selectedUser.phone}
                      </p>
                      <p>
                        <span className="font-medium">CMND/CCCD:</span> {selectedUser.idCard}
                      </p>
                      <p>
                        <span className="font-medium">Ngày sinh:</span>{" "}
                        {selectedUser.dateOfBirth
                          ? new Date(selectedUser.dateOfBirth).toLocaleDateString("vi-VN")
                          : "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Thông tin tài khoản</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Tên đăng nhập:</span> {selectedUser.username}
                      </p>
                      <p>
                        <span className="font-medium">Vai trò:</span> {getRoleBadge(selectedUser.role)}
                      </p>
                      <p>
                        <span className="font-medium">Trạng thái:</span> {getStatusBadge(selectedUser.status)}
                      </p>
                      <p>
                        <span className="font-medium">Ngày tạo:</span>{" "}
                        {new Date(selectedUser.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                      <p>
                        <span className="font-medium">Đăng nhập cuối:</span>{" "}
                        {selectedUser.lastLogin
                          ? new Date(selectedUser.lastLogin).toLocaleDateString("vi-VN")
                          : "Chưa đăng nhập"}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Địa chỉ</h4>
                  <p className="text-sm">{selectedUser.address || "Chưa cập nhật"}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
