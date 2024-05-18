import { serve } from '@hono/node-server'
import { Hono } from 'hono'

export const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

const port = 3000

console.log(`Server is running: http://127.0.0.1:${port}`)

serve({
  fetch: app.fetch,
  port
})
