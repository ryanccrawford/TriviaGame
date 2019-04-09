//Globals
var questiontimer = 10000; // Time per question in ms
var correct = 0; // correct answer score
var incorrect = 0; // incorrect answer score
var waitBetweenQuestions = 2000; // Time between the questions in ms
const S = ':'; //Delimiter for parsing the data txt files / Could you JSON here but for simplicity  just using plain TXT files with windows line endings
const QUEST_TYPE = '[]'
var triviaQuestion = function () {
    return {
        id: 0,
        title: '',
        question: '',
        answers: []
    }
};
var id = 0;
var triviaQuestions = [];
var questions = '';
var timeCount = 0;
 var timerRef;
var timerIsOn = false;
 
$(document).ready(function () {
    var timerDisplay = $('#timmerDisplay');
    $(timerDisplay).text(timeToDisplayString(0));
    if (!timerIsOn) {
      timerRef = setInterval(doloader, 1000);
      timerIsOn = true;
    }
    $('#gameTitle').hide();
    $('#gameTitle').load("https://ryanccrawford.github.io/TriviaGame/assets/data/questions.txt", 'load=true',
        function (data, status) {
           
            processQuestions(data);
            $('#gameTitle').text('Trivia Bonanza').show();
            startGame();
            }
    );
  
  
        
       
    
    

     

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
function timeToDisplayString(t) {

    var minutes = Math.floor(t / 60);
    var seconds = t - (minutes * 60);

    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    if (minutes === 0) {
        minutes = "00";
    } else if (minutes < 10) {
        minutes = "0" + minutes;
    }

    return minutes + ":" + seconds;
}
function doloader() {

        timeCount++;
         $(timerDisplay).text(timeToDisplayString(timeCount));
}
});
var question = function () {
    return {
        id: 0,
        tile: '',
        question:'',
        choices: [],
        startTimer: function () {
            
        },
        getAnswered: function () {
            
        },
        playerAnswer: '',
        isAnswerCorrect: function () {
            
        },
        correctImage: '',
        incorrectImage:'',
}}
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
            tq.answers.push('T');
            tq.answers.push('F');
        }
        triviaQuestions.push(tq);
    }


}
function startGame() {
    clearInterval(timerRef);
    timeCount = 0;
    var tQuests = new question();













}
