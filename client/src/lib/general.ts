export function toTitleCase(string: String | string){
    return string.split(' ').map(word => {
        return word[0].toUpperCase() + word.substring(1, word.length)
    }).join(' ')
}

//@ts-ignore
export function getEventTarget(e): HTMLElement{
    return e.target || e.srcElement || e.originalTarget
}

export function generateNumberFromRange(max: number){
    return Math.round(Math.random() * max)
}

export function getLocalStorageJSON(key: string){
    const result = localStorage.getItem(key)
    if(result == undefined)
        return null

    try {
        return JSON.parse(result)
    } catch (error) {
        console.warn(error)
        return null
    }
}

export function saveLocalStorageJSON(key: string, data: object){
    localStorage.setItem(key, JSON.stringify(data))
}