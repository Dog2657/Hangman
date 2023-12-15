<script lang="ts">
    import FinishModel from "./components/FinishModel.svelte";
    import MainMenu from "./components/MainMenu.svelte";
    import Game from "./components/Game.svelte";

    import { gameStatus } from './lib/gameStatus'
</script>

{#if $gameStatus == undefined || $gameStatus?.finished}
    <MainMenu/>
{:else}
    <Game/>
{/if}

{#if $gameStatus?.finished}
    <FinishModel/>
{/if}