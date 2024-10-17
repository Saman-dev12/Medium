import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { cors } from 'hono/cors'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'
import authRouter from '../routes/authRouter'
import blogRouter from '../routes/blogRouter'

type Env = {
  DATABASE_URL: string
  JWT_SECRET: string
}

type Variables = {
  user?: { id: string }
  userId : string
  prisma:any
}

const app = new Hono<{ Bindings: Env; Variables: Variables }>()

app.use('/*', cors())
app.use('*',async(c,next)=>{
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  c.set('prisma', prisma);
  await next();
})


app.use('/api/v1/blog/*', async (c, next) => {
  const token = c.req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return c.json({ message: 'Unauthorized' }, 401);
  }

  try {
    const decoded = await verify(token, c.env.JWT_SECRET) as { id: string };
    if (!decoded.id) {
      return c.json({ message: 'Invalid token' }, 401);
    }

    c.set('userId', decoded.id);
    await next();
  } catch (error) {
    return c.json({ message: 'Invalid token' }, 401);
  }
});

app.get('/', (c) => {
  return c.text("Hello")
})

app.route('/api/v1/auth', authRouter)
app.route('/api/v1/blog', blogRouter)

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse()
  }
  return c.json({ error: err.message }, 500)
})

export default app