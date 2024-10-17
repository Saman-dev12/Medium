"use client"
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

function DashHead() {
    const router = useRouter()
    const handleLogout = () => {
        Cookies.remove('token');
        router.push('/login');
      };
  return (
    <div>
      <header className="py-5 border-b">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-serif font-bold">Medium Clone</Link>
          <nav className="flex items-center space-x-4">
            <Link href="/profile">
              <Button variant="ghost">Profile</Button>
            </Link>
            <Link href="/create-blog">
              <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full">Write a story</Button>
            </Link>
            <Button variant="ghost" onClick={handleLogout}>Logout</Button>
            
        
            
          </nav>
        </div>
      </header>
    </div>
  )
}

export default DashHead
