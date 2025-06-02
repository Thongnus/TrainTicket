"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"

interface NewsItem {
  id: number
  title: string
  description: string
  image: string
  createdAt: number[]
  updatedAt: number[]
  content: string
}

interface ApiResponse {
  data: NewsItem[]
  status: number
  code: string
  message: string
  timestamp: number
}

const BaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const itemsPerPage = 3

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch(`${BaseUrl}/api/new-feeds`)
        const data: ApiResponse = await response.json()
        if (data.status === 200) {
          setNews(data.data)
        } else {
          setError(data.message || 'Failed to fetch news')
        }
      } catch (error) {
        console.error('Error fetching news:', error)
        setError('Failed to fetch news')
      } finally {
        setIsLoading(false)
      }
    }

    fetchNews()
  }, [])

  const nextSlide = () => {
    if (isTransitioning || news.length === 0) return
    setIsTransitioning(true)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const prevSlide = () => {
    if (isTransitioning || news.length === 0) return
    setIsTransitioning(true)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + news.length) % news.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  useEffect(() => {
    if (news.length > 0) {
      const interval = setInterval(nextSlide, 3000)
      return () => clearInterval(interval)
    }
  }, [news])

  const getVisibleNews = () => {
    if (!news.length) return []
    const result = []
    for (let i = 0; i < itemsPerPage; i++) {
      const index = (currentIndex + i) % news.length
      result.push(news[index])
    }
    return result
  }

  const formatDate = (dateArray: number[]) => {
    const [year, month, day] = dateArray
    return `${day}/${month}/${year}`
  }

  const renderSkeleton = () => (
    <div className="grid gap-6 md:grid-cols-3">
      {[...Array(3)].map((_, index) => (
        <Card key={index}>
          <Skeleton className="w-full h-48 rounded-t-lg" />
          <CardHeader className="p-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3 mt-2" />
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Tin tức & Khuyến mãi</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Cập nhật thông tin mới nhất và ưu đãi đặc biệt
            </p>
          </div>
        </div>
        <div className="relative pt-8">
          {isLoading ? (
            renderSkeleton()
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : news.length === 0 ? (
            <div className="text-center text-gray-500">Không có tin tức nào</div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-3">
                {getVisibleNews().map((item) => (
                  <Card 
                    key={item.id} 
                    className={`transition-all duration-500 transform ${
                      isTransitioning ? 'opacity-50' : 'opacity-100'
                    }`}
                  >
                    <div className="relative w-full h-48">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription className="flex items-center pt-2">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {formatDate(item.createdAt)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Link href={`/news/${item.id}`} className="w-full">
                        <Button variant="outline" className="w-full">
                          Xem chi tiết
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <div className="absolute left-0 top-1/2 -translate-y-1/2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white/80 shadow-md hover:bg-white"
                  onClick={prevSlide}
                  disabled={isTransitioning}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="absolute right-0 top-1/2 -translate-y-1/2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white/80 shadow-md hover:bg-white"
                  onClick={nextSlide}
                  disabled={isTransitioning}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex justify-center gap-2 mt-4">
                {news.map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 w-2 rounded-full transition-all ${
                      index === currentIndex ? "bg-primary w-4" : "bg-gray-300"
                    }`}
                    onClick={() => setCurrentIndex(index)}
                    disabled={isTransitioning}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
