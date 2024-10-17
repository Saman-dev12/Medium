'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from 'axios'
import {z} from "zod"

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

 
const signupSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

type signupType = z.infer<typeof signupSchema>; 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/signup`,{name,email,password})
      if(res.data){
        router.push('/login');
      } 
    } catch (error) {
      console.error('Error signing up:', error)
    }
    
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md">
          <Link href="/" className="text-3xl font-serif font-bold mb-8 block text-center">Medium Clone</Link>
          <h1 className="text-3xl font-bold mb-6 text-center">Join Medium.</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="sr-only">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-full"
              />
            </div>
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
            <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white rounded-full">Sign up</Button>
          </form>
          <p className="mt-4 text-center">
            Already have an account? <Link href="/login" className="text-green-600 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
