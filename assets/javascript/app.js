


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
var timmerDisplay = $('#timmerDisplay'), correct = [], incorrect = [], tQuests, results = [], timeRef, running = false, score = 0, colorSpin = ['text-white bg-blue mb-3', 'text-white bg-cyan mb-3', 'text-white bg-green mb-3'];
var currentGameObj, questCount = 0;
const QUESTION_TIMMER = 20, WAIT_DELAY = 2000, D = ':', TF = 'tf', MULTI = 'multi';

var triviaQuestion = function () {
    return {
        id: 0,
        title: '',
        question: '',
        answers: [],
        guessed: '',
        answer: ''
    };
}


var idCounter = 0, triviaQuestions = [], answers = '', questions = '', timeCount = 0, timerIsOn = false, time = 0;

$(document).ready(function () {
    $('#timmerDisplay').hide();
    $('#gameTitle').hide();
    $('#gameTitle').load("https://ryanccrawford.github.io/TriviaGame/assets/data/questions.txt", 'load=true',
        function (data, status) {

            if (status === 'success') {
                $('#gameTitle').addClass('text-white');
                $('#gameTitle').text('Trivia Bonanza').fadeIn(250);
                processQuestions(data);

                $('#answerHolder').load("https://ryanccrawford.github.io/TriviaGame/assets/data/answers.txt", 'load=true',
                    function (answers, status) {
                        if (status === 'success') {
                            $('#answerHolder').empty();
                            processAnswers(answers);
                            setTimeout(startGame, 2000);
                        } else {
                            doLoadError();
                        }
                    }
                );
            } else {
                doLoadError();
            }
        }
    );

    $('#messageOver').on('show.bs.modal', function (event) {
        var trigger = $(event.relatedTarget)
        var modal = $(this)
        modal.find('.modal-title').text("Test")
        console.log(this)
    })

});
var game = function () {
    return {
        id: null,
        tile: null,
        question: null,
        choices: null,
        answer: null,
        _questionObject: null,
        nextQuestion: function () {
            questCount++;
            if (!running) {
                $('#multi-choice-answers').empty();
                this.question = this._questionObject.question;
                this.id = this._questionObject.id;
                this.tile = questCount + ". " + this._questionObject.title;
                this.choices = this._questionObject.answers;
                this.answer = this._questionObject.answer;
                var answerList = $('<ul>');
                var color = Math.floor(Math.random() * 3);
                var bgColor = colorSpin[color];
                $('#area').removeClass();
                $('#area').addClass('card col');
                $('#area').addClass(bgColor);
                $(answerList).addClass('list-group list-group-flush');
                $('#area').fadeIn();
                for (let i = 0; i < this.choices.length; i++) {
                    var button = $('<li>');
                    $(button).addClass('text-dark');


                    if (this.choices.length == 2) {
                        if (i == 0) {
                            $(button).attr('id', 'answer_T');
                        } else {
                            $(button).attr('id', 'answer_F');
                        }

                    } else {
                        $(button).attr('id', 'answer_' + i.toString());

                    }


                    var answerText = this.choices[i];
                    // var icon = $('<img>');
                    // $(icon).attr('src', '../images/check.gif');
                    // $(icon).css('width', '64px');
                    // $(button).before(icon);
                    $(button).text(answerText.toUpperCase());
                    $(button).click(this.bclick);
                    $(button).addClass('list-group-item pointer-hover');
                    $(answerList).append(button);

                }
                $('#multi-choice-answers').append(answerList);
                $('#question').text(this.question);
                $('#qtitle').text(this.tile);

                timeCount = QUESTION_TIMMER;
                setTimer(timeCount);
                startTimmer();

            }
        },
        startGame: function () {

            timeCount = QUESTION_TIMMER;
            next();

        },
        playerAnswer: '',
        bclick: function (event) {
            pauseTimmer();
            $(timmerDisplay).hide();
            $('#area').hide();
            var choice = event.currentTarget.id;
            var letterAnswer;
            switch (choice) {
                case 'answer_0':
                    letterAnswer = 'A'
                    break;
                case 'answer_1':
                    letterAnswer = 'B'
                    break;
                case 'answer_2':
                    letterAnswer = 'C'
                    break;
                case 'answer_3':
                    letterAnswer = 'D'
                    break;
                case 'answer_T':
                    letterAnswer = 'T'
                    break;
                case 'answer_F':
                    letterAnswer = 'F'
                    break;
                default:
                    letterAnswer = 'none'
                    break;
            }

            scoreIt(letterAnswer);

            if (isGameOver()) {
                showGameOutcome();

            } else {

                setTimeout(next, 4000)
            }

        },
        isAnswerCorrect: false,

    };

};
function next() {
    currentGameObj._questionObject = getNextQuestion();
    currentGameObj.nextQuestion();

}
function scoreIt(_answer) {
    currentGameObj._questionObject.playerAnswer = _answer;
    if (currentGameObj._questionObject.answer.startsWith(_answer)) {
        currentGameObj._questionObject.isAnswerCorrect = true;
        showCorrectMessage(currentGameObj._questionObject);
    } else {
        currentGameObj._questionObject.isAnswerCorrect = false;
        showIncorrectMessage(currentGameObj._questionObject);
    }
    results.push(currentGameObj._questionObject);

}
function showCorrectMessage(_questObj) {
    var a = getTF(_questObj.answer);
    $('.correct').hide()
    $('.correct').text(a + ' IS CORRECT!').addClass('correctText', 'correctMark')
    $('.correct').show()
    $('.correct').show()
    setTimeout(function () {
        $('.correct').fadeOut(500)
    }, 3000)

}
function showIncorrectMessage(_questObj) {
    var a = getTF(_questObj.answer);
    $('.incorrect').hide()
    $('.incorrect').text('INCORRECT ANSWER!').addClass('incorrectText')
    var g = $('<span>').text(' THE CORRECT ANSWER IS ' + a)
    $('.incorrect').append(g)
    $('.incorrect').show()
    setTimeout(function () {
        $('.incorrect').fadeOut(500)
    }, 3000)
}
function getTF(_answer) {
    if (_answer.startsWith('T')) {
        return "TRUE"
    }
    if (_answer.startsWith('F')) {
        return "FALSE"
    }
    return _answer;
}
function processAnswers(_answers) {

    answers = _answers;
    var re = /(([ABCDTF]\n)|(F\s.+))/g;
    var matches = _answers.matchAll(re);
    var ref;
    var ct = 0;

    while (ref = matches.next()) {

        if (!ref.value) {
            break;
        }
        triviaQuestions[ct++].answer = ref.value[1];
    }
}
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
        var choices = ['A.', 'B.', 'C.', 'D.']
        tq.id = idCounter++;
        tq.title = ref.value[2];
        tq.question = ref.value[3];
        if (ref.value[6] == 'multi') {
            var an = ref.value[7].split(':');
            var l = an.length;
            for (var i = 0; i < l; i++) {
                tq.answers.push(choices[i] + " " + an[i]);
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
function getNextQuestion() {
    // triviaQuestions.reverse();
    return triviaQuestions.pop();

}


function timeToString(t) {

    var seconds = t.toString();

    if (seconds < 10) {
        seconds = "0" + seconds;
    } else {

    }
    return seconds + ' <span class="seconds"> seconds remaining.</span>';
}
function tick() {
    if (running) {

        if (timeCount == 0) {
            clearInterval(timeRef)
            running = false;
            timesUP();

        } else {
            timeCount--;
            updateTimmerDisplay();
        }
    }
}
function setTimer(_time = 0) {
    if (_time != 0) {
        time = _time;
    }

    running = false;
}
function updateTimmerDisplay() {
    var t = timeToString(timeCount);
    $(timmerDisplay).html(t);

}

function startTimmer() {
    if (!running) {

        running = true;
        timeRef = setInterval(tick, 1000);
        $(timmerDisplay).fadeIn(250);
    } else {
        running = false;
        clearInterval(timeRef)
        running = true;
        $(timmerDisplay).fadeIn(250);
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
    $('#area').hide();
    $('#question').text('');
    $('#multi-choice-answers').text('');
    $('#tf-answers').text('');
    $('#timmerDisplay').empty();

}
function timesUP() {
    //TODO: function to fire when time is up. Needs to load the next question if there is one

    $('#area').fadeOut(250);
    $(timmerDisplay).fadeOut(250);

    if (isGameOver()) {

        setTimeout(showGameOutcome, 5000);

    } else {
        scoreIt('TimeOut');
        setTimeout(next, 5000);
    }
}
function isGameOver() {
    return triviaQuestions.length == 0;
}
function showGameOutcome() {

    var correct, incorrect, timedout;
    var answersLength = results.length
    for (let i = 0; i < answersLength; i++) {
        var yourGuess = results[i].playerAnswer
        var rightAnswer = results[i].answer
        if (yourGuess === 'TimeOut') {
            timedout++
            continue;
        }
        if (yourGuess === rightAnswer) {
            correct++
            continue;
        }
        incorrect++

    }
    var percentage = parseInt((correct / answersLength) * 100)
    var p1 = $('<p>').text('You got ' + correct.toString() + ' correct.').css('color', 'red')
    var p2 = $('<p>').text('You got ' + incorrect.toString() + ' incorrect.').css('color', 'green')
    var p3 = $('<p>').text("That's " + percentage + "% ")
    $('.modal-body').append(p1).append(p2).append(p3);
    var message;
    if (percentage > 90) {
        message = "Wow! You must be pretty social. ";

    }
    if (percentage > 80) {
        message = "Not Bad! You must get out of the house every other day"
    }
    if (precentage > 70) {
        message = "Just Like Everyone Else! You need to get out more!"
    }
    if (percentage > 60) {
        message = "Sorry, but if you put the phone down for a day and left the house once a week, starting today, there might be hope for you!"
    }
    if (percentage <= 60) {
        message = "Ouch! The bad news... You are beyond help. The good news... The planet will end soon anyways"
    }
    var p4 = $('<p>').text(message)
    $('.modal-body').append(p1).append(p2).append(p3).append(p4);
    $('#messageOver').modal('show');

}
function doLoadError() {
    //TODO: NETWORK ERROR MESSAGE HERE

}