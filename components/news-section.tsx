import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays } from "lucide-react"
import Link from "next/link"

export function NewsSection() {
  const news = [
    {
      id: 1,
      title: "Khám phá tuyến đường mới từ Hải Phòng đến Đà Nẵng",
      description: "Tuyến đường mới từ Hải Phòng đến Đà Nẵng bắt đầu từ tháng 5 năm 2025!",
      date: "13/05/2025",
    },
    {
      id: 2,
      title: "Khuyến mãi mùa đông - Giảm 25% cho tất cả các chuyến",
      description: "Sử dụng mã WINTER25 để được giảm 25% cho chuyến đi tiếp theo của bạn.",
      date: "15/05/2025",
    },
    {
      id: 3,
      title: "Nâng cấp hệ thống đặt vé trực tuyến",
      description: "Hệ thống đặt vé trực tuyến đã được nâng cấp với nhiều tính năng mới.",
      date: "20/05/2025",
    },
  ]

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
        <div className="grid gap-6 pt-8 md:grid-cols-3">
          {news.map((item) => (
            <Card key={item.id}>
              <CardHeader className="p-4">
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription className="flex items-center pt-2">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {item.date}
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
      </div>
    </section>
  )
}
