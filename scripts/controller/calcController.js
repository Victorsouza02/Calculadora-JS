class CalcController {

    constructor() {
        this._currentLocale;
        this._operation = [];
        this._displayCalcEl = document.querySelector("#display");
        this._dateCalcEl = document.querySelector("#data");
        this._timeCalcEl = document.querySelector("#hora");
        this.initialize();
    }

    initialize() {
        this.displayCalc = 0;
        this.currentLocale = navigator.language;
        this.setDisplayDateTime();
        this.updateDisplayDateTime();
        this.initButtonsEvents();
    }

    initButtonsEvents() { // INICIA EVENTO NOS BOTÕES
        let buttons = document.querySelectorAll("#buttons > g, #parts > g"); // Capturando botoes

        buttons.forEach((btn, index) => {
            this.addEventListenerAll(btn, "click drag ", e => {
                //PEGA NOME DA CLASSE E SUBSTITUI
                let textBtn = btn.className.baseVal.replace("btn-", "");
                this.execBtn(textBtn);
            });


            // MUDANDO CURSOR EM AREAS CLICAVEIS
            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
                btn.style.cursor = "pointer";
            });
        })
    }


    // ******************** GETTERS AND SETTERS

    get currentLocale() {
        return this._currentLocale;
    }

    set currentLocale(locale) {
        this._currentLocale = locale;
    }

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

    // ***************************** METHODS

    addEventListenerAll(btn, events, fn) { // ADICIONA MAIS DE UM EVENTO NO BOTAO
        // SEPARA STRING EM ARRAY
        events.split(' ').forEach(event => {
            btn.addEventListener(event, fn, false);
        });
    }

    setDisplayDateTime() { // Insere data e hora atual no display
        let currentDate = new Date();
        this.displayDate = currentDate.toLocaleDateString(this.currentLocale, {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
        this.displayTime = currentDate.toLocaleTimeString(this.currentLocale);
    }

    execBtn(value) {
        switch (value) {
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperation("+");
                break;

            case 'subtracao':
                this.addOperation("-");
                break;

            case 'divisao':
                this.addOperation("/");
                break;

            case 'multiplicacao':
                this.addOperation("*");
                break;

            case 'porcento':
                this.addOperation("%");
                break;

            case 'igual':

                break;

            case 'ponto':
                this.addOperation(".");
                break;

            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                this.addOperation(parseInt(value));
                break;

            default:
                this.setError();
                break;
        }
    }

    addOperation(value) {

        if (isNaN(this.getLastOperation())) {
            // Ultima Operacão é String
            if (this.isOperator(value)) {
                //Trocar o operador
                this.setLastOperation(value);
            } else if (isNaN(value)) {
                // Outra coisa
                console.log(value);
            } else {
                // É um numero
                this._operation.push(value);
            }

        } else {
            // Ultima operação é Numero
            if (this.isOperator(value)) {
                this._operation.push(value);
            } else {
                let new_value = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(parseInt(new_value));
            }

        }
        console.log(this._operation);
    }

    updateDisplayDateTime() {
        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);
        /* setTimeout(()=>{
            clearInterval(interval);
        }, 10000); */
    }

    isOperator(value) {
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);

    }

    clearAll() {
        this._operation = []; // ZERA O ARRAY
    }

    getLastOperation() { // PEGA O ULTIMO ITEM DO ARRAY
        return this._operation[this._operation.length - 1];
    }

    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value;
    }

    clearEntry() {
        this._operation.pop(); // DELETA ULTIMO ITEM DO ARRAY
    }

    setError() {
        this.displayCalc = "Error";
    }



}