"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { fetchWithAuth } from "@/lib/api"

interface UserProfileProps {
  user: {
    id: number
    username: string
    roles: string[]
  }
}

interface UserData {
  userId: number
  username: string
  fullName: string | null
  email: string | null
  phone: string | null
  address: string | null
  idCard: string | null
  dateOfBirth: string | null
  roles: Array<{
    id: number
    name: string
  }>
}

export function UserProfile({ user }: UserProfileProps) {
  const { toast } = useToast()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchWithAuth("/users/me")
        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }

        const data = await response.json()
        setUserData(data)
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin người dùng. Vui lòng thử lại.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [toast])

  const getRoleName = (roleName: string) => {
    switch (roleName) {
      case "ROLE_USER":
        return "Người dùng"
      case "ROLE_STAFF":
        return "Nhân viên"
      case "ROLE_ADMIN":
        return "Quản trị viên"
      default:
        return roleName
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Không thể tải thông tin người dùng</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src="/images/avatar.png" alt={userData.username} />
          <AvatarFallback>{userData.username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold">{userData.fullName || userData.username}</h2>
          <div className="flex items-center space-x-2 mt-1">
            {userData.roles.map((role) => (
              <Badge key={role.id} variant="secondary">
                {getRoleName(role.name)}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <Separator />

      <div className="grid gap-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Thông tin cá nhân</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Tên đăng nhập</p>
              <p className="font-medium">{userData.username}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Họ và tên</p>
              <p className="font-medium">{userData.fullName || "Chưa cập nhật"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{userData.email || "Chưa cập nhật"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Số điện thoại</p>
              <p className="font-medium">{userData.phone || "Chưa cập nhật"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CMND/CCCD</p>
              <p className="font-medium">{userData.idCard || "Chưa cập nhật"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ngày sinh</p>
              <p className="font-medium">{userData.dateOfBirth || "Chưa cập nhật"}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Địa chỉ</p>
              <p className="font-medium">{userData.address || "Chưa cập nhật"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 