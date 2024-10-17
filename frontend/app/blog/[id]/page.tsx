'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

export default function BlogPost() {
  const [blog, setBlog] = useState<Blog | null>(null)
  const params = useParams()
  const { id } = params

  useEffect(() => {
    // Fetch blog post here using the id
    // setBlog(fetchedBlog)
  }, [id])

  if (!blog) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="py-5 border-b">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-serif font-bold">Medium Clone</Link>
        </div>
      </header>
      <main className="py-10">
        <article className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
            <div>
              <p className="font-medium">{blog.author}</p>
              <p className="text-gray-500 text-sm">
                {new Date(blog.createdAt).toLocaleDateString()} · 
                {Math.ceil(blog.content.split(' ').length / 200)} min read
              </p>
            </div>
          </div>
          <div className="prose max-w-none">
            {blog.content}
          </div>
        </article>
      </main>
    </div>
  )
}