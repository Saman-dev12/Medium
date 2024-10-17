'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function CreateBlog() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isDraft, setIsDraft] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent, saveAsDraft: boolean) => {
    e.preventDefault()
    // Implement your create blog logic here
    // Use the 'saveAsDraft' parameter to determine whether to save as draft or publish
    console.log(`Saving blog as ${saveAsDraft ? 'draft' : 'published'}`)
    // If successful, redirect to dashboard
    router.push('/dashboard')
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="py-5 border-b">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-serif font-bold">Medium Clone</Link>
          <div className="space-x-2">
            <Button 
              onClick={(e) => handleSubmit(e, true)} 
              variant="outline"
              className="rounded-full"
            >
              Save as Draft
            </Button>
            <Button 
              onClick={(e) => handleSubmit(e, false)} 
              className="bg-green-600 hover:bg-green-700 text-white rounded-full"
            >
              Publish
            </Button>
          </div>
        </div>
      </header>
      <main className="py-10">
        <form id="blog-form" className="space-y-6 max-w-2xl mx-auto">
          <div>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Title"
              className="text-4xl font-bold border-none placeholder-gray-300 focus:outline-none focus:ring-0"
            />
          </div>
          <div>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Tell your story..."
              className="w-full h-96 text-xl border-none resize-none placeholder-gray-300 focus:outline-none focus:ring-0"
            />
          </div>
        </form>
      </main>
    </div>
  )
}