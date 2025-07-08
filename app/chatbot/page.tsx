"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import {
  Bot,
  User,
  Send,
  Loader2,
  Sparkles,
  MessageCircle,
  ArrowLeft,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Train,
  Calendar,
  CreditCard,
  HelpCircle,
  MapPin,
} from "lucide-react"
import Link from "next/link"

interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  prompt: string
  color: string
}

const quickActions: QuickAction[] = [
  {
    id: "booking",
    label: "Đặt vé tàu",
    icon: <Train className="h-4 w-4" />,
    prompt: "Tôi muốn đặt vé tàu. Hướng dẫn tôi cách đặt vé nhé!",
    color: "bg-blue-100 text-blue-700 hover:bg-blue-200",
  },
  {
    id: "schedule",
    label: "Lịch trình tàu",
    icon: <Calendar className="h-4 w-4" />,
    prompt: "Cho tôi biết lịch trình các chuyến tàu từ Hà Nội đi Sài Gòn",
    color: "bg-green-100 text-green-700 hover:bg-green-200",
  },
  {
    id: "payment",
    label: "Thanh toán",
    icon: <CreditCard className="h-4 w-4" />,
    prompt: "Tôi có thể thanh toán vé tàu bằng những phương thức nào?",
    color: "bg-purple-100 text-purple-700 hover:bg-purple-200",
  },
  {
    id: "refund",
    label: "Hoàn tiền",
    icon: <RefreshCw className="h-4 w-4" />,
    prompt: "Chính sách hoàn tiền vé tàu như thế nào?",
    color: "bg-orange-100 text-orange-700 hover:bg-orange-200",
  },
  {
    id: "stations",
    label: "Ga tàu",
    icon: <MapPin className="h-4 w-4" />,
    prompt: "Cho tôi biết danh sách các ga tàu chính ở Việt Nam",
    color: "bg-red-100 text-red-700 hover:bg-red-200",
  },
  {
    id: "support",
    label: "Hỗ trợ",
    icon: <HelpCircle className="h-4 w-4" />,
    prompt: "Tôi cần hỗ trợ về dịch vụ đặt vé tàu",
    color: "bg-teal-100 text-teal-700 hover:bg-teal-200",
  },
]

interface Message {
  role: "user" | "assistant"
  content: string
}

const initialMessages: Message[] = [
  {
    role: "assistant",
    content: "Xin chào! Tôi là AI Assistant. Tôi có thể giúp bạn về dịch vụ đặt vé tàu, lịch trình, giá vé và nhiều thông tin khác. Hãy bắt đầu cuộc trò chuyện!",
  },
]

export default function ChatPage() {
  const { toast } = useToast()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return
    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Cảm ơn bạn đã nhắn tin! (Chức năng chat bot sẽ được tích hợp sau)",
        },
      ])
      setIsTyping(false)
    }, 1000)
  }

  const handleQuickAction = (action: QuickAction) => {
    const userMessage: Message = { role: "user", content: action.prompt }
    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Cảm ơn bạn đã nhắn tin! (Chức năng chat bot sẽ được tích hợp sau)",
        },
      ])
      setIsTyping(false)
    }, 1000)
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: "Đã sao chép",
      description: "Nội dung đã được sao chép vào clipboard",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Về trang chủ
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="rounded-full bg-gradient-to-r from-blue-500 to-green-500 p-2">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white">
                    <div className="h-full w-full rounded-full bg-green-500 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    AI Assistant
                  </h1>
                  <p className="text-sm text-muted-foreground">Trợ lý thông minh cho dịch vụ đặt vé tàu</p>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <Sparkles className="h-3 w-3 mr-1" />
              Đang hoạt động
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
          {/* Sidebar - Quick Actions */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  Câu hỏi thường gặp
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.id}
                    variant="ghost"
                    className={`w-full justify-start h-auto p-3 ${action.color} transition-all duration-200 hover:scale-105`}
                    onClick={() => handleQuickAction(action)}
                    disabled={isTyping}
                  >
                    <div className="flex items-center gap-3">
                      {action.icon}
                      <span className="text-sm font-medium">{action.label}</span>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-green-500" />
                  Mẹo sử dụng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <span>Hỏi về lịch trình, giá vé, chính sách</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    <span>Được hỗ trợ 24/7 bằng AI</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                    <span>Câu trả lời nhanh và chính xác</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3 flex flex-col">
            <Card className="flex-1 border-0 shadow-xl bg-white/70 backdrop-blur-sm">
              <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-green-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-blue-500" />
                    <CardTitle>Trò chuyện với AI</CardTitle>
                  </div>
                  {messages.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setMessages(initialMessages)
                        setInput("")
                      }}
                      className="hover:bg-red-50 hover:border-red-200"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Làm mới
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1 p-0">
                <ScrollArea ref={scrollAreaRef} className="h-[500px] p-4">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                      <div className="rounded-full bg-gradient-to-r from-blue-100 to-green-100 p-6">
                        <Bot className="h-12 w-12 text-blue-500" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-gray-800">Xin chào! Tôi là AI Assistant</h3>
                        <p className="text-muted-foreground max-w-md">
                          Tôi có thể giúp bạn về dịch vụ đặt vé tàu, lịch trình, giá vé và nhiều thông tin khác. Hãy bắt
                          đầu cuộc trò chuyện!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          {message.role === "assistant" && (
                            <Avatar className="h-8 w-8 border-2 border-blue-200">
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
                                <Bot className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}

                          <div
                            className={`group relative max-w-[80%] rounded-2xl px-4 py-3 ${
                              message.role === "user"
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                                : "bg-gray-100 text-gray-800 border"
                            }`}
                          >
                            <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>

                            <div
                              className={`flex items-center justify-between mt-2 text-xs ${
                                message.role === "user" ? "text-blue-100" : "text-gray-500"
                              }`}
                            >
                              <span>{formatTime(new Date())}</span>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 hover:bg-white/20"
                                  onClick={() => copyMessage(message.content)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                                {message.role === "assistant" && (
                                  <>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-white/20">
                                      <ThumbsUp className="h-3 w-3" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-white/20">
                                      <ThumbsDown className="h-3 w-3" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {message.role === "user" && (
                            <Avatar className="h-8 w-8 border-2 border-blue-200">
                              <AvatarFallback className="bg-gradient-to-r from-gray-500 to-gray-600 text-white">
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}

                      {/* Typing Indicator */}
                      {isTyping && (
                        <div className="flex gap-3 justify-start">
                          <Avatar className="h-8 w-8 border-2 border-blue-200">
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-gray-100 border rounded-2xl px-4 py-3">
                            <div className="flex items-center gap-1">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                <div
                                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.1s" }}
                                />
                                <div
                                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.2s" }}
                                />
                              </div>
                              <span className="text-xs text-gray-500 ml-2">AI đang trả lời...</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>

              {/* Input Area */}
              <div className="border-t bg-white/50 p-4">
                <form onSubmit={handleSend} className="flex gap-3">
                  <div className="flex-1 relative">
                    <Input
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Nhập câu hỏi của bạn..."
                      disabled={isTyping}
                      className="pr-12 h-12 border-2 focus:border-blue-300 rounded-xl"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isTyping || !input.trim()}
                    className="h-12 px-6 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 rounded-xl"
                  >
                    {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  AI có thể mắc lỗi. Vui lòng kiểm tra thông tin quan trọng.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
