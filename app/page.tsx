"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SearchForm } from "@/components/search-form"
import { PopularRoutes } from "@/components/popular-routes"
import { NewsSection } from "@/components/news-section"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { UserNav } from "@/components/user-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Train,
  Clock,
  Shield,
  CreditCard,
  Smartphone,
  Star,
  Users,
  MapPin,
  CheckCircle,
  ArrowRight,
  Play,
  Award,
  Headphones,
  Wifi,
  Coffee,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function Home() {
  const { toast } = useToast()
  return (
    <div className="flex min-h-screen flex-col">
  
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-600 via-blue-600 to-purple-700">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-xl animate-bounce" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-400/20 rounded-full blur-xl animate-ping" />

          <div className="relative z-10 container px-4 md:px-6">
            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
              {/* Left Column - Content */}
              <div className="flex flex-col justify-center space-y-6 text-white">
                {/* Trust Badge */}
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Đánh giá 4.8/5 từ 100,000+ khách hàng
                  </Badge>
                </div>

                {/* Main Heading */}
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                    Hành trình
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                      Tuyệt vời
                    </span>
                    bắt đầu từ đây
                  </h1>
                  <p className="max-w-[600px] text-lg md:text-xl text-white/90 leading-relaxed">
                    Khám phá Việt Nam qua hệ thống đường sắt hiện đại. Đặt vé tàu hỏa trực tuyến nhanh chóng, an toàn và
                    tiện lợi với hơn 200+ tuyến đường khắp cả nước.
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-6 py-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400">200+</div>
                    <div className="text-sm text-white/80">Tuyến đường</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">1M+</div>
                    <div className="text-sm text-white/80">Khách hàng</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">24/7</div>
                    <div className="text-sm text-white/80">Hỗ trợ</div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/search">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-white text-green-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                    >
                      <Train className="w-5 h-5 mr-2" />
                      Đặt vé ngay
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Xem video
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-white/80">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Bảo mật SSL</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Thanh toán an toàn</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>10,000+ vé/ngày</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Search Form */}
              <div className="flex justify-center lg:justify-end">
                <div className="w-full max-w-md">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
                    <div className="mb-6 text-center">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Tìm chuyến tàu</h3>
                      <p className="text-sm text-gray-600">Nhập thông tin để tìm vé phù hợp</p>
                    </div>
                    <SearchForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Tại sao chọn VietRail?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Trải nghiệm đặt vé hiện đại với những tính năng tiên tiến nhất
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                {
                  icon: <Smartphone className="h-8 w-8" />,
                  title: "Đặt vé trực tuyến",
                  description: "Đặt vé mọi lúc, mọi nơi qua website hoặc app",
                  color: "text-blue-600 bg-blue-100",
                },
                {
                  icon: <CreditCard className="h-8 w-8" />,
                  title: "Thanh toán đa dạng",
                  description: "Hỗ trợ thẻ, ví điện tử, chuyển khoản",
                  color: "text-green-600 bg-green-100",
                },
                {
                  icon: <Shield className="h-8 w-8" />,
                  title: "Bảo mật tuyệt đối",
                  description: "Mã hóa SSL, bảo vệ thông tin cá nhân",
                  color: "text-purple-600 bg-purple-100",
                },
                {
                  icon: <Clock className="h-8 w-8" />,
                  title: "Check-in nhanh",
                  description: "Quét QR code, không cần in vé giấy",
                  color: "text-orange-600 bg-orange-100",
                },
              ].map((feature, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${feature.color} mb-4 group-hover:scale-110 transition-transform`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Train Services */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Tiện ích trên tàu</h3>
                <p className="text-white/90">Hành trình thoải mái với đầy đủ tiện nghi hiện đại</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: <Wifi className="h-6 w-6" />, title: "WiFi miễn phí" },
                  { icon: <Coffee className="h-6 w-6" />, title: "Dịch vụ ăn uống" },
                  { icon: <Train className="h-6 w-6" />, title: "Toa VIP cao cấp" },
                  { icon: <Headphones className="h-6 w-6" />, title: "Hỗ trợ 24/7" },
                ].map((service, index) => (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-3">
                      {service.icon}
                    </div>
                    <h4 className="font-semibold text-sm">{service.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: <Train className="h-8 w-8 text-green-600" />, value: "200+", label: "Tuyến đường" },
                { icon: <Users className="h-8 w-8 text-blue-600" />, value: "1M+", label: "Khách hàng" },
                { icon: <MapPin className="h-8 w-8 text-purple-600" />, value: "63", label: "Tỉnh thành" },
                { icon: <Award className="h-8 w-8 text-yellow-600" />, value: "4.8/5", label: "Đánh giá" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-3">{stat.icon}</div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Routes */}
        <PopularRoutes />

        {/* News Section */}
        <NewsSection />

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 flex items-center justify-center">
          <div className="container px-4 md:px-6 text-center">
            <div className="max-w-3xl mx-auto text-white">
              <h2 className="text-3xl font-bold mb-4">Sẵn sàng cho chuyến đi tiếp theo?</h2>
              <p className="text-xl mb-8 text-white/90">Đặt vé ngay hôm nay và khám phá vẻ đẹp Việt Nam bằng tàu hỏa</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/search">
                  <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3">
                    Tìm chuyến tàu
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3">
                    Tạo tài khoản
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

     
    </div>
  )
}
