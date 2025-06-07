"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Train, AlertCircle, Loader2, CheckCircle, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ForgotPasswordPage() {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError("Vui lòng nhập email")
      return
    }

    if (!validateEmail(email)) {
      setError("Email không hợp lệ")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
      const response = await fetch(`${baseUrl}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok && data.status === 200) {
        setIsSuccess(true)
        toast({
          title: "Email đã được gửi",
          description: "Vui lòng kiểm tra hộp thư để đặt lại mật khẩu.",
        })
      } else {
        if (data.code === "USER_NOT_FOUND") {
          setError("Email này chưa được đăng ký")
        } else {
          setError(data.message || "Có lỗi xảy ra. Vui lòng thử lại")
        }
      }
    } catch (error) {
      console.error("Forgot password error:", error)
      setError("Có lỗi xảy ra. Vui lòng kiểm tra kết nối mạng và thử lại")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background">
          <div className="container flex h-16 items-center">
            <MainNav />
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center py-8 px-4">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <Train className="h-8 w-8 text-green-600" />
                <h1 className="text-2xl font-bold">VietRail</h1>
              </div>
            </div>

            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Email đã được gửi</CardTitle>
                <CardDescription>Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Vui lòng kiểm tra hộp thư (bao gồm cả thư mục spam) và làm theo hướng dẫn để đặt lại mật khẩu.
                  </AlertDescription>
                </Alert>
                <div className="text-center text-sm text-muted-foreground">
                  <p>Không nhận được email?</p>
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => {
                      setIsSuccess(false)
                      setEmail("")
                    }}
                  >
                    Gửi lại
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại đăng nhập
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Train className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold">VietRail</h1>
            </div>
            <p className="text-muted-foreground">Đặt lại mật khẩu</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quên mật khẩu?</CardTitle>
              <CardDescription>Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError("")
                    }}
                    className={error ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    "Gửi hướng dẫn đặt lại mật khẩu"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter>
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại đăng nhập
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
