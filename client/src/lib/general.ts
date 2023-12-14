//@ts-ignore
export function getEventTarget(e): HTMLElement{
    return e.target || e.srcElement || e.originalTarget
}

export function generateNumberFromRange(max: number){
    return Math.round(Math.random() * max)
}