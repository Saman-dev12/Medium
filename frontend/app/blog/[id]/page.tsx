import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import axios from 'axios'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import BackButton from '@/components/backbutton'

interface Blog {
  id: string;
  title: string;
  content: string;
  author: { name: string; avatar: string };
  createdAt: string;
}

async function getPost(id: string): Promise<Blog> {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value
  const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/blog/getPost/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.data) {
    throw new Error('Failed to fetch blog post')
  }
  return res.data;
}

function BlogContent({ blog }: { blog: Blog }) {
  return (
    <>
    <BackButton/>   
    <article className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 font-serif">{blog.title}</h1>
      <div className="flex items-center mb-8">
        <Avatar className="h-12 w-12 mr-4">
          <AvatarImage src={blog.author.avatar} alt={blog.author.name} />
          <AvatarFallback>{blog.author.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{blog.author.name}</p>
         
        </div>
      </div>
      <div className="prose prose-lg max-w-none">
        {blog.content}
      </div>
    </article>
    </>
  )
}

function BlogSkeleton() {
  return (
    <div className="max-w-2xl mx-auto">
      <Skeleton className="h-12 w-3/4 mb-4" />
      <div className="flex items-center mb-8">
        <Skeleton className="h-12 w-12 rounded-full mr-4" />
        <div>
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  )
}

export default async function BlogPost({ params }: { params: { id: string } }) {
  let blog: Blog;

  try {
    blog = await getPost(params.id);
  } catch (error) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="py-5 border-b sticky top-0 bg-white z-10">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href="/" className="text-2xl font-serif font-bold">Medium Clone</Link>
          
        </div>
      </header>
      <main className="py-10 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<BlogSkeleton />}>
          <BlogContent blog={blog} />
        </Suspense>
      </main>
      <footer className="py-8 border-t mt-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          © 2024 Medium Clone. All rights reserved.
        </div>
      </footer>
    </div>
  )
}