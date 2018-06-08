/* **index.js**: The file containing the logic for the course of the game, which depends on `Word.js` and:

  * Randomly selects a word and uses the `Word` constructor to store it

  * Prompts the user for each guess and keeps track of the user's remaining guesses
*/
var word = require('./Word');
var inquirer = require('inquirer');
var figlet = require('figlet');
var chalk = require('chalk');

var wordList =  ["Word", "Excel", "PowerPoint", "Access", "Google Chrome", "Google Drive","Adobe Acrobat", "Adobe Flash Player", 
                "Oracle", "Panopto", "Skype", "MATLAB", "Microsoft Visual Studio", "SPSS", "AutoCAD", "SolidWorks", "LINUX", "UNIX",
                "macOS", "Firefox", "GIMP" ];

var guesses = [];
var remainingGuess = 10;


//head banner
figlet('PROGRAM NAMES GUESS GAME..', function(err, data) {
    if (err) {
    console.log('Something went wrong...');
    console.dir(err);           
    return;
    }        
    console.log("\n\n"+ chalk.cyan.bgWhite(data)+ "\n\n");
    confirmStart();
});

//random word
function randomWord(wordList){
    var randomIndex =  Math.floor(Math.random() * wordList.length);
    return wordList[randomIndex];
};

var randomWordList = randomWord(wordList);
var newWord = new word(randomWordList);
newWord.makeGuess(' ');

//confirm to start a game
function confirmStart() {
	var init = [
	{
	    type: 'text',
	    name: 'Username',
        message: 'What is your name?'
	},
	{
	    type: 'confirm',
	    name: 'readyToPlay',
	    message: 'Are you ready to play?',
	    default: true
	}
	];

	inquirer.prompt(init).then(answers => {
		if (answers.readyToPlay){
			console.log(chalk.blue("Great! Welcome, " + answers.Username ));
			start();
		}

		else {
			console.log(chalk.yellow("Bye bye, " + answers.Username));
			return;
		}
	});
};

var questions = [
    {
        name: 'Guessingletter',
        message: 'Guess a letter',
        validate: function (letter) {
            var alphabet = 'abcdefghijklmnopqrstuvwxyz';
            var valid = (letter.length === 1) && (alphabet.indexOf(letter.charAt(0).toLowerCase()) !== -1); 
            return valid || 'Please enter a single letter';
        },
        when: function () {
            return (!newWord.allGuessed() && remainingGuess > 0);
        }
    },
    {
        type: 'confirm',
        name: 'Replay',
        message: 'Do you want to play again?',
        when: function () {
            return (newWord.allGuessed() || remainingGuess <= 0);
        }
    }
];

function start() {

    if (!newWord.allGuessed() && remainingGuess > 0) {
        console.log(newWord + '');
    }
    
    inquirer.prompt(questions).then(answers => {
        if ('Replay' in answers && !answers.Replay) {
            console.log(chalk.yellow('Thanks for playing'));
            process.exit();
        }
        if (answers.Replay) {
            RestartGame();
        }

        if (answers.hasOwnProperty('Guessingletter')) {
            var currentGuess = answers.Guessingletter.toLowerCase();
            
            if (guesses.indexOf(currentGuess) === -1) {
                guesses.push(currentGuess);
                newWord.makeGuess(currentGuess);
                if (randomWordList.toLowerCase().indexOf(currentGuess.toLowerCase()) === -1) {
                    remainingGuess--;
                }
            } else {
                console.log(chalk.red('You already guessed', currentGuess));
                
            }
        }

        if (!newWord.allGuessed()) {
            if (remainingGuess < 1) {
                console.log(chalk.red.bold('---Game Over---'));
                console.log(chalk.red("INCORRECT!!!!"));
                console.log(chalk.green.bold("The correct was " + randomWordList));
            } else {
                console.log('Already Guessed:', guesses.join(' '));
                console.log('Guesses remaining:', remainingGuess);
            }

        } else {
            console.log(chalk.green.bold("CORRECT !!!"));
        }

        start();
    });
}


function RestartGame() {
    randomWordList = randomWord(wordList);
    newWord = new word(randomWordList);
    newWord.makeGuess(' ');
    guesses = [];
    remainingGuess = 10;
};
