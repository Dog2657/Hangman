import { request } from "./apiRequester"

export const catagorys = new Promise<Array<string>>(async (resolve, reject) => {
    const [result, error] = await request("word-catagorys")
    const catagorys = result || ["cats"]
    resolve(catagorys)
});

export const words: Record<string, Promise<Array<string>>> = {}
catagorys.then(cats => {
    cats.forEach(catagory => {
        words[catagory] = new Promise<Array<string>>(async (resolve, reject) => {
            const [result, error] = await request(`catagory-words/${catagory}`)
            if(error)resolve([])
            resolve(result)
        })
    });
})