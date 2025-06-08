"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Wallet, Gift } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserNav } from "@/components/user-nav"
import { fetchWithAuth } from "@/lib/api"

// API Response Types
interface ApiSeat {
  seatId: number
  seatNumber: string
  seatType: string
  status: string
  createdAt: string | null
  updatedAt: string | null
  price: number
  booked: boolean
}

interface ApiCarriage {
  carriageId: number
  carriageNumber: string
  carriageType: string
  capacity: number
  seats: ApiSeat[]
}

interface ApiTrip {
  tripId: number
  trainNumber: string
  departureTime: string
  arrivalTime: string
  carriages: ApiCarriage[]
}

interface ApiResponse {
  data: ApiTrip[]
  status: number
  code: string
  message: string
  timestamp: number
}

// Internal Types
interface Trip {
  id: number
  trainNumber: string
  departureTime: string
  arrivalTime: string
  carriages: Carriage[]
}

interface Carriage {
  id: number
  number: string
  type: string
  capacity: number
  seats: Seat[]
}

interface Seat {
  id: number
  number: string
  type: string
  available: boolean
  price: number
  status: string
}

interface Passenger {
  name: string
  idCard: string
  seatId: number | null
  carriageId: number | null
  price: number | null
}

interface PassengerTicketDto {
  seatId: number
  passengerName: string
  identityCard: string
}

interface BookingCheckoutRequest {
  tripId: number
  paymentMethod: string
  infoPhone: string
  infoEmail: string
  passengerTickets: PassengerTicketDto[]
  promotionCode: string | null
  returnTripId?: number
  returnPassengerTickets?: PassengerTicketDto[]
}

