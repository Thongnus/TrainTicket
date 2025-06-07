"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { UserNav } from "@/components/user-nav"

export default function SearchPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [date, setDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [passengers, setPassengers] = useState("1")
  const [isRoundTrip, setIsRoundTrip] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validate origin station
    if (!origin) {
      newErrors.origin = "Vui lòng chọn ga đi"
    }

    // Validate destination station
    if (!destination) {
      newErrors.destination = "Vui lòng chọn ga đến"
    }

    // Validate same station
    if (origin && destination && origin === destination) {
      newErrors.destination = "Ga đi và ga đến không được trùng nhau"
    }

    // Validate departure date
    if (!date) {
      newErrors.date = "Vui lòng chọn ngày đi"
    } else {
      const selectedDate = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (selectedDate < today) {
        newErrors.date = "Ngày đi không được nhỏ hơn ngày hiện tại"
      }
    }

    // Validate return date for round trip
    if (isRoundTrip) {
      if (!returnDate) {
        newErrors.returnDate = "Vui lòng chọn ngày về"
      } else {
        const departureDate = new Date(date)
        const returnDateObj = new Date(returnDate)
        
        if (returnDateObj < departureDate) {
          newErrors.returnDate = "Ngày về phải sau ngày đi"
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast({
        title: "Thông tin chưa hợp lệ",
        description: "Vui lòng kiểm tra lại thông tin đã nhập",
        variant: "destructive",
      })
      return
    }

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

  const stations = [
    { id: "1", name: "Ga Hà Nội" },
    { id: "2", name: "Ga Phủ Lý" },
    { id: "3", name: "Ga Nam Định" },
    { id: "4", name: "Ga Ninh Bình" },
    { id: "5", name: "Ga Thanh Hóa" },
    { id: "6", name: "Ga Vinh" },
    { id: "10", name: "Ga Đà Nẵng" },
    { id: "14", name: "Ga Nha Trang" },
    { id: "17", name: "Ga Sài Gòn" },
  ]

  return (
    <div className="flex min-h-screen flex-col items-center">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6 md:py-8">
          <div className="mx-auto max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Tìm chuyến tàu</CardTitle>
                <CardDescription>Tìm và đặt vé tàu cho hành trình của bạn</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="origin">Ga đi</Label>
                      <Select 
                        value={origin} 
                        onValueChange={setOrigin}
                      >
                        <SelectTrigger 
                          id="origin"
                          className={errors.origin ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                        >
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
                      {errors.origin && (
                        <p className="text-xs text-red-500 mt-1 flex items-center">
                          <span className="mr-1">⚠️</span>
                          {errors.origin}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="destination">Ga đến</Label>
                      <Select 
                        value={destination} 
                        onValueChange={setDestination}
                      >
                        <SelectTrigger 
                          id="destination"
                          className={errors.destination ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                        >
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
                      {errors.destination && (
                        <p className="text-xs text-red-500 mt-1 flex items-center">
                          <span className="mr-1">⚠️</span>
                          {errors.destination}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Ngày đi</Label>
                      <Input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className={errors.date ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                      />
                      {errors.date && (
                        <p className="text-xs text-red-500 mt-1 flex items-center">
                          <span className="mr-1">⚠️</span>
                          {errors.date}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passengers">Số hành khách</Label>
                      <Select value={passengers} onValueChange={setPassengers}>
                        <SelectTrigger id="passengers">
                          <SelectValue placeholder="Chọn số hành khách" />
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
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="roundTrip"
                        checked={isRoundTrip}
                        onCheckedChange={(checked) => {
                          setIsRoundTrip(checked as boolean)
                          if (!checked) {
                            setReturnDate("")
                            setErrors(prev => ({ ...prev, returnDate: "" }))
                          }
                        }}
                      />
                      <Label htmlFor="roundTrip" className="text-sm font-normal">
                        Đặt vé khứ hồi
                      </Label>
                    </div>

                    {isRoundTrip && (
                      <div className="space-y-2">
                        <Label htmlFor="returnDate">Ngày về</Label>
                        <Input
                          id="returnDate"
                          type="date"
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          min={date || new Date().toISOString().split('T')[0]}
                          className={errors.returnDate ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                        />
                        {errors.returnDate && (
                          <p className="text-xs text-red-500 mt-1 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {errors.returnDate}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <Button type="submit" className="w-full">
                    Tìm chuyến tàu
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 