class CalcController {

    constructor() {
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateCalcEl = document.querySelector("#data");
        this._timeCalcEl = document.querySelector("#hora");
        this.initialize();
    }

    initialize() {
        this.setDisplayDateTime();
        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);
        this.initButtonsEvents();

        /* setTimeout(()=>{
            clearInterval(interval);
        }, 10000); */
    }

    initButtonsEvents(){ // EVENTOS DOS BOTOES
         let buttons = document.querySelectorAll("#buttons > g, #parts > g"); // Capturando botoes

         buttons.forEach((btn, index) =>{
             this.buttonEvents(btn,"click");
             this.buttonEvents(btn,"drag");
         })
    }

    
    // GETTERS AND SETTERS

    get displayDate() { // Captura data no display
        return this._dateCalcEl.innerHTML;
    }

    set displayDate(value) { // Insere data no display
        this._dateCalcEl.innerHTML = value;
    }



    get displayTime() { // Captura hora no display
        return this._timeCalcEl.innerHTML;
    }

    set displayTime(value) { // Insere hora no display
        this._timeCalcEl.innerHTML = value;
    }



    get displayCalc() { // Captura display calculo
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(valor) { // Insere display calculo
        this._displayCalcEl.innerHTML = valor;
    }

    // METHODS

    buttonEvents(btn,event){
        btn.addEventListener(event,e=>{
            console.log(btn.className.baseVal.replace("btn-",""));
         });
    }

    currentDate() { // Captura data atual
        return new Date();
    }

    setDisplayDateTime(){ // Insere data e hora atual no display
        this.displayDate = this.currentDate().toLocaleDateString(this._locale, {
            day : "2-digit",
            month : "short",
            year: "numeric"
        });
        this.displayTime = this.currentDate().toLocaleTimeString(this._locale);
    }

}