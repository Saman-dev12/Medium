import { zValidator } from "@hono/zod-validator";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { z } from "zod";
import bcrypt from 'bcryptjs';
import { sign } from "hono/jwt";
import { setCookie } from "hono/cookie";
import argon2 from "argon2-browser"

type Env = {
    DATABASE_URL : string,
    JWT_SECRET  : string
}
type Variables = {
    user?: { id: string }
    prisma:any
  }
const app = new Hono<{Bindings:Env,Variables:Variables}>()

async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer)); 
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

app.post('/signup',zValidator("json",z.object({
    name:z.string(),
    email:z.string().email(),
    password:z.string().min(6)
})),async(c)=> {
    const prisma = c.get('prisma');
    try {
        const {name, email, password} = c.req.valid("json");
        // const { name, email, password } = await c.req.json();
        if(!name || !email || !password){
            return c.json({message:"Invalid data"},400);
        }

        const userExists = await prisma.user.findUnique({
            where:{
                email
            }
        });
        if(userExists){
            return c.json({message:"User already exists"}, 400);
        }

        
        const hashedPassword = await hashPassword(password)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });
        if(!user){
            return c.json({message:"User not created"}, 400);
        }

        return c.json({message:"User created successfully", user}, 201);
    } catch (error) {
        return c.json({message:"Error creating user", error: error}, 500);
    } finally {
        await prisma.$disconnect();
    }
});

app.post('/signin', 
    zValidator("json", 
        z.object({
            email:z.string().email(),
            password:z.string().min(6)
        })
    ),
    async(c) => {
        const prisma = c.get('prisma');
        try {
            const {email, password} = c.req.valid("json");
            if(!email || !password){
                return c.json({message:"Invalid data"}, 400);
            }

            const user = await prisma.user.findUnique({
                where: {
                    email
                }
            });
            if(!user){
                return c.json({message:"User not found"}, 400);
            }


            const hashedPassword = await hashPassword(password)
            if(!(hashedPassword === user.password)){
                return c.json({message:"Invalid password"}, 400);
            }

            const token = await sign({id: user.id}, c.env.JWT_SECRET);
            setCookie(c, 'token', token, {httpOnly: true});
            if(!token){
                return c.json({message:"Error signing in"}, 500);
            }
            
            return c.json({message:"User signed in successfully", token}, 200);
        } catch (error) {
            return c.json({message:"Error signing in", error: error}, 500);
        }
    }
);

app.post('logout',(c)=>{
    setCookie(c, 'token', '', {maxAge: 0});
    return c.json({message:"User logged out successfully"}, 200);
})

export default app;
