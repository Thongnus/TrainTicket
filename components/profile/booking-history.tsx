"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format, parse, parseISO } from "date-fns"
import { vi } from "date-fns/locale"
import { Loader2, Receipt, Train, Calendar, Clock, MapPin, CreditCard } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { fetchWithAuth } from "@/lib/api"

interface Route {
  routeId: number
  routeName: string
  distance: number
  description: string
  status: string
  createdAt: number[]
  updatedAt: number[]
}

interface Train {
  trainId: number
  trainNumber: string
  trainName: string
  trainType: string
  capacity: number
  status: string
  createdAt: number[]
  updatedAt: number[]
}

interface Trip {
  tripId: number
  route: Route
  train: Train
  tripCode: string
  departureTime: number[]
  arrivalTime: number[]
  status: string
  delayMinutes: number
  createdAt: number[]
  updatedAt: number[]
  origin: string | null
  destination: string | null
}

interface Passenger {
  seatId: number
  passengerName: string
  identityCard: string
  seatNumbers?: string[]
  carriage?: string
  carriageNumber?: string
}

interface Payment {
  method: string
  status: string
  transactionId: string
  paidAt: string
  paymentDate: string
}

interface Booking {
  bookingId: number
  bookingCode: string
  bookingStatus: string
  createdAt: string
  totalAmount: number
  trip: Trip
  passengers: Passenger[]
  payment: Payment | null
}

