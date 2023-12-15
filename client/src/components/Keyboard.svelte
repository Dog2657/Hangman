<script lang="ts">
    import { gameStatus } from '../lib/gameStatus'

    function handleButtonPress(key: string){
        gameStatus.testCharacter(key)
    }

    function handleKeyPress(e){
        var keyCode = e.keyCode || e.which
        if(keyCode < 65 || keyCode > 90)
            return

        gameStatus.testCharacter(String.fromCharCode(keyCode))
    }
</script>

<svelte:window on:keydown={handleKeyPress}/>

<article>
    <section>
        {#each ["qwertyuiop", "asdfghjkl", "zxcvbnm"] as keyRow}
            <div>
                {#each keyRow.split('') as character}
                    <button
                    class:valid={$gameStatus.word.includes(character) && !$gameStatus.validChars.has(character)}
                    class:wrong={$gameStatus.wrongChars.has(character)}
                    on:click={() => {handleButtonPress(character)}}>
                        {character.toUpperCase()}
                    </button>
                {/each}
            </div>
        {/each}
    </section>
</article>