<script>
    import { fade } from "svelte/transition";
    import { gameStatus } from '../lib/gameStatus'
    import Keyboard from "./Keyboard.svelte";

    $:{console.log($gameStatus)}
</script>
<main transition:fade={($gameStatus?.finished)? {duration: 500, delay: 200} : {duration: 200}}>
    <Keyboard/>
</main>