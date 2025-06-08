"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, MapPin } from "lucide-react"

type PopularRoute = {
  tripId: number
  departure: string
  arrival: string
  duration: string
  trainNumber: string
  averagePrice: number
  originStationId: number
  destinationStationId: number
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
export function PopularRoutes() {
  const [popularRoutes, setPopularRoutes] = useState<PopularRoute[]>([])

  useEffect(() => {
    fetch(`${baseUrl}/trips/popular`)
      .then((res) => res.json())
      .then((data) => {
        setPopularRoutes(data)
        console.log("popularRoutes", data)
      }) 
      .catch((error) => {
        console.error("Failed to fetch popular routes:", error)
      })
  }, [])

  const getSearchUrl = (route: PopularRoute) => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dateStr = tomorrow.toISOString().split('T')[0]
    
    return `/search/results?origin=${route.originStationId}&destination=${route.destinationStationId}&date=${dateStr}&passengers=1`
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Tuyến đường phổ biến</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Khám phá các tuyến đường phổ biến nhất với giá vé hấp dẫn
            </p>
          </div>
        </div>
        <div className="grid gap-6 pt-8 md:grid-cols-2 lg:grid-cols-4">
          {popularRoutes.map((route) => (
            <Card key={route.tripId} className="overflow-hidden">
              <CardHeader className="p-4">
                <CardTitle className="text-lg">
                  {route.departure} - {route.arrival}
                </CardTitle>
                <CardDescription>Tuyến đường phổ biến</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>
                    {route.departure} → {route.arrival}
                  </span>
                </div>
                <div className="mt-2 flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{route.duration}</span>
                </div>
                <div className="mt-4">
                  <p className="font-medium">
                    Giá trung bình: <span className="text-green-600">{route.averagePrice.toLocaleString("vi-VN")}đ</span>
                  </p>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Link
                  href={getSearchUrl(route)}
                  className="w-full"
                >
                  <Button className="w-full" variant="outline">
                    Xem lịch trình
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
