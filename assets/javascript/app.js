


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


//Globals
var     timmerDisplay = $('#timmerDisplay'), correct = [], incorrect = [], tQuests, results = [], timeRef, running = false, score = 0, colorSpin = ['text-white bg-danger mb-3','text-white bg-warning mb-3','text-white bg-success mb-3'];
var currentGameObj;
const   QUESTION_TIMMER = 25, WAIT_DELAY = 2000, D = ':', TF = 'tf', MULTI = 'multi';

var triviaQuestion = function () {
    return {
        id: 0,
        title: '',
        question: '',
        answers: [],
        answer: 0,
    };
}


var idCounter = 0, triviaQuestions = [], questions = '', timeCount = 0, timerIsOn = false, time = 0;

$(document).ready(function () {

    $('#gameTitle').hide();
    $('#gameTitle').load("https://ryanccrawford.github.io/TriviaGame/assets/data/questions.txt", 'load=true',
        function (data, status) {

            processQuestions(data);
            $('#gameTitle').addClass('text-white');
            $('#gameTitle').text('Trivia Bonanza').show();
            startGame();
        }
    );

});
var game = function () {
    return {
        id: null,
        tile: null,
        question: null,
        choices: null,
        answer: null,
        _questionObject: null,
        nextQuestion: function(){
            this._questionObject = getNextQuestion();
            $('#multi-choice-answers').empty();
            this.question = this._questionObject.question;
            this.id= this._questionObject.id;
            this.tile= this._questionObject.title;
            this.choices= this._questionObject.answers;
            this.answer= this._questionObject.answer;
            var answerList = $('<ul>');
            var color = Math.floor(Math.random()*3);
            var bgColor = colorSpin[color];
            $('#area').removeClass();
            $('#area').addClass(bgColor);
            $(answerList).addClass('list-group list-group-flush');
            for (let i = 0; i < this.choices.length; i++) {
                var button = $('<li>');
                $(button).addClass('text-dark');
                $(button).attr('id', 'answer_' + i.toString());
                var answerText = this.choices[i];
                var icon = $('<img>');
                $(icon).attr('src', 'assets/images/check.gif');
                $(icon).css('width', '64px');
                $(button).before(icon);
                $(button).text(answerText);
                $(button).click(this.bclick);
                $(button).addClass('list-group-item pointer-hover');
                $(answerList).append(button);

            }
            $('#multi-choice-answers').append(answerList);
            $('#question').text(this.question);
            $('#qtitle').text(this.tile);
            timeCount = QUESTION_TIMMER;
            setTimer(timeCount);   
            setTimeout(startTimmer(), 2000);

            
        },
        startGame: function () {
            updateTimmerDisplay();
            timeCount = QUESTION_TIMMER;
            setTimer(timeCount);
            this.nextQuestion();
        },
        playerAnswer: '',
        bclick: function (event) {
            pauseTimmer();
            var choice = event.currentTarget.id;
            results.push(choice);
            currentGameObj.playerAnswer = choice;
            
            if(isGameOver()){
                doGameOver();
            }
            currentGameObj._questionObject = getNextQuestion();
           currentGameObj.nextQuestion();

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
        tq.id = idCounter++;
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
    updateTimmerDisplay();
    results = [];
    currentGameObj = new game();
    
    currentGameObj.startGame();
    
}
function getNextQuestion(){
    triviaQuestions.reverse();
    return triviaQuestions.pop();
   
}


function timeToString(t) {
  
    var seconds = t.toString();

    if (seconds < 10) {
        seconds = "0" + seconds;
    }else{

    }
    return "00:" + seconds;
}
function tick() {
    if (running) {
        
        if (--timeCount < 0) {
            running = false;
            timesUP();
        } else {
            updateTimmerDisplay();
        }
    }
}
function setTimer(_time = 0) {
    if(_time != 0){
        time = _time;
    }
    
    running = false;
}
function updateTimmerDisplay(){
    var t = timeToString(timeCount);
    $(timmerDisplay).text(t);

}

function startTimmer() {
    if (!running) {
        
        running = true;
        timeRef = setInterval(tick, 1000);

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
function timesUP(){
//TODO: function to fire when time is up. Needs to load the next question if there is one
    
if(isGameOver()){
        showGameOutcome();

    }else{
        tQuests.nextQuestion();
    }
}
function isGameOver(){
    return triviaQuestions.length <= 0;
}
function showGameOutcome(){

    //TODO: function for modal box popup of game outcome
    $('#messageOver').modal('show')

}