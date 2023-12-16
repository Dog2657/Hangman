<script lang="ts">
    import Loader from "./Loader.svelte";

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

            <form class="entry-inputer">
                <input type="text">
            </form>

            <section class="words">
                word1
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
                }
                

                &:has(.loader){
                    display: grid;
                    align-items: center;
                    justify-content: center;
                    place-items: center;
                }

                & > button{
                    @media (width <= $mobile-size) {
                        display: none;
                    }
                }

                & > select{
                    @media (width > $mobile-size) {
                        display: none;
                    }
                }
            }
            & > form.entry-inputer { grid-area: New-enterys; }
            & > section.words { grid-area: Words; }
        }
    }
</style>