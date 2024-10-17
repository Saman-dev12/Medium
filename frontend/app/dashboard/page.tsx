import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axios from 'axios'
import { cookies } from 'next/headers'
import DashHead from '@/components/dashHead'

interface Blog {
  id: string;
  title: string;
  content: string;
  author: { name: string };
}

async function getBlogs() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/blog/getall`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.posts;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export default async function Dashboard() {
  const blogs: Blog[] = await getBlogs();

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <DashHead/>
      <main className="py-10">
        <div className="space-y-10">
          {blogs.map((blog, index) => (
            <article key={blog.id} className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>{blog.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{blog.author.name}</span>
              </div>
              <Link href={`/blog/${blog.id}`} className="group">
                <h2 className="text-xl font-bold mb-2 group-hover:underline">{blog.title}</h2>
                <p className="text-gray-600 line-clamp-3">{blog.content}</p>
              </Link>
              {index !== blogs.length - 1 && <hr className="my-8" />}
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}