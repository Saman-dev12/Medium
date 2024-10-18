"use client"
import React from 'react'
import { Button } from './ui/button'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

function Publish({id}:{id:string}) {
  const router = useRouter()
    const handlePublish = async (blogId: string) => {
        const token = Cookies.get('token');
        const publish = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/blog/publish/${blogId}`,{
            method:'POST',
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        if(publish.ok){
            router.push('/dashboard')
        }
      }
    
  return (
    <>
     <Button
        onClick={() => handlePublish(id)}
        className="text-sm bg-green-600 hover:bg-green-700 text-white"
        >
        Publish
        </Button> 
    </>
  )
}

export default Publish
