<script>
    import { currentGame, endGame } from '../lib/gameStatus'
    import { fade } from "svelte/transition";
    import Keyboard from "./Keyboard.svelte";
    import WordDisplay from './WordDisplay.svelte';
    import Icon from './Icon.svelte';
    import GameStatus from './GameStatus.svelte';
</script>

<main transition:fade={($currentGame?.finished)? {duration: 500, delay: 200} : {duration: 200}}>
    <button class="exit" on:click={endGame}>
        <Icon name="home" width={22.5} height={22.5}/>
    </button>

    <GameStatus stage={10 - $currentGame?.remainingAttempts}/>

    <WordDisplay/>
    <Keyboard/>
</main>

<style lang="scss">
    main{
        box-sizing: border-box;
        flex-direction: column;
        align-items: center;
        height: 100vh;
        display: flex;
        gap: 15px;

        button{
            border-bottom-right-radius: 100%;
            background: rgb(27, 27, 27);
            padding: 10px 20px 20px 10px;
            align-self: flex-start;
            width: max-content;
            font-size: 20px;
            cursor: pointer;
            color: white;
            border: none;
        }


        & > :global(.keyboard){
            align-self: end;
        }
    }
</style>