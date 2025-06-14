"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Clock, CreditCard } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { UserNav } from "@/components/user-nav"

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  const bookingId = searchParams.get("bookingId")
  const amount = searchParams.get("amount") || "0"
  const paymentMethod = searchParams.get("method") || "vnPay"

  const [paymentStatus, setPaymentStatus] = useState<"processing" | "success" | "failed">("processing")
  const [countdown, setCountdown] = useState(180) // 3 minutes countdown

  useEffect(() => {
    // Simulate payment processing
    const timer = setTimeout(() => {
      setPaymentStatus("success")

      toast({
        title: "Thanh toán thành công",
        description: "Vé của bạn đã được đặt thành công.",
      })
    }, 5000)

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearTimeout(timer)
      clearInterval(countdownInterval)
    }
  }, [toast])

  useEffect(() => {
    if (countdown === 0 && paymentStatus === "processing") {
      setPaymentStatus("failed")

      toast({
        title: "Thanh toán thất bại",
        description: "Thời gian thanh toán đã hết. Vui lòng thử lại.",
        variant: "destructive",
      })
    }
  }, [countdown, paymentStatus, toast])

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("vi-VN").format(Number.parseInt(price))
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "vnPay":
        return "VNPay"
      case "credit_card":
        return "Thẻ tín dụng"
      case "bank_transfer":
        return "Chuyển khoản ngân hàng"
      case "e_wallet":
        return "Ví điện tử"
      case "cash":
        return "Tiền mặt"
      default:
        return method
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center">
      <main className="flex-1">
        <div className="container py-6 md:py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Thanh toán</h1>
            <p className="text-muted-foreground">Mã đặt vé: {bookingId}</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {paymentStatus === "processing" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Đang xử lý thanh toán</CardTitle>
                    <CardDescription>
                      Vui lòng không đóng trang này cho đến khi quá trình thanh toán hoàn tất
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
                        <p className="mt-4 text-lg font-medium">Đang xử lý thanh toán của bạn</p>
                        <p className="mt-2 text-muted-foreground">Vui lòng đợi trong giây lát...</p>
                        <div className="mt-4 flex items-center justify-center text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Thời gian còn lại: {formatTime(countdown)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 bg-gray-50 p-4 rounded-md dark:bg-gray-900">
                      <h3 className="font-medium">Lưu ý:</h3>
                      <ul className="text-sm space-y-1 list-disc pl-5">
                        <li>Không tắt trình duyệt hoặc đóng trang này</li>
                        <li>Kiểm tra tin nhắn hoặc email xác nhận từ ngân hàng</li>
                        <li>Nếu gặp vấn đề, vui lòng liên hệ hỗ trợ khách hàng</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}

              {paymentStatus === "success" && (
                <Card>
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <CheckCircle className="h-16 w-16 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl">Thanh toán thành công</CardTitle>
                    <CardDescription>Cảm ơn bạn đã đặt vé. Thông tin vé đã được gửi đến email của bạn.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Mã đặt vé</p>
                        <p className="font-medium">{bookingId}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Phương thức thanh toán</p>
                        <p className="font-medium">{getPaymentMethodLabel(paymentMethod)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Ngày thanh toán</p>
                        <p className="font-medium">{new Date().toLocaleDateString("vi-VN")}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Tổng tiền</p>
                        <p className="font-medium">{formatPrice(amount)}đ</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h3 className="font-medium">Thông tin quan trọng:</h3>
                      <ul className="text-sm space-y-1 list-disc pl-5">
                        <li>Vui lòng kiểm tra email để xem thông tin vé chi tiết</li>
                        <li>Xuất trình mã vé khi lên tàu</li>
                        <li>Đến ga trước giờ khởi hành ít nhất 30 phút</li>
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center space-x-4">
                    <Link href="/tickets">
                      <Button>Xem vé của tôi</Button>
                    </Link>
                    <Link href="/">
                      <Button variant="outline">Về trang chủ</Button>
                    </Link>
                  </CardFooter>
                </Card>
              )}

              {paymentStatus === "failed" && (
                <Card>
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4 text-red-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                    </div>
                    <CardTitle className="text-2xl">Thanh toán thất bại</CardTitle>
                    <CardDescription>Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 bg-red-50 p-4 rounded-md dark:bg-red-950">
                      <h3 className="font-medium">Lý do có thể:</h3>
                      <ul className="text-sm space-y-1 list-disc pl-5">
                        <li>Thời gian thanh toán đã hết</li>
                        <li>Thẻ không đủ số dư</li>
                        <li>Thông tin thẻ không chính xác</li>
                        <li>Lỗi kết nối với cổng thanh toán</li>
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center space-x-4">
                    <Button
                      onClick={() => {
                        setPaymentStatus("processing")
                        setCountdown(180)

                        // Simulate payment processing again
                        setTimeout(() => {
                          setPaymentStatus("success")

                          toast({
                            title: "Thanh toán thành công",
                            description: "Vé của bạn đã được đặt thành công.",
                          })
                        }, 5000)
                      }}
                    >
                      Thử lại
                    </Button>
                    <Link href="/">
                      <Button variant="outline">Về trang chủ</Button>
                    </Link>
                  </CardFooter>
                </Card>
              )}
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Chi tiết thanh toán</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tổng tiền vé</span>
                      <span>{formatPrice(amount)}đ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phí giao dịch</span>
                      <span>0đ</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Tổng cộng</span>
                      <span>{formatPrice(amount)}đ</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Phương thức thanh toán</h3>
                    <div className="flex items-center p-3 border rounded-md">
                      <CreditCard className="h-5 w-5 mr-2" />
                      <span>{getPaymentMethodLabel(paymentMethod)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Hỗ trợ khách hàng</h3>
                    <p className="text-sm">Nếu bạn gặp vấn đề trong quá trình thanh toán, vui lòng liên hệ:</p>
                    <div className="text-sm">
                      <p>Hotline: 1900 1234</p>
                      <p>Email: support@vietrail.vn</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
