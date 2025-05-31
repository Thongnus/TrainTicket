import Link from "next/link"
import { Train } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Train className="h-6 w-6 text-green-600" />
          <p className="text-center text-sm leading-loose md:text-left">
            &copy; 2025 VietRail. Bản quyền thuộc về Công ty Đường sắt Việt Nam.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/about" className="text-sm font-medium underline underline-offset-4">
            Về chúng tôi
          </Link>
          <Link href="/contact" className="text-sm font-medium underline underline-offset-4">
            Liên hệ
          </Link>
          <Link href="/terms" className="text-sm font-medium underline underline-offset-4">
            Điều khoản
          </Link>
          <Link href="/privacy" className="text-sm font-medium underline underline-offset-4">
            Chính sách
          </Link>
        </div>
      </div>
    </footer>
  )
}
