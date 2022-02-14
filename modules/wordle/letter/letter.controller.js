(function() {
    "use strict";

    angular
        .module("app")
        .controller("LetterController", LetterController);

    LetterController.$inject = [];
    function LetterController() {

        var wordleLetter = this;

        /** Bindable Elements. */
        wordleLetter.errors = [];
        


        /** Common Functions.  */
        wordleLetter.getRowColor = getRowColor;
       

        /////////////////////////

        function getRowColor(contact) {

        }

        
    }

})();