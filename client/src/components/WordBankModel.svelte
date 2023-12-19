<script lang="ts">
    import CatagoryLoader from "./CatagoryLoader.svelte";
    import EntryInput from "./EntryInput.svelte";
    import Loader from "./Loader.svelte";
    import Icon from "./Icon.svelte";

    import { words, addWord, deleteWord, addCatagory, deleteCatagory } from "../lib/words"
    import { fade } from 'svelte/transition';
    import { get } from "svelte/store";
    import { onMount } from "svelte";
    import { toTitleCase } from "../lib/general";

    let display: number = -1

    let selectedCatagory: string
    $: catagoryWords = new Promise<Array<String>>(async (resolve, reject) => {
        const instace = await $words
        const catagoryWords = await instace[selectedCatagory]
        resolve(catagoryWords || [])
    })

    onMount(async () => { selectedCatagory = Object.keys(await get(words))[0] });

    export function open(){
        display = 0
    }

    async function handelWordAdd(value: string, success: () => void, error: () => void){
        const word = value.toLowerCase()

        if((await catagoryWords).includes(word))
            return error()

        addWord(selectedCatagory, word)
        success()
    }

    async function handelNewCatagory(value: string, success: () => void, error: () => void) {
        const catagories = await get(words) 
        if(catagories[value] !== undefined)
            return error()

        addCatagory(value.toLowerCase())
        success()
    }

    function confirmDeletion(name: string){
        if(!confirm(`Are you sure you want to delete "${ toTitleCase(name) }"`))
            return

        deleteCatagory(name)
    }
</script>

{#if display >= 0}
    <div class="word-bank-model" in:fade={{duration: 200}} out:fade={{duration: 300}}>
        <section class:words={display == 0} class:catagory={display == 1}>
            {#if display === 0}
                <header>
                    <button on:click={() => {display = -1}}>
                        <Icon name="cross" width={20} height={20}/>
                    </button>
                    <h2>Words</h2>
                </header>
                <section class="catagory-selector">
                    <CatagoryLoader let:categories>
                        <select bind:value={selectedCatagory}>
                            {#each categories as catagory}
                                <option>{toTitleCase(catagory)}</option>
                            {/each}
                        </select>
                        {#each categories as catagory}
                            <button class:selected={catagory === selectedCatagory} on:click={() => { selectedCatagory = catagory }}>{toTitleCase(catagory)}</button>
                        {/each}
                    </CatagoryLoader>
                    <button class="catagory-modify" on:click={() => {display = 1}}>
                        <Icon name="edit" width={10} height={10}/>
                    </button>
                </section>

                <EntryInput placeholder="Custom Word" callback={handelWordAdd}/>

                <section class="words">
                    {#await catagoryWords}
                        <Loader/>
                    {:then words} 
                        <table>
                            {#each words as word}
                                <tr>
                                    <td>
                                        <button on:click={() => {
                                            //@ts-ignore
                                            deleteWord(selectedCatagory, word)
                                        }}>
                                            <Icon name="cross" width={10} height={10}/>
                                        </button>
                                    </td>
                                    <td>{word}</td>
                                </tr>
                            {/each}
                        </table>
                    {/await}
                </section>
            {:else if display == 1}
                <header>
                    <button on:click={() => {display = 0}}>
                        <Icon name="cross" width={20} height={20}/>
                    </button>
                    <h2>Categories</h2>
                </header>
                <EntryInput placeholder="New catagory" callback={handelNewCatagory}/>
                <CatagoryLoader let:categories>
                    <section>
                        {#each categories as catagory}
                            <button on:click={() => { confirmDeletion(catagory) }}>{toTitleCase(catagory)}</button>
                        {/each}
                    </section>
                </CatagoryLoader>
            {/if}
        </section>
    </div>
{/if}

<style lang="scss">
    @import '../assets/veriables.scss';
    $mobile-size: 500px;

    div.word-bank-model{
        @include CustomModel($mobile-size);



        & > section{
            max-height: 100vh;
            overflow-y: scroll;

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
        }
    
        & > section.words{
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

            & > section.catagory-selector{
                grid-area: Catagorys;
                display: flex;
                gap: 10px;

                @media (width > $mobile-size) {
                    flex-direction: column;
                    overflow-y: scroll;
                    border-right: 1px solid white;
                    padding-right: 10px;
                }

                @media (width <= $mobile-size) {
                    margin-bottom: 20px;
                }
                

                &:has(.loader){
                    display: grid;
                    align-items: center;
                    justify-content: center;
                    place-items: center;
                }

                & > button:not(.catagory-modify){
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

                button.catagory-modify{
                    @include FancyButton(rgb(37, 37, 172));
                    @media (width <= $mobile-size) {border-radius: 10px;}
                    @media (width > $mobile-size) {
                        &::after{
                            content: "Edit";
                            margin-left: 5px;
                        }
                    }
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
                    outline-width: 1px;
                    background: none;
                    border: none;
                    height: 40px;
                    width: 100%;
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

        & > section.catagory{
            flex-direction: column;
            max-height: 100vh;
            display: flex;

            & > section{
                flex-direction: column;
                align-items: center;
                overflow-y: scroll;
                padding: 10px 5px;
                display: flex;
                flex-grow: 1;
                gap: 15px;

                & > button{
                    background-color: rgba(48, 64, 92, 0.251);
                    outline: 1px solid rgba(255, 255, 255, 0.5);
                    transition: all 400ms ease-out;
                    box-sizing: border-box;
                    border-radius: 20px;
                    cursor: pointer;
                    padding: 10px;
                    border: none;
                    width: 100%;

                    &:hover{
                        transition: all 200ms ease-in;
                        text-decoration: line-through;
                        opacity: .7;
                    }
                }
            }
        }
    }
</style>