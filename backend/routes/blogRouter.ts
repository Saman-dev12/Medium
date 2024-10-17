import { zValidator } from "@hono/zod-validator";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { z } from "zod";

type Env = {
    DATABASE_URL:string
}
type Variables = {
    prisma: PrismaClient
    user?: { id: string }
  }
  
const app = new Hono<{ Bindings: Env; Variables: Variables }>()
  
app.get('/getuserposts',async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const user = c.get('user');
    if(!user){
        return c.json({message:"User not found"}, 400);
    }
    //get all user blogs
    const userPosts = await prisma.post.findMany({
        where: {
            authorId: user.id
        }
    })

    return c.json(userPosts, 200);
})

app.get('/:id',async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const id = c.req.param('id');
    const post = await prisma.post.findUnique({
        where: {
            id: id
        }
    })
    return c.json(post, 200);
})

app.post('/',zValidator("json",z.object({
    title:z.string(),
    content:z.string()
})),async (c)=>{
    const prisma = c.get('prisma');

    const {title,content} = c.req.valid('json');
    const user = c.get('user');
    if(!user){
        return c.json({message:"User not found"}, 400);
    }
    const post = await prisma.post.create({
        data: {
            title: title,
            content: content,
            author: {
                connect: {
                    id: user.id
                }
            }
        }
    })
    return c.json(post, 201);
})

export default app;