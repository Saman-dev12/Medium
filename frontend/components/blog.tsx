import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

async function getPost(id: string): Promise<Blog> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/blog/${id}`, { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error('Failed to fetch blog post')
  }
  return res.json()
}

export default async function BlogPost({ params }: { params: { id: string } }) {
  let blog: Blog;

  try {
    blog = await getPost(params.id);
  } catch (error) {
    notFound();
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="py-5 border-b">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-serif font-bold">Medium Clone</Link>
        </div>
      </header>
      <Suspense fallback={<div>Loading...</div>}>
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
      </Suspense>
    </div>
  )
}