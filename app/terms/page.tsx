import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  FileText,
  RefreshCw,
  Shield,
  CreditCard,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  ArrowLeft,
  Home,
} from "lucide-react"
import Link from "next/link"
import { MainNav } from "@/components/main-nav"

export default function TermsPage() {
  return (
  
      <main className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Table of Contents */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-sm border-0 bg-white/60 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Mục lục
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <a
                    href="#general-terms"
                    className="flex items-center gap-3 rounded-xl p-3 hover:bg-blue-50 transition-all duration-200 group"
                  >
                    <div className="rounded-lg bg-blue-100 p-1.5 group-hover:bg-blue-200 transition-colors">
                      <Shield className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Điều khoản chung</div>
                      <div className="text-xs text-gray-500">Quy định cơ bản</div>
                    </div>
                  </a>

                  <a
                    href="#refund-policy"
                    className="flex items-center gap-3 rounded-xl p-3 hover:bg-green-50 transition-all duration-200 group"
                  >
                    <div className="rounded-lg bg-green-100 p-1.5 group-hover:bg-green-200 transition-colors">
                      <RefreshCw className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Chính sách hoàn trả</div>
                      <div className="text-xs text-gray-500">Quy định hoàn tiền</div>
                    </div>
                  </a>

                  <a
                    href="#payment-policy"
                    className="flex items-center gap-3 rounded-xl p-3 hover:bg-purple-50 transition-all duration-200 group"
                  >
                    <div className="rounded-lg bg-purple-100 p-1.5 group-hover:bg-purple-200 transition-colors">
                      <CreditCard className="h-3.5 w-3.5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Chính sách thanh toán</div>
                      <div className="text-xs text-gray-500">Phương thức thanh toán</div>
                    </div>
                  </a>

                  <a
                    href="#user-responsibilities"
                    className="flex items-center gap-3 rounded-xl p-3 hover:bg-orange-50 transition-all duration-200 group"
                  >
                    <div className="rounded-lg bg-orange-100 p-1.5 group-hover:bg-orange-200 transition-colors">
                      <Users className="h-3.5 w-3.5 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Trách nhiệm người dùng</div>
                      <div className="text-xs text-gray-500">Nghĩa vụ và quyền lợi</div>
                    </div>
                  </a>

                  <a
                    href="#privacy-policy"
                    className="flex items-center gap-3 rounded-xl p-3 hover:bg-red-50 transition-all duration-200 group"
                  >
                    <div className="rounded-lg bg-red-100 p-1.5 group-hover:bg-red-200 transition-colors">
                      <Shield className="h-3.5 w-3.5 text-red-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Chính sách bảo mật</div>
                      <div className="text-xs text-gray-500">Bảo vệ thông tin</div>
                    </div>
                  </a>

                  <a
                    href="#contact"
                    className="flex items-center gap-3 rounded-xl p-3 hover:bg-teal-50 transition-all duration-200 group"
                  >
                    <div className="rounded-lg bg-teal-100 p-1.5 group-hover:bg-teal-200 transition-colors">
                      <Phone className="h-3.5 w-3.5 text-teal-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Thông tin liên hệ</div>
                      <div className="text-xs text-gray-500">Hỗ trợ khách hàng</div>
                    </div>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* General Terms */}
            <Card id="general-terms" className="scroll-mt-24 shadow-sm border-0 bg-white/60 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-blue-100 p-3">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl text-gray-900 mb-2">1. Điều khoản chung</CardTitle>
                    <CardDescription className="text-base text-gray-600">
                      Các quy định cơ bản khi sử dụng dịch vụ đặt vé tàu trực tuyến
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold flex items-center gap-3 text-gray-900">
                    <div className="rounded-lg bg-green-100 p-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    1.1. Phạm vi áp dụng
                  </h4>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <p className="text-gray-700 leading-relaxed">
                      Các điều khoản này áp dụng cho tất cả người dùng sử dụng dịch vụ đặt vé tàu trực tuyến của chúng
                      tôi. Bằng việc sử dụng dịch vụ, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu trong tài
                      liệu này.
                    </p>
                  </div>
                </div>

                <Separator className="my-8" />

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold flex items-center gap-3 text-gray-900">
                    <div className="rounded-lg bg-green-100 p-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    1.2. Định nghĩa
                  </h4>
                  <div className="grid gap-4 sm:gap-6">
                    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-xl">
                      <Badge variant="outline" className="w-fit text-sm font-medium">
                        Dịch vụ
                      </Badge>
                      <span className="text-gray-700 flex-1">
                        Hệ thống đặt vé tàu trực tuyến và các dịch vụ liên quan
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-xl">
                      <Badge variant="outline" className="w-fit text-sm font-medium">
                        Người dùng
                      </Badge>
                      <span className="text-gray-700 flex-1">Cá nhân hoặc tổ chức sử dụng dịch vụ của chúng tôi</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-xl">
                      <Badge variant="outline" className="w-fit text-sm font-medium">
                        Vé tàu
                      </Badge>
                      <span className="text-gray-700 flex-1">Vé điện tử hoặc vé giấy được phát hành qua hệ thống</span>
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold flex items-center gap-3 text-gray-900">
                    <div className="rounded-lg bg-green-100 p-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    1.3. Quyền và nghĩa vụ
                  </h4>
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="bg-green-50 rounded-xl p-6">
                      <h5 className="font-semibold text-green-800 mb-4 text-lg">Quyền của người dùng</h5>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-green-700">
                          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Được cung cấp thông tin chính xác về chuyến tàu</span>
                        </li>
                        <li className="flex items-start gap-3 text-green-700">
                          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Được hỗ trợ kỹ thuật khi gặp sự cố</span>
                        </li>
                        <li className="flex items-start gap-3 text-green-700">
                          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Được bảo mật thông tin cá nhân</span>
                        </li>
                        <li className="flex items-start gap-3 text-green-700">
                          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Được hoàn trả theo quy định</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-6">
                      <h5 className="font-semibold text-orange-800 mb-4 text-lg">Nghĩa vụ của người dùng</h5>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-orange-700">
                          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Cung cấp thông tin chính xác khi đặt vé</span>
                        </li>
                        <li className="flex items-start gap-3 text-orange-700">
                          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Thanh toán đầy đủ và đúng hạn</span>
                        </li>
                        <li className="flex items-start gap-3 text-orange-700">
                          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Tuân thủ các quy định về an toàn</span>
                        </li>
                        <li className="flex items-start gap-3 text-orange-700">
                          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Không sử dụng dịch vụ cho mục đích bất hợp pháp</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Refund Policy */}
            <Card
              id="refund-policy"
              className="scroll-mt-24 shadow-sm border-0 bg-gradient-to-br from-green-50/80 to-emerald-50/80 backdrop-blur-sm"
            >
              <CardHeader className="pb-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-green-100 p-3">
                    <RefreshCw className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl text-green-900 mb-2">2. Chính sách hoàn trả vé</CardTitle>
                    <CardDescription className="text-base text-green-700">
                      Quy định về việc hủy vé và hoàn tiền chi tiết theo thời gian
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Refund Timeline */}
                <div className="space-y-6">
                  <h4 className="text-xl font-semibold text-green-900">2.1. Thời gian hoàn trả theo lịch trình</h4>
                  <div className="grid gap-4 sm:gap-6">
                    {/* 1. Hoàn 100% trước 24h */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 bg-white rounded-2xl border border-green-200 shadow-sm">
                      <div className="rounded-full bg-green-100 p-3">
                        <Clock className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <Badge className="bg-green-600 hover:bg-green-700 w-fit">Trước 24h</Badge>
                          <span className="text-lg font-semibold text-gray-900">Hoàn 100% giá vé</span>
                        </div>
                        <p className="text-gray-600">
                          Khách hoàn vé trước giờ tàu chạy tối thiểu 24h sẽ được hoàn lại toàn bộ số tiền vé.
                        </p>
                      </div>
                    </div>
                    {/* 2. Hoàn 90% từ 6h - 24h */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 bg-white rounded-2xl border border-yellow-200 shadow-sm">
                      <div className="rounded-full bg-yellow-100 p-3">
                        <Clock className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-500 w-fit">6h - 24h</Badge>
                          <span className="text-lg font-semibold text-gray-900">Hoàn 90% giá vé</span>
                        </div>
                        <p className="text-gray-600">
                          Khách hoàn vé trong khoảng 6 đến 24 giờ trước giờ tàu chạy sẽ được hoàn 90% giá vé (phí hủy 10%).
                        </p>
                      </div>
                    </div>
                    {/* 3. Không hoàn dưới 6h */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-200 shadow-sm">
                      <div className="rounded-full bg-gray-100 p-3">
                        <AlertTriangle className="h-6 w-6 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <Badge variant="outline" className="border-gray-400 w-fit">Dưới 6h</Badge>
                          <span className="text-lg font-semibold text-gray-900">Không hoàn tiền</span>
                        </div>
                        <p className="text-gray-600">Không hỗ trợ hoàn trong vòng 6h trước khi tàu chạy.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Special Cases */}
                <div className="space-y-6">
                  <h4 className="text-xl font-semibold text-green-900">2.2. Trường hợp đặc biệt</h4>
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200">
                      <h5 className="font-semibold text-blue-800 mb-4 text-lg">Hoàn tiền 100%</h5>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-blue-700">
                          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Tàu bị hủy do sự cố kỹ thuật</span>
                        </li>
                        <li className="flex items-start gap-3 text-blue-700">
                          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Thay đổi lịch trình từ phía nhà ga</span>
                        </li>
                        <li className="flex items-start gap-3 text-blue-700">
                          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Thiên tai, dịch bệnh</span>
                        </li>
                        <li className="flex items-start gap-3 text-blue-700">
                          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Lỗi hệ thống khi đặt vé</span>
                        </li>
                      </ul>
                    </div>
                    <div className="p-6 bg-red-50 rounded-2xl border border-red-200">
                      <h5 className="font-semibold text-red-800 mb-4 text-lg">Không hoàn tiền</h5>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-red-700">
                          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Vé khuyến mãi đặc biệt</span>
                        </li>
                        <li className="flex items-start gap-3 text-red-700">
                          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Vé đã sử dụng một phần</span>
                        </li>
                        <li className="flex items-start gap-3 text-red-700">
                          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Thông tin đặt vé sai do khách hàng</span>
                        </li>
                        <li className="flex items-start gap-3 text-red-700">
                          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Không có mặt tại ga đúng giờ</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Refund Process */}
                <div className="space-y-6">
                  <h4 className="text-xl font-semibold text-green-900">2.3. Quy trình hoàn trả</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-green-200">
                      <div className="rounded-full bg-green-100 p-2 mt-1">
                        <span className="text-sm font-bold text-green-600 px-2">1</span>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900 mb-2">Yêu cầu hủy vé</h5>
                        <p className="text-gray-600">Đăng nhập tài khoản và chọn "Hủy vé" trong mục "Vé của tôi"</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-green-200">
                      <div className="rounded-full bg-green-100 p-2 mt-1">
                        <span className="text-sm font-bold text-green-600 px-2">2</span>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900 mb-2">Xác nhận thông tin</h5>
                        <p className="text-gray-600">Kiểm tra thông tin vé và xác nhận lý do hủy</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-green-200">
                      <div className="rounded-full bg-green-100 p-2 mt-1">
                        <span className="text-sm font-bold text-green-600 px-2">3</span>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900 mb-2">Xử lý hoàn tiền</h5>
                        <p className="text-gray-600">
                          Tiền sẽ được hoàn về tài khoản/thẻ thanh toán trong 3-7 ngày làm việc
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Policy */}
            <Card id="payment-policy" className="scroll-mt-24 shadow-sm border-0 bg-white/60 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-purple-100 p-3">
                    <CreditCard className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl text-gray-900 mb-2">3. Chính sách thanh toán</CardTitle>
                    <CardDescription className="text-base text-gray-600">
                      Các phương thức và quy định thanh toán được hỗ trợ
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid gap-8 lg:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Phương thức thanh toán</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="rounded-lg bg-blue-100 p-2">
                          <CreditCard className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">Thẻ tín dụng/ghi nợ</span>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
                        <div className="rounded-lg bg-green-100 p-2">
                          <Phone className="h-5 w-5 text-green-600" />
                        </div>
                        <span className="font-medium text-gray-900">Ví điện tử (MoMo, ZaloPay)</span>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
                        <div className="rounded-lg bg-orange-100 p-2">
                          <CreditCard className="h-5 w-5 text-orange-600" />
                        </div>
                        <span className="font-medium text-gray-900">Chuyển khoản ngân hàng</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Bảo mật thanh toán</h4>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-gray-700">
                          <CheckCircle className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                          <span>Mã hóa SSL 256-bit</span>
                        </li>
                        <li className="flex items-start gap-3 text-gray-700">
                          <CheckCircle className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                          <span>Tuân thủ chuẩn PCI DSS</span>
                        </li>
                        <li className="flex items-start gap-3 text-gray-700">
                          <CheckCircle className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                          <span>Không lưu trữ thông tin thẻ</span>
                        </li>
                        <li className="flex items-start gap-3 text-gray-700">
                          <CheckCircle className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                          <span>Xác thực 3D Secure</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Responsibilities */}
            <Card id="user-responsibilities" className="scroll-mt-24 shadow-sm border-0 bg-white/60 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-orange-100 p-3">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl text-gray-900 mb-2">4. Trách nhiệm người dùng</CardTitle>
                    <CardDescription className="text-base text-gray-600">
                      Các nghĩa vụ và trách nhiệm khi sử dụng dịch vụ
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid gap-8 lg:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-orange-800">Thông tin cá nhân</h4>
                    <div className="bg-orange-50 rounded-xl p-6">
                      <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Cung cấp thông tin chính xác và đầy đủ</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Cập nhật thông tin khi có thay đổi</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Bảo mật thông tin đăng nhập</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-red-800">Sử dụng dịch vụ</h4>
                    <div className="bg-red-50 rounded-xl p-6">
                      <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Không sử dụng cho mục đích bất hợp pháp</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Không can thiệp vào hệ thống</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Tuân thủ các quy định về an toàn</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Policy */}
            <Card id="privacy-policy" className="scroll-mt-24 shadow-sm border-0 bg-white/60 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-red-100 p-3">
                    <Shield className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl text-gray-900 mb-2">5. Chính sách bảo mật</CardTitle>
                    <CardDescription className="text-base text-gray-600">
                      Cam kết bảo vệ thông tin cá nhân của người dùng
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-3 text-lg">Thu thập thông tin</h4>
                    <p className="text-blue-700">
                      Chúng tôi chỉ thu thập thông tin cần thiết để cung cấp dịch vụ đặt vé và hỗ trợ khách hàng.
                    </p>
                  </div>
                  <div className="p-6 bg-green-50 rounded-2xl border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-3 text-lg">Sử dụng thông tin</h4>
                    <p className="text-green-700">
                      Thông tin được sử dụng để xử lý đơn hàng, liên lạc và cải thiện dịch vụ.
                    </p>
                  </div>
                  <div className="p-6 bg-purple-50 rounded-2xl border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-3 text-lg">Bảo vệ thông tin</h4>
                    <p className="text-purple-700">
                      Áp dụng các biện pháp bảo mật tiên tiến để bảo vệ dữ liệu khách hàng.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card
              id="contact"
              className="scroll-mt-24 shadow-sm border-0 bg-gradient-to-br from-teal-50/80 to-blue-50/80 backdrop-blur-sm"
            >
              <CardHeader className="pb-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-teal-100 p-3">
                    <Phone className="h-6 w-6 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl text-gray-900 mb-2">6. Thông tin liên hệ</CardTitle>
                    <CardDescription className="text-base text-gray-600">
                      Kênh hỗ trợ và giải đáp thắc mắc 24/7
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-8 lg:grid-cols-2">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 bg-white rounded-xl">
                      <div className="rounded-lg bg-green-100 p-2">
                        <Phone className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Hotline</p>
                        <p className="text-gray-600">1900 1234 (24/7)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-white rounded-xl">
                      <div className="rounded-lg bg-blue-100 p-2">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Email hỗ trợ</p>
                        <p className="text-gray-600">support@trainbooking.vn</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-white rounded-xl">
                      <div className="rounded-lg bg-red-100 p-2">
                        <MapPin className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Địa chỉ</p>
                        <p className="text-gray-600">123 Đường ABC, Quận 1, TP.HCM</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Thời gian hỗ trợ</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Hotline:</span>
                          <Badge className="bg-green-600 hover:bg-green-700">24/7</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Email:</span>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            Trong 24h
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Chat trực tuyến:</span>
                          <Badge variant="outline" className="border-purple-300 text-purple-700">
                            6:00 - 22:00
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-6">
                      <Link href="/">
                        <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
                          Về trang chủ
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Updated timestamp */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-gray-200">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Cập nhật lần cuối: 30/12/2024</span>
          </div>
        </div>
      </main>
   
  )
}
