<script lang="ts">
    import WordBankModel from "./WordBankModel.svelte";
    import CatagoryLoader from "./CatagoryLoader.svelte";

    import { getEventTarget } from "../lib/general";
    import { gameStatus } from '../lib/gameStatus'
    import { fade } from 'svelte/transition';

    let openWordBankModel: () => void
    
    //@ts-ignore
    async function playCustomWord(e){
        const value = getEventTarget(e).querySelector("input")?.value || ""
        gameStatus.start(value)
    }

    //@ts-ignore
    async function playCatagoryWord(e){
        /*const value = getEventTarget(e).querySelector("select")?.value || ""
        const catWords = await words[value]
        const index = generateNumberFromRange(catWords.length -1)

        gameStatus.start(catWords[index], value)*/
    }

    async function playRandomWord(){
        /*const cats = await catagorys
        const catIndex = generateNumberFromRange(cats.length -1)
        const cat = cats[catIndex]

        const catWords = await words[cat]
        const wordsIndex = generateNumberFromRange(catWords.length -1)

        gameStatus.start(catWords[wordsIndex], cat)*/
    }
</script>

<main transition:fade={($gameStatus?.finished)? {duration: 500, delay: 200} : {duration: 200}}>
    <section>
        <h1>HangMan</h1>
        <div>
            <form on:submit|preventDefault={playCustomWord}>
                <input type="text" placeholder="Custom Word" pattern="[a-zA-Z ]+" required>
                <button>Play</button>
            </form>
            <form on:submit|preventDefault={playCatagoryWord}>
                <CatagoryLoader validate={true} let:categories>
                    <select>
                        {#each categories as catagory}
                            <option>{catagory}</option>
                        {/each}
                    </select>
                    <button>Play</button>
                </CatagoryLoader>
            </form>
            <form on:submit|preventDefault={playRandomWord}>
                <CatagoryLoader validate={true}>
                    <div>Random</div>
                    <button>Play</button>
                </CatagoryLoader>
            </form>
            <div class="devider"></div>
            <button on:click={openWordBankModel} class="word-bank">Word Bank</button>
        </div>
    </section>
    <a class="credit" target="_blank" href="https://github.com/Dog2657/Hangman">Made by Dog2657</a>
</main>

<WordBankModel bind:open={openWordBankModel}/>

<style lang="scss">
    @import '../assets/veriables.scss';

    main{
        flex-direction: column;
        height: 100vh;
        display: flex;

        & > section{
            flex-direction: column;
            justify-content: center;
            align-items: center;
            display: flex;
            flex-grow: 1;

            & > h1{
                -webkit-text-stroke: 2px white;
                text-align: center;
                color: transparent;
                font-weight: 500;
                font-size: 4rem;
                margin: 0;
                font-family: serif;
            }
            & > div{
                flex-direction: column;
                justify-content: center;
                align-items: center;
                display: flex;
                gap: 10px;

                & > form{
                    &:not(:is(:focus-within, :focus)){ background-color: color-mix(in srgb, var(--Colour), transparent 80%); }
                    &:is(:focus-within, :focus){ background-color: color-mix(in srgb, var(--Colour), transparent 60%); }

                    &:nth-of-type(1){--Colour: rgb(0, 128, 0);}
                    &:nth-of-type(2){--Colour: rgb(255, 255, 0);}
                    &:nth-of-type(3){--Colour: rgb(255, 45, 45);}

                    transition: opacity 200ms ease-in-out,
                        background-color 500ms ease-in-out;
                        justify-content: center;
                    border-radius: 0.25em;
                    align-items: center;
                    position: relative;
                    font-size: 15px;
                    display: flex;
                    height: 41px;
                    width: 300px;
                    opacity: 1;

                    & > input, select, div{
                        flex-grow: 1;
                        background: none;
                        border: none;
                        display: grid;
                        place-items: center;
                        text-align: center;
                        outline: transparent;
                        color: white;
                    }

                    & > button{
                        @include FancyButton(var(--Colour));
                        font-size: 1.5rem;
                    }
                }

                & > .devider{
                    border-top: 1px solid white;
                    margin: 10px 0;
                    display: block;
                    width: 100%;
                }

                & > button.word-bank{
                    transition: 400ms background-color ease-out;
                    background-color: rgb(61, 61, 89);
                    outline: transparent;
                    border-radius:7px;
                    cursor: pointer;
                    border: none;
                    height: 40px;
                    width: 100%;

                    &:hover{
                        transition: 200ms background-color ease-in;
                        background-color: rgb(98, 110, 120);
                    }
                }
            }        
        }

        & > a.credit{
            align-self: flex-end;
            text-align: center;
            margin-top: 10px;
            padding: 10px 0;
            color: grey;
            opacity: 0.5;
            width: 100%;
        }
    }
</style>