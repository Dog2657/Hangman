<script lang="ts">
    import Loader from "./Loader.svelte";

    import { words } from "../lib/words"
    import { get } from 'svelte/store';
    import { toTitleCase } from "../lib/general";
    
    export let validate = false

    function newPromise(){
        return new Promise<Array<string>>(async (resolve, reject) => {
            const catagories = await get(words) 
            const names = Object.keys(catagories)
            if(!validate)
                return resolve(names)

            const wordPromises = await Promise.all(Object.values(catagories))
            const validCategories: Array<string> = []

            wordPromises.forEach((value, index) => {
                if(value.length > 0)
                    validCategories.push( names[index] )
            })

            resolve(validCategories)
        })
    }

    let data: Promise<Array<string>> = newPromise()


    words.subscribe(() => {
        data = newPromise()
    })
</script>

{#await data}
    <Loader/>
{:then categories} 
    <slot {categories}/>
{/await}