"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
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
}

interface Payment {
  method: string
  status: string
  transactionId: string
  paidAt: string
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

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true)
      try {
        const response = await fetchWithAuth("/bookings/history")
        if (!response.ok) {
          throw new Error("Failed to fetch booking history")
        }
        const data = await response.json()
        setBookings(data)
        console.log(data)
      } catch (error) {
        console.error("Error fetching booking history:", error)
        toast({
          title: "Lỗi tải lịch sử",
          description: "Không thể tải lịch sử đặt vé. Vui lòng thử lại.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [toast])

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Badge className="bg-green-500">Hoàn thành</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Đang xử lý</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Đã hủy</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatDateTime = (dateTimeStr: string | number[]) => {
    let dateTime: Date
    if (Array.isArray(dateTimeStr)) {
      dateTime = new Date(dateTimeStr[0], dateTimeStr[1] - 1, dateTimeStr[2], dateTimeStr[3], dateTimeStr[4])
    } else {
      dateTime = new Date(dateTimeStr.replace(" ", "T"))
    }
    return format(dateTime, "HH:mm - dd/MM/yyyy", { locale: vi })
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
        throw new Error("Failed to cancel booking")
      }

      // Refresh booking list
      const updatedBookings = bookings.map(booking => 
        booking.bookingId === bookingId 
          ? { ...booking, bookingStatus: "cancelled" }
          : booking
      )
      setBookings(updatedBookings)
      
      toast({
        title: "Hủy vé thành công",
        description: "Vé đã được hủy thành công.",
      })
    } catch (error) {
      console.error("Error cancelling booking:", error)
      toast({
        title: "Lỗi hủy vé",
        description: "Không thể hủy vé. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowDetails(true)
  }

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
              {booking.bookingStatus.toLowerCase() === "pending" && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleCancelBooking(booking.bookingId)}
                  disabled={isLoading}
                >
                  Hủy vé
                </Button>
              )}
            </div>
          </div>
        ))}
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
                      <span className="font-medium">{selectedBooking.payment.status}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Mã giao dịch:</span>
                      <span className="font-medium">{selectedBooking.payment.transactionId}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Thời gian thanh toán:</span>
                      <span className="font-medium">{formatDateTime(selectedBooking.payment.paidAt)}</span>
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
    </>
  )
} 