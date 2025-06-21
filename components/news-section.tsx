"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarDays, ChevronLeft, ChevronRight, Newspaper, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import Image from "next/image"

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

const BaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

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
        const response = await fetch(`${BaseUrl}/new-feeds`)
        const data: ApiResponse = await response.json()
        if (data.status === 200) {
          setNews(data.data)
        } else {
          setError(data.message || "Failed to fetch news")
        }
      } catch (error) {
        console.error("Error fetching news:", error)
        setError("Không thể tải tin tức")
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
      const interval = setInterval(nextSlide, 5000)
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

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(" ").length
    const readTime = Math.ceil(wordCount / wordsPerMinute)
    return `${readTime} phút đọc`
  }

  const getCategoryFromTitle = (title: string) => {
    if (title.toLowerCase().includes("khuyến mãi") || title.toLowerCase().includes("giảm giá")) {
      return { name: "Khuyến mãi", color: "bg-red-100 text-red-700" }
    }
    if (title.toLowerCase().includes("tin tức") || title.toLowerCase().includes("thông báo")) {
      return { name: "Tin tức", color: "bg-blue-100 text-blue-700" }
    }
    if (title.toLowerCase().includes("hướng dẫn")) {
      return { name: "Hướng dẫn", color: "bg-green-100 text-green-700" }
    }
    return { name: "Tin tức", color: "bg-gray-100 text-gray-700" }
  }

  const renderSkeleton = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <Skeleton className="w-full h-48" />
          <CardHeader className="pb-3">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="pb-3">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )

  return (
    <section className="py-16 bg-gray-50 flex justify-center">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Newspaper className="h-6 w-6 text-green-600" />
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Tin tức & Khuyến mãi</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cập nhật những thông tin mới nhất về dịch vụ và các chương trình ưu đãi hấp dẫn
          </p>
        </div>

        <div className="relative">
          {isLoading ? (
            renderSkeleton()
          ) : error ? (
            <div className="text-center">
              <div className="text-red-500 mb-4">{error}</div>
              <Button onClick={() => window.location.reload()}>Thử lại</Button>
            </div>
          ) : news.length === 0 ? (
            <div className="text-center text-gray-500">Không có tin tức nào</div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {getVisibleNews().map((item, index) => {
                  const category = getCategoryFromTitle(item.title)
                  const isFeatured = index === 0

                  return (
                    <Card
                      key={item.id}
                      className={`group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden ${
                        isFeatured ? "md:col-span-2 md:row-span-1" : ""
                      } ${isTransitioning ? "opacity-50" : "opacity-100"}`}
                    >
                      {/* News Image */}
                      <div className={`relative overflow-hidden ${isFeatured ? "h-64" : "h-48"}`}>
                        <Image
                          src={item.image || "/placeholder.svg?height=200&width=300"}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                        {/* Category Badge */}
                        <div className="absolute top-3 left-3">
                          <Badge className={category.color}>{category.name}</Badge>
                        </div>

                        {/* Featured Badge */}
                        {isFeatured && (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-yellow-500 text-white">Nổi bật</Badge>
                          </div>
                        )}
                      </div>

                      <CardHeader className={isFeatured ? "pb-3" : "pb-2"}>
                        <CardTitle
                          className={`group-hover:text-green-600 transition-colors line-clamp-2 ${
                            isFeatured ? "text-xl" : "text-lg"
                          }`}
                        >
                          {item.title}
                        </CardTitle>
                        <CardDescription
                          className={`leading-relaxed line-clamp-3 ${isFeatured ? "text-base" : "text-sm"}`}
                        >
                          {item.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="pb-3">
                        {/* Meta Info */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                          <div className="flex items-center">
                            <CalendarDays className="h-3 w-3 mr-1" />
                            {formatDate(item.createdAt)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {getReadTime(item.content)}
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter>
                        <Link href={`/news/${item.id}`} className="w-full">
                          <Button
                            variant="ghost"
                            className="w-full justify-between p-0 h-auto text-green-600 hover:text-green-700"
                          >
                            Đọc thêm
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>

              {/* Navigation Controls */}
              {news.length > itemsPerPage && (
                <>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full bg-white/90 shadow-lg hover:bg-white hover:shadow-xl transition-all"
                      onClick={prevSlide}
                      disabled={isTransitioning}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full bg-white/90 shadow-lg hover:bg-white hover:shadow-xl transition-all"
                      onClick={nextSlide}
                      disabled={isTransitioning}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Pagination Dots */}
                  <div className="flex justify-center gap-2 mt-8">
                    {news.map((_, index) => (
                      <button
                        key={index}
                        className={`h-2 w-2 rounded-full transition-all duration-200 ${
                          index === currentIndex ? "bg-green-600 w-6" : "bg-gray-300 hover:bg-gray-400"
                        }`}
                        onClick={() => setCurrentIndex(index)}
                        disabled={isTransitioning}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* View All News */}
        <div className="text-center mt-12">
          <Link href="/news">
            <Button variant="outline" size="lg" className="px-8">
              Xem tất cả tin tức
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
