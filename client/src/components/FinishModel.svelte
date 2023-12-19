<script lang="ts">
    import { fade } from "svelte/transition";
    import { currentGame } from "../lib/gameStatus";
    import { isCustomCatagory } from "../lib/words";
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    import { toTitleCase } from "../lib/general";

    let customCatagory = false

    onMount(async() => {
        const instance = get(currentGame)
        //@ts-ignore
        customCatagory = (await isCustomCatagory(instance?.catagory))
    })
    
    function calculateDuration(){
        //@ts-ignore
        const duration = $currentGame.finished - $currentGame.start

        let seconds = Math.floor(duration/1000)
        let output = ""
        
        const hours = Math.floor(seconds/3600)
        if(hours > 0){
            seconds -= hours * 3600
            output = `${hours}h `
        }
        

        const minutes = Math.floor(seconds/60)
        if(minutes > 0){
            seconds -= minutes * 60
            output += `${minutes}m `
        }

        output += `${seconds}s`

        return output
    }
</script>

{#if $currentGame && $currentGame.finished}
    <div class="finish-model" in:fade={{duration: 400}} out:fade={{duration: 250}}>
        <section> 
            <h1>
                {#if $currentGame?.validChars.size <= 0}
                    You Win
                {:else}
                    You Lose
                {/if}
            </h1>
            <section class="word">
                <div>Your Word</div>
                <div>{$currentGame?.word}</div>
                {#if $currentGame?.catagory}
                    <div>
                        {toTitleCase($currentGame?.catagory)}
                        {#if customCatagory}
                            (<i>Custom</i>)
                        {/if}
                    </div>
                {/if}
            </section>

            <section class="details">
                <div>Time</div>
                <div>{calculateDuration()}</div>
                {#if $currentGame.validChars.size <= 0}
                    <div>Wrong gesses</div>
                    <div>{10 - $currentGame.remainingAttempts}</div>
                {/if}
            </section>

            <button on:click={() => {currentGame.set(undefined)}}>Continue</button>
        </section>
    </div>
{/if}

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

            & > h1{
                margin: 0;
            }

            & > section.word{
                background-color: rgba(148, 187, 221, 0.7);
                border-radius: 10px;
                min-height: 50px;
                padding: 10px;
                color: black;
                margin: 10px;

                & > *:nth-child(1){
                    font-size: 20px;
                }
                & > *:nth-child(2){
                    font-size: 30px;
                    text-transform: capitalize;
                    font-weight: bold;
                    margin: 0;

                    &::before, &::after{
                        content: '"';
                        font-weight: normal;
                    }
                }
                & > *:nth-child(3){
                    font-style: italic;
                    line-height: 10px;
                }
            }

           
            & > section.details{
                display: grid; 
                grid-auto-columns: 1fr; 
                grid-auto-rows: 1fr; 
                grid-template-columns: 1fr 1fr; 
                grid-template-rows: 1fr 1fr; 
                align-items: center;
                justify-content: center;
                gap: 0px 10px; 
                grid-template-areas: 
                    "Time TimeValue"
                    "Attemps AttempsValue"; 

                & > div:is(:nth-child(1), :nth-child(3)){
                    text-align: right;
                }
                & > div:is(:nth-child(2), :nth-child(4)){
                    text-align: left;
                }

                & > div:nth-child(1){ grid-area: Time; }
                & > div:nth-child(2){ grid-area: TimeValue; }
                & > div:nth-child(3){ grid-area: Attemps; }
                & > div:nth-child(4){ grid-area: AttempsValue; }
            }


            & > button{
                margin-top: 20px;
                background-color: rgb(168, 63, 63);
                outline: transparent;
                padding: 10px 20px;
                border-radius: 10px;
                cursor: pointer;
                width: 80%;
                font-size: 15px;
                border: none;
            }
        }
    }
</style>