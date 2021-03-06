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
                var change = remaining / 300;
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

            var min = Math.floor(2 + correctQuestions * .3);
            var max = Math.floor(11 + correctQuestions * .3);

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
            }, 200);
        },

        checkAnswer: function(force) {
            var correctValue = this.calculateCorrectAnswer();
            var answer = this.inputAnswer();
            if (answer === correctValue) {
                this.next(true);
            } else if (force || answer > 10 * correctValue) {
                this.inputAnswer(correctValue);
                this.next(false);
            }
        },

        isCurrentAnswerNumeric: function(currentNum) {
            return !(currentNum === null || currentNum === undefined || isNaN(currentNum) || !isFinite(currentNum));
        },

        handleNumericInput: function (num) {
            var self = this;
            var inputAnswer = this.inputAnswer;
            var currentNum = inputAnswer();
            var isCurrentAnswerNumeric = this.isCurrentAnswerNumeric(currentNum);
            var checkAnswer = this.checkAnswer;

            if (!isCurrentAnswerNumeric)
                currentNum = 0;

            currentNum = currentNum * 10 + num;
            inputAnswer(currentNum);
            checkAnswer.call(self);
        },

        handleDelete: function() {
            this.inputAnswer(undefined);
        },

        handleEnter: function () {
            var currentNum = this.inputAnswer();
            var isCurrentAnswerNumeric = this.isCurrentAnswerNumeric(currentNum);

            if (!isCurrentAnswerNumeric)
                return;

            this.checkAnswer.call(this, true);
        },

        keydownAnswer: function (vm, event) {
            var self = this;
            var keyCode = event.keyCode;

            if (keyCode === 13) {
                //Enter
                this.handleEnter();
            }
            if (keyCode === 8) {
                //Backspace
                var inputAnswer = this.inputAnswer;
                var currentNum = inputAnswer();
                var isCurrentAnswerNumeric = this.isCurrentAnswerNumeric(currentNum);
                if (!isCurrentAnswerNumeric)
                    return;

                var currentNumString = currentNum.toString();
                currentNumString = currentNumString.substring(0, currentNumString.length - 1);
                currentNum = currentNumString === "" ? undefined : parseInt(currentNumString, 10);
                inputAnswer(currentNum);
            }
            if (keyCode === 46) {
                //Delete
                this.handleDelete();
            }
            if (keyCode >= 48 && keyCode <= 57) {
                this.handleNumericInput.call(self, keyCode - 48);
            }
            if (keyCode >= 96 && keyCode <= 105) {
                this.handleNumericInput.call(self, keyCode - 96);
            }
        },

        getRandomInt: function getRandomInt(min, max) {

            if (min === undefined) { min = 11; }
            if (max === undefined) { max = 39; }

            return Math.floor(Math.random() * (max - min)) + min;
        },

        isTouchDevice: function() {
            return !!("ontouchstart" in window || "onmsgesturechange" in window);
        },

        init: function() {
            this.setQuestion();
            this.initTimer();
        }

    };

    viewModel.init();

    ko.applyBindings(viewModel);
})();