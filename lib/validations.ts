import { z } from "zod"

// Search form validation
export const searchFormSchema = z.object({
  origin: z.string().min(1, "Vui lòng chọn ga đi"),
  destination: z.string().min(1, "Vui lòng chọn ga đến"),
  date: z.date({
    required_error: "Vui lòng chọn ngày đi",
  }),
  returnDate: z.date().optional(),
  passengers: z.string().min(1, "Vui lòng chọn số hành khách"),
  isRoundTrip: z.boolean(),
}).refine((data) => {
  if (data.isRoundTrip && !data.returnDate) {
    return false
  }
  return true
}, {
  message: "Vui lòng chọn ngày về khi đặt vé khứ hồi",
  path: ["returnDate"],
}).refine((data) => {
  if (data.isRoundTrip && data.returnDate && data.date) {
    return data.returnDate > data.date
  }
  return true
}, {
  message: "Ngày về phải sau ngày đi",
  path: ["returnDate"],
})

// Passenger information validation
export const passengerSchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập họ tên"),
  idNumber: z.string().min(1, "Vui lòng nhập số CMND/CCCD"),
  phoneNumber: z.string().min(1, "Vui lòng nhập số điện thoại"),
  email: z.string().email("Email không hợp lệ"),
  seatId: z.string().min(1, "Vui lòng chọn ghế"),
})

export const bookingFormSchema = z.object({
  passengers: z.array(passengerSchema),
  returnPassengers: z.array(passengerSchema).optional(),
  promoCode: z.string().optional(),
})

// Payment validation
export const paymentSchema = z.object({
  cardNumber: z.string().min(16, "Số thẻ phải có 16 chữ số"),
  cardHolder: z.string().min(1, "Vui lòng nhập tên chủ thẻ"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Ngày hết hạn không hợp lệ"),
  cvv: z.string().min(3, "Mã CVV phải có 3 chữ số"),
})

// Login validation
export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
})

// Register validation
export const registerSchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập họ tên"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  phoneNumber: z.string().min(10, "Số điện thoại không hợp lệ"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"],
})

// Profile validation
export const profileSchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập họ tên"),
  email: z.string().email("Email không hợp lệ"),
  phoneNumber: z.string().min(10, "Số điện thoại không hợp lệ"),
  address: z.string().optional(),
  dateOfBirth: z.date().optional(),
})

// Admin validation
export const adminLoginSchema = z.object({
  username: z.string().min(1, "Vui lòng nhập tên đăng nhập"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
})

export const trainSchema = z.object({
  trainNumber: z.string().min(1, "Vui lòng nhập số hiệu tàu"),
  trainType: z.string().min(1, "Vui lòng chọn loại tàu"),
  origin: z.string().min(1, "Vui lòng chọn ga đi"),
  destination: z.string().min(1, "Vui lòng chọn ga đến"),
  departureTime: z.string().min(1, "Vui lòng nhập giờ khởi hành"),
  arrivalTime: z.string().min(1, "Vui lòng nhập giờ đến"),
  price: z.number().min(0, "Giá vé phải lớn hơn 0"),
  availableSeats: z.number().min(0, "Số ghế trống phải lớn hơn 0"),
})

export const stationSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên ga"),
  code: z.string().min(1, "Vui lòng nhập mã ga"),
  address: z.string().min(1, "Vui lòng nhập địa chỉ"),
  city: z.string().min(1, "Vui lòng nhập thành phố"),
})

export const scheduleSchema = z.object({
  trainId: z.string().min(1, "Vui lòng chọn tàu"),
  stationId: z.string().min(1, "Vui lòng chọn ga"),
  arrivalTime: z.string().min(1, "Vui lòng nhập giờ đến"),
  departureTime: z.string().min(1, "Vui lòng nhập giờ khởi hành"),
  stopOrder: z.number().min(1, "Thứ tự dừng phải lớn hơn 0"),
}) 