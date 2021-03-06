


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
var timmerDisplay = $('#timmerDisplay'), correct = [], incorrect = [], tQuests, results = [], timeRef, running = false,colorSpin = ['text-white bg-blue mb-3', 'text-white bg-cyan mb-3', 'text-white bg-green mb-3'], currentGameObj, questCount = 0
//Global Conts
const QUESTION_TIMMER = 22, WAIT_DELAY = 2000, D = ':', TF = 'tf', MULTI = 'multi';
// question object
var triviaQuestion = function () {
    return {
        id: 0,
        title: '',
        question: '',
        answers: [], //hold mutiple coice and True False choices
        guessed: '', //holds players answer
        answer: '', //holds real answer
        isAnswerCorrect: false
    };
}

//More Globals
var idCounter = 0, triviaQuestions = [], answers = '', questions = '', timeCount = 0, timerIsOn = false, time = 0;

//Waits for document to load 
$(document).ready(function () {
    init()
})
function init(){
    $('#countdown').hide();
    $('#gameTitle').hide();
    $('#titleBar').hide();
    $('#howToBox').hide();
   //here we use a little ajax trick that I learned a long long time ago. Because I'm using plain txt files stored on the 
    //server I need a way to load the files without ajax in jq gving me greif. So I learned that by loading the files into a 
    //div tag on the page using the load method. ajax will be nicer to me. 
    $('#questionHolder').empty();
    $('#answerHolder').empty();
    $('#questionHolder').load("https://ryanccrawford.github.io/TriviaGame/assets/data/questions.txt", 'load=true',
        function (data, status) {

            if (status === 'success') {
                processQuestions(data);
                $('#answerHolder').load("https://ryanccrawford.github.io/TriviaGame/assets/data/answers.txt", 'load=true',
                    function (answers, status) {
                        if (status === 'success') {

                            processAnswers(answers);
                            
                        } else {
                            doLoadError();
                        }
                    }
                );
            } else {
                doLoadError();
            }
        }
    ).done(doStartScreen());
    

  
    
}

//start screen creator
function doStartScreen() {
   
    $('#startScreen').fadeIn(250)

    $('#spage1').click(function () {
      
        $('#startScreen').fadeOut(250)
            setTimeout(startTheGame, 250)
    })
    $('#spage2').click(function () {

        $('#startScreen').fadeOut(250)
        $('#howToBox').fadeIn(500);
        $('#exitHowTo').click(function () {
            $('#howToBox').fadeOut(150);
            $('#startScreen').fadeIn(250)
        })
       
    })
    $('#spage3').click(function () {
     
        $('#startScreen').fadeOut(500)
        
    })
}

function startTheGame() {
    
    
        $('#gameTitle').fadeIn(250);
        $('#titleBar').fadeIn(100);
        startGame()
    
}

