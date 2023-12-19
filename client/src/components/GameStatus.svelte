<script lang="ts">
    export let stage = 0 
</script>

<section>
    <img src="/stages/{stage}.png" alt="">
    <div>{10 - stage}</div>
</section>

<style lang="scss">
    section{
        background: rgba(255, 196, 86, 0.5);
        place-items: center;
        border-radius: 20px;
        isolation: isolate;
        height: 200px;
        display: grid;
        margin: auto;
        width: 200px;

        & > div{
            -webkit-text-stroke: 2px white;
            color: rgba(0, 0, 0, 0.3);
            position: absolute;
            font-size: 7rem;
        }

        & > img{
            height: 100%;
            width: 100%;
        }
    }
</style>