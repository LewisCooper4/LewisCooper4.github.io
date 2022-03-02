export class Letter {
    guess: string;
    matchResult: string;

    constructor(guess: string) {
        this.guess = guess;
        this.matchResult = "";
    }
}