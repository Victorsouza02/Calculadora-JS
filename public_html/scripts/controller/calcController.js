class CalcController {

    constructor() {
        this._lastOperator = '';
        this._lastNumber = '';
        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._currentLocale;
        this._operation = [];
        this._displayCalcEl = document.querySelector("#display");
        this._dateCalcEl = document.querySelector("#data");
        this._timeCalcEl = document.querySelector("#hora");
        this.initialize();
    }

    initialize() {
        this.displayCalc = "0";
        this.currentLocale = navigator.language;
        this.setDisplayDateTime();
        this.updateDisplayDateTime();
        this.setLastNumbertoDisplay();
        this.initButtonsEvents();
        this.initKeyboard();
        this.pasteFromClipboard();

        document.querySelectorAll(".btn-ac").forEach(btn =>{
            btn.addEventListener("dblclick", e=>{
                this.toggleAudio();
            });
        })
    }

    toggleAudio(){
        this._audioOnOff = !this._audioOnOff;
    }

    playAudio(){
        if(this._audioOnOff){
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    copytoClipboard(){
        let input = document.createElement('input');
        input.value = this.displayCalc;
        document.body.appendChild(input);
        input.select();
        document.execCommand("Copy");
        input.remove();
    }

    pasteFromClipboard(){
        document.addEventListener('paste', e=>{
            let text = e.clipboardData.getData('Text');
            this.displayCalc = parseFloat(text);
            console.log(text);
        });
    }

    initKeyboard(){
        document.addEventListener("keyup", e =>{
            this.playAudio();
            console.log(e.key);
            switch (e.key) {
                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.clearEntry();
                    break;

                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation("+");
                    break;
    
    
                case 'Enter':
                case '=':
                    this.calc();
                    break;
    
                case '.':
                case ',':
                    this.addDot(".");
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
                    this.addOperation(parseInt(e.key));
                    break;
                case 'c':
                    if(e.ctrlKey) this.copytoClipboard();
                    break;
            }
        });
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
        if(valor.toString().length > 10){
            this.clearAll();
            this.setError();
            return false;
        }
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
        this.playAudio();
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
                this.calc();
                break;

            case 'ponto':
                this.addDot(".");
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
        // VERIFICA SE A ULTIMA NÃO É UM NUMERO
        if (isNaN(this.getLastOperation())) {
            // Ultima Operacão é String
            if (this.isOperator(value)) { // SE FOR OPERADOR
                //Trocar o operador
                this.setLastOperation(value);
            } else {
                this.pushOperation(value);
                this.setLastNumbertoDisplay();
            }

        } else {
            // Ultima operação é Numero
            if (this.isOperator(value)) {
                this.pushOperation(value);
            } else {
                let new_value = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(new_value);

                //Atualizar display
                this.setLastNumbertoDisplay();
            }

        }
        console.log(this._operation);
    }

    getResult() {
        try{
        return eval(this._operation.join(""));
        } catch (e){
            this.clearAll();
            this.setError();
            return false;
        }
    }

    setFloatValue(){
        let value = this.getLastItem(false).toString + "." + value.toString;
        return parseFloat(value);
    }

    updateDisplayDateTime() {
        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);
        /* setTimeout(()=>{
            clearInterval(interval);
        }, 10000); */
    }

    setLastNumbertoDisplay() {
        let lastNumber = (this._operation.length == 0) ? 0 : this.getLastItem(false);
        this.displayCalc = lastNumber;
    }

    isOperator(value) {
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
    }


    clearAll() {
        this._operation = []; // ZERA O ARRAY
        this._lastNumber = "";
        this._lastOperator = "";
        this.setLastNumbertoDisplay();
    }

    pushOperation(value) {
        this._operation.push(value);
        if (this._operation.length > 3) {
            this.calc();
        }
    }

    addDot(){
        let lastOperation = this.getLastOperation();

        if(typeof lastOperation === "string" && lastOperation.split("").indexOf(".") > -1) return;

        if(this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation("0.");
        } else {
            this.setLastOperation(lastOperation.toString() + ".");
        }

        this.setLastNumbertoDisplay();
    }

    calc() {
        let result;
        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3) {
            let firstNumber = this._operation[0];
            this._operation = [firstNumber, this._lastOperator, this._lastNumber];
            this.setLastNumbertoDisplay();
        }

        if (isNaN(this.getLastOperation())) {
            let last = this._operation.pop();
            result = parseInt(this.getResult());
            this._lastNumber = this.getResult();
            if (last == "%") {
                result /= 100;
                this._operation = [result];
            } else {
                this._operation = [result, last];
            };
            this.setLastNumbertoDisplay();
        } else {
                result = this.getResult();
                if(result != false){
                    result = parseFloat(this.getResult());
                    this._lastNumber = this.getLastItem(false);
                    this._operation = [result]; 
                    this.setLastNumbertoDisplay();
                }    
        }
    }

    getLastItem(isOperator = true) {
        let lastItem;
        for (let i = this._operation.length - 1; i >= 0; i--) {
            if (this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i];
                break;
            }
        }

        if (!lastItem) {
            // OPERADOR TERNARIO
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;
    }

    getLastOperation() { // PEGA O ULTIMO ITEM DO ARRAY
        return this._operation[this._operation.length - 1];
    }

    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value;
    }

    clearEntry() {
        this._operation.pop(); // DELETA ULTIMO ITEM DO ARRAY
        this.setLastNumbertoDisplay();
    }


    setError() {
        this.displayCalc = "Error";
    }



}