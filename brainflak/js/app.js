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

        startTime: new Date(),
        averageTime: ko.observable(""),
        calculateAverageTime: function () {
            var total = this.questionsTotal() + 1;
            var currentTime = new Date();
            var diff = currentTime.valueOf() - this.startTime.valueOf();
            var av = diff / total / 1000;
            this.averageTime(av.toFixed(2) + " sec.");
        },

        progress: ko.observable(0),

        initTimer: function() {
            var pr = this.progress;
            var calcAverageTime = this.calculateAverageTime;
            var self = this;

            var timer = window.setInterval(function() {
                var oldVal = pr();
                var remaining = 100 - oldVal;
                var change = remaining / 100;
                var updatedVal = oldVal + change;
                pr(updatedVal);
                calcAverageTime.call(self);
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

        setQuestion: function () {

            var correctQuestions = this.questionsCorrect();

            var min = 2 + correctQuestions;
            var max = 11 + correctQuestions;

            var first = this.getRandomInt(min, max);
            var second = this.getRandomInt(min, max);

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
            var currentNum = inputAnswer();
            var isCurrentAnswerNumeric = !(currentNum === null || currentNum === undefined || isNaN(currentNum) || !isFinite(currentNum));
            var checkAnswer = this.checkAnswer;

            var handleNumericInput = function (num) {
                if (!isCurrentAnswerNumeric)
                    currentNum = 0;
                currentNum = currentNum * 10 + num;
                inputAnswer(currentNum);
                checkAnswer.call(self);
            };

            if (keyCode === 13) {
                //Enter
                if (!isCurrentAnswerNumeric)
                    return;

                checkAnswer.call(self, true);
            }
            if (keyCode === 8) {
                //Backspace
                if (!isCurrentAnswerNumeric)
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