export function BookingHistory() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  // Custom toast state
  const [customToast, setCustomToast] = useState<{
    show: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    show: false,
    title: '',
    message: '',
    type: 'info',
  });

  const fetchBookings = async (pageNumber = 0) => {
    setIsLoading(true)
    try {
      const response = await fetchWithAuth(`/bookings/history?page=${pageNumber}`)
      if (!response.ok) {
        showCustomToast("Lỗi tải lịch sử", "Không thể tải lịch sử đặt vé. Vui lòng thử lại.", "error");
        return;
      }
      const data = await response.json()
      setBookings(data.content || [])
      setTotalPages(data.totalPages || 1)
      setPage(data.number || 0)
    } catch (error) {
      showCustomToast("Lỗi tải lịch sử", "Không thể tải lịch sử đặt vé. Vui lòng thử lại.", "error");
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, toast])

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Badge className="bg-yellow-500">Chờ xác nhận</Badge>
      case "confirmed":
        return <Badge className="bg-blue-500">Đã xác nhận</Badge>
      case "pending_cancel":
        return <Badge className="bg-orange-400">Chờ hủy</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Đã hủy</Badge>
      case "refund_processing":
        return <Badge className="bg-orange-500">Đang hoàn tiền</Badge>
      case "refund_failed":
        return <Badge className="bg-gray-500">Hoàn tiền thất bại</Badge>
      case "refunded":
        return <Badge className="bg-green-700">Đã hoàn tiền</Badge>
      case "completed":
        return <Badge className="bg-green-500">Hoàn thành</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Badge className="bg-yellow-500">Chờ thanh toán</Badge>
      case "paid":
        return <Badge className="bg-blue-500">Đã thanh toán</Badge>
      case "refund_pending":
        return <Badge className="bg-orange-400">Chờ hoàn tiền</Badge>
      case "refunded":
        return <Badge className="bg-green-700">Đã hoàn tiền</Badge>
      case "refund_failed":
        return <Badge className="bg-gray-500">Hoàn tiền thất bại</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Đã hủy</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatDateTime = (dateTimeStr: string | number[]) => {
    if (!dateTimeStr) return "";
    let dateTime: Date;
    try {
      if (Array.isArray(dateTimeStr)) {
        if (dateTimeStr.length >= 5) {
          dateTime = new Date(dateTimeStr[0], dateTimeStr[1] - 1, dateTimeStr[2], dateTimeStr[3], dateTimeStr[4]);
        } else {
          return "";
        }
      } else {
        // Thử parse ISO trước
        if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(dateTimeStr)) {
          dateTime = parseISO(dateTimeStr);
        } else {
          // Thử parse dạng 'HH:mm:ss dd/MM/yyyy'
          if (/\d{2}:\d{2}:\d{2} \d{2}\/\d{2}\/\d{4}/.test(dateTimeStr)) {
            dateTime = parse(dateTimeStr, "HH:mm:ss dd/MM/yyyy", new Date());
          } else if (/\d{2}:\d{2} \d{2}\/\d{2}\/\d{4}/.test(dateTimeStr)) {
            dateTime = parse(dateTimeStr, "HH:mm dd/MM/yyyy", new Date());
          } else {
            return "";
          }
        }
      }
      if (isNaN(dateTime.getTime())) {
        return "";
      }
      return format(dateTime, "HH:mm - dd/MM/yyyy", { locale: vi });
    } catch (error) {
      return "";
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price)
  }

  const handleCancelBooking = async (bookingId: number) => {
    setIsLoading(true)
    try {
      const response = await fetchWithAuth(`/bookings/${bookingId}/cancel`, {
        method: 'POST'
      })
      
      if (!response.ok) {
        showCustomToast("Lỗi hủy vé", "Không thể hủy vé. Vui lòng thử lại.", "error");
        return;
      }

      // Refresh booking list
      const updatedBookings = bookings.map(booking => 
        booking.bookingId === bookingId 
          ? { ...booking, bookingStatus: "cancelled" }
          : booking
      )
      setBookings(updatedBookings)
      
      showCustomToast("Hủy vé thành công", "Vé đã được hủy thành công.", "success");
    } catch (error) {
      console.error("Error cancelling booking:", error)
      showCustomToast("Lỗi hủy vé", "Không thể hủy vé. Vui lòng thử lại.", "error");
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefundBooking = async (bookingId: number) => {
    setIsLoading(true);
    try {
      const response = await fetchWithAuth(`/refunds/booking/${bookingId}`, {
        method: 'POST',
      });
      const data = await response.json();
      // if (!response.ok || data.code === "A09") {
      //   const errorMsg = data.code === "A09"
      //     ? "Vượt quá thời gian hoàn tiền"
      //     : (data.message || "Yêu cầu hoàn tiền không hợp lệ hoặc đã quá thời gian quy định.");
      //   showCustomToast("Không thể hoàn tiền", errorMsg, "error");
      //   return;
      // }
      showCustomToast("Yêu cầu hoàn tiền thành công", `Yêu cầu hoàn tiền cho booking #${bookingId} đã được gửi.`, "success");
      await fetchBookings(page); // Gọi lại để cập nhật danh sách đúng trang hiện tại
    } catch (error) {
      showCustomToast("Lỗi hoàn tiền", "Không thể gửi yêu cầu hoàn tiền. Vui lòng thử lại.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowDetails(true)
  }

  // Custom toast function
  const showCustomToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setCustomToast({ show: true, title, message, type });
    setTimeout(() => setCustomToast({ show: false, title: '', message: '', type: 'info' }), 4000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <Receipt className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">Chưa có lịch sử đặt vé</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Bạn chưa có lịch sử đặt vé nào. Hãy đặt vé để xem lịch sử ở đây.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking.bookingId}
            className="border rounded-lg p-4 space-y-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Mã đặt vé: {booking.bookingCode}</p>
                <p className="text-sm text-muted-foreground">
                  Ngày đặt: {formatDateTime(booking.createdAt)}
                </p>
              </div>
              {getStatusBadge(booking.bookingStatus)}
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Tàu:</span>
                <span>{booking.trip.train.trainNumber}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Hành trình:</span>
                <span>
                  {booking.trip.route.routeName}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Giờ đi:</span>
                <span>{formatDateTime(booking.trip.departureTime)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Giờ đến:</span>
                <span>{formatDateTime(booking.trip.arrivalTime)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Tổng tiền:</span>
                <span className="font-medium text-green-600">{formatPrice(booking.totalAmount)}đ</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleViewDetails(booking)}
              >
                Xem chi tiết
              </Button>
              {booking.bookingStatus === "confirmed" && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRefundBooking(booking.bookingId)}
                  disabled={isLoading}
                >
                  Yêu cầu hoàn tiền
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page - 1)}
          disabled={page === 0}
        >
          Trang trước
        </Button>
        <span className="px-2 py-1">Trang {page + 1} / {totalPages}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page + 1)}
          disabled={page + 1 >= totalPages}
        >
          Trang sau
        </Button>
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết đặt vé</DialogTitle>
            <DialogDescription>
              Mã đặt vé: {selectedBooking?.bookingCode}
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6">
              {/* Thông tin chuyến tàu */}
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <Train className="h-4 w-4" />
                  Thông tin chuyến tàu
                </h3>
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tàu:</span>
                    <span className="font-medium">{selectedBooking.trip.train.trainNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Hành trình:</span>
                    <span className="font-medium">
                      {selectedBooking.trip.route.routeName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Giờ đi:</span>
                    <span className="font-medium">{formatDateTime(selectedBooking.trip.departureTime)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Giờ đến:</span>
                    <span className="font-medium">{formatDateTime(selectedBooking.trip.arrivalTime)}</span>
                  </div>
                </div>
              </div>

              {/* Thông tin hành khách */}
              {selectedBooking.passengers && (
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Thông tin hành khách
                  </h3>
                  <div className="space-y-4">
                    {selectedBooking.passengers.map((passenger, index) => (
                      <div key={index} className="grid gap-2 text-sm border rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Họ tên:</span>
                          <span className="font-medium">{passenger.passengerName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">CMND/CCCD:</span>
                          <span className="font-medium">{passenger.identityCard}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Số ghế:</span>
                          <span className="font-medium">{passenger.seatNumbers || passenger.seatId || ""}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Toa:</span>
                          <span className="font-medium">{passenger.carriageNumber || ""}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Thông tin thanh toán */}
              {selectedBooking.payment && (
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Thông tin thanh toán
                  </h3>
                  <div className="grid gap-2 text-sm border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Phương thức:</span>
                      <span className="font-medium">{selectedBooking.payment.method}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Trạng thái:</span>
                      <span className="font-medium">{getPaymentStatusBadge(selectedBooking.payment.status)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Mã giao dịch:</span>
                      <span className="font-medium">{selectedBooking.payment.transactionId}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Thời gian thanh toán:</span>
                      <span className="font-medium">{formatDateTime(selectedBooking.payment.paymentDate)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tổng tiền:</span>
                      <span className="font-medium text-green-600">{formatPrice(selectedBooking.totalAmount)}đ</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      {customToast.show && (
        <div className={`fixed top-4 right-4 z-[9999] p-4 rounded-lg shadow-lg border max-w-sm ` +
          (customToast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            customToast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            'bg-blue-50 border-blue-200 text-blue-800')
        }>
          <div className="font-semibold">{customToast.title}</div>
          <div className="text-sm mt-1">{customToast.message}</div>
          <button
            onClick={() => setCustomToast({ show: false, title: '', message: '', type: 'info' })}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      )}
    </>
  )
} 