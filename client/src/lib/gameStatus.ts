import type { Writable } from "svelte/store";
import { get, writable } from "svelte/store";

export class Game{
    remainingAttempts = 10;
    wrongChars = new Set()
    validChars: Set<Array<string>> = new Set()
    catagory: string | undefined
    word: string
    finished: Date | undefined
    start: Date

    constructor(word: string, catagory: string = ""){
        this.word = word.toLowerCase()
        this.start = new Date
        this.catagory = catagory

        Array.from(word).forEach(letter => { 
            letter = letter.toLowerCase()
            if(RegExp(/[a-z]/).test(letter) && !this.validChars.has(letter))
                this.validChars.add(letter)
        });
    }
}


export const currentGame: Writable<Game | undefined> = writable()

export function startGame(word: string, catagory: string = "", customCatagory: boolean = false){
    currentGame.set(new Game(word, catagory))
}

export function endGame(){
    currentGame.set(undefined)
}

export function testCharacter(key: string){
    const game = get(currentGame)
    key = key.toLowerCase()

    if(game == undefined)
        return

    if((game.word.includes(key) && !game.validChars.has(key)) || game.wrongChars.has(key))
        return

    if(game.validChars.has(key)){
        game.validChars.delete(key)
        if(game.validChars.size <= 0)
            game.finished = new Date
    }else{
        game.remainingAttempts--
        game.wrongChars.add(key)
        if(game.remainingAttempts <= 0)
            game.finished = new Date
    }
    currentGame.set(game)
}