"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { fetchWithAuth } from "@/lib/api"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface UserData {
  userId: number
  username: string
  fullName: string
  email: string
  phone: string
  address: string
  idCard: string
  dateOfBirth: string
}

interface FormErrors {
  fullName?: string
  email?: string
  phone?: string
  address?: string
  idCard?: string
  dateOfBirth?: string
}

export function EditProfile() {
  const { toast } = useToast()
  const [formData, setFormData] = useState<UserData>({
    userId: 0,
    username: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    idCard: "",
    dateOfBirth: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchWithAuth("/users/me")
        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }

        const data = await response.json()
        setFormData({
          userId: data.userId,
          username: data.username,
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          idCard: data.idCard || "",
          dateOfBirth: data.dateOfBirth || "",
        })
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin người dùng. Vui lòng thử lại.",
          variant: "destructive",
        })
      } finally {
        setIsInitialLoading(false)
      }
    }

    fetchUserData()
  }, [toast])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ và tên"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại"
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại phải có 10 chữ số"
    }

    if (!formData.idCard.trim()) {
      newErrors.idCard = "Vui lòng nhập CMND/CCCD"
    } else if (!/^[0-9]{9,12}$/.test(formData.idCard)) {
      newErrors.idCard = "CMND/CCCD phải có 9-12 chữ số"
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Vui lòng chọn ngày sinh"
    }

    if (!formData.address.trim()) {
      newErrors.address = "Vui lòng nhập địa chỉ"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setShowConfirmDialog(true)
  }

  const handleConfirmUpdate = async () => {
    setIsLoading(true)
    setShowConfirmDialog(false)

    try {
      const response = await fetchWithAuth("/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.code === "USER_NOT_FOUND") {
          toast({
            title: "Lỗi",
            description: "Không tìm thấy thông tin người dùng. Vui lòng thử lại sau.",
            variant: "destructive",
          })
        } else if (data.code === "USER_ALREADY") {
          toast({
            title: "Lỗi",
            description: "Tên đăng nhập đã tồn tại. Vui lòng thử lại.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Lỗi",
            description: data.message || "Không thể cập nhật thông tin. Vui lòng thử lại.",
            variant: "destructive",
          })
        }
        return
      }

      toast({
        title: "Thành công",
        description: "Thông tin cá nhân đã được cập nhật.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật thông tin. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Tên đăng nhập</Label>
          <Input
            id="username"
            value={formData.username}
            disabled
            className="bg-muted"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullName">Họ và tên</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="Nhập họ và tên"
            className={errors.fullName ? "border-red-500" : ""}
          />
          {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Nhập email"
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Số điện thoại</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Nhập số điện thoại"
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="idCard">CMND/CCCD</Label>
          <Input
            id="idCard"
            value={formData.idCard}
            onChange={(e) => setFormData({ ...formData, idCard: e.target.value })}
            placeholder="Nhập số CMND/CCCD"
            className={errors.idCard ? "border-red-500" : ""}
          />
          {errors.idCard && <p className="text-sm text-red-500">{errors.idCard}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Ngày sinh</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            className={errors.dateOfBirth ? "border-red-500" : ""}
          />
          {errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Địa chỉ</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Nhập địa chỉ"
            className={errors.address ? "border-red-500" : ""}
          />
          {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Đang cập nhật..." : "Cập nhật thông tin"}
        </Button>
      </form>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận cập nhật</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn cập nhật thông tin cá nhân? Thông tin sau khi cập nhật sẽ không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmUpdate}>Xác nhận</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 