export default function BookingPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const tripId = params.tripId as string
  const returnTripId = searchParams.get("returnTripId")
  const passengersCount = Number.parseInt(searchParams.get("passengers") || "1")
  const origin = searchParams.get("origin")
  const destination = searchParams.get("destination")
  const returnOrigin = searchParams.get("returnOrigin")
  const returnDestination = searchParams.get("returnDestination")

  const [trip, setTrip] = useState<Trip | null>(null)
  const [returnTrip, setReturnTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCarriage, setSelectedCarriage] = useState<number | null>(null)
  const [selectedReturnCarriage, setSelectedReturnCarriage] = useState<number | null>(null)
  const [passengers, setPassengers] = useState<Passenger[]>([])
  const [returnPassengers, setReturnPassengers] = useState<Passenger[]>([])
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState("vnPay")
  const [isPromoDialogOpen, setIsPromoDialogOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<{title: string; description: string} | null>(null)
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: ""
  })

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

  const availablePromotions = [
    {
      code: "WINTER25",
      description: "Giảm 25% cho tất cả chuyến tàu",
      validUntil: "31/12/2024"
    },
    {
      code: "SUMMER15",
      description: "Giảm 15% cho chuyến tàu mùa hè",
      validUntil: "31/08/2024"
    },
    {
      code: "FAMILY10",
      description: "Giảm 10% cho nhóm từ 3 người trở lên",
      validUntil: "31/12/2024"
    }
  ]

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetchWithAuth("/users/me")
        if (!response.ok) {
          throw new Error("Failed to fetch user info")
        }
        const userData = await response.json()
        setContactInfo({
          email: userData.email || "",
          phone: userData.phone || ""
        })
      } catch (error) {
        console.error("Error fetching user info:", error)
        toast({
          title: "Lỗi tải thông tin",
          description: "Không thể tải thông tin người dùng. Vui lòng thử lại.",
          variant: "destructive",
        })
      }
    }

    fetchUserInfo()
  }, [toast])

  // Initialize passengers
  useEffect(() => {
    const initialPassengers: Passenger[] = Array(passengersCount)
      .fill(null)
      .map(() => ({
        name: "",
        idCard: "",
        seatId: null,
        carriageId: null,
        price: null,
      }))
    setPassengers(initialPassengers)
    setReturnPassengers(initialPassengers)
  }, [passengersCount])

  // Convert API data to internal format
  const convertApiTripToTrip = (apiTrip: ApiTrip): Trip => {
    return {
      id: apiTrip.tripId,
      trainNumber: apiTrip.trainNumber,
      departureTime: apiTrip.departureTime,
      arrivalTime: apiTrip.arrivalTime,
      carriages: apiTrip.carriages.map((apiCarriage) => ({
        id: apiCarriage.carriageId,
        number: apiCarriage.carriageNumber,
        type: apiCarriage.carriageType,
        capacity: apiCarriage.capacity,
        seats: apiCarriage.seats.map((apiSeat) => ({
          id: apiSeat.seatId,
          number: apiSeat.seatNumber,
          type: apiSeat.seatType,
          available: apiSeat.status === "active" && !apiSeat.booked,
          price: apiSeat.price,
          status: apiSeat.status,
        })),
      })),
    }
  }

  // Fetch trip data from API
  useEffect(() => {
    const fetchTripData = async () => {
      try {
        setLoading(true)
        const response = await fetchWithAuth(`/trips/${tripId}/carriages-with-seats`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const apiResponse: ApiResponse = await response.json()
        console.log("API Response:", apiResponse)

        if (apiResponse.status !== 200) {
          throw new Error(apiResponse.message || "API request failed")
        }

        // Convert API trip to internal format
        const fetchedTrip = convertApiTripToTrip(apiResponse.data[0])
        setTrip(fetchedTrip)
        if (fetchedTrip.carriages.length > 0) {
          setSelectedCarriage(fetchedTrip.carriages[0].id)
        }
          console.log(returnTripId)
        // Fetch return trip if returnTripId exists
        if (returnTripId) {
          const returnResponse = await fetchWithAuth(`/trips/${returnTripId}/carriages-with-seats`)
          if (!returnResponse.ok) {
            throw new Error(`HTTP error for return trip! status: ${returnResponse.status}`)
          }
          const returnApiResponse: ApiResponse = await returnResponse.json()
          if (returnApiResponse.status !== 200) {
            throw new Error(returnApiResponse.message || "Return trip API request failed")
          }
          const fetchedReturnTrip = convertApiTripToTrip(returnApiResponse.data[0])
          setReturnTrip(fetchedReturnTrip)
          if (fetchedReturnTrip.carriages.length > 0) {
            setSelectedReturnCarriage(fetchedReturnTrip.carriages[0].id)
          }
        }
      } catch (err) {
        console.error("Error fetching trip data:", err)
        toast({
          title: "Lỗi tải dữ liệu",
          description: "Không thể tải thông tin chuyến tàu. Vui lòng thử lại.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTripData()
  }, [tripId, returnTripId, toast])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price)
  }

  const formatDateTime = (dateTimeStr: string) => {
    const dateTime = new Date(dateTimeStr.replace(" ", "T"))
    return format(dateTime, "HH:mm - dd/MM/yyyy", { locale: vi })
  }

  const getCarriageTypeLabel = (type: string) => {
    switch (type) {
      case "soft_seat":
        return "Ghế mềm"
      case "hard_seat":
        return "Ghế cứng"
      case "soft_sleeper":
        return "Giường nằm mềm"
      case "hard_sleeper":
        return "Giường nằm cứng"
      case "vip":
        return "VIP"
      default:
        return type
    }
  }

  const getSeatTypeLabel = (type: string) => {
    switch (type) {
      case "window":
        return "Cửa sổ"
      case "aisle":
        return "Lối đi"
      case "middle":
        return "Giữa"
      case "lower_berth":
        return "Giường dưới"
      case "middle_berth":
        return "Giường giữa"
      case "upper_berth":
        return "Giường trên"
      default:
        return type
    }
  }

  const handleSeatSelect = (
    passengerId: number,
    seatId: number,
    carriageId: number,
    price: number,
    isReturn = false,
  ) => {
    const passengersList = isReturn ? returnPassengers : passengers
    const setPassengersList = isReturn ? setReturnPassengers : setPassengers

    // Check if seat is already selected by another passenger
    const isSeatTaken = passengersList.some((p, idx) => idx !== passengerId && p.seatId === seatId)

    if (isSeatTaken) {
      toast({
        title: "Ghế đã được chọn",
        description: "Ghế này đã được hành khách khác chọn. Vui lòng chọn ghế khác.",
        variant: "destructive",
      })
      return
    }

    const updatedPassengers = [...passengersList]
    updatedPassengers[passengerId] = {
      ...updatedPassengers[passengerId],
      seatId,
      carriageId,
      price,
    }
    setPassengersList(updatedPassengers)
  }

  const handlePassengerInfoChange = (index: number, field: keyof Passenger, value: string, isReturn = false) => {
    const passengersList = isReturn ? returnPassengers : passengers
    const setPassengersList = isReturn ? setReturnPassengers : setPassengers

    const updatedPassengers = [...passengersList]
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value,
    }
    setPassengersList(updatedPassengers)
  }

  const handleApplyPromo = (code?: string) => {
    const codeToApply = code || promoCode
    const promotion = availablePromotions.find(p => p.code.toUpperCase() === codeToApply.toUpperCase())
    
    if (promotion) {
      if (promotion.code === "WINTER25") {
        setDiscount(0.25)
        toast({
          title: "Mã giảm giá đã được áp dụng",
          description: "Bạn được giảm 25% tổng giá trị đơn hàng.",
        })
      } else if (promotion.code === "SUMMER15") {
        setDiscount(0.15)
        toast({
          title: "Mã giảm giá đã được áp dụng",
          description: "Bạn được giảm 15% tổng giá trị đơn hàng.",
        })
      } else if (promotion.code === "FAMILY10" && passengersCount >= 3) {
        setDiscount(0.10)
        toast({
          title: "Mã giảm giá đã được áp dụng",
          description: "Bạn được giảm 10% tổng giá trị đơn hàng.",
        })
      } else if (promotion.code === "FAMILY10" && passengersCount < 3) {
        toast({
          title: "Mã giảm giá không hợp lệ",
          description: "Mã FAMILY10 chỉ áp dụng cho nhóm từ 3 người trở lên.",
          variant: "destructive",
        })
        return false
      }
      setIsPromoDialogOpen(false)
      return true
    } else {
      setDiscount(0)
      toast({
        title: "Mã giảm giá không hợp lệ",
        description: "Vui lòng kiểm tra lại mã giảm giá.",
        variant: "destructive",
      })
      return false
    }
  }

  const getTotalPrice = () => {
    const outboundTotal = passengers.reduce((sum, passenger) => sum + (passenger.price || 0), 0)
    const returnTotal = returnPassengers.reduce((sum, passenger) => sum + (passenger.price || 0), 0)
    const subtotal = outboundTotal + returnTotal
    const discountAmount = Math.round(subtotal * discount)
    return {
      subtotal,
      discountAmount,
      total: subtotal - discountAmount
    }
  }

  const validatePassenger = (passenger: Passenger, index: number, isReturn = false) => {
    const errors: Record<string, string> = {}
    const prefix = isReturn ? `return_` : `outbound_`

    if (!passenger.name.trim()) {
      errors[`${prefix}name_${index}`] = "Họ và tên là bắt buộc"
    } else if (passenger.name.trim().length < 2) {
      errors[`${prefix}name_${index}`] = "Họ và tên phải có ít nhất 2 ký tự"
    } else if (passenger.name.trim().length > 50) {
      errors[`${prefix}name_${index}`] = "Họ và tên không được quá 50 ký tự"
    } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(passenger.name.trim())) {
      errors[`${prefix}name_${index}`] = "Họ và tên chỉ được chứa chữ cái và khoảng trắng"
    }

    if (!passenger.idCard.trim()) {
      errors[`${prefix}idCard_${index}`] = "Số CMND/CCCD là bắt buộc"
    } else if (passenger.idCard.trim().length < 9) {
      errors[`${prefix}idCard_${index}`] = "Số CMND/CCCD phải có ít nhất 9 số"
    } else if (passenger.idCard.trim().length > 12) {
      errors[`${prefix}idCard_${index}`] = "Số CMND/CCCD không được quá 12 số"
    } else if (!/^\d+$/.test(passenger.idCard.trim())) {
      errors[`${prefix}idCard_${index}`] = "Số CMND/CCCD chỉ được chứa số"
    }

    if (!passenger.seatId) {
      errors[`${prefix}seat_${index}`] = "Vui lòng chọn ghế cho hành khách này"
    }

    return errors
  }

  const validateContactInfo = () => {
    const errors: Record<string, string> = {}
    
    if (!contactInfo.email.trim()) {
      errors.email = "Email là bắt buộc"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email.trim())) {
      errors.email = "Email không hợp lệ"
    }

    if (!contactInfo.phone.trim()) {
      errors.phone = "Số điện thoại là bắt buộc"
    } else if (!/^[0-9]{10}$/.test(contactInfo.phone.trim())) {
      errors.phone = "Số điện thoại phải có 10 chữ số"
    }

    return errors
  }

  const handleSubmit = async () => {
    setErrors({})
    setSubmitError(null)
    let allErrors: Record<string, string> = {}
    let hasErrors = false

    // Validate contact info
    const contactErrors = validateContactInfo()
    if (Object.keys(contactErrors).length > 0) {
      hasErrors = true
      allErrors = { ...allErrors, ...contactErrors }
    }

    // Validate passenger information
    passengers.forEach((passenger, index) => {
      const passengerErrors = validatePassenger(passenger, index, false)
      if (Object.keys(passengerErrors).length > 0) {
        hasErrors = true
        allErrors = { ...allErrors, ...passengerErrors }
      }
    })

    if (returnTrip) {
      returnPassengers.forEach((passenger, index) => {
        const passengerErrors = validatePassenger(passenger, index, true)
        if (Object.keys(passengerErrors).length > 0) {
          hasErrors = true
          allErrors = { ...allErrors, ...passengerErrors }
        }
      })
    }

    const outboundSeatsSelected = passengers.every((p) => p.seatId !== null)
    const returnSeatsSelected = returnTrip ? returnPassengers.every((p) => p.seatId !== null) : true

    if (!outboundSeatsSelected) {
      hasErrors = true
      allErrors.general = "Vui lòng chọn ghế cho tất cả hành khách chiều đi"
    }

    if (returnTrip && !returnSeatsSelected) {
      hasErrors = true
      allErrors.general = "Vui lòng chọn ghế cho tất cả hành khách chiều về"
    }

    setErrors(allErrors)

    if (hasErrors) {
      toast({
        title: "Thông tin chưa hợp lệ",
        description: "Vui lòng kiểm tra lại thông tin đã nhập và đảm bảo tất cả các trường bắt buộc đã được điền.",
        variant: "destructive",
      })

      const firstErrorElement = document.querySelector(".border-red-500")
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" })
      }
      return
    }

    try {
      setIsSubmitting(true)
      setSubmitError(null)
      
      toast({
        title: "Đang xử lý đặt vé",
        description: "Vui lòng đợi trong giây lát...",
      })

      // Prepare booking request
      const bookingRequest: BookingCheckoutRequest = {
        tripId: Number(tripId),
        paymentMethod: paymentMethod.toUpperCase(),
        infoPhone: contactInfo.phone,
        infoEmail: contactInfo.email,
        passengerTickets: passengers.map(p => ({
          seatId: p.seatId!,
          passengerName: p.name,
          identityCard: p.idCard
        })),
        promotionCode: promoCode || null
      }

      // If it's a round trip, add return trip information
      if (returnTrip) {
        bookingRequest.returnTripId = Number(returnTripId)
        bookingRequest.returnPassengerTickets = returnPassengers.map(p => ({
          seatId: p.seatId!,
          passengerName: p.name,
          identityCard: p.idCard
        }))
      }

      const response = await fetchWithAuth("/bookings/checkout", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingRequest)
      })

      const responseData = await response.json()

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 409 && responseData.code === "SEATLOCK") {
          // Get seat details from the locked seats
          const lockedSeats = responseData.data.map((seatId: number) => {
            // Check in outbound trip
            const outboundSeat = trip?.carriages
              .flatMap(c => c.seats)
              .find(s => s.id === seatId)
            
            if (outboundSeat) {
              const carriage = trip?.carriages.find(c => 
                c.seats.some(s => s.id === seatId)
              )
              return `Toa ${carriage?.number} - Ghế ${outboundSeat.number}`
            }

            // Check in return trip
            const returnSeat = returnTrip?.carriages
              .flatMap(c => c.seats)
              .find(s => s.id === seatId)
            
            if (returnSeat) {
              const carriage = returnTrip?.carriages.find(c => 
                c.seats.some(s => s.id === seatId)
              )
              return `Toa ${carriage?.number} - Ghế ${returnSeat.number}`
            }

            return `Ghế ${seatId}`
          })

          const errorMessage = `Các ghế sau đã bị người khác đặt: ${lockedSeats.join(", ")}. Vui lòng chọn ghế khác.`
          
          setSubmitError({
            title: "Ghế đã bị khóa",
            description: errorMessage
          })
          toast({
            title: "Ghế đã bị khóa",
            description: errorMessage,
            variant: "destructive",
          })
          // Refresh trip data to get updated seat status
          const tripResponse = await fetchWithAuth(`/trips/${tripId}/carriages-with-seats`)
          if (tripResponse.ok) {
            const tripData = await tripResponse.json()
            if (tripData.status === 200) {
              const updatedTrip = convertApiTripToTrip(tripData.data[0])
              setTrip(updatedTrip)
            }
          }
          return
        }

        if (response.status === 400) {
          setSubmitError({
            title: "Thông tin không hợp lệ",
            description: responseData.message || "Vui lòng kiểm tra lại thông tin đặt vé."
          })
          toast({
            title: "Thông tin không hợp lệ",
            description: responseData.message || "Vui lòng kiểm tra lại thông tin đặt vé.",
            variant: "destructive",
          })
          return
        }

        if (response.status === 403) {
          setSubmitError({
            title: "Không có quyền thực hiện",
            description: "Bạn không có quyền thực hiện thao tác này."
          })
          toast({
            title: "Không có quyền thực hiện",
            description: "Bạn không có quyền thực hiện thao tác này.",
            variant: "destructive",
          })
          return
        }

        if (response.status === 404) {
          setSubmitError({
            title: "Không tìm thấy thông tin",
            description: "Không tìm thấy thông tin chuyến tàu hoặc ghế ngồi."
          })
          toast({
            title: "Không tìm thấy thông tin",
            description: "Không tìm thấy thông tin chuyến tàu hoặc ghế ngồi.",
            variant: "destructive",
          })
          return
        }

        if (response.status === 500) {
          setSubmitError({
            title: "Lỗi hệ thống",
            description: "Có lỗi xảy ra từ hệ thống. Vui lòng thử lại sau."
          })
          toast({
            title: "Lỗi hệ thống",
            description: "Có lỗi xảy ra từ hệ thống. Vui lòng thử lại sau.",
            variant: "destructive",
          })
          return
        }

        // Handle other errors
        throw new Error(responseData.message || 'Failed to create booking')
      }

      const { paymentUrl } = responseData
      
      // Redirect to VNPay payment page
      window.location.href = paymentUrl
    } catch (error) {
      console.error('Error creating booking:', error)
      setSubmitError({
        title: "Lỗi đặt vé",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra khi xử lý đặt vé. Vui lòng thử lại."
      })
      toast({
        title: "Lỗi đặt vé",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra khi xử lý đặt vé. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-centercenter items-center">
        <header className="sticky top-0 z-50 w-full border-b bg-background">
          <div className="container flex h-16 items-center">
            <MainNav />
          </div>
        </header>
        <main className="flex-1">
          <div className="container py-4 md:py-6 lg:py-8">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Đang tải thông tin chuyến tàu...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center ">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-4 md:py-6 lg:py-8">
          <div className="mb-4 md:mb-6">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Đặt vé tàu</h1>
            <p className="text-sm md:text-base text-muted-foreground">Điền thông tin hành khách và chọn chỗ ngồi</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">Thông tin liên hệ</CardTitle>
                  <CardDescription className="text-sm">
                    Thông tin này sẽ được sử dụng để liên lạc về vé của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Nhập email của bạn"
                        className={`text-sm md:text-base ${
                          errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                        }`}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1 flex items-center">
                          <span className="mr-1">⚠️</span>
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm">
                        Số điện thoại
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Nhập số điện thoại"
                        className={`text-sm md:text-base ${
                          errors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-xs text-red-500 mt-1 flex items-center">
                          <span className="mr-1">⚠️</span>
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Outbound Trip */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">Chiều đi</CardTitle>
                  <CardDescription className="text-sm">
                    {trip?.trainNumber} - {origin} → {destination}
                    {trip && (
                      <>
                        <br />
                        <span>
                          <b>Giờ đi:</b> {formatDateTime(trip.departureTime)} | <b>Giờ đến:</b>{" "}
                          {formatDateTime(trip.arrivalTime)}
                        </span>
                      </>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {errors.general && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600 flex items-center">
                        <span className="mr-2">⚠️</span>
                        {errors.general}
                      </p>
                    </div>
                  )}
                  <div className="space-y-4 md:space-y-6">
                    {passengers.map((passenger, index) => (
                      <div key={index} className="space-y-3 md:space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-sm md:text-base">Hành khách {index + 1}</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`name-${index}`} className="text-sm">
                              Họ và tên
                            </Label>
                            <Input
                              id={`name-${index}`}
                              value={passenger.name}
                              onChange={(e) => handlePassengerInfoChange(index, "name", e.target.value)}
                              placeholder="Nhập họ và tên"
                              className={`text-sm md:text-base ${
                                errors[`outbound_name_${index}`]
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                  : ""
                              }`}
                            />
                            {errors[`outbound_name_${index}`] && (
                              <p className="text-xs text-red-500 mt-1 flex items-center">
                                <span className="mr-1">⚠️</span>
                                {errors[`outbound_name_${index}`]}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`idCard-${index}`} className="text-sm">
                              CMND/CCCD
                            </Label>
                            <Input
                              id={`idCard-${index}`}
                              value={passenger.idCard}
                              onChange={(e) => handlePassengerInfoChange(index, "idCard", e.target.value)}
                              placeholder="Nhập số CMND/CCCD"
                              className={`text-sm md:text-base ${
                                errors[`outbound_idCard_${index}`]
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                  : ""
                              }`}
                            />
                            {errors[`outbound_idCard_${index}`] && (
                              <p className="text-xs text-red-500 mt-1 flex items-center">
                                <span className="mr-1">⚠️</span>
                                {errors[`outbound_idCard_${index}`]}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm">Ghế đã chọn</Label>
                          {passenger.seatId ? (
                            <div className="flex items-center p-2 border rounded-md">
                              <div className="font-medium text-sm md:text-base">
                                Toa {trip?.carriages.find((c) => c.id === passenger.carriageId)?.number} - Ghế{" "}
                                {
                                  trip?.carriages
                                    .find((c) => c.id === passenger.carriageId)
                                    ?.seats.find((s) => s.id === passenger.seatId)?.number
                                }
                              </div>
                              <Badge className="ml-2 text-xs">{formatPrice(passenger.price || 0)}đ</Badge>
                            </div>
                          ) : (
                            <div
                              className={`text-xs md:text-sm p-2 border rounded-md border-dashed ${
                                errors[`outbound_seat_${index}`] ? "border-red-500 bg-red-50" : "text-muted-foreground"
                              }`}
                            >
                              Vui lòng chọn ghế bên dưới
                            </div>
                          )}
                          {errors[`outbound_seat_${index}`] && (
                            <p className="text-xs text-red-500 mt-1 flex items-center">
                              <span className="mr-1">⚠️</span>
                              {errors[`outbound_seat_${index}`]}
                            </p>
                          )}
                        </div>
                        <Separator />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Return Trip */}
              {returnTrip && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base md:text-lg">Chiều về</CardTitle>
                    <CardDescription className="text-sm">
                      {returnTrip.trainNumber} - {returnOrigin} → {returnDestination}
                      <br />
                      <span>
                        <b>Giờ đi:</b> {formatDateTime(returnTrip.departureTime)} | <b>Giờ đến:</b>{" "}
                        {formatDateTime(returnTrip.arrivalTime)}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 md:space-y-6">
                      {returnPassengers.map((passenger, index) => (
                        <div key={index} className="space-y-3 md:space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-sm md:text-base">Hành khách {index + 1}</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`return-name-${index}`} className="text-sm">
                                Họ và tên
                              </Label>
                              <Input
                                id={`return-name-${index}`}
                                value={passenger.name}
                                onChange={(e) => handlePassengerInfoChange(index, "name", e.target.value, true)}
                                placeholder="Nhập họ và tên"
                                className={`text-sm md:text-base ${
                                  errors[`return_name_${index}`]
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                    : ""
                                }`}
                              />
                              {errors[`return_name_${index}`] && (
                                <p className="text-xs text-red-500 mt-1 flex items-center">
                                  <span className="mr-1">⚠️</span>
                                  {errors[`return_name_${index}`]}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`return-idCard-${index}`} className="text-sm">
                                CMND/CCCD
                              </Label>
                              <Input
                                id={`return-idCard-${index}`}
                                value={passenger.idCard}
                                onChange={(e) => handlePassengerInfoChange(index, "idCard", e.target.value, true)}
                                placeholder="Nhập số CMND/CCCD"
                                className={`text-sm md:text-base ${
                                  errors[`return_idCard_${index}`]
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                    : ""
                                }`}
                              />
                              {errors[`return_idCard_${index}`] && (
                                <p className="text-xs text-red-500 mt-1 flex items-center">
                                  <span className="mr-1">⚠️</span>
                                  {errors[`return_idCard_${index}`]}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm">Ghế đã chọn</Label>
                            {passenger.seatId ? (
                              <div className="flex items-center p-2 border rounded-md">
                                <div className="font-medium text-sm md:text-base">
                                  Toa {returnTrip.carriages.find((c) => c.id === passenger.carriageId)?.number} - Ghế{" "}
                                  {
                                    returnTrip.carriages
                                      .find((c) => c.id === passenger.carriageId)
                                      ?.seats.find((s) => s.id === passenger.seatId)?.number
                                  }
                                </div>
                                <Badge className="ml-2 text-xs">{formatPrice(passenger.price || 0)}đ</Badge>
                              </div>
                            ) : (
                              <div
                                className={`text-xs md:text-sm p-2 border rounded-md border-dashed ${
                                  errors[`return_seat_${index}`] ? "border-red-500 bg-red-50" : "text-muted-foreground"
                                }`}
                              >
                                Vui lòng chọn ghế bên dưới
                              </div>
                            )}
                            {errors[`return_seat_${index}`] && (
                              <p className="text-xs text-red-500 mt-1 flex items-center">
                                <span className="mr-1">⚠️</span>
                                {errors[`return_seat_${index}`]}
                              </p>
                            )}
                          </div>
                          <Separator />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Seat Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">Chọn ghế</CardTitle>
                  <CardDescription className="text-sm">Chọn toa và ghế cho từng hành khách</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="outbound" className="w-full">
                    <TabsList className="w-full md:w-auto mb-4">
                      <TabsTrigger value="outbound" className="flex-1 md:flex-none">
                        Chiều đi
                      </TabsTrigger>
                      {returnTrip && (
                        <TabsTrigger value="return" className="flex-1 md:flex-none">
                          Chiều về
                        </TabsTrigger>
                      )}
                    </TabsList>
                    <TabsContent value="outbound">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="carriage" className="text-sm">
                            Chọn toa
                          </Label>
                          <Select
                            value={selectedCarriage?.toString() || ""}
                            onValueChange={(value) => setSelectedCarriage(Number.parseInt(value))}
                          >
                            <SelectTrigger id="carriage" className="text-sm md:text-base">
                              <SelectValue placeholder="Chọn toa" />
                            </SelectTrigger>
                            <SelectContent>
                              {trip?.carriages.map((carriage) => (
                                <SelectItem
                                  key={carriage.id}
                                  value={carriage.id.toString()}
                                  className="text-sm md:text-base"
                                > 
                                  Toa {carriage.number} - {getCarriageTypeLabel(carriage.type)} (
                                  {carriage.seats.filter((s) => s.available).length} ghế trống)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {selectedCarriage && (
                          <div className="mt-4">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-2">
                              <h4 className="font-medium text-sm md:text-base">Sơ đồ ghế</h4>
                              <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm">
                                <div className="flex items-center">
                                  <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-200 rounded mr-1"></div>
                                  <span>Đã đặt</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-3 h-3 md:w-4 md:h-4 bg-green-100 rounded mr-1"></div>
                                  <span>Còn trống</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-3 h-3 md:w-4 md:h-4 bg-green-600 rounded mr-1"></div>
                                  <span>Đã chọn</span>
                                </div>
                              </div>
                            </div>

                            <div className="border rounded-md p-3 md:p-4">
                              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-1 md:gap-2">
                                {trip?.carriages
                                  .find((c) => c.id === selectedCarriage)
                                  ?.seats.map((seat) => {
                                    const isSelected = passengers.some((p) => p.seatId === seat.id)
                                    const isAvailable = seat.available

                                    return (
                                      <div key={seat.id} className="text-center">
                                        <button
                                          className={`w-full p-1 md:p-2 rounded text-xs md:text-sm transition-colors ${
                                            !isAvailable
                                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                              : isSelected
                                                ? "bg-green-600 text-white"
                                                : "bg-green-100 hover:bg-green-200"
                                          }`}
                                          disabled={!isAvailable}
                                          onClick={() => {
                                            const passengerIndex = passengers.findIndex((p) => p.seatId === null)
                                            if (passengerIndex !== -1) {
                                              handleSeatSelect(passengerIndex, seat.id, selectedCarriage, seat.price)
                                            } else if (isSelected) {
                                              const selectedPassengerIndex = passengers.findIndex(
                                                (p) => p.seatId === seat.id,
                                              )
                                              if (selectedPassengerIndex !== -1) {
                                                const updatedPassengers = [...passengers]
                                                updatedPassengers[selectedPassengerIndex] = {
                                                  ...updatedPassengers[selectedPassengerIndex],
                                                  seatId: null,
                                                  carriageId: null,
                                                  price: null,
                                                }
                                                setPassengers(updatedPassengers)
                                              }
                                            } else {
                                              toast({
                                                title: "Tất cả hành khách đã có ghế",
                                                description: "Bạn đã chọn đủ ghế cho tất cả hành khách.",
                                                variant: "destructive",
                                              })
                                            }
                                          }}
                                        >
                                          {seat.number}
                                        </button>
                                        <div className="text-[10px] md:text-xs mt-1 text-gray-500">
                                          {getSeatTypeLabel(seat.type)}
                                        </div>
                                        <div className="text-[10px] md:text-xs text-green-600 font-medium">
                                          {formatPrice(seat.price)}đ
                                        </div>
                                      </div>
                                    )
                                  })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    {returnTrip && (
                      <TabsContent value="return">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="return-carriage" className="text-sm">
                              Chọn toa
                            </Label>
                            <Select
                              value={selectedReturnCarriage?.toString() || ""}
                              onValueChange={(value) => setSelectedReturnCarriage(Number.parseInt(value))}
                            >
                              <SelectTrigger id="return-carriage" className="text-sm md:text-base">
                                <SelectValue placeholder="Chọn toa" />
                              </SelectTrigger>
                              <SelectContent>
                                {returnTrip.carriages.map((carriage) => (
                                  <SelectItem
                                    key={carriage.id}
                                    value={carriage.id.toString()}
                                    className="text-sm md:text-base"
                                  >
                                    Toa {carriage.number} - {getCarriageTypeLabel(carriage.type)} (
                                    {carriage.seats.filter((s) => s.available).length} ghế trống)
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {selectedReturnCarriage && (
                            <div className="mt-4">
                              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-2">
                                <h4 className="font-medium text-sm md:text-base">Sơ đồ ghế</h4>
                                <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm">
                                  <div className="flex items-center">
                                    <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-200 rounded mr-1"></div>
                                    <span>Đã đặt</span>
                                  </div>
                                  <div className="flex items-center">
                                    <div className="w-3 h-3 md:w-4 md:h-4 bg-green-100 rounded mr-1"></div>
                                    <span>Còn trống</span>
                                  </div>
                                  <div className="flex items-center">
                                    <div className="w-3 h-3 md:w-4 md:h-4 bg-green-600 rounded mr-1"></div>
                                    <span>Đã chọn</span>
                                  </div>
                                </div>
                              </div>

                              <div className="border rounded-md p-3 md:p-4">
                                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-1 md:gap-2">
                                  {returnTrip.carriages
                                    .find((c) => c.id === selectedReturnCarriage)
                                    ?.seats.map((seat) => {
                                      const isSelected = returnPassengers.some((p) => p.seatId === seat.id)
                                      const isAvailable = seat.available

                                      return (
                                        <div key={seat.id} className="text-center">
                                          <button
                                            className={`w-full p-1 md:p-2 rounded text-xs md:text-sm transition-colors ${
                                              !isAvailable
                                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                : isSelected
                                                  ? "bg-green-600 text-white"
                                                  : "bg-green-100 hover:bg-green-200"
                                            }`}
                                            disabled={!isAvailable}
                                            onClick={() => {
                                              const passengerIndex = returnPassengers.findIndex(
                                                (p) => p.seatId === null,
                                              )
                                              if (passengerIndex !== -1) {
                                                handleSeatSelect(
                                                  passengerIndex,
                                                  seat.id,
                                                  selectedReturnCarriage,
                                                  seat.price,
                                                  true,
                                                )
                                              } else if (isSelected) {
                                                const selectedPassengerIndex = returnPassengers.findIndex(
                                                  (p) => p.seatId === seat.id,
                                                )
                                                if (selectedPassengerIndex !== -1) {
                                                  const updatedPassengers = [...returnPassengers]
                                                  updatedPassengers[selectedPassengerIndex] = {
                                                    ...updatedPassengers[selectedPassengerIndex],
                                                    seatId: null,
                                                    carriageId: null,
                                                    price: null,
                                                  }
                                                  setReturnPassengers(updatedPassengers)
                                                }
                                              } else {
                                                toast({
                                                  title: "Tất cả hành khách đã có ghế",
                                                  description: "Bạn đã chọn đủ ghế cho tất cả hành khách.",
                                                  variant: "destructive",
                                                })
                                              }
                                            }}
                                          >
                                            {seat.number}
                                          </button>
                                          <div className="text-[10px] md:text-xs mt-1 text-gray-500">
                                            {getSeatTypeLabel(seat.type)}
                                          </div>
                                          <div className="text-[10px] md:text-xs text-green-600 font-medium">
                                            {formatPrice(seat.price)}đ
                                          </div>
                                        </div>
                                      )
                                    })}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    )}
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">Tóm tắt đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm md:text-base mb-2">Chi tiết vé</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs md:text-sm font-medium">Chiều đi</p>
                        {passengers.map((passenger, index) => (
                          <div key={index} className="flex justify-between text-xs md:text-sm mt-1">
                            <span>Hành khách {index + 1}</span>
                            <span>{passenger.price ? formatPrice(passenger.price) + "đ" : "-"}</span>
                          </div>
                        ))}
                      </div>
                      {returnTrip && (
                        <div className="mt-4">
                          <p className="text-xs md:text-sm font-medium">Chiều về</p>
                          {returnPassengers.map((passenger, index) => (
                            <div key={index} className="flex justify-between text-xs md:text-sm mt-1">
                              <span>Hành khách {index + 1}</span>
                              <span>{passenger.price ? formatPrice(passenger.price) + "đ" : "-"}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="promoCode" className="text-sm">
                      Mã giảm giá
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                        id="promoCode"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Nhập mã giảm giá"
                        className="text-sm md:text-base"
                      />
                      <Button
                        variant="outline"
                        onClick={() => handleApplyPromo()}
                        className="text-sm md:text-base whitespace-nowrap"
                      >
                        Áp dụng
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label className="text-sm">Phương thức thanh toán</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={paymentMethod === "vnPay" ? "default" : "outline"}
                        className="w-full text-sm md:text-base"
                        onClick={() => setPaymentMethod("vnPay")}
                      >
                        <CreditCard className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                        VNPay
                      </Button>
                      <Button
                        variant={paymentMethod === "momo" ? "default" : "outline"}
                        className="w-full text-sm md:text-base"
                        onClick={() => setPaymentMethod("momo")}
                      >
                        <Wallet className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                        MoMo
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tổng tiền hàng</span>
                      <span>{formatPrice(getTotalPrice().subtotal)}đ</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Giảm giá ({discount * 100}%)</span>
                        <span>-{formatPrice(getTotalPrice().discountAmount)}đ</span>
                      </div>
                    )}
                    <div className="flex justify-between font-medium">
                      <span className="text-base">Thành tiền</span>
                      <span className="text-lg text-green-600">{formatPrice(getTotalPrice().total)}đ</span>
                    </div>
                    {submitError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-4">
                        <p className="text-sm font-medium text-red-600">{submitError.title}</p>
                        <p className="text-xs text-red-500 mt-1">{submitError.description}</p>
                      </div>
                    )}
                    <Button 
                      className="w-full text-sm md:text-base" 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Đang xử lý...
                        </>
                      ) : (
                        "Tiến hành thanh toán"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
