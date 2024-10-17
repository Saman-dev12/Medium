import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="py-5 border-b">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-serif font-bold">Medium Clone</Link>
          <nav>
            <Link href="/login">
              <Button variant="ghost" className="mr-2 text-green-600 hover:text-green-700">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-green-600 hover:bg-green-700 text-white">Get started</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="py-20">
        <section className="text-center mb-20">
          <h1 className="text-7xl font-serif font-bold mb-6">Stay curious.</h1>
          <p className="text-2xl mb-10 max-w-2xl mx-auto">Discover stories, thinking, and expertise from writers on any topic.</p>
          <Link href="/signup">
            <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-12 py-3 text-xl rounded-full">Start reading</Button>
          </Link>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-6 border-b pb-4">Trending on Medium</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Trending posts would go here */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-start">
                <span className="text-3xl font-bold text-gray-200 mr-4">{`0${i}`}</span>
                <div>
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 rounded-full bg-gray-300 mr-2"></div>
                    <span className="text-sm">Author Name</span>
                  </div>
                  <h3 className="font-bold mb-1">Trending Article Title</h3>
                  <span className="text-sm text-gray-500">Date · 5 min read</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}