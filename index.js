/* **index.js**: The file containing the logic for the course of the game, which depends on `Word.js` and:

  * Randomly selects a word and uses the `Word` constructor to store it

  * Prompts the user for each guess and keeps track of the user's remaining guesses
*/

var word = require('./Word');
var inquirer = require('inquirer');

var wordList =  ["Word", "Excel", "PowerPoint", "Access", "Google Chrome", "Google Drive","Adobe Acrobat", "Adobe Flash Player", 
                "Oracle", "Panopto", "Skype", "MATLAB", "Microsoft Visual Studio", "SPSS", "AutoCAD", "SolidWorks", "LINUX", "UNIX",
                "macOS", "Firefox", "GIMP" ];

var target;
var targetWord;
var guesses;
var remainingGuess = 10;


function randomWord(wordList){
    var randomIndex =  Math.floor(Math.random() * wordList.length);
    return wordList[randomIndex];
};

const questions = [
    {
        name: 'letterGuessed',
        message: 'Guess a letter',
        validate: function (value) {
            var valid = (value.length === 1) && ('abcdefghijklmnopqrstuvwxyz'.indexOf(value.charAt(0).toLowerCase()) !== -1); // fix letter logic later
            return valid || 'Please enter a single letter';
        },
        when: function () {
            return (!target.allGuessed() && remainingGuess > 0);
        }
    },
    {
        type: 'confirm',
        name: 'playAgain',
        message: 'Want to play again?',
        // default: true,
        when: function () {
            return (target.allGuessed() || remainingGuess <= 0);
        }
    }
];

function resetGame() {
    targetWord = randomWord(wordList);
    // console.log(targetWord);
    target = new word(targetWord);
    target.makeGuess(' ');
    guesses = [];
    remainingGuess = 9;
}

function ask() {
    // console.log('target.allGuessed():', target.allGuessed());
    if (!target.allGuessed() && remainingGuess > 0) {
        console.log(target + '');
    }
    
    inquirer.prompt(questions).then(answers => {
        // console.log('answers.playAgain ' + answers.playAgain);
        if ('playAgain' in answers && !answers.playAgain) {
            console.log('thanks for playing');
            process.exit();
        }
        if (answers.playAgain) {
            resetGame();
        }

        if (answers.hasOwnProperty('letterGuessed')) {
            var currentGuess = answers.letterGuessed.toLowerCase();
            
            if (guesses.indexOf(currentGuess) === -1) {
                guesses.push(currentGuess);
                target.makeGuess(currentGuess);
                if (targetWord.toLowerCase().indexOf(currentGuess.toLowerCase()) === -1) {
                    remainingGuess--;
                }
            } else {
                console.log('you already guessed', currentGuess);
                
            }
        }

        if (!target.allGuessed()) {
            if (remainingGuess < 1) {
                console.log('no more guesses');
                console.log(targetWord, 'was correct.');

            } else {
                console.log('guesses so far:', guesses.join(' '));
                console.log('guesses remaining:', remainingGuess);
            }

        } else {
            console.log(targetWord, 'is correct!');
            // console.log(answers.playAgain);
        }

        ask();
    }); // end inquirer.then
}
resetGame();
ask();
