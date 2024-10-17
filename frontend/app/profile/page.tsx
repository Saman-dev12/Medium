'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  published: boolean;
  createdAt: string;
}

export default function Profile() {
  const [blogs, setBlogs] = useState<Blog[]>([])

  useEffect(() => {
    // Fetch user's blogs here
    // This is a placeholder. Replace with actual API call.
    const fetchedBlogs: Blog[] = [
      { id: '1', title: 'My First Blog', excerpt: 'This is my first blog...', published: true, createdAt: '2023-06-01' },
      { id: '2', title: 'My Second Blog', excerpt: 'This is my second blog...', published: false, createdAt: '2023-06-02' },
      { id: '3', title: 'My Third Blog', excerpt: 'This is my third blog...', published: false, createdAt: '2023-06-03' },
    ]
    setBlogs(fetchedBlogs)
  }, [])

  const handlePublish = async (blogId: string) => {
    // Implement your publish logic here
    console.log(`Publishing blog with id: ${blogId}`)
    // After successful publish, update the blog's published status
    setBlogs(blogs.map(blog => 
      blog.id === blogId ? { ...blog, published: true } : blog
    ))
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="py-5 border-b">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-serif font-bold">Medium Clone</Link>
          <nav>
            <Link href="/dashboard">
              <Button variant="ghost" className="mr-2">Dashboard</Button>
            </Link>
            <Link href="/create-blog">
              <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full">Write a story</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="py-10">
        <h1 className="text-3xl font-bold mb-6">Your stories</h1>
        <div className="space-y-6">
          {blogs.map((blog) => (
            <div key={blog.id} className="border-b pb-6">
              <h2 className="text-xl font-bold mb-2">{blog.title}</h2>
              <p className="text-gray-600 mb-2">{blog.excerpt}</p>
              <div className="flex items-center text-sm text-gray-500">
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                <span className="mx-2">·</span>
                <span>{blog.published ? 'Published' : 'Draft'}</span>
              </div>
              <div className="mt-4 space-x-2">
                <Link href={`/edit-blog/${blog.id}`}>
                  <Button variant="outline" className="text-sm">Edit</Button>
                </Link>
                {!blog.published && (
                  <Button 
                    onClick={() => handlePublish(blog.id)}
                    className="text-sm bg-green-600 hover:bg-green-700 text-white"
                  >
                    Publish
                  </Button>
                )}
                <Button variant="outline" className="text-sm text-red-600 hover:text-red-700">Delete</Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}