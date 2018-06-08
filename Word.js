/* **Word.js**: Contains a constructor, Word that depends on the Letter constructor. This is used to create an object representing the current word the user is attempting to guess. That means the constructor should define:

  * An array of `new` Letter objects representing the letters of the underlying word

  * A function that returns a string representing the word. This should call the function on each letter object (the first function defined in `Letter.js`) that displays the character or an underscore and concatenate those together.

  * A function that takes a character as an argument and calls the guess function on each letter object (the second function defined in `Letter.js`)
*/ 

var Letter = require('./Letter');

var Word = function(word){
    this.word = word;
    
    this.wordArray =[];

    word.split('').forEach(element => {
        this.wordArray.push(new Letter(element));
    });
    
    this.toString = function(){
        return this.wordArray.join(" ");
    };

    this.makeGuess = function(guess) {
        this.wordArray.forEach(letter => {
            letter.correctGuess(guess);
        });
    }

    this.allGuessed = function() {
        return this.wordArray.every((currentValue) => currentValue.guessLetter);
    }
}

module.exports = Word;