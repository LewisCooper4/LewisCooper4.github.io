import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Guess } from './guess';
import { WordsService } from './wordle.service';

@Component({
  selector: 'lc-wordle',
  templateUrl: './wordle.component.html',
  styleUrls: ['./wordle.component.css']
})
export class WordleComponent implements OnInit {
  @ViewChild('guessInput') guessInput!: ElementRef;
  pageTitle: string = "Wordle";


  sub!: Subscription;
  errorMessage: string = "";
  resultColors: Map<string, string> = new Map()
    .set("None", "")
    .set("Match", "#1c9600")
    .set("Mis-Match", "#ababab")
    .set("Wrong Place", "#fff959");
  totalGuesses: number = 6;
  totalLetters: number = 5;
  guesses: Guess[] = [];
  words: string[] = [];
  allLetters: Map<string, string> = new Map<string, string>([]);
  alphabet: string[][] = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"]
  ]
  word: string = "";
  currentGuessIndex: number = 0;
  currentGuess: string = "";
  validGuess: boolean = false;
  invalidWord: boolean = false;
  win: boolean = false;
  gameOver: boolean = false;


  constructor(private wordsService: WordsService) { };

  ngOnInit(): void {

    // set up guesses 
    this.guesses = [];
    for (var i = 0; i < this.totalGuesses; i++) {
      this.guesses.push(new Guess(this.totalLetters));
    }

    // read in all words
    this.sub = this.wordsService.getProducts().subscribe({
      next: words => {
        this.words = words;
        // pick word
        var wordIndex = Math.floor(Math.random() * this.words.length)
        this.word = this.words[wordIndex]
      },
      error: err => this.errorMessage = err
    });

    // set up guessed letters 
    this.allLetters = new Map<string, string>();
    for (var i = 0; i < 26; i++) {
      var chr = String.fromCharCode(65 + i);
      this.allLetters.set(chr, "");
    }
  }

  submitGuess(): void {

    // check for valid word
    if (this.words.indexOf(this.currentGuess) < 0) {
      this.invalidWord = true;
    }
    else {
      this.invalidWord = false;
      // color guess 
      var correctWord = this.word;
      var currentGuess = this.currentGuess;
      var correctGuesses = [];

      // check if letter is in correct place 
      for (var i = 0; i < this.totalLetters; i++) {
        var currentCharacter = correctWord.charAt(i);
        if (currentCharacter == currentGuess[i]) {
          this.guesses[this.currentGuessIndex].letters[i].matchResult = "Match";
          correctWord = this.replaceCharacter(correctWord, "_", i);
          correctGuesses.push(i);
          this.allLetters.set(currentCharacter, "Match");
        }
      }

      // check if letter in incorrect place
      for (var i = 0; i < this.totalLetters; i++) {
        var currentLetter = currentGuess[i];

        if (correctGuesses.indexOf(i) > -1) {
          // already matched
        }
        else if (correctWord.indexOf(currentLetter) > -1) {
          this.guesses[this.currentGuessIndex].letters[i].matchResult = "Wrong Place";
          correctWord = this.replaceCharacter(correctWord, "_", correctWord.indexOf(currentLetter));

          if (this.allLetters.get(currentLetter) != "Match") {
            this.allLetters.set(currentLetter, "Wrong Place");
          }

        } else {
          this.guesses[this.currentGuessIndex].letters[i].matchResult = "Mis-Match";
          
          if (this.allLetters.get(currentLetter) == "") {
            this.allLetters.set(currentLetter, "Mis-Match");
          }
        }
      }

      this.currentGuessIndex = this.currentGuessIndex + 1;
      this.currentGuess = "";
      this.win = correctGuesses.length == this.totalLetters;
      this.gameOver = this.checkGameOver();
      this.guessInput.nativeElement.focus();
    }
  }

  changeGuess(): void {
    this.invalidWord = false;
    this.guesses[this.currentGuessIndex].setLetters(this.currentGuess);
    this.validGuess = this.currentGuess.length == 5;
  }

  getLetterColor(result: string): string {
    var color = this.resultColors.get(result);
    return color == undefined ? "" : color;
  }

  addLetter(letter: string): void {
    if (!this.gameOver) {
      if (this.currentGuess.length < this.totalLetters) {
        this.currentGuess += letter;
        this.changeGuess();
      }
      this.guessInput.nativeElement.focus();
    }
  }

  private replaceCharacter(str: string, replace: string, ind: number) {
    return str.substring(0, ind) + replace + str.substring(ind + replace.length);
  }

  private checkGameOver() {
    return this.win || this.currentGuessIndex >= this.totalGuesses;
  }

}
