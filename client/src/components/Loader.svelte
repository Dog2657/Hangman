<section class="loader">
    <i />
</section>

<style lang="scss">
    section.loader{
        position: relative;
        height: 17.5px;
        text-align: center;

        & > i{
            color: #ffffff8e;
            font-size: 7px;
            position: relative;
            text-indent: -9999em;
            transform: translateY(-100%) translateX(-50%) translateZ(0);
            animation-delay: -0.16s;


            &, &::before, &::after{
                border-radius: 50%;
                width: 2.5em;
                height: 2.5em;
                animation-fill-mode: both;
                animation: bblFadInOut 1.8s infinite ease-in-out;
                content: '';
                position: absolute;
                top: 0;
            }

            &::before{
                left: -3.5em;
                animation-delay: -0.32s;
            }

            &::after{
                left: 3.5em;
                animation-delay: 0.32s;
            }
        }
    }
    
    @keyframes bblFadInOut {
        0%, 80%, 100% { box-shadow: 0 2.5em 0 -1.3em }
        40% { box-shadow: 0 2.5em 0 0 }
    }
</style>