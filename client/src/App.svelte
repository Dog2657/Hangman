<script lang="ts">
    import FinishModel from "./components/FinishModel.svelte";
    import MainMenu from "./components/MainMenu.svelte";
    import Game from "./components/Game.svelte";

    import { currentGame } from './lib/gameStatus'
</script>

{#if $currentGame == undefined || $currentGame?.finished}
    <MainMenu/>
{:else}
    <Game/>
{/if}


<FinishModel/>