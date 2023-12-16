<script lang="ts">
    import Loader from "./Loader.svelte";

    import { getEventTarget } from "../lib/general"
    import { catagorys, words } from "../lib/words"
    import { fade } from 'svelte/transition';
    import { onMount } from "svelte";

    let display: boolean = false
    let selectedCatagory: string

    onMount(async () => {
        selectedCatagory = (await catagorys)[0]
    });

    export function open(){
        display = true
    }

    function addWord(e){
        const word = getEventTarget(e).querySelector("input")?.value
        console.log(word)
    }
</script>

{#if display}
    <div class="word-bank-model" in:fade={{duration: 200}} out:fade={{duration: 300}}>
        <article>
            <section class="catagory-selector">
                {#await catagorys}
                    <Loader/>
                {:then data}
                    <select bind:value={selectedCatagory}>
                        {#each data as catagory}
                            <option>{catagory}</option>
                        {/each}
                    </select>

                    {#each data as catagory}
                        <button class:selected={ selectedCatagory == catagory } on:click={() => {selectedCatagory = catagory}}>{catagory}</button>
                    {/each}
                {/await}
            </section>

            <form class="entry-inputer" on:submit|preventDefault={addWord}>
                <input type="text" required placeholder="">
                <div>E.g. Animals or planets</div>
                <button type="submit">
                    <svg width="15" height="15" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_267_2)">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M1.73448 49.93C1.68598 48.0572 2.32907 46.1677 3.66375 44.7384L43.5771 1.99455C46.1529 -0.763866 50.329 -0.763872 52.9047 1.99455C55.4805 4.75296 55.4805 9.22524 52.9047 11.9837L23.3405 43.6445H85.8246V18.2831C85.8246 15.5217 88.0632 13.2831 90.8246 13.2831H95C97.7615 13.2831 100 15.5217 100 18.2831V51.9276C100 51.9354 100 51.9432 100 51.9509V53.8252C100 56.5866 97.7614 58.8252 95 58.8252H25.7855L52.905 87.8678C55.4807 90.6262 55.4807 95.0985 52.905 97.8569C50.3292 100.615 46.1531 100.615 43.5773 97.8569L3.66397 55.1131C2.3313 53.6859 1.68813 51.8 1.73448 49.93Z" fill="#D9D9D9"/>
                        </g>
                    </svg>
                </button>
            </form>

            <section class="words">
               
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

            @media (width > $mobile-size) {
                display: grid; 
                grid-auto-columns: 1fr; 
                grid-auto-rows: 1fr; 
                grid-template-columns: 0.5fr 1.5fr; 
                grid-template-rows: 0.2fr 1.8fr; 
                gap: 0px 10px; 
                grid-template-areas: 
                    "Catagorys New-enterys"
                    "Catagorys Words"; 
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

            & > section.words { grid-area: Words; }
        }
    }
</style>