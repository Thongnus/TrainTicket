"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeftRight, Calendar, MapPin } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface Station {
  id: string
  name: string
  code: string
}

interface CompactSearchFormProps {
  initialOrigin?: string
  initialDestination?: string
  initialDate?: string
  initialReturnDate?: string
  initialPassengers?: string
  initialRoundTrip?: boolean
}

const stations: Station[] = [
  { id: "1", name: "Hà Nội", code: "HNO" },
  { id: "2", name: "Phủ Lý", code: "PLY" },
  { id: "3", name: "Nam Định", code: "NDI" },
  { id: "4", name: "Ninh Bình", code: "NBI" },
  { id: "5", name: "Thanh Hóa", code: "THO" },
  { id: "6", name: "Vinh", code: "VIN" },
  { id: "7", name: "Đông Hà", code: "DHA" },
  { id: "8", name: "Huế", code: "HUE" },
  { id: "9", name: "Đà Nẵng", code: "DNA" },
  { id: "10", name: "Quảng Ngãi", code: "QNG" },
  { id: "11", name: "Quy Nhon", code: "QNH" },
  { id: "12", name: "Tuy Hòa", code: "THA" },
  { id: "13", name: "Nha Trang", code: "NTR" },
  { id: "14", name: "Phan Thiết", code: "PTH" },
  { id: "15", name: "Biên Hòa", code: "BHO" },
  { id: "16", name: "Sài Gòn", code: "SGN" },
  { id: "17", name: "Sài Gòn", code: "SGN" },
]

function CompactSearchForm({
  initialOrigin,
  initialDestination,
  initialDate,
  initialReturnDate,
  initialPassengers = "1",
  initialRoundTrip = false,
}: CompactSearchFormProps) {
  const router = useRouter()
  const [origin, setOrigin] = useState(initialOrigin || "")
  const [destination, setDestination] = useState(initialDestination || "")
  const [date, setDate] = useState(initialDate || "")
  const [returnDate, setReturnDate] = useState(initialReturnDate || "")
  const [passengers, setPassengers] = useState(initialPassengers)
  const [isRoundTrip, setIsRoundTrip] = useState(initialRoundTrip)

  // Update form when initial props change
  useEffect(() => {
    if (initialOrigin) setOrigin(initialOrigin)
    if (initialDestination) setDestination(initialDestination)
    if (initialDate) setDate(initialDate)
    if (initialReturnDate) setReturnDate(initialReturnDate)
    if (initialPassengers) setPassengers(initialPassengers)
    setIsRoundTrip(initialRoundTrip)
  }, [initialOrigin, initialDestination, initialDate, initialReturnDate, initialPassengers, initialRoundTrip])

  // Set default date to today if not provided
  useEffect(() => {
    if (!date && !initialDate) {
      const today = new Date()
      setDate(format(today, "yyyy-MM-dd"))
    }
  }, [date, initialDate])

  const getStationDisplay = (stationId: string) => {
    const station = stations.find((s) => s.id === stationId)
    return station ? `${station.name} (${station.code})` : ""
  }

  const getDateDisplay = (dateStr: string) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    return format(date, "dd-MM-yyyy, EEEE", { locale: vi })
  }

  const handleSwapStations = () => {
    const temp = origin
    setOrigin(destination)
    setDestination(temp)
  }

  const handleSearch = () => {
    const searchParams = new URLSearchParams({
      origin,
      destination,
      date,
      passengers,
      roundTrip: isRoundTrip.toString(),
    })

    if (isRoundTrip && returnDate) {
      searchParams.append("returnDate", returnDate)
    }

    router.push(`/search/results?${searchParams.toString()}`)
  }

  const isFormValid = () => {
    return origin && destination && origin !== destination && date && (!isRoundTrip || returnDate)
  }

  return (
    <Card className="w-full bg-white shadow-sm border">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-3 items-end">
          {/* Origin and Destination */}
          <div className="flex flex-1 items-center gap-2">
            <div className="flex-1 space-y-1">
              <Label htmlFor="origin" className="text-xs text-gray-600">
                Ga đi
              </Label>
              <Select value={origin} onValueChange={setOrigin}>
                <SelectTrigger id="origin" className="h-12 border-gray-200">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <SelectValue placeholder="Chọn ga đi">{origin && getStationDisplay(origin)}</SelectValue>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {stations.map((station) => (
                    <SelectItem key={station.id} value={station.id}>
                      {station.name} ({station.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="mt-6 h-8 w-8 p-0 border-gray-200 hover:bg-gray-50"
              onClick={handleSwapStations}
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>

            <div className="flex-1 space-y-1">
              <Label htmlFor="destination" className="text-xs text-gray-600">
                Ga đến
              </Label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger id="destination" className="h-12 border-gray-200">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <SelectValue placeholder="Chọn ga đến">{destination && getStationDisplay(destination)}</SelectValue>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {stations.map((station) => (
                    <SelectItem key={station.id} value={station.id}>
                      {station.name} ({station.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Departure Date */}
          <div className="flex-1 space-y-1">
            <Label htmlFor="date" className="text-xs text-gray-600">
              Ngày đi
            </Label>
            <div className="relative">
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-12 border-gray-200 pl-10"
                min={format(new Date(), "yyyy-MM-dd")}
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Return Date */}
          <div className="flex-1 space-y-1">
            <Label htmlFor="returnDate" className="text-xs text-gray-600">
              Ngày về (Khứ hồi)
            </Label>
            <div className="relative">
              <Input
                id="returnDate"
                type="date"
                value={returnDate}
                onChange={(e) => {
                  setReturnDate(e.target.value)
                  setIsRoundTrip(!!e.target.value)
                }}
                className="h-12 border-gray-200 pl-10"
                min={date || format(new Date(), "yyyy-MM-dd")}
                placeholder="Chọn nếu muốn vé về"
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Passengers */}
          <div className="w-24 space-y-1">
            <Label htmlFor="passengers" className="text-xs text-gray-600">
              Hành khách
            </Label>
            <Select value={passengers} onValueChange={setPassengers}>
              <SelectTrigger id="passengers" className="h-12 border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} người
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            disabled={!isFormValid()}
            className="h-12 px-8 bg-orange-500 hover:bg-orange-600 text-white font-medium"
          >
            Tìm
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default CompactSearchForm
export { CompactSearchForm }
