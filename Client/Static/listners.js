addEventListener("online", e => { HTML_Menu.classList.remove('Offline') })
addEventListener("offline", e => { HTML_Menu.classList.add('Offline') })

//Stops forms from refreshing
document.querySelectorAll('form').forEach(f => {
    f.addEventListener("submit", e => e.preventDefault())
})
 
//Custom Word form submit
HTML_Menu.querySelector('form[data-Game-Type="Custom"]').addEventListener("submit", e => {
     startGame(e.target.querySelector('input').value)
})
 
//Catagory Word form submit
HTML_Menu.querySelector('form[data-Game-Type="Catagory"]').addEventListener("submit", async e => {
    if(window.navigator.onLine == false)
        return console.error("Please connect to internet")
    const catagory = e.target.querySelector('select').value
    const response = await fetch(`/Words/${catagory}/Random`)
    startGame(await response.json())
})
HTML_Menu.querySelector('form[data-Game-Type="Random"]').addEventListener("submit", async e => {
    if(window.navigator.onLine == false)
        return console.error("Please connect to internet")
    const response = await fetch(`/Words/Random`)
    startGame(await response.json())
})

//Press Key on UI keyboard
HTML_Keyboard.addEventListener("click", e => {
    if(e.target.className != "Key")return
    useLetter(e.target.innerHTML.toLowerCase())
})

//Press Gess Word Button
Button_Gess_Word.addEventListener("click", (e) => {
    removeEventListener("keypress", physicalKeyClick)
    Swal.fire({
        title: "What's the word",
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Check',
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if(result.isDismissed)
            return addEventListener("keypress", physicalKeyClick)

        if(Current_Game.tryWord(result.value))
            sendEvent("Game Finished", {Won: true, Game: Current_Game})
        else{
            HTML_Status.setAttribute("data-Attemps-Left", Current_Game.remainingAttempts)
            HTML_Status.querySelector('img').src = `/Stages/${Math.abs(Current_Game.remainingAttempts - 10)}.png`
            Swal.fire({
                icon: 'error',
                title: 'You Gessed Wrong',
            })
        }
    });
     
})

//Press key on physical keyboard
const physicalKeyClick = (e) => {
    if(Current_Game == null)return
    if(RegExp(/[a-zA-Z]/).test(e.key) == false)return

    useLetter(e.key)
}
addEventListener("keypress", physicalKeyClick)

//On Guess
addEventListener("Letter Guess", e => {
    let key = document.querySelector(`.Game .Keyboard .Row .Key[data-Key="${e.detail.letter.toUpperCase()}"]`)
    key.classList.add((e.detail.correct)? 'Correct':'Wrong')
    if(e.detail.correct){
        for (let i=0; i<Current_Game.word.length; i++) {
            const letter = Current_Game.word[i];
            if(letter == e.detail.letter.toLowerCase()){
                HTML_Word.children[i].classList.add('Guessed')
                HTML_Word.children[i].textContent = letter
            }
        }
    }else{
        HTML_Status.setAttribute("data-Attemps-Left", Current_Game.remainingAttempts)
        HTML_Status.querySelector('img').src = `/Stages/${Math.abs(Current_Game.remainingAttempts - 10)}.png`
    }
})

//On Game Started
addEventListener("Game Started", e => {
    HTML_Word.innerHTML = Array.from(e.detail).map(char => {
        return (char == ' ')? `<span class="space">/</span>`:`<span>*</span>`
    }).join('')
    HTML_Game.classList.add("Active")
    HTML_Menu.classList.remove("Active")
})

//On Game Finished
addEventListener("Game Finished", e => {
    Current_Game = null
    HTML_Menu.classList.add("Active")
    HTML_Status.setAttribute("data-Attemps-Left", "10")
    HTML_Status.querySelector(img).src = "/Stages/0.png"

    setTimeout(function() {
        HTML_Game.classList.remove("Active")
        HTML_Keyboard.querySelectorAll('.Row .Key:is(.Wrong, .Correct)').forEach(e => e.classList.remove("Wrong", "Correct"))
    }, 500);

    if(e.detail.Won == null)return
    if(e.detail.Won){
        const errors = Math.abs(e.detail.Game.remainingAttempts - 10)
        Swal.fire({
            icon: 'success',
            title: '🎉 You Got It 🎉',
            text: `You guessed the word "${e.detail.Game.word}" with ${(errors > 0)? `only ${errors}`:'no'} wrong guesses`,
        })
    }else{
        Swal.fire({
            icon: 'error',
            title: "You'll get it next time",
            text: `The word was "${e.detail.Game.word}"`,
        })
    }
})