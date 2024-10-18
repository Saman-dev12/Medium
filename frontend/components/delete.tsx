"use client"
import React from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

function Delete({id}:{id:string}) {
    const router = useRouter()
    const handleDelete = async(blogId:string) =>{
        const token = Cookies.get('token')
        const del = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/blog/delete/${blogId}`,{
            method:'DELETE',
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        if(del.ok){
            router.push('/dashboard')
        }
    }
  return (
    <>
        <Button variant="outline" className="text-sm text-red-600 hover:text-red-700" onClick={()=>{handleDelete(id)}}>Delete</Button>
    </>
  )
}

export default Delete
