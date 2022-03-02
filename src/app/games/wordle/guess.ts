import { Letter } from "./letter";

export class Guess {
    letters: Letter[];
    letterLength: number;
    
    constructor(letterLength: number) {
        this.letterLength = letterLength;

        this.letters = [];
        for (var i = 0; i < letterLength; i++) {
            this.letters.push(new Letter(""))
        }
    }

    setLetters(guess: string) {
        this.letters = [];
        for (var i = 0; i < this.letterLength; i++) {
            var l = guess.length > i ? guess.charAt(i) : "";
            this.letters.push(new Letter(l));
        }
    }

}