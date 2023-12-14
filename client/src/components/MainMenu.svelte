<script>
    import Loader from "./Loader.svelte";

    import { getEventTarget, generateNumberFromRange } from "../lib/general";
    import { catagorys, words } from "../lib/words"
    
    async function playCustomWord(e){
        const value = getEventTarget(e).querySelector("input")?.value || ""
    }

    async function playCatagoryWord(e){
        const value = getEventTarget(e).querySelector("select")?.value || ""
        const catWords = await words[value]
        const index = generateNumberFromRange(catWords.length -1)

        console.log(catWords[index])
    }

    async function playRandomWord(){
        const cats = await catagorys
        const catIndex = generateNumberFromRange(cats.length -1)
        const cat = cats[catIndex]

        const catWords = await words[cat]
        const wordsIndex = generateNumberFromRange(catWords.length -1)

        console.log(catWords[wordsIndex])
    }
</script>
<main>
    <section>
        <h1>HangMan</h1>
        <div>
            <form on:submit|preventDefault={playCustomWord}>
                <input type="text" placeholder="Custom Word" pattern="[a-zA-Z ]+" required>
                <button>Play</button>
            </form>
            <form on:submit|preventDefault={playCatagoryWord}>
                {#await catagorys}
                    <div>
                        <Loader/>
                    </div>
                {:then data}
                    <select>
                        {#each data as catagory}
                            <option>{catagory}</option>
                        {/each}
                    </select>
                    <button>Play</button>
                {/await}
            </form>
            <form on:submit|preventDefault={playRandomWord}>
                <div>Random</div>
                <button>Play</button>
            </form>
            <div class="devider"></div>
            <button class="word-bank">Word Bank</button>
        </div>
    </section>
    <a class="credit" target="_blank" href="https://github.com/Dog2657/Hangman">Made by Dog2657</a>
</main>

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
                    &:not(:is(:focus-within, :focus)){ background-color: rgba(var(--Colour), .2); }
                    &:is(:focus-within, :focus){ background-color: rgba(var(--Colour), .4); }

                    &:nth-of-type(1){--Colour: 0, 128, 0;}
                    &:nth-of-type(2){--Colour: 255, 255, 0;}
                    &:nth-of-type(3){--Colour: 255, 45, 45;}

                    transition: opacity 200ms ease-in-out,
                        background-color 500ms ease-in-out;
                    border-radius: 0.25em;
                    position: relative;
                    align-items: center;
                    font-size: 15px;
                    display: flex;
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
                        @include FancyButton(var(--Colour))
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