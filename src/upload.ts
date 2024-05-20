import { Hono } from 'hono'
import { exists, ensureFile, remove } from 'fs-extra'
import path from 'path'
import fs from 'fs/promises'
import mime from 'mime'


const app = new Hono()

const chunks = "./chunks"

const files = "./files"

app.post('/chunk', async (c) => {

    const info: {
        name: string,
        id: string,
        file: File
    } = await c.req.parseBody()

    console.log(info);

    const chunkPath = path.join(chunks, info.name, info.id)

    console.log(chunkPath);

    try {
        await ensureFile(chunkPath)

        await fs.writeFile(chunkPath, Buffer.from(await info.file.arrayBuffer()))

        c.status(200)
        return c.json({
            data: 1
        })
    } catch (error) {

        console.error(error);

        c.status(500)
        return c.json({
            data: -1
        })
    }
})
app.post('/merge', async (c) => {
    const req: {
        filename: string,
        ids: string[]
    } = await c.req.json()


    const bufs: Buffer[] = []

    for (const id of req.ids) {
        const buf = await fs.readFile(path.join(chunks, req.filename, id))
        bufs.push(buf)
    }

    const fileBuffer = Buffer.concat(bufs)

    const filePath = path.join(files, req.filename)

    console.log(filePath);

    await ensureFile(filePath)

    await fs.writeFile(filePath, fileBuffer)

    c.status(200)

    return c.json({
        // data: `/static/${req.filename}`
        data: `/upload/result/${req.filename}`
    })
})

app.get('/result/:name', async (c) => {
    const name = c.req.param('name')
    const disposition = "attachment;filename=" + name;
    const buf = await fs.readFile(path.join(files, name))
    c.status(200)
    c.header('Content-Type', mime.getType(name)!)
    c.header('Content-Disposition', disposition)
    return c.body(buf)
})

app.post('/delete', async (c) => {
    const req: {
        name: string,
        id: string
    } = await c.req.json()

    await remove(path.join(chunks, req.name, req.id))

    return c.json({
        data: 1
    })
})

app.post('/info', async (c) => {
    const info: {
        filename: string,
        id: string
    } = await c.req.json()

    const exist = await exists(path.join(chunks, info.filename, info.id))

    return c.json({
        data: exist
    })
})

export default app