"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, Calendar, Clock, Train, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import CompactSearchForm from "@/app/search/results/Compact-search-form"
import { CarriageType, getCarriageTypeLabel, toCarriageType } from "@/app/types/carriage"
import { Filter, FilterState } from "./filter"
import { UserNav } from "@/components/user-nav"
import { fetchWithAuth } from "@/lib/api"

// API Response Types
interface ApiTrip {
  tripId: number
  tripCode: string
  departureTime: string // "2025-05-20 07:00:00"
  arrivalTime: string // "2025-05-20 18:00:00"
  routeName: string
  trainNumber: string
  trainName: string
  trainType: string
  originStation: string
  destinationStation: string
  duration: string // "11:00:00"
  minPrice: number
  maxPrice: number

  amenities: string
  availableSeats: number
 
}

interface ApiResponse {
  data: {
    departureTrips: ApiTrip[]
    returnTrips: ApiTrip[]
  }
  status: number
  code: string
  message: string
  timestamp: number
}

// Internal Trip interface (adapted from API)
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
  trainName: string
  minPrice: number
  maxPrice: number
  carriageTypes: CarriageType[]
  availableSeats: number
}

type SearchParams = {
  origin: string | null
  destination: string | null
  date: string | null
  returnDate?: string | null
  isRoundTrip?: boolean
}

