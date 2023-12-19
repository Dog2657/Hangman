<script lang=ts>
    import { currentGame } from '../lib/gameStatus'
</script>

{#if $currentGame}
    <section class="word-display">
        {#each $currentGame?.word as character, index}
            {#if character != ' '}
                <div>
                    {#if !$currentGame.validChars.has(character)}
                        {character}
                    {/if}
                </div>
            {:else}
                <div class="space"></div>
            {/if}
        {/each}
    </section>
{/if}

<style lang="scss">
    section{
        justify-content: space-evenly;
        justify-content: center;
        align-items: center;
        width: 100%;
        margin: 20px 10px;
        font-size: 20px;
        flex-wrap: wrap;
        color: white;
        display: flex;
        gap: 10px;

        & > div{
            display: grid;
            justify-content: center;
            align-items: center;
            height: 80px;
        }

        & > div.space{
            &::before{ content: '/'; }

            padding: 5px 10px;
        }

        & > div:first-of-type, & > div.space + div{
            text-transform: capitalize;
        }

        & > div:not(.space){
            transition: color 500ms ease-out;
            justify-content: center;
            font-weight: lighter;
            align-items: center;
            width: -webkit-fill-available;
            width: -moz-available;
            width: fill-available;
            display: flex;
            margin: 0 1px;
           
            border-bottom: 5px solid rgb(121, 121, 121);

            @media (750px < width) {
                max-width: 80px;
            }

            @media (750px >= width > 500px) {
                max-width: 50px;
            }
            
            @media (500px >= width > 350px) {
                max-width: 40px;
            }

            @media (350px >= width > 250px) {
                max-width: 30px;
            }

            @media (250px > width ) {
                max-width: 10px;
            }
        }
    }
</style>