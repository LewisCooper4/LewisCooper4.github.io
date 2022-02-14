(function() {
    "use strict";

    angular
        .module("app")
        .controller("WordleController", WordleController);

    WordleController.$inject = ["words"];
    function WordleController(words) {

        var wordle = this;

        // initialized values 
        wordle.guesses = []
        wordle.guessesResults = [];
        wordle.resultColors = {
            "Match" :       "#1c9600",
            "Mis-Match" :   "",
            "Wrong Place" : "#adad00"
        };
        wordle.totalGuesses = 6;
        wordle.totalLetters = 5;
        wordle.currentGuessIndex = 0;
        wordle.showWord = false;

        // functions
        wordle.load = load;
        wordle.getLetterColor = getLetterColor;
        wordle.changeGuess = changeGuess;
        wordle.submitGuess = submitGuess;
        wordle.gameOver = gameOver;

        // initialize controller
        load()

        function load() {
            // pick word
            var wordIndex = Math.floor(Math.random() * words.length)
            wordle.word = words[wordIndex]

            // set up guesses 
            wordle.guesses = [];
            for (var i = 0; i < wordle.totalGuesses; i++) {
                wordle.guesses.push(Array(wordle.totalLetters).fill(""));
            }

            wordle.guessesResults = [];
            for (var i = 0; i < wordle.totalGuesses; i++) {
                wordle.guessesResults.push(Array(wordle.totalLetters).fill(""));
            }
        }

        function getLetterColor(result) {
            console.log("Get Color for = " + result);
            return wordle.resultColors[result];
        }

        function changeGuess() {
            var guess = Array(wordle.totalLetters).fill("");

            for (var i = 0; i < wordle.guessInput.length; i++) {
                guess[i] = wordle.guessInput.charAt(i);
            }

            wordle.guesses[wordle.currentGuessIndex] = guess;
        }

        function submitGuess() {
            // color guess 
            var correctWord = wordle.word;
            var currentGuess = wordle.guesses[wordle.currentGuessIndex];
            var correctGuesses = 0;

            // check if letter is in correct place 
            for (var i = 0; i < wordle.totalLetters; i++) {
                if (correctWord.charAt(i) == currentGuess[i]) {
                    wordle.guessesResults[wordle.currentGuessIndex][i] = "Match";
                    correctWord = replaceCharacter(correctWord, "_", i);
                    correctGuesses = correctGuesses + 1;
                }
            }

            // check if letter in incorrect place
            for (var i = 0; i < wordle.totalLetters; i++) {
                if (correctWord.indexOf(currentGuess[i]) > -1) {
                    wordle.guessesResults[wordle.currentGuessIndex][i] = "Wrong Place";
                    correctWord = replaceCharacter(correctWord, "_", correctWord.indexOf(currentGuess[i]));
                }
            }
            
            wordle.currentGuessIndex = wordle.currentGuessIndex + 1;
            wordle.guessInput = "";
            wordle.win = correctGuesses == wordle.totalLetters;
        }

        function replaceCharacter(str, replace, ind) {
            return str.substr(0, ind) + replace + str.substr(ind + replace.length);
        }

        function gameOver() {
            return (wordle.totalGuesses == wordle.currentGuessIndex) || wordle.win;
        }

    }

})();
