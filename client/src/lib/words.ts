import { getLocalStorageJSON, saveLocalStorageJSON } from "./general";
import { request } from "./apiRequester"
import { get, writable } from 'svelte/store';

function getWordAlterations(): {additive: Record<string, Set<string>>, subtractive: Record<string, Set<string>>}{
    function convertToSet(data: Record<string, Array<string>>){
        const output: Record<string, Set<string>> = {}
        Object.keys(data).forEach(key => {
            output[key] = new Set(data[key])
        });
        return output
    }

    const additive = getLocalStorageJSON("additiveWords") || {}
    const subtractive = getLocalStorageJSON("subtractiveWords") || {}
    
    return {
        additive: convertToSet(additive),
        subtractive: convertToSet(subtractive)
    }
}

async function getCatagoryWords(name: string, additive: Set<string> = new Set, subtractive: Set<string> = new Set){
    let [result, error] = await request(`catagory-words/${name}`)
    if(result == undefined)
        return additive

    const words = new Set([...result, ...additive])
    subtractive.forEach(word => { words.delete(word) })

    return words
}   


export const words = writable(new Promise<Record<string, Promise<Set<String>>>>(async (resolve, reject) => {
    const [result, error] = await request("word-catagorys")
    const data: Record<string, Promise<Set<string>>> = {}

    const {additive, subtractive } = getWordAlterations()

    result.forEach((name: string) => {
        data[name] = getCatagoryWords(name, additive[name], subtractive[name])
    });

    resolve(data)
}));


export async function addWord(catagory: string, word: string){
    const {additive, subtractive } = getWordAlterations()
    const instance = await get(words);
    const catagoryInstance = await instance[catagory]

    catagoryInstance.add(word)
    
    instance[catagory] = Promise.resolve(catagoryInstance)
    words.set(Promise.resolve(instance))



}


setTimeout(async () => {
    addWord("Computing", /*"Personal Computer"*/ "word")
    //const instance = await get(words);
    //(await instance["Computing"]).push("dog")
    //
    //words.set(instance)
    //console.log(instance)
    console.log("Added Word")
}, 5000)