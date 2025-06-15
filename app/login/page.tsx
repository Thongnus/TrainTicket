"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Eye, EyeOff, Train, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"

interface LoginFormData {
  username: string
  password: string
}

interface LoginErrors {
  username?: string
  password?: string
  general?: string
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { setUser } = useAuth()
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  })
  const [errors, setErrors] = useState<LoginErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Debug log for returnUrl
  useEffect(() => {
    const returnUrl = searchParams.get("returnUrl")
    console.log("Return URL from params:", returnUrl)
  }, [searchParams])

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {}

    // Username validation
    if (!formData.username) {
      newErrors.username = "Vui lòng nhập tên đăng nhập"
    } else if (formData.username.length < 3) {
      newErrors.username = "Tên đăng nhập phải có ít nhất 3 ký tự"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu"
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store tokens in localStorage
        localStorage.setItem("token", data.token)
        localStorage.setItem("refreshToken", data.refreshToken)
        
        // Store user data in localStorage and update auth context
        const userData = {
          id: data.id,
          username: data.username,
          roles: data.roles.map((role: any) => role.authority)
        }
        localStorage.setItem("user", JSON.stringify(userData))
        setUser(userData)

        toast({
          title: "Đăng nhập thành công",
          description: `Chào mừng ${data.username}!`,
        })

        // Get returnUrl from search params or default to home page
        const returnUrl = searchParams.get("returnUrl")
        console.log("Return URL before redirect:", returnUrl)
        
        if (returnUrl) {
          const decodedUrl = decodeURIComponent(returnUrl)
          console.log("Decoded return URL:", decodedUrl)
          router.replace(decodedUrl)
        } else {
          router.replace("/")
        }
      } else {
        // Handle API errors
        if (data.code === "INVALID_CREDENTIALS") {
          setErrors({ general: "Tên đăng nhập hoặc mật khẩu không chính xác" })
        } else if (data.code === "USER_NOT_FOUND") {
          setErrors({ general: "Tài khoản không tồn tại" })
        } else if (data.code === "ACCOUNT_LOCKED") {
          setErrors({ general: "Tài khoản đã bị khóa. Vui lòng liên hệ hỗ trợ" })
        } else {
          setErrors({ general: data.message || "Đăng nhập thất bại. Vui lòng thử lại" })
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      setErrors({ general: "Có lỗi xảy ra. Vui lòng kiểm tra kết nối mạng và thử lại" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = () => {
    setFormData({
      username: "demo",
      password: "demo123",
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Train className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold">VietRail</h1>
            </div>
            <p className="text-muted-foreground">Đăng nhập vào tài khoản của bạn</p>
          </div>

          {/* Login Form */}
          <Card>
            <CardHeader>
              <CardTitle>Đăng nhập</CardTitle>
              <CardDescription>Nhập thông tin đăng nhập để tiếp tục</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* General Error */}
                {errors.general && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.general}</AlertDescription>
                  </Alert>
                )}

                {/* Username Field */}
                <div className="space-y-2">
                  <Label htmlFor="username">Tên đăng nhập</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Nhập tên đăng nhập"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className={errors.username ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-700 hover:underline">
                    Quên mật khẩu?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang đăng nhập...
                    </>
                  ) : (
                    "Đăng nhập"
                  )}
                </Button>
              </form>

              {/* Demo Login */}
              <div className="mt-4">
                <Separator className="my-4" />
                <Button variant="outline" className="w-full" onClick={handleDemoLogin} disabled={isLoading}>
                  Dùng tài khoản demo
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Separator />
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Chưa có tài khoản? </span>
                <Link href="/register" className="text-green-600 hover:text-green-700 hover:underline font-medium">
                  Đăng ký ngay
                </Link>
              </div>
            </CardFooter>
          </Card>

          {/* Additional Info */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Bằng việc đăng nhập, bạn đồng ý với</p>
            <div className="space-x-1">
              <Link href="/terms" className="hover:underline">
                Điều khoản sử dụng
              </Link>
              <span>và</span>
              <Link href="/privacy" className="hover:underline">
                Chính sách bảo mật
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
