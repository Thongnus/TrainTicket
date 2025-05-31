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
import { CreditCard, Wallet } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs"

interface Trip {
  id: number
  tripCode: string
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  duration: string
  trainType: string
  trainNumber: string
  carriages: Carriage[]
}

interface Carriage {
  id: number
  number: string
  type: string
  seats: Seat[]
}

interface Seat {
  id: number
  number: string
  type: string
  available: boolean
  price: number
}

interface Passenger {
  name: string
  idCard: string
  seatId: number | null
  carriageId: number | null
  price: number | null
}

export default function BookingPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const tripId = params.tripId as string
  const returnTripId = searchParams.get("returnTripId")
  const passengersCount = Number.parseInt(searchParams.get("passengers") || "1")

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
  const [errors, setErrors] = useState<Record<string, string>>({})

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

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockTrip: Trip = {
        id: Number.parseInt(tripId),
        tripCode: "SE9-20250520",
        origin: "Hà Nội",
        destination: "Sài Gòn",
        departureTime: "2025-05-20T07:00:00",
        arrivalTime: "2025-05-21T13:30:00",
        duration: "30h 30m",
        trainType: "express",
        trainNumber: "SE9",
        carriages: [
          {
            id: 1,
            number: "C1",
            type: "soft_seat",
            seats: Array(60)
              .fill(null)
              .map((_, i) => ({
                id: i + 1,
                number: `${i + 1}`,
                type: i % 3 === 0 ? "window" : i % 3 === 1 ? "aisle" : "middle",
                available: Math.random() > 0.3,
                price: 400000,
              })),
          },
          {
            id: 2,
            number: "C2",
            type: "soft_sleeper",
            seats: Array(40)
              .fill(null)
              .map((_, i) => ({
                id: i + 61,
                number: `B${i + 1}`,
                type: i % 3 === 0 ? "lower_berth" : i % 3 === 1 ? "middle_berth" : "upper_berth",
                available: Math.random() > 0.4,
                price: 600000,
              })),
          },
        ],
      }

      setTrip(mockTrip)
      if (mockTrip.carriages.length > 0) {
        setSelectedCarriage(mockTrip.carriages[0].id)
      }

      // Mock return trip data if returnTripId exists
      if (returnTripId) {
        const mockReturnTrip: Trip = {
          id: Number.parseInt(returnTripId),
          tripCode: "SE10-20250525",
          origin: "Sài Gòn",
          destination: "Hà Nội",
          departureTime: "2025-05-25T07:00:00",
          arrivalTime: "2025-05-26T13:30:00",
          duration: "30h 30m",
          trainType: "express",
          trainNumber: "SE10",
          carriages: [
            {
              id: 1,
              number: "C1",
              type: "soft_seat",
              seats: Array(60)
                .fill(null)
                .map((_, i) => ({
                  id: i + 1,
                  number: `${i + 1}`,
                  type: i % 3 === 0 ? "window" : i % 3 === 1 ? "aisle" : "middle",
                  available: Math.random() > 0.3,
                  price: 400000,
                })),
            },
            {
              id: 2,
              number: "C2",
              type: "soft_sleeper",
              seats: Array(40)
                .fill(null)
                .map((_, i) => ({
                  id: i + 61,
                  number: `B${i + 1}`,
                  type: i % 3 === 0 ? "lower_berth" : i % 3 === 1 ? "middle_berth" : "upper_berth",
                  available: Math.random() > 0.4,
                  price: 600000,
                })),
            },
          ],
        }

        setReturnTrip(mockReturnTrip)
        if (mockReturnTrip.carriages.length > 0) {
          setSelectedReturnCarriage(mockReturnTrip.carriages[0].id)
        }
      }

      setLoading(false)
    }, 1000)
  }, [tripId, returnTripId])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price)
  }

  const formatDateTime = (dateTimeStr: string) => {
    const dateTime = new Date(dateTimeStr)
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

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "WINTER25") {
      // Apply 25% discount
      setDiscount(0.25)
      toast({
        title: "Mã giảm giá đã được áp dụng",
        description: "Bạn được giảm 25% tổng giá trị đơn hàng.",
      })
    } else {
      setDiscount(0)
      toast({
        title: "Mã giảm giá không hợp lệ",
        description: "Vui lòng kiểm tra lại mã giảm giá.",
        variant: "destructive",
      })
    }
  }

  const getTotalPrice = () => {
    const outboundTotal = passengers.reduce((sum, passenger) => sum + (passenger.price || 0), 0)
    const returnTotal = returnPassengers.reduce((sum, passenger) => sum + (passenger.price || 0), 0)
    const subtotal = outboundTotal + returnTotal
    const discountAmount = subtotal * discount
    return subtotal - discountAmount
  }

  const isFormValid = () => {
    const outboundValid = passengers.every((p) => p.name.trim() !== "" && p.idCard.trim() !== "" && p.seatId !== null)
    const returnValid = returnTrip
      ? returnPassengers.every((p) => p.name.trim() !== "" && p.idCard.trim() !== "" && p.seatId !== null)
      : true
    return outboundValid && returnValid
  }

  const validatePassenger = (passenger: Passenger, index: number, isReturn = false) => {
    const errors: Record<string, string> = {}
    const prefix = isReturn ? `return_` : `outbound_`

    // Validate name
    if (!passenger.name.trim()) {
      errors[`${prefix}name_${index}`] = "Họ và tên là bắt buộc"
    } else if (passenger.name.trim().length < 2) {
      errors[`${prefix}name_${index}`] = "Họ và tên phải có ít nhất 2 ký tự"
    } else if (passenger.name.trim().length > 50) {
      errors[`${prefix}name_${index}`] = "Họ và tên không được quá 50 ký tự"
    } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(passenger.name.trim())) {
      errors[`${prefix}name_${index}`] = "Họ và tên chỉ được chứa chữ cái và khoảng trắng"
    }

    // Validate ID card
    if (!passenger.idCard.trim()) {
      errors[`${prefix}idCard_${index}`] = "Số CMND/CCCD là bắt buộc"
    } else if (passenger.idCard.trim().length < 9) {
      errors[`${prefix}idCard_${index}`] = "Số CMND/CCCD phải có ít nhất 9 số"
    } else if (passenger.idCard.trim().length > 12) {
      errors[`${prefix}idCard_${index}`] = "Số CMND/CCCD không được quá 12 số"
    } else if (!/^\d+$/.test(passenger.idCard.trim())) {
      errors[`${prefix}idCard_${index}`] = "Số CMND/CCCD chỉ được chứa số"
    }

    // Validate seat selection
    if (!passenger.seatId) {
      errors[`${prefix}seat_${index}`] = "Vui lòng chọn ghế cho hành khách này"
    }

    return errors
  }

  const handleSubmit = () => {
    setErrors({})
    let allErrors: Record<string, string> = {}
    let hasErrors = false

    // Validate outbound passengers
    passengers.forEach((passenger, index) => {
      const passengerErrors = validatePassenger(passenger, index, false)
      if (Object.keys(passengerErrors).length > 0) {
        hasErrors = true
        allErrors = { ...allErrors, ...passengerErrors }
      }
    })

    // Validate return passengers if exists
    if (returnTrip) {
      returnPassengers.forEach((passenger, index) => {
        const passengerErrors = validatePassenger(passenger, index, true)
        if (Object.keys(passengerErrors).length > 0) {
          hasErrors = true
          allErrors = { ...allErrors, ...passengerErrors }
        }
      })
    }

    // Check if all passengers have selected seats
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

      // Scroll to first error
      const firstErrorElement = document.querySelector(".border-red-500")
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" })
      }
      return
    }

    // If all validations pass, proceed with booking
    toast({
      title: "Đang xử lý đặt vé",
      description: "Vui lòng đợi trong giây lát...",
    })

    // Redirect to payment page after 2 seconds
    setTimeout(() => {
      router.push(`/payment?bookingId=BK${Date.now()}&amount=${getTotalPrice()}&method=${paymentMethod}`)
    }, 2000)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center">
        <header className="sticky top-0 z-50 w-full border-b bg-background">
         
            <MainNav />
    
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
    <div className="flex min-h-screen flex-col items-center">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
       
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <Link href="/login">
              <Button variant="outline">Đăng nhập</Button>
            </Link>
            <Link href="/register">
              <Button>Đăng ký</Button>
            </Link>
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
              {/* Outbound Trip */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">Chiều đi</CardTitle>
                  <CardDescription className="text-sm">
                    {trip?.trainNumber} - {trip?.origin} → {trip?.destination}
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
                              className={`text-sm md:text-base ${errors[`outbound_name_${index}`] ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                              aria-invalid={!!errors[`outbound_name_${index}`]}
                              aria-describedby={errors[`outbound_name_${index}`] ? `name-error-${index}` : undefined}
                            />
                            {errors[`outbound_name_${index}`] && (
                              <p id={`name-error-${index}`} className="text-xs text-red-500 mt-1 flex items-center">
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
                              className={`text-sm md:text-base ${errors[`outbound_idCard_${index}`] ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                              aria-invalid={!!errors[`outbound_idCard_${index}`]}
                              aria-describedby={
                                errors[`outbound_idCard_${index}`] ? `idCard-error-${index}` : undefined
                              }
                            />
                            {errors[`outbound_idCard_${index}`] && (
                              <p id={`idCard-error-${index}`} className="text-xs text-red-500 mt-1 flex items-center">
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
                              className={`text-xs md:text-sm p-2 border rounded-md border-dashed ${errors[`outbound_seat_${index}`] ? "border-red-500 bg-red-50" : "text-muted-foreground"}`}
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
                      {returnTrip.trainNumber} - {returnTrip.origin} → {returnTrip.destination}
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
                                className={`text-sm md:text-base ${errors[`return_name_${index}`] ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                                aria-invalid={!!errors[`return_name_${index}`]}
                                aria-describedby={errors[`return_name_${index}`] ? `name-error-${index}` : undefined}
                              />
                              {errors[`return_name_${index}`] && (
                                <p id={`name-error-${index}`} className="text-xs text-red-500 mt-1 flex items-center">
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
                                className={`text-sm md:text-base ${errors[`return_idCard_${index}`] ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                                aria-invalid={!!errors[`return_idCard_${index}`]}
                                aria-describedby={
                                  errors[`return_idCard_${index}`] ? `idCard-error-${index}` : undefined
                                }
                              />
                              {errors[`return_idCard_${index}`] && (
                                <p id={`idCard-error-${index}`} className="text-xs text-red-500 mt-1 flex items-center">
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
                                className={`text-xs md:text-sm p-2 border rounded-md border-dashed ${errors[`return_seat_${index}`] ? "border-red-500 bg-red-50" : "text-muted-foreground"}`}
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
                                  Toa {carriage.number} - {getCarriageTypeLabel(carriage.type)}
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

                                    return (
                                      <div key={seat.id} className="text-center">
                                        <button
                                          className={`w-full p-1 md:p-2 rounded text-xs md:text-sm ${
                                            !seat.available
                                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                              : isSelected
                                                ? "bg-green-600 text-white"
                                                : "bg-green-100 hover:bg-green-200"
                                          }`}
                                          disabled={!seat.available}
                                          onClick={() => {
                                            // Find first passenger without a seat
                                            const passengerIndex = passengers.findIndex((p) => p.seatId === null)
                                            if (passengerIndex !== -1) {
                                              handleSeatSelect(passengerIndex, seat.id, selectedCarriage, seat.price)
                                            } else if (isSelected) {
                                              // If already selected, find which passenger has this seat
                                              const selectedPassengerIndex = passengers.findIndex(
                                                (p) => p.seatId === seat.id,
                                              )
                                              if (selectedPassengerIndex !== -1) {
                                                // Deselect the seat
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
                                    Toa {carriage.number} - {getCarriageTypeLabel(carriage.type)}
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

                                      return (
                                        <div key={seat.id} className="text-center">
                                          <button
                                            className={`w-full p-1 md:p-2 rounded text-xs md:text-sm ${
                                              !seat.available
                                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                : isSelected
                                                  ? "bg-green-600 text-white"
                                                  : "bg-green-100 hover:bg-green-200"
                                            }`}
                                            disabled={!seat.available}
                                            onClick={() => {
                                              // Find first passenger without a seat
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
                                                // If already selected, find which passenger has this seat
                                                const selectedPassengerIndex = returnPassengers.findIndex(
                                                  (p) => p.seatId === seat.id,
                                                )
                                                if (selectedPassengerIndex !== -1) {
                                                  // Deselect the seat
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
                        onClick={handleApplyPromo}
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
                    <div className="flex justify-between">
                      <span className="text-sm md:text-base">Tổng tiền</span>
                      <span className="font-medium text-base md:text-lg">{formatPrice(getTotalPrice())}đ</span>
                    </div>
                    <Button className="w-full text-sm md:text-base" onClick={handleSubmit}>
                      Tiến hành thanh toán
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