//Game object that stores the current display logic and creates the click events for the dynamically created game elements
var game = function () {
    return {
        id: null,
        tile: null,
        question: null,
        choices: null,
        answer: null,
        _questionObject: null,
        nextQuestion: function () { // creates the question card and fill it withe answers
            questCount++;
            if (!running) {
             
                $('#multi-choice-answers').empty();
                this.question = this._questionObject.question;
                this.id = this._questionObject.id;
                this.tile = questCount + ". " + this._questionObject.title;
                this.choices = this._questionObject.answers;
                this.answer = this._questionObject.answer.charAt(0);
                var answerList = $('<ul>');
                var color = Math.floor(Math.random() * 3);// Randomly select a color to use as the color background
                var bgColor = colorSpin[color];

                $('#area').removeClass();
                $('#area').addClass('card col');
                $('#area').addClass(bgColor);
                $(answerList).addClass('list-group list-group-flush');
                
                //Creates The question choices as a list item that then is style like a button
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
                    // var imagName
                    // var cardImg = $('<img>')
                    // if (imageCount < 10) {
                    //  imagName = './assets/images/image__' + (imageCount++).toString() + '__.jpg'
                    // } else {
                    //     imagName = './assets/images/image__' + (imageCount++).toString() + '_.jpg'
                    // }
            
                   
                   
                    var answerText = this.choices[i];
                    $(button).text(answerText.toUpperCase());
                    $(button).click(this.bclick);
                    $(button).addClass('list-group-item pointer-hover');
                    $(answerList).append(button);
                    //$('body').css('background-image','url('+imagName+')');
                }
                $('#multi-choice-answers').append(answerList);
                $('#question').text(this.question);
                $('#qtitle').text(this.tile);
                $('#area').fadeIn(120);
                timeCount = QUESTION_TIMMER;
                setTimer();
               setTimeout(startTimmer, 500);

            }
        },
        startGame: function () {

            timeCount = QUESTION_TIMMER;
            next();

        },
        playerAnswer: '',
        bclick: function (event) {// the click event that is attached to the answer choice buttons
            resetTimmer();
            updateTimmerDisplay(true)
            $('#area').hide();
            var choice = event.currentTarget.id;
            var letterAnswer;
            switch (choice) { //Checks users Input
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
// Stores and loads the next qestion into the game object
function next() {
    currentGameObj._questionObject = getNextQuestion();
    currentGameObj.nextQuestion();

}
// checks and stores the players answers
function scoreIt(_answer) {
    var questionObj = currentGameObj._questionObject
    questionObj.playerAnswer = _answer;
    if (questionObj.answer.startsWith(_answer)) {
        questionObj.isAnswerCorrect = true;
        showCorrectMessage(questionObj);
    } else {
        questionObj.isAnswerCorrect = false;
        showIncorrectMessage(questionObj);
    }
    results.push(questionObj);

}
//--------------------- Ryans Custom File Parser --------------------------------------------------
// Shows Correct answer message
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
//Displays Message for Wrong Answers
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

//-------------------------- Parser Helper Functions -------------------------------------------------------
//Used to decode True False Answers
function getTF(_answer) {
    if (_answer.startsWith('T')) {
        return "TRUE"
    }
    if (_answer.startsWith('F')) {
        return "FALSE"
    }
    return _answer;
}
//Custom Regex Parser to parse answers file
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
        triviaQuestions[ct++].answer = ref.value[1].charAt(0);
    }
}
//Custom Regex Parser for Questions File
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

//---------------------------------Game Functions--------------------------------------------------------
//Start up and Init Game
function startGame() {

    resetScreen();
    results = [];
    currentGameObj = new game();
    $('#timer').show();
    currentGameObj.startGame();

}
//Gets the next question out of the que 
function getNextQuestion() {
    // triviaQuestions.reverse();
    return triviaQuestions.pop();

}

//---------------------------------------Timer Functions ------------------------------------------------------------------

//Converts the counter into the displayed countdown digits
function timeToString(t) {

    var seconds = parseInt(t);

    if (seconds < 10) {
        if (!$('#timer-number').hasClass('below10')) {
            $('#timer-number').addClass('below10')
        } 
        seconds = "0" + seconds.toString();
    } else {
        if ($('#timer-number').hasClass('below10')) {
            $('#timer-number').removeClass('below10')
        } 
    }
    return seconds.toString();
}
//Timer counter
function tick() {

    
    if (running) {
        updateTimmerDisplay()
        if (timeCount > 20) {
            timeCount = 20
        }
        if (timeCount == 0) {
            running = false;
            $('circle').removeClass('circle')
            $('#timer').hide()
            clearInterval(timeRef)
            timesUP();

        }
        if(timeCount > 0 ) {
            timeCount--
            
        }
    }
}
//Sets the initial count down time
function setTimer(_time = 20) {
    running = false;
    clearInterval(timeRef)    
    timeCount = 20;
    
}
//Updates the screen to shows seconds left
function updateTimmerDisplay(force = false) {
    if (force) {
        $('#timer-number').text(timeToString(20))
    } else {
        $('#timer-number').text(timeToString(timeCount))
    }
}
//Start the global timer
function startTimmer() {
    if (!running) {
       
        running = true;
        
        timeRef = setInterval(tick, 1000)
        $('circle').addClass('circle')
        $('#timer').show()
    }
   

}
function stopTimer() {
    $('#timer').hide()
    $('circle').removeClass('circle')
    running = false;
    clearInterval(timeRef)
}
// resets the timer for the next question
function resetTimmer() {
    stopTimer();
    timeCount = parseInt(QUESTION_TIMMER);
}

//---------------------------------------Game Helper Functions-------------------------
//Clears the elements on the screen
function resetScreen() {
    $('#area').hide();
    $('#question').empty();
    $('#multi-choice-answers').empty();
    $('#tf-answers').empty();

}
//called when timer hits 0 on all questions
function timesUP() {
    $('#area').fadeOut(250);
    scoreIt('TimeOut');
    
    if (isGameOver()) {

        setTimeout(showGameOutcome, 6000);

    } else {
        
        setTimeout(next, 5000);
    }
}
//chesks to see if the all questions have been answerd
function isGameOver() {
    return triviaQuestions.length == 0;
}
//Show end of game score and rankings Dialog. Talleies up the final score 
function showGameOutcome() {

    var correct = 0, incorrect = 0, timedout = 0;
    var answersLength = results.length
    for (let i = 0; i < answersLength; i++) {
      
        if (results[i].isAnswerCorrect) {
            correct++
           
        } else {
            incorrect++
        }
       

    }
    var percentage = parseInt((correct / answersLength) * 100)
    var p1 = $('<p>').text('You got ' + correct + ' correct.').css('color', 'Green')
    var p2 = $('<p>').text('And ' + incorrect + ' incorrect out of ' + answersLength.toString()).css('color', 'red')
    var p3 = $('<p>').text("That's " + percentage + "% ").css('color', 'blue')
    $('.modal-body').empty()
   
    var message;
    if (percentage > 90) {
        message = "Wow! You Are Super Human!. ";

    }
    if (percentage > 80) {
        message = "Not Bad! You Know Your Stuff."
    }
    if (percentage > 70) {
        message = "It's True, You Are Just Like Everyone Else, Human, AKA Average Joe. With a Little Work, You Could Pass as Human!"
    }
    if (percentage > 60) {
        message = "Sorry, but you are most likley NOT Human!"
    }
    if (percentage <= 60) {
        message = "Were you just pressing random keys? The bad news is.. The game is over. The good news... You can play again!"
    }
    var p4 = $('<p>').text(message);
    $('.modal-body').append(p1).append(p2).append(p3).append(p4);
    $('#messageOver').on('show.bs.modal', function (event) {
        var trigger = $(event.relatedTarget);
        var modal = $(this);
        modal.find('.modal-title').text("Game Over");
              
    })
    $('#messageOver').on('hidden.bs.modal', function (e) {

        $('#gameTitle').fadeOut(250);
        $('#titleBar').fadeOut(100);
        results = [];
        currentGameObj = null;
        triviaQuestions = []
        questions = ''
        questCount = 0
        tQuests = ''
        incorrect = []
        correct = []
        clearInterval(timeRef)
        timeRef = ''
        running = false;
        init()
    })
     $('#messageOver').modal('show');
}
//TODO: incase ther is a network Error loading the game data. Not really needed for this project
function doLoadError() {
    //TODO: NETWORK ERROR MESSAGE HERE

}