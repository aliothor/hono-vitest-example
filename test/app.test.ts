import { describe, test, expect } from 'vitest'
import { app } from '../src/index'
import fs from 'node:fs/promises'

describe('hono app tes', () => {
    test('/hello', async () => {
        const res = await app.request('/hello')
        const text = await res.text()
        console.log(text);
        expect(res.status).toBe(200)
        expect(text).toBe('Hello Hono!')
    })

    test('/avatar', async () => {
        const data = new FormData()
        data.append('file', new File([new Blob([await fs.readFile("./data/1.png")])], '1.png'))
        data.append('file2', new File([new Blob([await fs.readFile("./data/11.jpg")])], '11.jpg'))
        const res = await app.request('/avatar', {
            method: "POST",
            body: data
        })
        const json = await res.json()
        console.log(json);
        expect(json.name.length).toBe(2)
    })
})