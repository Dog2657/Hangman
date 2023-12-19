<script lang="ts">
    import { currentGame, testCharacter } from '../lib/gameStatus'
    import WordAttempt from './WordAttempt.svelte';

    let wordGuessModelOpen = false

    function handleKeyPress(e){
        if($currentGame == undefined || wordGuessModelOpen)
            return

        
        var keyCode = e.keyCode || e.which
        if(keyCode < 65 || keyCode > 90)
            return
    
        testCharacter(String.fromCharCode(keyCode))
    }
</script>


<svelte:window on:keydown={handleKeyPress}/>


<button on:click={() => {wordGuessModelOpen = true}} class="word-guess">Guess Word</button>

<article class="keyboard">
    {#each ["qwertyuiop", "asdfghjkl", "zxcvbnm"] as keyRow}
        <div>
            {#each keyRow.split('') as character}
                <button
                class:valid={$currentGame?.word.includes(character) && !$currentGame?.validChars.has(character)}
                class:wrong={$currentGame?.wrongChars.has(character)}
                on:click={() => {testCharacter(character)}}>
                    {character.toUpperCase()}
                </button>
            {/each}
        </div>
    {/each}
</article>


<WordAttempt bind:display={wordGuessModelOpen}/>


<style lang="scss">
    @import '../assets/veriables.scss';

    button.word-guess{
        @include FancyButton(rgb(63, 105, 126));
        margin: auto auto 0 auto;
    }


    article{
        margin: 0 auto 0 auto;
        height: max-content;
        max-width: 100vw;
        font-size: large;
        width: 750px;

        @media (width <= 312px) {
            background-color: #2e2b2b;
        }

        & > div{
            justify-content: center;
            align-items: center;
            overflow-x: scroll;
            display: flex;


            & > button{
                &.valid{background-color: rgb(0, 255, 0, .75)}
                &.wrong{background-color: rgb(255, 0, 0, .75)}
                @media (width > 312px) {
                    &.valid, &.wrong{translate: 0 4px}
                }
    
                &:not( :is( .valid, .wrong ) ){
                    @media (width > 312px) {
                        box-shadow: 0 0.2em 0 0.05em #dcdcdc;
                        border-bottom-color: #555;
                    }
                    cursor: pointer;

                    &:hover{
                        opacity: .7;
                    }
                } 
    
                transition: 
                    border-bottom-color 200ms ease-in-out,
                    background-color 200ms ease-in-out,
                    box-shadow 200ms ease-in-out;

                border: 1px solid #444;
                justify-content: center;
                box-sizing: border-box;
                width: calc(100vw / 10);
                border-radius: 0.3em;
                align-items: center;
                position: relative;
                background: #333;
                text-align: center;
                max-width: 70px;
                display: flex;
                color: #eee;
                height: 70px; 

                @media (width > 312px) {
                    padding: 5px;
                    margin: 5px;
                }
            }
        }
    }
</style>