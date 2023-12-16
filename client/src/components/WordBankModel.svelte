<script lang="ts">
    import Loader from "./Loader.svelte";
    import Icon from "./Icon.svelte";

    import { words } from "../lib/words"
    import { fade } from 'svelte/transition';
    import { onMount } from "svelte";
    import CatagoryLoader from "./CatagoryLoader.svelte";
    import { get } from "svelte/store";

    let display: boolean = false

    let selectedCatagory: string
    $: catagoryWords = new Promise<Set<String>>(async (resolve, reject) => {
        const instace = await $words
        const catagoryWords = await instace[selectedCatagory]
        resolve(catagoryWords || [])
    })



    onMount(async () => { selectedCatagory = Object.keys(await get(words))[0] });


    export function open(){
        display = true
    }

    async function addWord(e){
        /*const word = getEventTarget(e).querySelector("input")?.value.toLowerCase() || ""

        if((await words[selectedCatagory]).includes(word))
            return;

        addWordToCatagory(selectedCatagory, word)
        refreshWordBank()

        //@ts-ignore
        getEventTarget(e).querySelector("input").value = ""*/
    }

    async function removeWord(word: string){
        /*removeWordFromCatagory(selectedCatagory, word)
        refreshWordBank()*/
    }
</script>

{#if display}
    <div class="word-bank-model" in:fade={{duration: 200}} out:fade={{duration: 300}}>
        <article>
            <header>
                <button on:click={() => {display = false}}>
                    <Icon name="cross" width={20} height={20}/>
                </button>
                <h2>Words</h2>
            </header>
            <section class="catagory-selector">
                <CatagoryLoader let:categories>
                    <select bind:value={selectedCatagory}>
                        {#each categories as catagory}
                            <option>{catagory}</option>
                        {/each}
                    </select>
                    {#each categories as catagory}
                        <button class:selected={catagory === selectedCatagory}>{catagory}</button>
                    {/each}
                </CatagoryLoader>
            </section>

            <form class="entry-inputer" on:submit|preventDefault={addWord}>
                <input type="text" required placeholder="">
                <div>E.g. Animals or planets</div>
                <button type="submit">
                    <Icon name="enter" width={15} height={15}/>
                </button>
            </form>

            <section class="words">
                {#await catagoryWords}
                    <Loader/>
                {:then words} 
                    <table>
                        {#each words as word}
                            <tr>
                                <td>
                                    <button on:click={() => {removeWord(word)}}>
                                        <Icon name="cross" width={10} height={10}/>
                                    </button>
                                </td>
                                <td>{word}</td>
                            </tr>
                        {/each}
                    </table>
                {/await}
            </section>
        </article>
    </div>
{/if}

<style lang="scss">
    @import '../assets/veriables.scss';

    div.word-bank-model{
        $mobile-size: 500px;
        @include CustomModel($mobile-size);
    
        & > article{
            max-height: 100vh;
            overflow-y: scroll;

            @media (width > $mobile-size) {
                display: grid; 
                grid-auto-columns: 1fr; 
                grid-auto-rows: 1fr; 
                grid-template-columns: 0.5fr 1.5fr; 
                grid-template-rows: max-content 0.2fr 1.8fr; 
                gap: 0px 10px; 
                grid-template-areas: 
                    "Header Header"
                    "Catagorys New-enterys"
                    "Catagorys Words"; 
            }

            @media (width <= $mobile-size) {
                display: flex;
                flex-direction: column;
            }

            & > header{
                grid-area: Header;
                display: grid; 
                grid-auto-columns: 1fr; 
                grid-auto-rows: 1fr; 
                grid-template-columns: 35px 1fr 35px; 
                grid-template-rows: 1fr; 
                gap: 0px 10px; 
                grid-template-areas: 
                    "Button Title ."; 
                margin-bottom: 10px;

                & > button{
                    grid-area: Button;
                    transition: all 200ms ease;
                    color: white;
                    border: none;
                    outline: 1px solid white;
                    border-radius: 10px;
                    cursor: pointer;

                    &:hover, &:active{
                        opacity: .7;
                        color: red;
                        outline-color: red;
                    }
                }

                & > h2{
                    text-align: center;
                    grid-area: Title;
                    margin: 0;
                }
            }
        
            & > section.catagory-selector{
                grid-area: Catagorys;

                @media (width > $mobile-size) {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    overflow-y: scroll;
                    border-right: 1px solid white;
                    padding-right: 10px;
                }
                

                &:has(.loader){
                    display: grid;
                    align-items: center;
                    justify-content: center;
                    place-items: center;
                }

                & > button{
                    @media (width <= $mobile-size) { display: none; }

                    &:not(.selected){
                        font-weight: lighter;
                        color: white
                    }
                    &:not(:is(:hover, :active )){ color: white; }
                    &:not(.selected):is(:hover, :active){
                        transition: color 200ms ease-in;
                        color: orangered;
                    }

                    transition: color 400ms ease-out;
                    outline: transparent;
                    width: max-content;
                    background: none;
                    text-align: left;
                    cursor: pointer;
                    max-width: 100%;
                    cursor: pointer;
                    border: none;
                }

                & > select{
                    @media (width > $mobile-size) { display: none; }
                    &:not(:is(:hover, :active)){ outline-color: white; }
                    &:is(:hover, :active){
                        transition: outline 200ms ease-in;
                        outline-color: orangered;
                    }

                    transition: outline 400ms ease-out;
                    outline-style: solid;
                    border-radius: 10px;
                    margin-bottom: 20px;
                    outline-width: 1px;
                    background: none;
                    border: none;
                    height: 40px;
                    width: 100%;
                }
            }

            & > form.entry-inputer {
                $padding: 15px;
                
                background-color: rgb(57, 92, 98);
                grid-area: New-enterys;
                position: relative;
                border-radius: 5px;
                padding: $padding;
                display: flex;
                margin-bottom: 20px;

                & > input:is(:focus, :focus-within, :not(:placeholder-shown)) + div{
                    transition: all 150ms ease-in;
                    font-size: 13px;
                    bottom: 70%;
                }                

                &::after{
                    width: calc(100% - ($padding * 2));
                    border-top: 1px solid white;
                    position: absolute;
                    bottom: $padding;
                    left: $padding;
                    display: block;
                    content: "";
                }

                & > input{
                    outline: transparent;
                    background: none;
                    border: none;
                    flex-grow: 1;
                }

                & > div{
                    bottom: calc($padding + 2px );
                    transition: all 300ms ease-out;
                    position: absolute;
                    pointer-events: none;
                    font-size: 17px;
                }

                & > button{
                    background: none;
                    outline: transparent;
                    border: none;
                    cursor: pointer;
                }
            }

            & > section.words {
                grid-area: Words;
                flex-grow: 1;
                overflow-y: scroll;
                min-height: 100px;
                max-height: 100%;

                &:has(.loader){
                    display: grid;
                    place-items: center;
                }

                & > table{
                    table-layout:fixed;
                    width:100%;

                    & > tr{
                        &:hover > td:nth-child(1) > button{ color: red }

                        & > td:nth-child(1){
                            width: max-content;
                            padding-right: 2.5px;
                            & > button{
                                cursor: pointer;
                                background: none;
                                color: rgb(183, 34, 34);
                                outline: transparent;
                                border: none;

                                &:active, &:hover{
                                    color: red
                                }
                            }
                        }

                        & > td:nth-child(2){
                            word-break: break-all;
                            padding-left: 2.5px;
                        }
                    }
                }
            }
        }
    }
</style>