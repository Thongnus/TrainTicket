import { NewsList } from "@/components/news/news-list"

export default function NewsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Tin tức</h1>
      <NewsList />
    </div>
  )
} 