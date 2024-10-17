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
    userId:string
  }
  
const app = new Hono<{ Bindings: Env; Variables: Variables }>()
  

app.get('/getall', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const posts = await prisma.post.findMany({
        where: { published: true },
        select: {
            content: true,
            title: true,
            id: true,
            author: {
                select: {
                    name: true
                }
            }
        }
    })
    return c.json({ posts });
})

app.get('/getuserposts',async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const user = c.get('userId');
    if(!user){
        return c.json({message:"User not found"}, 400);
    }
    //get all user blogs
    const userPosts = await prisma.post.findMany({
        where: {
            authorId: user
        },
        select: {
            content: true,
            title: true,
            id: true,
            published:true,
            author: {
                select: {
                    name: true
                }
            }
        }
    })

    return c.json(userPosts, 200);
})

app.get('/getPost/:id',async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const id = c.req.param('id');
    const post = await prisma.post.findUnique({
        where: {
            id: id
        },
        select: {
            content: true,
            title: true,
            id: true,
            published:true,
            author: {
                select: {
                    name: true
                }
            }
        }
    })
    return c.json(post, 200);
})

app.post('/',
    zValidator("json",z.object({
    title:z.string(),
    content:z.string()
})),async (c)=>{
    const prisma = c.get('prisma');

    const {title,content} = c.req.valid('json');
    const user = c.get('userId');
    if(!user){
        return c.json({message:"User not found"}, 400);
    }
    const post = await prisma.post.create({
        data: {
            title: title,
            content: content,
            author: {
                connect: {
                    id: user
                }
            }
        }
    })
    return c.json(post, 201);
})

app.post('/publish/:id',async (c)=>{
    const prisma = c.get('prisma');
    const id = c.req.param('id');
    const user = c.get('userId');
    if(!user){
        return c.json({message:"User not found"}, 400);
    }
    const post = await prisma.post.update({
        where: {
            id: id
        },
        data: {
            published: true
        }
    })
    return c.json(post, 200);
})

app.put('/update/:id',
    zValidator("json",z.object({
        title:z.string().optional(),
        content : z.string().optional()
    })),
    zValidator("param",z.object({
        id:z.string()
    }))
    ,async (c)=>{
        const prisma = c.get('prisma');
        const {title,content} = c.req.valid('json');
        const {id} = c.req.valid('param');
        const user = c.get('userId');
        if(!user){
            return c.json({message:"User not found"}, 400);
        }
        const post = await prisma.post.update({
            where: {
                id: id
            },
            data: {
                title: title,
                content: content
            }
        })
        return c.json(post, 200);
})

app.delete('delete/:id',async (c)=>{
    const prisma = c.get('prisma');
    const id = c.req.param('id');
    const post = await prisma.post.delete({
        where: {
            id: id
        }
    })
    return c.json(post, 200);
})


export default app;