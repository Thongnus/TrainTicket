import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SearchForm } from "@/components/search-form"
import { PopularRoutes } from "@/components/popular-routes"
import { NewsSection } from "@/components/news-section"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { UserNav } from "@/components/user-nav"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center ">
      <header >
        <div className="container flex h-16 items-center">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-background">
          <div className="container px-4 md:px-6">
            <div className="grid items-start gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Đặt vé tàu hỏa nhanh chóng và tiện lợi
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    Hệ thống đặt vé tàu hỏa trực tuyến giúp bạn dễ dàng tìm kiếm, đặt vé và quản lý hành trình của mình.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/search">
                    <Button size="lg" className="w-full">
                      Tìm vé ngay
                    </Button>
                  </Link>
                  <Link href="/schedule">
                    <Button size="lg" variant="outline" className="w-full">
                      Xem lịch trình
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto flex w-full max-w-[400px] flex-col justify-center">
                <SearchForm />
              </div>
            </div>
          </div>
        </section>
        <PopularRoutes />
        <NewsSection />
      </main>
      <Footer />
    </div>
  )
}
