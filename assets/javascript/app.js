


// * You'll create a trivia form with multiple choice or true/false options (your choice).
// * The player will have a limited amount of time to finish the quiz. 
// * The game ends when the time runs out.The page will reveal the number of questions that players answer correctly and incorrectly.
// * Don't let the player pick more than one answer per question.
// * Don't forget to include a countdown timer.
// * Timed Questions

// * You'll create a trivia game that shows only one question until the player answers it or their time runs out.
// * If the player selects the correct answer, show a screen congratulating them for choosing the right option.After a few seconds, display the next question-- do this without user input.
// * The scenario is similar for wrong answers and time - outs.
// * If the player runs out of time, tell the player that time's up and display the correct answer. Wait a few seconds, then show the next question.
// * If the player chooses the wrong answer, tell the player they selected the wrong option and then display the correct answer.Wait a few seconds, then show the next question.
// * On the final screen, show the number of correct answers, incorrect answers, and an option to restart the game(without reloading the page).


// taken from timers class work assignment

//Globals
var timmerDisplay = $('#timmerDisplay')
var correct = 0; // correct answer score
var incorrect = 0; // incorrect answer score
const QUESTION_TIMMER = 10 // Time per question in ms
const WAIT_DELAY = 2000; // Time between the questions in ms
const D = ':'; //Delimiter for parsing the data txt files / Could you JSON here but for simplicity  just using plain TXT files with windows line endings
const TF = 'tf';
const MULTI = 'multi';
//Question Object
var triviaQuestion = function () {
    return {
        id: 0,
        title: '',
        question: '',
        answers: [],
        answer: 0,
    };
};
var timeRef;
var running = false;
var score = 0;
//Question ID Counter
var id = 0;
// Array to hold all question objects
var triviaQuestions = [];
// string to hold raw txt file data from server
var questions = '';
//actual timer count
var timeCount = 0;
// reference to timer to cancel
//used to indicate timers state
var timerIsOn = false;
var time = 0;
$(document).ready(function () {

    $('#gameTitle').hide();
    $('#gameTitle').load("https://ryanccrawford.github.io/TriviaGame/assets/data/questions.txt", 'load=true',
        function (data, status) {

            processQuestions(data);
            $('#gameTitle').text('Trivia Bonanza').show();
            startGame();
        }
    );

});
var game = function (_questionObject) {
    return {
        id: _questionObject.id,
        tile: _questionObject.title,
        question: _questionObject.question,
        choices: _questionObject.answers,
        answer: _questionObject.answer,
        startGame: function () {
            var answerList = $('<ul>');
            $(answerList).addClass('list-group');
            for (let i = 0; i < this.choices.length; i++) {
                var button = $('<li>');
                $(button).addClass('text-dark');
                $(button).attr('id', 'answer_' + i.toString());
                $(button).text(this.choices[i]);
                $(button).click(this, this.bclick);
                $(button).addClass('list-group-item pointer-hover');
                $(answerList).append(button);

            }
            $('#multi-choice-answers').append(answerList);
            $('#question').text(this.question);
            $('#qtitle').text(this.tile);
            timeCount = QUESTION_TIMMER;
            setTimer(timeCount);
            startTimmer();
        },
        playerAnswer: '',
        bclick: function (event, thisRef) {
           
            var choice = event.currentTarget.id;
            if (choice[choice.length - 1] === thisRef.answer) {

                return true;
            } else {
                return false;
            }

        },
        isAnswerCorrect: false,

    };

};

function processQuestions(_questions) {
    questions = _questions;
    var re = /((.*\S*):+(.*\S*):+)((\[(.*)\]),(.*:+.*:+.*:+.*)|(\[(.*)\]))\n/gim;
    var matches = _questions.matchAll(re);
    var flag = false;
    var ref;
    while (ref = matches.next()) {
        if (!ref.value) {
            break;
        }
        var tq = new triviaQuestion();
        tq.id = id++;
        tq.title = ref.value[2];
        tq.question = ref.value[3];
        if (ref.value[6] == 'multi') {
            var an = ref.value[7].split(':');
            var l = an.length;
            for (var i = 0; i < l; i++) {
                tq.answers.push(an[i]);
            }
        } else {
            tq.answers.push('True');
            tq.answers.push('False');
        }
        triviaQuestions.push(tq);
    }


}
function startGame() {

    resetScreen();
    var results = [];
    var currentQuestion = triviaQuestions.pop();
    var tQuests = new game(currentQuestion, gt);
    tQuests.startGame();

}
function timeToString(t) {
  
    var seconds = t.toString();

    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return seconds;
}
function tick() {
    if (running) {
        --timeCount;
        if (timeCount <= 0) {
            timesUP();
            running = false;
        } else {
            var currentTime = timeToString(timeCount);
            $(timmerDisplay).text(currentTime);
        }
    }
}
function setTimer(_time) {
    if (typeof (_time) === 'undefined') {
        time = time;
    } else {
        time = _time;
    }
}
function startTimmer() {
    if (!running) {
        running = true;
        timeRef = setInterval(tick, time);

    }
}
function pauseTimmer() {
    if (running) {
        clearInterval(timeRef);
        running = false;
    }
}
function resetTimmer() {
    pauseTimmer();
    timeCount = parseInt(QUESTION_TIMMER);
}
function resetScreen() {
    
   $('#question').text('');
   $('#multi-choice-answers').text('');
   $('#tf-answers').text('');
   $('#timmerDisplay').text('');
}