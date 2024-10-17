'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from 'axios'
import Cookies from 'js-cookie';


export default function Login() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/signin`, { email, password });
  
      if (res.data && res.data.token) {
        // localStorage.setItem('token', JSON.stringify(res.data.token));
        Cookies.set('token', res.data.token, { expires: 7, path: '/' }); 
        router.push('/dashboard');
      } else {
        console.log('Login failed: No token received.');
      }
      
      // console.log(res.data.message);
  
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };
  

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md">
          <Link href="/" className="text-3xl font-serif font-bold mb-8 block text-center">Medium Clone</Link>
          <h1 className="text-3xl font-bold mb-6 text-center">Welcome back.</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="sr-only">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-full"
              />
            </div>
            <div>
              <Label htmlFor="password" className="sr-only">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-full"
              />
            </div>
            <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white rounded-full">Sign in</Button>
          </form>
          <p className="mt-4 text-center">
            No account? <Link href="/signup" className="text-green-600 hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}