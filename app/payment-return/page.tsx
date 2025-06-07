"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"

export default function PaymentReturn() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const success = searchParams.get("success")
    const message = searchParams.get("message")

    if (success === "true") {
      toast({
        title: "Thanh toán thành công",
        description: "Cảm ơn bạn đã đặt vé. Chúng tôi sẽ gửi thông tin vé qua email của bạn.",
      })
    } else {
      toast({
        title: "Thanh toán thất bại",
        description: message || "Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.",
        variant: "destructive",
      })
    }
  }, [searchParams, toast])

  return (
    <div className="flex min-h-screen flex-col items-centercenter">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-4 md:py-6 lg:py-8">
          <div className="mx-auto max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-2xl">
                  {searchParams.get("success") === "true" ? (
                    <div className="flex items-center justify-center text-green-600">
                      <CheckCircle2 className="mr-2 h-6 w-6" />
                      Thanh toán thành công
                    </div>
                  ) : (
                    <div className="flex items-center justify-center text-red-600">
                      <XCircle className="mr-2 h-6 w-6" />
                      Thanh toán thất bại
                    </div>
                  )}
                </CardTitle>
                <CardDescription className="text-center">
                  {searchParams.get("success") === "true"
                    ? "Cảm ơn bạn đã đặt vé. Chúng tôi sẽ gửi thông tin vé qua email của bạn."
                    : searchParams.get("message") || "Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại."}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center space-x-4">
                <Link href="/">
                  <Button>Về trang chủ</Button>
                </Link>
                {searchParams.get("success") !== "true" && (
                  <Button variant="outline" onClick={() => router.back()}>
                    Thử lại
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 