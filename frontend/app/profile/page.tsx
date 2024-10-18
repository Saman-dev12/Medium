import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { cookies } from 'next/headers';
import DashHead from '@/components/dashHead';
import Publish from '@/components/publish';
import Delete from '@/components/delete';

interface Blog {
  id: string;
  title: string;
  content: string;
  published: boolean;
}

async function fetchUserBlogs() {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value
  
    const blogs = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/blog/getuserposts`,{
        headers:{
            Authorization:`Bearer ${token}`
        
        }
    })
    
    const userBlogs =  await blogs.json();
    // console.log(userBlogs);
    return userBlogs
}

export default async function Profile() {
  const blogs = await fetchUserBlogs();


  
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <DashHead/>
      <main className="py-10">
        <h1 className="text-3xl font-bold mb-6">Your stories</h1>
        <div className="space-y-6">
          {blogs.map((blog:Blog) => (
            <div key={blog.id} className="border-b pb-6">
              <h2 className="text-xl font-bold mb-2">{blog.title}</h2>
              <p className="text-gray-600 mb-2">{blog.content.slice(0, 40) + '...'}</p>
              <div className="flex items-center text-sm text-gray-500">
                <span className="mx-2">·</span>
                <span>{blog.published ? 'Published' : 'Draft'}</span>
              </div>
              <div className="mt-4 space-x-2">
                <Link href={`/edit-blog/${blog.id}`}>
                  <Button variant="outline" className="text-sm">Edit</Button>
                </Link>
                {!blog.published && (
                  <Publish id={blog.id} />
                )}
                <Delete id={blog.id}/>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}