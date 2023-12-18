<script lang="ts">
    import { fade, scale } from "svelte/transition";
    import { currentGame, Game } from '../lib/gameStatus'
    import { get } from "svelte/store";

    export let display = false

    let gess = ""
    let gessed = false

    function gessWord(){
        const instance = get(currentGame)
        if(instance?.word == gess)
            return currentGame.update(value => {
                value.finished = new Date()
                value.validChars = new Set()
                return value
            })
            
        currentGame.update(value => {
            value.remainingAttempts = (value.remainingAttempts -1)
            if(value.remainingAttempts <= 0)
                value.finished = true

            return value
        })
        gessed = true
    }
</script>
{#if display}
    <div class="word-attempt-model" in:fade={{duration: 300}}>
        {#if gessed}
            <section>
                <h2>You Guessed Wrong</h2>
                <div>You have {$currentGame?.remainingAttempts} attempts left</div>
                <button type="button" on:click={() => {
                    display = false
                    gessed = false
                }}>Close</button>
            </section>
        {:else}
            <form on:submit|preventDefault={gessWord} in:scale={{duration: 200, delay: 200}}>
                <h2>What's the word</h2>
                <input required bind:value={gess}>
                <section class="actions">
                    <button type="submit">Check</button>
                    <button type="button" on:click={() => {display = false}}>Cancel</button>
                </section>
            </form>
        {/if}
    </div>
{/if}

<style lang="scss">
    @import '../assets/veriables.scss';
    $mobile-size: 500px;

    div.word-attempt-model{
        @include CustomModel($mobile-size);

        & > :is(form, section){
            text-align: center;

            h2{
                margin: 0 0 10px 0;
            }
        }

        & > form{
            & > input{
                width: 100%;
                background: none;
                outline: 1px solid white;
                box-sizing: border-box;
                border-radius: 5px;
                padding: 10px;
                font-size: 20px;
                border: none;
            }

            & > section.actions{
                display: flex;
                margin-top: 20px;
                gap: 10px;

                & > button{
                    flex-grow: 1;
                    height: 40px;

                    &:nth-child(1){ @include FancyButton(rgb(0, 160, 0)); }
                    &:nth-child(2){ @include FancyButton(red); }
                }
            }
        }

        & > section {
            & > button{
                @include FancyButton(rgb(128, 58, 58));
                width: 100%;
                margin-top: 20px;
            }
        }
    }
</style>