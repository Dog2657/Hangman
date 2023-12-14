<section>
    <div class="Guess_Word_BNT_Containor">
        <button>Guess Word</button>
    </div>
    <div class="Row">
        <div class="Key" data-Key="Q">Q</div>
        <div class="Key" data-Key="W">W</div>
        <div class="Key" data-Key="E">E</div>
        <div class="Key" data-Key="R">R</div>
        <div class="Key" data-Key="T">T</div>
        <div class="Key" data-Key="Y">Y</div>
        <div class="Key" data-Key="U">U</div>
        <div class="Key" data-Key="I">I</div>
        <div class="Key" data-Key="O">O</div>
        <div class="Key" data-Key="P">P</div>
    </div>
    <div class="Row">
        <div class="Key" data-Key="A">A</div>
        <div class="Key" data-Key="S">S</div>
        <div class="Key" data-Key="D">D</div>
        <div class="Key" data-Key="F">F</div>
        <div class="Key" data-Key="G">G</div>
        <div class="Key" data-Key="H">H</div>
        <div class="Key" data-Key="J">J</div>
        <div class="Key" data-Key="K">K</div>
        <div class="Key" data-Key="L">L</div>
    </div>
    <div class="Row">
        <div class="Key" data-Key="Z">Z</div>
        <div class="Key" data-Key="X">X</div>
        <div class="Key" data-Key="C">C</div>
        <div class="Key" data-Key="V">V</div>
        <div class="Key" data-Key="B">B</div>
        <div class="Key" data-Key="N">N</div>
        <div class="Key" data-Key="M">M</div>
    </div>
</section>

<style lang="scss">
    section{
        margin: 50px auto;
        background-color: #eee;
        box-sizing: border-box;
        flex-direction: column;
        height: max-content;
        border-radius: 20px;
        text-align: center;
        max-width: 806px;
        display: flex;
        width: 100vw;
        padding: 5px;

        & > div{
            display: grid;
            grid-template-columns: repeat(10, 1fr);
            place-items: center;
            
            & > .Key{

    
                &:not( :is( .Correct, .Wrong ) ){
                    box-shadow: 0 0.2em 0 0.05em #222;
                    border-bottom-color: #555;
                    cursor: pointer;
                } 
    
                transition: all 200ms ease-in-out;
                border: 1px solid #444;
                justify-content: center;
                width: calc(100vw / 10);
                box-sizing: border-box;
                border-radius: 0.3em;
                align-items: center;
                position: relative;
                background: #333;
                text-align: center;
                font-size: large;
                max-width: 70px;
                display: flex;
                padding: 0.2em;
                color: #eee;
                margin: 0.2em;
                height: 70px;       
            }
        }
    }
</style>