"use client"

import { useState } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Eye, MoreHorizontal, Search, RefreshCw, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Booking {
  id: number
  bookingCode: string
  customerName: string
  customerEmail: string
  tripCode: string
  route: string
  departureTime: string
  totalAmount: number
  paymentStatus: string
  bookingStatus: string
  paymentMethod: string
  bookingDate: string
  ticketCount: number
}

export default function BookingsManagement() {
  const { toast } = useToast()
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 1,
      bookingCode: "BK202505200001",
      customerName: "Nguyễn Văn A",
      customerEmail: "nguyenvana@email.com",
      tripCode: "SE9-20250520",
      route: "Hà Nội - Sài Gòn",
      departureTime: "2025-05-20T07:00:00",
      totalAmount: 800000,
      paymentStatus: "paid",
      bookingStatus: "confirmed",
      paymentMethod: "bank_transfer",
      bookingDate: "2025-05-13T11:19:50Z",
      ticketCount: 2,
    },
    {
      id: 33,
      bookingCode: "BK20250527140346",
      customerName: "Trần Thị B",
      customerEmail: "tranthib@email.com",
      tripCode: "SE9-20250520",
      route: "Hà Nội - Sài Gòn",
      departureTime: "2025-05-20T07:00:00",
      totalAmount: 352500,
      paymentStatus: "paid",
      bookingStatus: "confirmed",
      paymentMethod: "vnPay",
      bookingDate: "2025-05-27T07:03:47Z",
      ticketCount: 1,
    },
    {
      id: 34,
      bookingCode: "BK20250527155124",
      customerName: "Lê Văn C",
      customerEmail: "levanc@email.com",
      tripCode: "SE9-20250520",
      route: "Hà Nội - Sài Gòn",
      departureTime: "2025-05-20T07:00:00",
      totalAmount: 352500,
      paymentStatus: "paid",
      bookingStatus: "confirmed",
      paymentMethod: "vnPay",
      bookingDate: "2025-05-27T08:51:24Z",
      ticketCount: 1,
    },
    {
      id: 35,
      bookingCode: "BK20250527173426",
      customerName: "Phạm Thị D",
      customerEmail: "phamthid@email.com",
      tripCode: "SE9-20250520",
      route: "Hà Nội - Sài Gòn",
      departureTime: "2025-05-20T07:00:00",
      totalAmount: 352500,
      paymentStatus: "cancelled",
      bookingStatus: "cancelled",
      paymentMethod: "vnPay",
      bookingDate: "2025-05-27T10:34:26Z",
      ticketCount: 1,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  const paymentStatusOptions = [
    { value: "pending", label: "Chờ thanh toán", color: "bg-yellow-100 text-yellow-800" },
    { value: "paid", label: "Đã thanh toán", color: "bg-green-100 text-green-800" },
    { value: "refunded", label: "Đã hoàn tiền", color: "bg-blue-100 text-blue-800" },
    { value: "cancelled", label: "Đã hủy", color: "bg-red-100 text-red-800" },
  ]

  const bookingStatusOptions = [
    { value: "pending", label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800" },
    { value: "confirmed", label: "Đã xác nhận", color: "bg-green-100 text-green-800" },
    { value: "cancelled", label: "Đã hủy", color: "bg-red-100 text-red-800" },
    { value: "completed", label: "Hoàn thành", color: "bg-blue-100 text-blue-800" },
  ]

  const paymentMethods = [
    { value: "vnPay", label: "VNPay" },
    { value: "credit_card", label: "Thẻ tín dụng" },
    { value: "bank_transfer", label: "Chuyển khoản" },
    { value: "e_wallet", label: "Ví điện tử" },
    { value: "cash", label: "Tiền mặt" },
  ]

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.bookingStatus === statusFilter
    const matchesPayment = paymentFilter === "all" || booking.paymentStatus === paymentFilter

    return matchesSearch && matchesStatus && matchesPayment
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price)
  }

  const getPaymentStatusBadge = (status: string) => {
    const statusOption = paymentStatusOptions.find((option) => option.value === status)
    return <Badge className={statusOption?.color}>{statusOption?.label}</Badge>
  }

  const getBookingStatusBadge = (status: string) => {
    const statusOption = bookingStatusOptions.find((option) => option.value === status)
    return <Badge className={statusOption?.color}>{statusOption?.label}</Badge>
  }

  const getPaymentMethodLabel = (method: string) => {
    const paymentMethod = paymentMethods.find((m) => m.value === method)
    return paymentMethod?.label || method
  }

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsDetailDialogOpen(true)
  }

  const handleUpdateStatus = (bookingId: number, newStatus: string) => {
    setBookings(
      bookings.map((booking) => (booking.id === bookingId ? { ...booking, bookingStatus: newStatus } : booking)),
    )
    toast({
      title: "Cập nhật thành công",
      description: "Trạng thái đặt vé đã được cập nhật.",
    })
  }

  const handleCancelBooking = (bookingId: number) => {
    setBookings(
      bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, bookingStatus: "cancelled", paymentStatus: "cancelled" } : booking,
      ),
    )
    toast({
      title: "Hủy thành công",
      description: "Đặt vé đã được hủy.",
    })
  }

  return (
    <div className="flex min-h-screen flex-col items-center">
      <AdminHeader />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Quản lý đặt vé</h2>
            <p className="text-muted-foreground">Quản lý và theo dõi các đơn đặt vé trong hệ thống</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách đặt vé</CardTitle>
            <CardDescription>Tổng cộng {bookings.length} đơn đặt vé trong hệ thống</CardDescription>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo mã đặt vé, tên khách hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trạng thái đặt vé" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  {bookingStatusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trạng thái thanh toán" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả thanh toán</SelectItem>
                  {paymentStatusOptions.map((status) => (
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
                  <TableHead>Mã đặt vé</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Chuyến tàu</TableHead>
                  <TableHead>Số vé</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Thanh toán</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày đặt</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.bookingCode}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.customerName}</div>
                        <div className="text-sm text-muted-foreground">{booking.customerEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.tripCode}</div>
                        <div className="text-sm text-muted-foreground">{booking.route}</div>
                      </div>
                    </TableCell>
                    <TableCell>{booking.ticketCount} vé</TableCell>
                    <TableCell>{formatPrice(booking.totalAmount)}đ</TableCell>
                    <TableCell>{getPaymentStatusBadge(booking.paymentStatus)}</TableCell>
                    <TableCell>{getBookingStatusBadge(booking.bookingStatus)}</TableCell>
                    <TableCell>{new Date(booking.bookingDate).toLocaleDateString("vi-VN")}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Mở menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(booking)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          {booking.bookingStatus === "pending" && (
                            <DropdownMenuItem onClick={() => handleUpdateStatus(booking.id, "confirmed")}>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Xác nhận
                            </DropdownMenuItem>
                          )}
                          {booking.bookingStatus !== "cancelled" && (
                            <DropdownMenuItem onClick={() => handleCancelBooking(booking.id)} className="text-red-600">
                              <X className="mr-2 h-4 w-4" />
                              Hủy đặt vé
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Booking Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Chi tiết đặt vé</DialogTitle>
              <DialogDescription>Thông tin chi tiết về đơn đặt vé {selectedBooking?.bookingCode}</DialogDescription>
            </DialogHeader>
            {selectedBooking && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Thông tin khách hàng</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Tên:</span> {selectedBooking.customerName}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span> {selectedBooking.customerEmail}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Thông tin chuyến tàu</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Mã chuyến:</span> {selectedBooking.tripCode}
                      </p>
                      <p>
                        <span className="font-medium">Tuyến:</span> {selectedBooking.route}
                      </p>
                      <p>
                        <span className="font-medium">Khởi hành:</span>{" "}
                        {new Date(selectedBooking.departureTime).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Thông tin thanh toán</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Phương thức:</span>{" "}
                        {getPaymentMethodLabel(selectedBooking.paymentMethod)}
                      </p>
                      <p>
                        <span className="font-medium">Tổng tiền:</span> {formatPrice(selectedBooking.totalAmount)}đ
                      </p>
                      <p>
                        <span className="font-medium">Trạng thái:</span>{" "}
                        {getPaymentStatusBadge(selectedBooking.paymentStatus)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Thông tin đặt vé</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Số vé:</span> {selectedBooking.ticketCount} vé
                      </p>
                      <p>
                        <span className="font-medium">Ngày đặt:</span>{" "}
                        {new Date(selectedBooking.bookingDate).toLocaleString("vi-VN")}
                      </p>
                      <p>
                        <span className="font-medium">Trạng thái:</span>{" "}
                        {getBookingStatusBadge(selectedBooking.bookingStatus)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
