import { getLocalStorageJSON, saveLocalStorageJSON } from "./general";
import { request } from "./apiRequester"
import { get, writable } from 'svelte/store';

function parseAlteration(data: Record<string, Array<string> | boolean>){
    const output: Record<string, Set<string> | boolean> = {}
    Object.keys(data).forEach(key => {

        if(typeof data[key] == 'boolean')
            output[key] = true
        else
            output[key] = new Set(data[key])
    });
    return output
}

function dumpAlteration(data: Record<string, Set<string>>){
    const output: Record<string, Array<string>> = {}
    Object.keys(data).forEach(key => {
        output[key] = Array.from(data[key])
    });
    return output
}


function getWordAlterations(): {additive: Record<string, Set<string>>, subtractive: Record<string, Set<string>>}{
    const additive = getLocalStorageJSON("additiveWords") || {}
    const subtractive = getLocalStorageJSON("subtractiveWords") || {}
    
    return {
        additive: parseAlteration(additive),
        subtractive: parseAlteration(subtractive)
    }
}



async function getCatagoryWords(name: string, additive: Set<string> = new Set, subtractive: Set<string> = new Set){
    let [result, error] = await request(`catagory-words/${name}`)
    if(result == undefined)
        return additive

    const words = new Set([...result, ...additive])

    if(typeof subtractive == "boolean")
        return new Set()

    subtractive.forEach(word => { words.delete(word) })

    return words
}   


export const words = writable(new Promise<Record<string, Promise<Set<String>>>>(async (resolve, reject) => {
    const [result, error] = await request("word-catagorys")
    const data: Record<string, Promise<Set<string>>> = {}

    const {additive, subtractive } = getWordAlterations();

    [...result, ...Object.keys(additive)].forEach((name: string) => {
        const details = getCatagoryWords(name, additive[name], subtractive[name])
        console.log(name, details)
        data[name] = details
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


    if(subtractive[catagory] != undefined && subtractive[catagory].has(word)){
        subtractive[catagory].delete(word)
        if(subtractive[catagory].size <= 0)
            delete subtractive[catagory]

        saveLocalStorageJSON("subtractiveWords", dumpAlteration(subtractive))
        return
    }

    if(additive[catagory] == undefined)
        additive[catagory] = new Set()

    additive[catagory].add(word)
    saveLocalStorageJSON("additiveWords", dumpAlteration(additive))
}


export async function deleteWord(catagory: string, word: string) {
    const {additive, subtractive } = getWordAlterations()
    const instance = await get(words);
    const catagoryInstance = await instance[catagory]

    catagoryInstance.delete(word)
    
    instance[catagory] = Promise.resolve(catagoryInstance)
    words.set(Promise.resolve(instance))


    if(additive[catagory] != undefined && additive[catagory].has(word)){
        additive[catagory].delete(word)
        if(additive[catagory].size <= 0)
            delete additive[catagory]

        
        saveLocalStorageJSON("additiveWords", dumpAlteration(additive))
        return
    }

    if(subtractive[catagory] == undefined)
        subtractive[catagory] = new Set()

    subtractive[catagory].add(word)
    saveLocalStorageJSON("subtractiveWords", dumpAlteration(subtractive))
}