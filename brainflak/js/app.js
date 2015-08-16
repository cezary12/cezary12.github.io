﻿(function() {

    var operations = {
        summation: "+",
        subtraction: "−",
        multiplication: "×", //"·",
        division: "÷"
    };

    var viewModel = {
        inputFirst: ko.observable(),
        inputSecond: ko.observable(),
        operation: ko.observable(operations.multiplication),
        inputAnswer: ko.observable(),
        calculateCorrectAnswer: function() {
            var first = this.inputFirst(),
                second = this.inputSecond();

            switch (this.operation()) {
            case operations.summation:
                return first + second;
            case operations.subtraction:
                return first - second;
            case operations.multiplication:
                return first * second;
            case operations.division:
                return first / second;
            default:
                throw new Error("Not supported operation " + this.operation());
            }
        },

        progress: ko.observable(0),

        initTimer: function() {
            var pr = this.progress;

            var timer = window.setInterval(function() {
                var oldVal = pr();
                var remaining = 100 - oldVal;
                var change = remaining / 25;
                var updatedVal = oldVal + change;
                pr(updatedVal);

            }, 50);

            this.timer = timer;
        },

        clearTimer: function() {
            var pr = this.progress;
            var existingTimer = this.timer;
            if (existingTimer) {
                window.clearInterval(existingTimer);
            }
            pr(0);
        },

        questionsTotal: ko.observable(0),
        questionsCorrect: ko.observable(0),
        questionsIncorrect: ko.observable(0),

        isCorrectAnswer: ko.observable(false),
        isIncorrectAnswer: ko.observable(false),

        setQuestion: function() {
            var first = this.getRandomInt(1, 10);
            var second = this.getRandomInt(1, 10);

            this.inputAnswer(undefined);
            this.inputFirst(first);
            this.inputSecond(second);
            this.operation(operations.multiplication);
            this.initTimer();
        },

        next: function (wasCorrectAnswer) {
            var isCorrectAnswer = this.isCorrectAnswer;
            var isIncorrectAnswer = this.isIncorrectAnswer;
            var setQuestion = this.setQuestion;

            if (wasCorrectAnswer === true) {
                this.questionsTotal(this.questionsTotal() + 1);
                this.questionsCorrect(this.questionsCorrect() + 1);
                this.isCorrectAnswer(true);
                this.clearTimer();
            } else if (wasCorrectAnswer === false) {
                this.questionsTotal(this.questionsTotal() + 1);
                this.questionsIncorrect(this.questionsIncorrect() + 1);
                this.isIncorrectAnswer(true);
                this.clearTimer();
            }

            var self = this;
            window.setTimeout(function () {
                isCorrectAnswer(false);
                isIncorrectAnswer(false);
                setQuestion.call(self);
            }, 100);
        },

        checkAnswer: function(force) {
            var correctValue = this.calculateCorrectAnswer();
            var answer = this.inputAnswer();
            if (answer === correctValue) {
                this.next(true);
            } else if (force || answer > 10 * correctValue) {
                this.next(false);
            }
        },

        keydownAnswer: function (vm, event) {
            var self = this;
            var keyCode = event.keyCode;
            var inputAnswer = this.inputAnswer;
            var checkAnswer = this.checkAnswer;
            var handleNumericInput = function (num) {
                var currentNum = inputAnswer();
                if (currentNum === null || currentNum === undefined || isNaN(currentNum) || !isFinite(currentNum))
                    currentNum = 0;
                currentNum = currentNum * 10 + num;
                inputAnswer(currentNum);
                checkAnswer.call(self);
            };

            if (keyCode === 13) {
                //Enter
                checkAnswer.call(self, true);
            }
            if (keyCode === 8) {
                //Backspace
                var currentNum = inputAnswer();
                if (currentNum === null || currentNum === undefined || isNaN(currentNum) || !isFinite(currentNum))
                    return;

                var currentNumString = currentNum.toString();
                currentNumString = currentNumString.substring(0, currentNumString.length - 1);
                currentNum = currentNumString === "" ? undefined : parseInt(currentNumString, 10);
                inputAnswer(currentNum);
            }
            if (keyCode === 46) {
                //Delete
                inputAnswer(undefined);
            }
            if (keyCode >= 48 && keyCode <= 57) {
                handleNumericInput(keyCode - 48);
            }
            if (keyCode >= 96 && keyCode <= 105) {
                handleNumericInput(keyCode - 96);
            }

            console.log(keyCode);
        },

        getRandomInt: function getRandomInt(min, max) {

            if (min === undefined) { min = 11; }
            if (max === undefined) { max = 39; }

            return Math.floor(Math.random() * (max - min)) + min;
        },

        init: function() {
            this.setQuestion();
            this.initTimer();
        }

    };

    viewModel.init();

    ko.applyBindings(viewModel);
})();