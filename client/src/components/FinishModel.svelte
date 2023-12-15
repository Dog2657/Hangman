<script>
    import { fade } from "svelte/transition";
    import { gameStatus } from "../lib/gameStatus";
    
    function calculateDuration(){
        let duration = $gameStatus.finished - $gameStatus.start
        let output = ""

        

        const minutes = Math.floor(duration/60000)
        if(minutes > 0){
            duration -= minutes * 60000
            output = minutes + "m"
        }

        const seconds = Math.floor(duration/1000)
        if(seconds > 0){
            duration -= seconds * 1000
            output += seconds + "s"
        }

        output = duration + "ms"

        return output
    }
</script>

<div class="finish-model" transition:fade={{duration: 200}}>
    <section> 
        <h1>
            {#if $gameStatus.validChars.size <= 0}
                You Win
            {:else}
                You Lose
            {/if}
        </h1>
        <section class="word">
            <div>Your Word</div>
            <div>{$gameStatus.word}</div>
            {#if $gameStatus.catagory}
                <div>{$gameStatus.catagory}</div>
            {/if}
        </section>

        <section>
            <span>Wrong attempts</span>
            <span>{10 - $gameStatus.remainingAttempts}</span>
        </section>

        <section>
            <span>Time</span>
            <span>{calculateDuration()}</span>
        </section>

        <button on:click={() => {gameStatus.end()}}>Continue</button>
        
    </section>
</div>


<style lang="scss">
    div.finish-model{
        position: absolute;
        left: 0;
        background-color: rgba(0, 0, 0, 0.3);
        top: 0;
        width: 100vw;
        overflow-y: scroll;
        display: grid;
        place-items: center;

        height: 100vh;

        & > section{
            $width: 500px;

            background-color: rgb(40, 40, 76);
            border: 2px solid white;
            box-sizing: border-box;
            text-align: center;
            max-width: 100vw;
            height: 300px;
            width: $width;

            @media (width > $width) {
                border-radius: 20px;
            }

            & > section.word{
                background-color: rgba(240, 248, 255, 0.7);
                padding: 10px;
                color: black;
                border-radius: 10px;
                min-height: 50px;
                margin: 10px;
            }

            & > button{
                background-color: rgb(168, 63, 63);
                outline: transparent;
                padding: 10px 20px;
                border-radius: 10px;
                cursor: pointer;
                font-size: 15px;
                border: none;
            }
        }
    }
</style>