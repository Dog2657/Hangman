<script lang="ts">
    import Icon from "./Icon.svelte";

    export let placeholder: string
    export let callback: (value: string, success: () => void, error: () => void) => void;

    let error = false;
    let input: HTMLInputElement

    function onSubmit(){
        callback(
            input?.value || "",
            () => { input.value = "" },
            () => { error = true }
        )
    }
</script>

<form class:error={error} on:submit|preventDefault={onSubmit}>
    <input type="text" bind:this={input} on:input={() => {error = false}} required placeholder="">
    <div>{placeholder}</div>
    <button type="submit">
        <Icon name="enter" width={15} height={15}/>
    </button>
</form>

<style lang="scss">
    form {
        $padding: 15px;
        
        background-color: rgb(57, 92, 98);
        grid-area: New-enterys;
        position: relative;
        margin-bottom: 20px;
        border-radius: 5px;
        padding: $padding;
        display: flex;

        & > input:is(:focus, :focus-within, :not(:placeholder-shown)) + div{
            transition: all 150ms ease-in;
            font-size: 13px;
            bottom: 70%;
        }                

        &.error{
            &::after{ border-top: 1px solid red !important; }
            color: red;
        }

        &:has(input:is(:focus, :active))::after{
            border-top-color: white;
        }

        &::after{
            transition: 200ms ease-in-out border-top-color;
            width: calc(100% - ($padding * 2));
            border-top-color: black;
            border-top-style: solid;
            border-top-width: 1px;
            position: absolute;
            bottom: $padding;
            left: $padding;
            display: block;
            content: "";
        }

        & > input{
            outline: transparent;
            background: none;
            border: none;
            flex-grow: 1;
        }

        & > div{
            bottom: calc($padding + 2px );
            transition: all 300ms ease-out;
            pointer-events: none;
            position: absolute;
            font-size: 17px;
        }

        & > button{
            outline: transparent;
            background: none;
            cursor: pointer;
            border: none;
        }
    }
</style>