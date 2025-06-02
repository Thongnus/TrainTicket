"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Eye, EyeOff, Train, AlertCircle, Loader2, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface RegisterFormData {
  fullName: string
  username: string
  email: string
  phoneNumber: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
  roles: string[]
}

interface RegisterErrors {
  fullName?: string
  username?: string
  email?: string
  phoneNumber?: string
  password?: string
  confirmPassword?: string
  agreeToTerms?: string
  general?: string
  roles?: string
}

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    roles: [],
  })
  const [errors, setErrors] = useState<RegisterErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: RegisterErrors = {}

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ và tên"
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Họ và tên phải có ít nhất 2 ký tự"
    } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(formData.fullName.trim())) {
      newErrors.fullName = "Họ và tên chỉ được chứa chữ cái và khoảng trắng"
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Vui lòng nhập tên đăng nhập"
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Tên đăng nhập phải có ít nhất 3 ký tự"
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username.trim())) {
      newErrors.username = "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới"
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Vui lòng nhập email"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ"
    }

    // Phone number validation
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Vui lòng nhập số điện thoại"
    } else if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại không hợp lệ"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu"
    } else if (formData.password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số"
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp"
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "Vui lòng đồng ý với điều khoản sử dụng"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof RegisterFormData, value: string | boolean) => {
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
      const response = await fetch(`${baseUrl}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          username: formData.username.trim(),
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
        }),
      })

      let data
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        const text = await response.text()
        if (response.ok && text === "User registered successfully!") {
          setShowSuccessModal(true)
          return
        }
        // Check for SQL duplicate entry error
        if (text.includes("Duplicate entry") && text.includes("users.email")) {
          setErrors({ email: "Email này đã được sử dụng" })
          return
        }
        if (text.includes("Duplicate entry") && text.includes("users.username")) {
          setErrors({ username: "Tên đăng nhập này đã được sử dụng" })
          return
        }
        if (text.includes("Duplicate entry") && text.includes("users.phone")) {
          setErrors({ phoneNumber: "Số điện thoại này đã được sử dụng" })
          return
        }
        setErrors({ general: "Đăng ký thất bại. Vui lòng thử lại sau." })
        return
      }

      if (response.ok && data.status === 201) {
        setShowSuccessModal(true)
      } else {
        // Handle API errors
        if (data.code === "USERNAME_ALREADY_EXISTS") {
          setErrors({ username: "Tên đăng nhập này đã được sử dụng" })
        } else if (data.code === "EMAIL_ALREADY_EXISTS") {
          setErrors({ email: "Email này đã được sử dụng" })
        } else if (data.code === "PHONE_ALREADY_EXISTS") {
          setErrors({ phoneNumber: "Số điện thoại này đã được sử dụng" })
        } else if (data.code === "VALIDATION_ERROR" && data.details) {
          // Handle field-specific validation errors from API
          const apiErrors: RegisterErrors = {}
          data.details.forEach((error: any) => {
            if (error.field === "username") apiErrors.username = error.message
            if (error.field === "email") apiErrors.email = error.message
            if (error.field === "phoneNumber") apiErrors.phoneNumber = error.message
            if (error.field === "password") apiErrors.password = error.message
          })
          setErrors(apiErrors)
        } else {
          setErrors({ general: "Đăng ký thất bại. Vui lòng thử lại sau." })
        }
      }
    } catch (error) {
      console.error("Registration error:", error)
      const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra. Vui lòng kiểm tra kết nối mạng và thử lại"
      
      // Check for SQL duplicate entry error in the error message
      if (errorMessage.includes("Duplicate entry") && errorMessage.includes("users.email")) {
        setErrors({ email: "Email này đã được sử dụng" })
      } else if (errorMessage.includes("Duplicate entry") && errorMessage.includes("users.username")) {
        setErrors({ username: "Tên đăng nhập này đã được sử dụng" })
      } else if (errorMessage.includes("Duplicate entry") && errorMessage.includes("users.phone")) {
        setErrors({ phoneNumber: "Số điện thoại này đã được sử dụng" })
      } else {
        setErrors({ general: "Đăng ký thất bại. Vui lòng thử lại sau." })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z\d]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Train className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold">VietRail</h1>
            </div>
            <p className="text-muted-foreground">Tạo tài khoản mới</p>
          </div>

          {/* Registration Form */}
          <Card>
            <CardHeader>
              <CardTitle>Đăng ký</CardTitle>
              <CardDescription>Điền thông tin để tạo tài khoản mới</CardDescription>
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

                {/* Full Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ và tên</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className={errors.fullName ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
                </div>

                {/* Username Field */}
                <div className="space-y-2">
                  <Label htmlFor="username">Tên đăng nhập</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="username123"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className={errors.username ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                {/* Phone Number Field */}
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Số điện thoại</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="0987654321"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    className={errors.phoneNumber ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
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

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="space-y-1">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded ${
                              passwordStrength >= level
                                ? passwordStrength <= 2
                                  ? "bg-red-500"
                                  : passwordStrength <= 3
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Mật khẩu {passwordStrength <= 2 ? "yếu" : passwordStrength <= 3 ? "trung bình" : "mạnh"}
                      </p>
                    </div>
                  )}

                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Nhập lại mật khẩu"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <div className="flex items-center text-green-600 text-sm">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Mật khẩu khớp
                    </div>
                  )}
                  {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                </div>

                {/* Terms Agreement */}
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                      disabled={isLoading}
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm leading-5">
                      Tôi đồng ý với{" "}
                      <Link href="/terms" className="text-green-600 hover:underline">
                        Điều khoản sử dụng
                      </Link>{" "}
                      và{" "}
                      <Link href="/privacy" className="text-green-600 hover:underline">
                        Chính sách bảo mật
                      </Link>
                    </Label>
                  </div>
                  {errors.agreeToTerms && <p className="text-sm text-red-500">{errors.agreeToTerms}</p>}
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang tạo tài khoản...
                    </>
                  ) : (
                    "Tạo tài khoản"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Separator />
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Đã có tài khoản? </span>
                <Link href="/login" className="text-green-600 hover:text-green-700 hover:underline font-medium">
                  Đăng nhập ngay
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>

      <Footer />

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-green-600">
              🎉 Đăng ký thành công!
            </DialogTitle>
            <DialogDescription className="text-center space-y-4">
              <p className="text-lg">Tài khoản của bạn đã được tạo thành công.</p>
              <p>Vui lòng đăng nhập để tiếp tục sử dụng dịch vụ.</p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => router.push("/login")}
              className="bg-green-600 hover:bg-green-700"
            >
              Đăng nhập ngay
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
