const QL = (selector) => {return document.querySelector(selector)}
const sendEvent = (Name, detail) => {dispatchEvent(new CustomEvent(Name, {detail}))}

const HTML_Game = QL('.Game')
const HTML_Menu = QL('.Menu')
const Button_Exit = QL('.Game button.EndGame')
const HTML_Status = QL('.Game .Status')
const HTML_Word = QL('.Game .Word')
const HTML_Keyboard = QL('.Game .Keyboard')
const Button_Gess_Word = HTML_Keyboard.querySelector('.Gess_Word_BNT_Containor > button')

class Game{
    remainingAttempts = 10;
    wrongChars = new Set()
    missingChars = new Set()
    word = ''

    constructor(Word){
        Word = Word.toLowerCase()
        this.word = Word
        Array.from(Word).forEach(letter => { 
            if(RegExp(/[a-z]/).test(letter))
                this.missingChars.add(letter)
        });
        sendEvent("Game Started", Word)
    }

    tryWord(Word){
        let c = this.word == Word.toLowerCase()
        if(c === false)
            this.remainingAttempts--
        return c
    }

    tryLetter(Letter){
        if(this.wrongChars.has(Letter))
            return

        if(this.word.indexOf(Letter) != -1){
            if(this.missingChars.has(Letter) == false)
                return true
            this.missingChars.delete(Letter);
            if(this.missingChars.size == 0){
                sendEvent("Game Finished", {Won: true, Game: Current_Game})
                return "Game Finished"
            }
            return true
        }else{
            this.remainingAttempts--
            if(this.remainingAttempts < 1){
                sendEvent("Game Finished", {Won: false, Game: Current_Game})
                return "Game Finished"
            }
            this.wrongChars.add(Letter)
            return false
        }
    }
}

//Load all catagorys
fetch('/Words/Catagorys')
.then(function(response) { return response.json(); })
.then(function(json) {
    HTML_Menu.querySelector('form[data-Game-Type="Catagory"] select').innerHTML +=
    json.map(data => {return `<option value="${data}">${data}</option>`})
});



let Current_Game = null;


function startGame(Word){
    Current_Game = new Game(Word)
}

function useLetter(Letter){
    let status = Current_Game.tryLetter(Letter)
    if(status != "Game Finished")
        sendEvent("Letter Guess", {correct: status, letter: Letter})
}