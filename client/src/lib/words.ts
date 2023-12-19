import { getLocalStorageJSON, saveLocalStorageJSON } from "./general";
import { request } from "./apiRequester"
import { get, writable } from 'svelte/store';

export const globalWords = new Promise<Array<string>>(async(resolve, reject) => {
    const [result, error] = await request("word-catagorys")
    if(error)
        return reject(error)
    resolve(result)
}) 

export async function isCustomCatagory(catagory: string){
    const catagorys = await globalWords
    return !catagorys.includes(catagory)
}



function getWordAlterations(): {additive: Record<string, Array<string>>, subtractive: Record<string, Array<string>>}{
    const additive = getLocalStorageJSON("additiveWords") || {}
    const subtractive = getLocalStorageJSON("subtractiveWords") || {}
    
    return {
        additive: additive,
        subtractive: subtractive
    }
}



async function getCatagoryWords(name: string, additive: Array<string> = [], subtractive: Array<string> = []){
    let globalResults = []
    
    if((await globalWords).includes(name)){
        let [result, error] = await request(`catagory-words/${name}`)
        if(result != undefined)
            globalResults = result
    }
    
    const words = [...globalResults, ...additive]

    if(typeof subtractive == "boolean")
        return []

    subtractive.forEach(word => { words.splice(words.indexOf(word), 1) })

    return words
}   


export const words = writable(new Promise<Record<string, Promise<Array<String>>>>(async (resolve, reject) => {
    const result = await globalWords
    const data: Record<string, Promise<Array<string>>> = {}

    const {additive, subtractive } = getWordAlterations();



    [...result, ...Object.keys(additive)].forEach((name: string) => {
        if(subtractive[name] == undefined || typeof subtractive[name] !== "boolean")
            data[name] = getCatagoryWords(name, additive[name], subtractive[name])
    });

    resolve(data)
}));


export async function addWord(catagory: string, word: string){
    const {additive, subtractive } = getWordAlterations()
    const instance = await get(words);
    const catagoryInstance = await instance[catagory]

    catagoryInstance.unshift(word)
    
    instance[catagory] = Promise.resolve(catagoryInstance)
    words.set(Promise.resolve(instance))


    if(subtractive[catagory] != undefined && subtractive[catagory].includes(word)){
        subtractive[catagory].splice(subtractive[catagory].indexOf(word), 1)
        if(subtractive[catagory].length <= 0)
            delete subtractive[catagory]

        saveLocalStorageJSON("subtractiveWords", subtractive)
        return
    }

    if(additive[catagory] == undefined)
        additive[catagory] = []

    additive[catagory].unshift(word)
    saveLocalStorageJSON("additiveWords", additive)
}


export async function deleteWord(catagory: string, word: string) {
    const { additive, subtractive } = getWordAlterations()
    const instance = await get(words);
    const catagoryInstance = await instance[catagory]

    catagoryInstance.splice(catagoryInstance.indexOf(word), 1)
    
    instance[catagory] = Promise.resolve(catagoryInstance)
    words.set(Promise.resolve(instance))


    if(additive[catagory] != undefined && additive[catagory].includes(word)){
        additive[catagory].splice(additive[catagory].indexOf(word), 1)
        if(additive[catagory].length <= 0)
            delete additive[catagory]

        
        saveLocalStorageJSON("additiveWords", additive)
        return
    }

    if(subtractive[catagory] == undefined)
        subtractive[catagory] = []

    subtractive[catagory].unshift(word)
    saveLocalStorageJSON("subtractiveWords", subtractive)
}

export async function addCatagory(name: string){
    const instance = await get(words);

    const {additive, subtractive } = getWordAlterations()

    if(subtractive[name] !== undefined){
        delete subtractive[name]
        saveLocalStorageJSON("subtractiveWords", subtractive)
    }else{
        additive[name] = []
        saveLocalStorageJSON("additiveWords", additive)
    }

    instance[name] = getCatagoryWords(name, additive[name], subtractive[name])
    words.set(Promise.resolve(instance))
}

export async function deleteCatagory(name: string){
    const instance = await get(words);

    delete instance[name]
    words.set(Promise.resolve(instance))

    const {additive, subtractive } = getWordAlterations()
   
    if(additive[name] !== undefined){
        delete additive[name]
        saveLocalStorageJSON("additiveWords", additive)
    }else{
        //@ts-ignore
        subtractive[name] = true
        saveLocalStorageJSON("subtractiveWords", subtractive)
    }
}