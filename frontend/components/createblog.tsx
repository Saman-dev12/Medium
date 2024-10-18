'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import axios from 'axios'
import Cookies from 'js-cookie'

export default function CreateBlog() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isDraft, setIsDraft] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent, publish: boolean) => {
    const token = Cookies.get('token')
    e.preventDefault()
    const create = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/blog`, {title, content},{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if(publish){  
        if(create.status === 201 && create.data){
            const publish = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/blog/publish/${create.data.id}`, {},{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            router.push('/dashboard')
        }else{
            console.log(create)
        }
    
    }else{
        router.push('/profile')
    }
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="py-5 border-b">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-serif font-bold">Medium Clone</Link>
          <div className="space-x-2">
            <Button 
              onClick={(e) => handleSubmit(e, false)} 
              variant="outline"
              className="rounded-full"
            >
              Save as Draft
            </Button>
            <Button 
              onClick={(e) => handleSubmit(e, true)} 
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