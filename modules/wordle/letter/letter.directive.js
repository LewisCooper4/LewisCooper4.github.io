/**
*/
(function() {
    "use strict";

    angular
        .module("app")
        .directive("wordleLetter", WordleLetter);

    function WordleLetter() {
        return {
            restrict: "E",
            templateUrl: "utilities/checkbox/pictureCheckbox.html",
            replace: true,
            transclude: true,

            controller: "WordleLetterController",
            controllerAs: "wordleLetter",
            templateUrl : "modules/wordle/letter/letter.html"
        }
    };

})();

