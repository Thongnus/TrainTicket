"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface News {
  newfeed_id: number
  title: string
  description: string
  content: string
  image: string
  created_at: string
  updated_at: string
}

// Temporary mock data - will be replaced with API data
const mockNews: News[] = [
  {
    newfeed_id: 1,
    title: "Khuyến mãi mùa hè - Giảm giá vé tàu",
    description: "Từ ngày 1/6 đến 31/8/2024, VietRail áp dụng chương trình khuyến mãi đặc biệt với mức giảm giá lên đến 30% cho tất cả các chuyến tàu.",
    content: "Từ ngày 1/6 đến 31/8/2024, VietRail áp dụng chương trình khuyến mãi đặc biệt với mức giảm giá lên đến 30% cho tất cả các chuyến tàu. Đây là cơ hội tuyệt vời để bạn và gia đình có những chuyến du lịch tiết kiệm trong mùa hè này.\n\nĐiều kiện áp dụng:\n- Áp dụng cho tất cả các chuyến tàu trong nước\n- Giảm giá 30% cho vé người lớn\n- Giảm giá 50% cho trẻ em dưới 12 tuổi\n- Không áp dụng cho các ngày lễ, Tết",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000",
    created_at: "2024-03-15T10:00:00",
    updated_at: "2024-03-15T10:00:00"
  },
  {
    newfeed_id: 2,
    title: "Thông báo lịch chạy tàu mới",
    description: "Kể từ ngày 1/4/2024, VietRail sẽ áp dụng lịch chạy tàu mới với nhiều chuyến tàu được bổ sung để phục vụ nhu cầu đi lại của hành khách.",
    content: "Kể từ ngày 1/4/2024, VietRail sẽ áp dụng lịch chạy tàu mới với nhiều chuyến tàu được bổ sung để phục vụ nhu cầu đi lại của hành khách trong dịp hè. Các chuyến tàu mới sẽ kết nối thêm nhiều điểm đến hấp dẫn.\n\nNhững thay đổi chính trong lịch chạy tàu mới:\n1. Tăng tần suất chạy tàu trên các tuyến phổ biến\n2. Thêm các chuyến tàu đêm để phục vụ nhu cầu đi lại\n3. Bổ sung các điểm dừng mới tại các khu du lịch\n4. Điều chỉnh giờ khởi hành để phù hợp với lịch trình của hành khách",
    image: "https://images.unsplash.com/photo-1513829596324-4bb2800c5efb?q=80&w=1000",
    created_at: "2024-03-14T15:30:00",
    updated_at: "2024-03-14T15:30:00"
  },
  {
    newfeed_id: 3,
    title: "VietRail ra mắt tàu cao tốc mới",
    description: "VietRail vừa chính thức ra mắt đội tàu cao tốc mới với công nghệ hiện đại, giúp rút ngắn thời gian di chuyển giữa các thành phố lớn.",
    content: "VietRail vừa chính thức ra mắt đội tàu cao tốc mới với công nghệ hiện đại, giúp rút ngắn thời gian di chuyển giữa các thành phố lớn. Tàu mới được trang bị đầy đủ tiện nghi và đảm bảo an toàn tuyệt đối cho hành khách.\n\nĐặc điểm nổi bật của tàu cao tốc mới:\n- Tốc độ tối đa: 200km/h\n- Giảm 50% thời gian di chuyển\n- Toa tàu rộng rãi, thoáng mát\n- Ghế ngồi có thể điều chỉnh\n- Wi-Fi miễn phí\n- Ổ cắm điện tại mỗi ghế",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000",
    created_at: "2024-03-13T09:15:00",
    updated_at: "2024-03-13T09:15:00"
  },
  {
    newfeed_id: 4,
    title: "Chương trình tích điểm đổi quà",
    description: "Từ tháng 4/2024, VietRail triển khai chương trình tích điểm đổi quà dành cho khách hàng thân thiết.",
    content: "Từ tháng 4/2024, VietRail triển khai chương trình tích điểm đổi quà dành cho khách hàng thân thiết. Mỗi chuyến đi sẽ được tích điểm tương ứng với giá trị vé, và bạn có thể đổi lấy nhiều phần quà hấp dẫn.\n\nCách thức tích điểm:\n- 1 điểm = 10.000đ giá trị vé\n- Tích lũy không giới hạn\n- Điểm có hiệu lực trong 12 tháng\n\nCác phần quà có thể đổi:\n1. Vé tàu miễn phí\n2. Nâng hạng vé\n3. Voucher giảm giá\n4. Quà tặng đặc biệt",
    image: "https://images.unsplash.com/photo-1513829596324-4bb2800c5efb?q=80&w=1000",
    created_at: "2024-03-12T14:20:00",
    updated_at: "2024-03-12T14:20:00"
  },
  {
    newfeed_id: 5,
    title: "Bảo trì hệ thống đặt vé trực tuyến",
    description: "VietRail sẽ tiến hành bảo trì hệ thống đặt vé trực tuyến từ 22:00 ngày 20/3 đến 06:00 ngày 21/3.",
    content: "VietRail sẽ tiến hành bảo trì hệ thống đặt vé trực tuyến từ 22:00 ngày 20/3 đến 06:00 ngày 21/3. Trong thời gian này, quý khách vẫn có thể đặt vé tại các ga tàu hoặc đại lý ủy quyền.\n\nThời gian bảo trì:\n- Bắt đầu: 22:00 ngày 20/3/2024\n- Kết thúc: 06:00 ngày 21/3/2024\n\nCác dịch vụ bị ảnh hưởng:\n1. Đặt vé trực tuyến\n2. Thanh toán online\n3. Tra cứu lịch tàu\n4. Quản lý đặt chỗ",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000",
    created_at: "2024-03-11T11:45:00",
    updated_at: "2024-03-11T11:45:00"
  },
  {
    newfeed_id: 6,
    title: "VietRail đạt chứng nhận ISO 9001:2015",
    description: "VietRail vinh dự được cấp chứng nhận ISO 9001:2015 về quản lý chất lượng dịch vụ.",
    content: "VietRail vinh dự được cấp chứng nhận ISO 9001:2015 về quản lý chất lượng dịch vụ. Đây là minh chứng cho cam kết của chúng tôi trong việc cung cấp dịch vụ vận tải đường sắt chất lượng cao.\n\nNhững cải tiến đạt được:\n1. Quy trình đặt vé tối ưu\n2. Dịch vụ khách hàng chuyên nghiệp\n3. Bảo trì tàu định kỳ\n4. Đào tạo nhân viên\n5. An toàn vận hành",
    image: "https://images.unsplash.com/photo-1513829596324-4bb2800c5efb?q=80&w=1000",
    created_at: "2024-03-10T16:30:00",
    updated_at: "2024-03-10T16:30:00"
  }
]

const categories = [
  { id: "promotion", label: "Khuyến mãi" },
  { id: "announcement", label: "Thông báo" },
  { id: "news", label: "Tin tức" },
]

export function NewsDetail() {
  const params = useParams()
  const [news, setNews] = useState<News | null>(null)

  useEffect(() => {
    // This will be replaced with API call
    const newsId = Number(params.id)
    const foundNews = mockNews.find(n => n.newfeed_id === newsId)
    setNews(foundNews || null)
  }, [params.id])

  if (!news) {
    return <div>Không tìm thấy tin tức</div>
  }

  return (
    <div className="space-y-6">
      <Link 
        href="/news"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lại danh sách tin tức
      </Link>

      <Card>
        {news.image && (
          <div className="aspect-video relative overflow-hidden rounded-t-lg">
            <img
              src={news.image}
              alt={news.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="secondary">
              {categories.find(c => news.title.toLowerCase().includes(c.id))?.label || "Tin tức"}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {format(new Date(news.created_at), "dd/MM/yyyy", { locale: vi })}
            </span>
          </div>
          <CardTitle className="text-2xl">{news.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none whitespace-pre-line">
            {news.content}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 