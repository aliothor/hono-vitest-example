import { describe, test ,expect} from 'vitest'
import { app } from '../src/index'

describe('hono app tes', () => {
    test('root test', async () => {
        const res = await app.request('/')
        console.log(res);
        expect(res.status).toBe(200)
        expect(await res.text()).toBe('Hello Hono!')
    })
})