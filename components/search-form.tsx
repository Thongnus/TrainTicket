"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"

export function SearchForm() {
  const router = useRouter()
  const [date, setDate] = useState<Date>()
  const [returnDate, setReturnDate] = useState<Date>()
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [passengers, setPassengers] = useState("1")
  const [isRoundTrip, setIsRoundTrip] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!origin) newErrors.origin = "Vui lòng chọn ga đi"
    if (!destination) newErrors.destination = "Vui lòng chọn ga đến"
    if (origin && destination && origin === destination) newErrors.destination = "Ga đi và ga đến không được trùng nhau"
    if (!date) newErrors.date = "Vui lòng chọn ngày đi"
    else {
      const selectedDate = new Date(date as any)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selectedDate < today) newErrors.date = "Ngày đi không được nhỏ hơn ngày hiện tại"
    }
    if (isRoundTrip) {
      if (!returnDate) newErrors.returnDate = "Vui lòng chọn ngày về"
      else {
        const departureDate = new Date(date as any)
        const returnDateObj = new Date(returnDate as any)
        if (returnDateObj < departureDate) newErrors.returnDate = "Ngày về phải sau ngày đi"
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    // Construct search params
    const searchParams = new URLSearchParams({
      origin,
      destination,
      date: date ? format(date, "yyyy-MM-dd") : "",
      passengers,
      roundTrip: isRoundTrip.toString(),
    })

    if (isRoundTrip && returnDate) {
      searchParams.append("returnDate", format(returnDate, "yyyy-MM-dd"))
    }

    // Redirect to search results
    router.push(`/search/results?${searchParams.toString()}`)
  }

  const stations = [
    { "id": "1", "name": "Ga Hà Nội" },
    { "id": "2", "name": "Ga Phủ Lý" },
    { "id": "3", "name": "Ga Nam Định" },
    { "id": "4", "name": "Ga Ninh Bình" },
    { "id": "5", "name": "Ga Thanh Hóa" },
    { "id": "6", "name": "Ga Vinh" },
    { "id": "7", "name": "Ga Đồng Hới" },
    { "id": "8", "name": "Ga Đông Hà" },
    { "id": "9", "name": "Ga Huế" },
    { "id": "10", "name": "Ga Đà Nẵng" },
    { "id": "11", "name": "Ga Tam Kỳ" },
    { "id": "12", "name": "Ga Quảng Ngãi" },
    { "id": "13", "name": "Ga Diêu Trì" },
    { "id": "14", "name": "Ga Nha Trang" },
    { "id": "15", "name": "Ga Tháp Chàm" },
    { "id": "16", "name": "Ga Biên Hòa" },
    { "id": "17", "name": "Ga Sài Gòn" },
    { "id": "18", "name": "Ga Hải Phòng" },
    { "id": "19", "name": "Ga Lào Cai" },
    { "id": "20", "name": "Ga Đà Lạt" }
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Tìm kiếm vé tàu</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin">Ga đi</Label>
              <Select value={origin} onValueChange={setOrigin}>
                <SelectTrigger id="origin" className={errors.origin ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}>
                  <SelectValue placeholder="Chọn ga đi" />
                </SelectTrigger>
                <SelectContent>
                  {stations.map((station) => (
                    <SelectItem key={station.id} value={station.id}>
                      {station.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.origin && <p className="text-xs text-red-500 mt-1">{errors.origin}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Ga đến</Label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger id="destination" className={errors.destination ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}>
                  <SelectValue placeholder="Chọn ga đến" />
                </SelectTrigger>
                <SelectContent>
                  {stations.map((station) => (
                    <SelectItem key={station.id} value={station.id}>
                      {station.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.destination && <p className="text-xs text-red-500 mt-1">{errors.destination}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Ngày đi</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground", errors.date && "border-red-500 focus:border-red-500 focus:ring-red-500")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày đi"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar 
                    mode="single" 
                    selected={date} 
                    onSelect={setDate} 
                    initialFocus 
                    locale={vi}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
              {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="passengers">Số hành khách</Label>
              <Select value={passengers} onValueChange={setPassengers}>
                <SelectTrigger id="passengers">
                  <SelectValue placeholder="Số hành khách" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} hành khách
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="roundTrip"
                checked={isRoundTrip}
                onCheckedChange={(checked) => setIsRoundTrip(checked as boolean)}
              />
              <Label htmlFor="roundTrip" className="text-sm font-normal">
                Đặt vé khứ hồi
              </Label>
            </div>

            {isRoundTrip && (
              <div className="space-y-2">
                <Label htmlFor="returnDate">Ngày về</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !returnDate && "text-muted-foreground", errors.returnDate && "border-red-500 focus:border-red-500 focus:ring-red-500")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {returnDate ? format(returnDate, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày về"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar 
                      mode="single" 
                      selected={returnDate} 
                      onSelect={setReturnDate} 
                      initialFocus 
                      locale={vi}
                      disabled={(date) => {
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        return date < today || (date && date < (date || today))
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {errors.returnDate && <p className="text-xs text-red-500 mt-1">{errors.returnDate}</p>}
              </div>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full">
          Tìm kiếm
        </Button>
      </CardFooter>
    </Card>
  )
}
