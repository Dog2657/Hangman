import { writable, type Subscriber, type Invalidator, type Unsubscriber } from "svelte/store";

class Game{
    remainingAttempts = 10;
    wrongChars = new Set()
    validChars: Set<Array<string>> = new Set()
    catagory: string | undefined
    word: string
    finished: Date | undefined
    start: Date

    constructor(word: string, catagory = undefined){
        this.word = word.toLowerCase()
        this.start = new Date
        this.catagory = catagory

        console.log(catagory)

        Array.from(word).forEach(letter => { 
            if(RegExp(/[a-z]/).test(letter) && !this.validChars.has(letter))
                this.validChars.add(letter)
        });
    }
}

function getStoreValue(subscribe: (this: void, run: Subscriber<unknown>, invalidate?: Invalidator<unknown> | undefined) => Unsubscriber): Promise<Game>{
    //@ts-ignore
    return new Promise<void>((resolve, reject) => {
        //@ts-ignore
        subscribe(value => { resolve(value) })
    })
}


function createGameStatus() {
	const { subscribe, set, update } = writable()

	return {
		subscribe,
		start: (word: string, catagory = undefined) => update(() => {return new Game(word, catagory)}),
        end: () => update(() => undefined),
        testCharacter: async (character: string) => {
            const value = await getStoreValue(subscribe)
            character = character.toLowerCase()

            //@ts-ignore
            if((value.word.includes(character) && !value.validChars.has(character)) || value.wrongChars.has(character))
                return

            if(value.validChars.has(character)){
                value.validChars.delete(character)
                if(value.validChars.size <= 0)
                    value.finished = new Date
            }else{
                value.remainingAttempts--
                value.wrongChars.add(character.toLowerCase())
                if(value.remainingAttempts <= 0)
                    value.finished = new Date
            }
            set(value)
        }
	};
}

export const gameStatus = createGameStatus()
