import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import fs from 'node:fs/promises'
import mime from 'mime'
import uploadApp from './upload'
import { serveStatic } from '@hono/node-server/serve-static'

export const app = new Hono()

// 注意路由要和文件夹名称一致
app.use('/files/*', serveStatic({ root: './' }))

app.get('/hello', (c) => {
  return c.text('Hello Hono!')
})

app.get('/preview/:name', async (c) => {
  const name = c.req.param('name')
  const file = await fs.readFile(`./files/${name}`)
  c.status(200)
  c.header('Content-Type', mime.getType(name)!)
  return c.body(file)
})

app.post('/avatar', async (c) => {
  const body = await c.req.parseBody()

  const files = Object.values(body) as File[]

  const img = files[0]

  for (const file of files) {
    await fs.writeFile(`./files/${file.name}`, Buffer.from(await file.arrayBuffer()))
  }

  return c.json({
    url: `/preview/${img.name}`
  })
})

app.route('/upload',uploadApp)


const port = 3001

console.log(`Server is running: http://127.0.0.1:${port}`)

serve({
  fetch: app.fetch,
  port
})
