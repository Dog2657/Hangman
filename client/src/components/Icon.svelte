<script lang="ts">
    export let name: string
    export let viewBox = "0 0 100 100"
    export let width: number | undefined = undefined
    export let height: number | undefined = undefined
</script>

<svg class="icon {$$restProps.class || ''}" {viewBox} {width} {height}>
    <use xlink:href='/Icons.svg#{name}'></use>
</svg>