export function validateSearchParams(params: SearchParams) {
  const errors: Record<string, string> = {}
  if (!params.origin) errors.origin = "Vui lòng chọn ga đi"
  if (!params.destination) errors.destination = "Vui lòng chọn ga đến"
  if (params.origin && params.destination && params.origin === params.destination)
    errors.destination = "Ga đi và ga đến không được trùng nhau"
  if (!params.date) errors.date = "Vui lòng chọn ngày đi"
  else {
    const selectedDate = new Date(params.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (selectedDate < today) errors.date = "Ngày đi không được nhỏ hơn ngày hiện tại"
  }
  if (params.isRoundTrip) {
    if (!params.returnDate) errors.returnDate = "Vui lòng chọn ngày về"
    else {
      const departureDate = new Date(params.date!)
      const returnDateObj = new Date(params.returnDate)
      if (returnDateObj < departureDate) errors.returnDate = "Ngày về phải sau ngày đi"
    }
  }
  return errors
}

function validateSelectedTrips(isRoundTrip: boolean, outbound: any, ret: any) {
  const errors: Record<string, string> = {}
  if (!outbound) errors.outbound = "Vui lòng chọn chuyến đi"
  if (isRoundTrip && !ret) errors.return = "Vui lòng chọn chuyến về"
  return errors
}

// Helper function to convert API time string to ISO string
function convertApiTimeToISOString(timeString: string): string {
  // Convert "2025-05-20 07:00:00" to "2025-05-20T07:00:00"
  return new Date(timeString.replace(" ", "T")).toISOString()
}

// Helper function to convert API duration to readable format
function formatDuration(duration: string): string {
  // If duration is already in the format "Xh Ym", return it as is
  if (duration.includes('h')) {
    return duration;
  }
  
  // Otherwise, handle the "HH:mm" format
  const [hours, minutes] = duration.split(":");
  return `${hours}h ${minutes}m`;
}

// Helper function to convert API trip to internal Trip format
function convertApiTripToTrip(apiTrip: ApiTrip): Trip {
  // Split amenities string into array and convert each to CarriageType
  const carriageTypes = apiTrip.amenities
    .split(',')
    .map(type => type.trim())
    .map(toCarriageType)

  return {
    id: apiTrip.tripId,
    tripCode: apiTrip.tripCode,
    origin: apiTrip.originStation,
    destination: apiTrip.destinationStation,
    departureTime: convertApiTimeToISOString(apiTrip.departureTime),
    arrivalTime: convertApiTimeToISOString(apiTrip.arrivalTime),
    duration: formatDuration(apiTrip.duration),
    trainType: apiTrip.trainType,
    trainNumber: apiTrip.trainNumber,
    trainName: apiTrip.trainName,
    minPrice: apiTrip.minPrice,
    maxPrice: apiTrip.maxPrice,
    carriageTypes: carriageTypes,
    availableSeats: apiTrip.availableSeats,
  }
}

export default function SearchResults() {
  const searchParams = useSearchParams()
  const origin = searchParams.get("origin")
  const destination = searchParams.get("destination")
  const date = searchParams.get("date")
  const passengers = searchParams.get("passengers") || "1"
  const isRoundTrip = searchParams.get("roundTrip") === "true"
  const returnDate = searchParams.get("returnDate")

  const router = useRouter()
  const { toast } = useToast()
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
  const [trips, setTrips] = useState<Trip[]>([])
  const [returnTrips, setReturnTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOutboundTrip, setSelectedOutboundTrip] = useState<Trip | null>(null)
  const [selectedReturnTrip, setSelectedReturnTrip] = useState<Trip | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [validateErrorsSelectTrip ,setValidateErrorsSelecTrip] =useState<Record<string, string>>({})
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([])
  const [filteredReturnTrips, setFilteredReturnTrips] = useState<Trip[]>([])

  // Fetch trips from API
  useEffect(() => {
    const fetchTrips = async () => {
      // Validate search params first
      const errors = validateSearchParams({
        origin,
        destination,
        date,
        returnDate,
        isRoundTrip,
      })

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
     const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
        // Build API URL
        const apiUrl = new URL(`${baseUrl}/trips/search`)
        apiUrl.searchParams.append("departure", origin!)
        apiUrl.searchParams.append("destination", destination!)
        apiUrl.searchParams.append("departureDate", date!)
        apiUrl.searchParams.append("passengers", passengers)

        if (isRoundTrip && returnDate) {
          apiUrl.searchParams.append("returnDate", returnDate)
        }

        console.log("Fetching trips from:", apiUrl.toString())

        const response = await fetch(apiUrl.toString())
       
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const apiResponse: ApiResponse = await response.json()
        console.log("response:" ,apiResponse.data)
        if (apiResponse.status !== 200) {
          throw new Error(apiResponse.message || "API request failed")
        }

        // Convert API trips to internal format
        const departureTrips = Array.isArray(apiResponse.data.departureTrips)
          ? apiResponse.data.departureTrips.map(convertApiTripToTrip)
          : Array.isArray(apiResponse.data)
            ? apiResponse.data.map(convertApiTripToTrip)
            : []

        const returnTripsData = Array.isArray(apiResponse.data.returnTrips)
          ? apiResponse.data.returnTrips.map(convertApiTripToTrip)
          : []

        setTrips(departureTrips)
        setReturnTrips(returnTripsData)
      } catch (err) {
        console.error("Error fetching trips:", err)
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi tìm kiếm chuyến tàu")
        toast({
          title: "Lỗi tìm kiếm",
          description: "Không thể tải dữ liệu chuyến tàu. Vui lòng thử lại.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (origin && destination && date) {
      fetchTrips()
    } else {
      setLoading(false)
    }
  }, [origin, destination, date, passengers, isRoundTrip, returnDate, toast])

  // Add filter handling
  const handleFilterChange = (filters: FilterState) => {
    const filterTrips = (trips: Trip[]) => {
      return trips.filter(trip => {
        // Filter by carriage type
        if (filters.carriageTypes.length > 0) {
          const hasMatchingCarriageType = trip.carriageTypes.some(type =>
            filters.carriageTypes.includes(type)
          )
          if (!hasMatchingCarriageType) return false
        }

        // Filter by price
        if (trip.minPrice < filters.priceRange[0] || trip.maxPrice > filters.priceRange[1]) {
          return false
        }

        // Filter by departure time
        const departureHour = new Date(trip.departureTime).getHours()
        if (departureHour < filters.departureTimeRange[0] || departureHour > filters.departureTimeRange[1]) {
          return false
        }

        return true
      })
    }

    setFilteredTrips(filterTrips(trips))
    setFilteredReturnTrips(filterTrips(returnTrips))
  }

  // Update useEffect to set initial filtered trips
  useEffect(() => {
    if (trips.length > 0) {
      setFilteredTrips(trips)
    }
    if (returnTrips.length > 0) {
      setFilteredReturnTrips(returnTrips)
    }
  }, [trips, returnTrips])

  // Calculate min and max prices for filter
  const minPrice = Math.min(...trips.map(trip => trip.minPrice))
  const maxPrice = Math.max(...trips.map(trip => trip.maxPrice))

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price)
  }

  const formatDateTime = (dateTimeStr: string) => {
    const dateTime = new Date(dateTimeStr)
    return format(dateTime, "HH:mm - dd/MM/yyyy", { locale: vi })
  }

  const getTrainTypeLabel = (type: string) => {
    switch (type) {
      case "express":
        return "Tàu tốc hành"
      case "sleeper":
        return "Tàu giường nằm"
      case "local":
        return "Tàu địa phương"
      case "fast":
        return "Tàu nhanh"
      default:
        return type
    }
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

  const getStationName = (id: string | null) => {
    const stations: Record<string, string> = {
      "1": "Ga Hà Nội",
      "2": "Ga Phủ Lý",
      "3": "Ga Nam Định",
      "4": "Ga Ninh Bình",
      "5": "Ga Thanh Hóa",
      "6": "Ga Vinh",
      "7": "Ga Đông Hà",
      "8": "Ga Huế",
      "9": "Ga Đà Nẵng",
      "10": "Ga Quảng Ngãi",
      "11": "Ga Quy Nhon",
      "12": "Ga Tuy Hòa",
      "13": "Ga Nha Trang",
      "14": "Ga Phan Thiết",
      "15": "Ga Biên Hòa",
      "16": "Ga Sài Gòn",
      "17": "Ga Sài Gòn",
    }

    return id ? stations[id] || "Không xác định" : "Không xác định"
  }

  const handleSelectTrip = (trip: Trip, isReturn = false) => {
    if (isReturn) {
      setSelectedReturnTrip(trip)
    } else {
      setSelectedOutboundTrip(trip)
    }
  }

  const handleProceedToBooking = () => {
    const tripErrors = validateSelectedTrips(isRoundTrip, selectedOutboundTrip, selectedReturnTrip)
    setValidateErrorsSelecTrip(tripErrors)

    if (Object.keys(tripErrors).length > 0) {
      if (tripErrors.return) {
        toast({
          title: "Vui lòng chọn chuyến về",
          description: tripErrors.return,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Thông tin chưa hợp lệ",
          description: Object.values(tripErrors).join(" & "),
          variant: "destructive",
        })
      }
      return
    }

    if (!selectedOutboundTrip) return
    
    // Build URL with all necessary parameters
    const params = new URLSearchParams({
      passengers: passengers.toString(),
      origin: selectedOutboundTrip.origin || '',
      destination: selectedOutboundTrip.destination || '',
    })

    // Add return trip parameters if it's a round trip
    if (isRoundTrip && selectedReturnTrip) {
      params.append('returnTripId', selectedReturnTrip.id.toString())
      params.append('returnOrigin', selectedReturnTrip.origin || '')
      params.append('returnDestination', selectedReturnTrip.destination || '')
    }

    const bookingUrl = `/booking/${selectedOutboundTrip.id}?${params.toString()}`
    router.push(bookingUrl)
  }

  return (
    <div className="flex min-h-screen flex-col items-center">
      <main className="flex-1">
        <div className="container py-4 md:py-6 lg:py-8">
          <div className="mb-4 md:mb-6">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Kết quả tìm kiếm</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              {getStationName(origin)} → {getStationName(destination)} |{" "}
              {date ? format(new Date(date), "dd/MM/yyyy", { locale: vi }) : ""} | {passengers} hành khách
              {isRoundTrip && returnDate && ` | Ngày về: ${format(new Date(returnDate), "dd/MM/yyyy", { locale: vi })}`}
            </p>
          </div>

          {/* Compact Search Form */}
          <div className="mb-6">
            <CompactSearchForm
              initialOrigin={origin || undefined}
              initialDestination={destination || undefined}
              initialDate={date || undefined}
              initialReturnDate={returnDate || undefined}
              initialPassengers={passengers}
              initialRoundTrip={isRoundTrip}
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Đang tìm kiếm chuyến tàu phù hợp...</p>
              </div>
            </div>
          ) : error ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <p className="text-lg font-medium text-red-600">Có lỗi xảy ra</p>
                  <p className="mt-2 text-muted-foreground">{error}</p>
                  <Button className="mt-4" onClick={() => window.location.reload()}>
                    Thử lại
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : Object.keys(validationErrors).length > 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <div className="space-y-2">
                    {validationErrors.origin && (
                      <p className="text-lg font-medium text-red-600">{validationErrors.origin}</p>
                    )}
                    {validationErrors.destination && (
                      <p className="text-lg font-medium text-red-600">{validationErrors.destination}</p>
                    )}
                    {validationErrors.date && (
                      <p className="text-lg font-medium text-red-600">{validationErrors.date}</p>
                    )}
                    {validationErrors.returnDate && (
                      <p className="text-lg font-medium text-red-600">{validationErrors.returnDate}</p>
                    )}
                  
                  </div>
                  <div className="mt-6 space-x-3">
                    <Link href="/">
                      <Button>Về trang chủ</Button>
                    </Link>
                    <Button variant="outline" onClick={() => window.location.reload()}>
                      Thử lại
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : trips.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <p className="text-lg font-medium">Không tìm thấy chuyến tàu nào phù hợp</p>
                  <p className="mt-2 text-muted-foreground">Vui lòng thử lại với các tiêu chí tìm kiếm khác</p>
                  <Link href="/">
                    <Button className="mt-4">Tìm kiếm lại</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Filter Sidebar */}
              <div className="w-full lg:w-64 flex-shrink-0">
                <div className="sticky top-24">
                  <Filter
                    onFilterChange={handleFilterChange}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                  />
                </div>
              </div>

              {/* Results */}
              <div className="flex-1 min-h-[600px]">
                <Tabs defaultValue="outbound" className="w-full">
                  <TabsList className="w-full md:w-auto mb-4">
                    <TabsTrigger value="outbound" className="flex-1 md:flex-none">
                      Chiều đi ({filteredTrips.length})
                    </TabsTrigger>
                    {isRoundTrip && (
                      <TabsTrigger value="return" className="flex-1 md:flex-none">
                        Chiều về ({filteredReturnTrips.length})
                      </TabsTrigger>
                    )}
                  </TabsList>
                  <TabsContent value="outbound">
                    <div className="space-y-3 md:space-y-4">
                      {filteredTrips.length === 0 ? (
                        <Card className="min-h-[200px] flex items-center justify-center">
                          <CardContent className="py-8">
                            <div className="text-center">
                              <p className="text-muted-foreground">Không có chuyến tàu nào phù hợp với bộ lọc</p>
                              <p className="text-sm text-muted-foreground mt-2">Vui lòng thử lại với các tiêu chí khác</p>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        filteredTrips.map((trip) => (
                          <Card key={trip.id} className={selectedOutboundTrip?.id === trip.id ? "border-green-500" : ""}>
                            <CardHeader className="pb-2">
                              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                                <div className="flex items-center">
                                  <Train className="h-4 w-4 md:h-5 md:w-5 mr-2 text-green-600" />
                                  <CardTitle className="text-base md:text-lg">
                                    {trip.trainNumber} - {getTrainTypeLabel(trip.trainType)}
                                  </CardTitle>
                                </div>
                                <Badge variant="outline" className="w-fit">
                                  {trip.tripCode}
                                </Badge>
                              </div>
                              <CardDescription className="flex items-center mt-1 text-sm">
                                <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                                {date ? format(new Date(date), "dd/MM/yyyy", { locale: vi }) : ""}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                                <div className="space-y-1">
                                  <p className="text-xs md:text-sm text-muted-foreground">Ga đi</p>
                                  <p className="text-sm md:text-base font-medium">{trip.origin}</p>
                                  <p className="text-xs md:text-sm">{formatDateTime(trip.departureTime)}</p>
                                </div>
                                <div className="flex items-center justify-center">
                                  <div className="text-center">
                                    <div className="flex items-center">
                                      <div className="h-0.5 w-8 md:w-10 bg-gray-300"></div>
                                      <ArrowRight className="h-3 w-3 md:h-4 md:w-4 mx-1 text-gray-500" />
                                      <div className="h-0.5 w-8 md:w-10 bg-gray-300"></div>
                                    </div>
                                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {trip.duration}
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-xs md:text-sm text-muted-foreground">Ga đến</p>
                                  <p className="text-sm md:text-base font-medium">{trip.destination}</p>
                                  <p className="text-xs md:text-sm">{formatDateTime(trip.arrivalTime)}</p>
                                </div>
                              </div>

                              <Separator className="my-3 md:my-4" />

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                                <div>
                                  <p className="text-xs md:text-sm text-muted-foreground">Loại toa</p>
                                  <div className="flex flex-wrap gap-1 md:gap-2 mt-1">
                                    {trip.carriageTypes.map((type) => (
                                      <Badge key={type} variant="secondary" className="text-xs">
                                        {getCarriageTypeLabel(type)}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs md:text-sm text-muted-foreground">Chỗ trống</p>
                                  <p className="text-sm md:text-base font-medium mt-1">{trip.availableSeats} chỗ</p>
                                </div>
                                <div>
                                  <p className="text-xs md:text-sm text-muted-foreground">Giá vé</p>
                                  <p className="text-sm md:text-base font-medium text-green-600 mt-1">
                                    {formatPrice(trip.minPrice)}đ - {formatPrice(trip.maxPrice)}đ
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter>
                              <Button
                                className="w-full text-sm md:text-base"
                                variant={selectedOutboundTrip?.id === trip.id ? "default" : "outline"}
                                onClick={() => handleSelectTrip(trip)}
                              >
                                {selectedOutboundTrip?.id === trip.id ? "Đã chọn" : "Chọn chuyến này"}
                              </Button>
                            </CardFooter>
                          </Card>
                        ))
                      )}
                    </div>
                  </TabsContent>
                  {isRoundTrip && (
                    <TabsContent value="return">
                      <div className="space-y-3 md:space-y-4">
                        {filteredReturnTrips.length === 0 ? (
                          <Card>
                            <CardContent className="py-8">
                              <div className="text-center">
                                <p className="text-muted-foreground">Không có chuyến tàu nào phù hợp với bộ lọc</p>
                                <p className="text-sm text-muted-foreground mt-2">Vui lòng thử lại với các tiêu chí khác</p>
                              </div>
                            </CardContent>
                          </Card>
                        ) : (
                          filteredReturnTrips.map((trip) => (
                            <Card key={trip.id} className={selectedReturnTrip?.id === trip.id ? "border-green-500" : ""}>
                              <CardHeader className="pb-2">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                                  <div className="flex items-center">
                                    <Train className="h-4 w-4 md:h-5 md:w-5 mr-2 text-green-600" />
                                    <CardTitle className="text-base md:text-lg">
                                      {trip.trainNumber} - {getTrainTypeLabel(trip.trainType)}
                                    </CardTitle>
                                  </div>
                                  <Badge variant="outline" className="w-fit">
                                    {trip.tripCode}
                                  </Badge>
                                </div>
                                <CardDescription className="flex items-center mt-1 text-sm">
                                  <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                                  {returnDate ? format(new Date(returnDate), "dd/MM/yyyy", { locale: vi }) : ""}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                                  <div className="space-y-1">
                                    <p className="text-xs md:text-sm text-muted-foreground">Ga đi</p>
                                    <p className="text-sm md:text-base font-medium">{trip.origin}</p>
                                    <p className="text-xs md:text-sm">{formatDateTime(trip.departureTime)}</p>
                                  </div>
                                  <div className="flex items-center justify-center">
                                    <div className="text-center">
                                      <div className="flex items-center">
                                        <div className="h-0.5 w-8 md:w-10 bg-gray-300"></div>
                                        <ArrowRight className="h-3 w-3 md:h-4 md:w-4 mx-1 text-gray-500" />
                                        <div className="h-0.5 w-8 md:w-10 bg-gray-300"></div>
                                      </div>
                                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {trip.duration}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-xs md:text-sm text-muted-foreground">Ga đến</p>
                                    <p className="text-sm md:text-base font-medium">{trip.destination}</p>
                                    <p className="text-xs md:text-sm">{formatDateTime(trip.arrivalTime)}</p>
                                  </div>
                                </div>

                                <Separator className="my-3 md:my-4" />

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                                  <div>
                                    <p className="text-xs md:text-sm text-muted-foreground">Loại toa</p>
                                    <div className="flex flex-wrap gap-1 md:gap-2 mt-1">
                                      {trip.carriageTypes.map((type) => (
                                        <Badge key={type} variant="secondary" className="text-xs">
                                          {getCarriageTypeLabel(type)}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-xs md:text-sm text-muted-foreground">Chỗ trống</p>
                                    <p className="text-sm md:text-base font-medium mt-1">{trip.availableSeats} chỗ</p>
                                  </div>
                                  <div>
                                    <p className="text-xs md:text-sm text-muted-foreground">Giá vé</p>
                                    <p className="text-sm md:text-base font-medium text-green-600 mt-1">
                                      {formatPrice(trip.minPrice)}đ - {formatPrice(trip.maxPrice)}đ
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                              <CardFooter>
                                <Button
                                  className="w-full text-sm md:text-base"
                                  variant={selectedReturnTrip?.id === trip.id ? "default" : "outline"}
                                  onClick={() => handleSelectTrip(trip, true)}
                                >
                                  {selectedReturnTrip?.id === trip.id ? "Đã chọn" : "Chọn chuyến này"}
                                </Button>
                              </CardFooter>
                            </Card>
                          ))
                        )}
                      </div>
                    </TabsContent>
                  )}
                </Tabs>

                {/* Selected Trips Summary */}
                {(selectedOutboundTrip || selectedReturnTrip) && (
                  <Card className="sticky bottom-0 md:bottom-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <CardContent className="p-3 md:p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="space-y-1">
                          <h3 className="font-medium text-sm md:text-base">Chuyến đã chọn</h3>
                          <div className="text-xs md:text-sm text-muted-foreground">
                            {selectedOutboundTrip && (
                              <div>
                                Chiều đi: {selectedOutboundTrip.trainNumber} -{" "}
                                {formatDateTime(selectedOutboundTrip.departureTime)}
                              </div>
                            )}
                            {selectedReturnTrip && (
                              <div>
                                Chiều về: {selectedReturnTrip.trainNumber} -{" "}
                                {formatDateTime(selectedReturnTrip.departureTime)}
                              </div>
                            )}
                          </div>
                        </div>
                        <Button onClick={handleProceedToBooking} className="w-full md:w-auto text-sm md:text-base">
                          Tiếp tục đặt vé
                        </Button>
                      </div>
                      {(validateErrorsSelectTrip.outbound || validateErrorsSelectTrip.return) && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              {validateErrorsSelectTrip.outbound && (
                                <div className="flex items-center text-red-600 text-sm mb-2">
                                  <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                                  <span>{validateErrorsSelectTrip.outbound}</span>
                                </div>
                              )}
                              {validateErrorsSelectTrip.return && (
                                <div className="flex items-center text-red-600 text-sm">
                                  <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                                  <span>{validateErrorsSelectTrip.return}</span>
                                </div>
                              )}
                            </div>
                          
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}