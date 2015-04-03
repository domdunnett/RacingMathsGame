// secret console cheat
// setInterval(function() { 
// 	$('#user-input').val(eval($('#question').text())); 
// 	$('#user-input').keyup(); }, 1000);

$(document).ready(function(){
	
	var userAnswer;
	var userChoice;
	var compChoice;
	var timer;
	var compTimer;
	var userGo;
	var compGo;
	var speedPerInterval = 5;
	var userDistance = 0;
	var compCar1 = 0;
	var compCar2 = 0;
	var compCar3 = 0;
	var	operators = [];
	var numCorrectAnswers = 0;
	var totalQuestions = 0;

	var race = {

		raceTrackLength: 100,
		secondsRemaining: 30,
		vehicles: ["vehicle-1", "vehicle-2", "vehicle-3", "vehicle-4"],
		moveUserCarForward: function() {

			$('#' + userChoice).animate(
				{ "left": "+=" + speedPerInterval + "%" }, "slow" );

				userDistance += speedPerInterval;

			},

		moveUserCarBackward: function() {

			$('#' + userChoice).animate(
				{ "left": "+=" + speedPerInterval + "%" }, "slow" );},

		moveCompCarForward: function() {

			$('#' + compChoice).animate(
 				{ "left": "+=" + speedPerInterval + "%" }, "slow" );

				if (compChoice === race.vehicles[0]) {
					compCar1 += speedPerInterval;
				}
				else if (compChoice === race.vehicles[1]) {
					compCar2 += speedPerInterval;
				}
				else if (compChoice === race.vehicles[2]) {
					compCar3 += speedPerInterval;
				};

				$('#' + race.vehicles[0]).removeClass('animated shake');
				$('#' + race.vehicles[1]).removeClass('animated shake');
				$('#' + race.vehicles[2]).removeClass('animated shake');
		},

		moveCompCarBackward: function() {

			$('#' + race.vehicles[0]).animate(
				{ "left": "-=" + speedPerInterval + "%" }, "slow" );

			$('#' + race.vehicles[0]).addClass('animated shake');

			$('#' + race.vehicles[1]).animate(
				{ "left": "-=" + speedPerInterval + "%" }, "slow" );

			$('#' + race.vehicles[1]).addClass('animated shake');

			$('#' + race.vehicles[2]).animate(
				{ "left": "-=" + speedPerInterval + "%" }, "slow" );

			$('#' + race.vehicles[2]).addClass('animated shake');

				compCar1 -= speedPerInterval;

				compCar2 -= speedPerInterval;

				compCar3 -= speedPerInterval;

		}

	};

	function whichOperators() {

		var checkboxes = $('.operator-checkbox');
		for (var i = 0; i < checkboxes.length; i++) {
			if ($(checkboxes[i]).prop('checked')) {
				var attr = $(checkboxes[i]).attr('operator-type');
				operators.push(attr);
			}
		}

	}

	function createRandomQuestion() {
		
		var randomQuestion;
		var randomAnswer;
		var number1;
		var number2;
		var randomOperator;

		number1 = Math.ceil(Math.random()*10);
		
		number2 = Math.ceil(Math.random()*10);

		randomOperator = operators[Math.floor(Math.random()*operators.length)];

		randomQuestion = number1 + " " + randomOperator + " " + number2;

		randomAnswer = eval(randomQuestion);

		$('#question').text(randomQuestion);
		$('#timer').text(" " + race.secondsRemaining);

		totalQuestions++;

	}

	function selectVehicles(userChoice) {

		for (var i = 0; i < race.vehicles.length; i++) {
			if (race.vehicles[i] === userChoice) {
				race.vehicles.splice(i,1);
			}
		}

	}
	
	function driveComputerCars() {
	
		compChoice = race.vehicles[Math.floor(Math.random()*race.vehicles.length)];
		race.moveCompCarForward();

	}

	function startTimer() {
	
		functionEverySecond();
		whichOperators();
		timer = setInterval(functionEverySecond, 1000);
		compTimer = setInterval(race.moveCompCarForward, 2000);
		userGo = setInterval(whoHasFinished, 500);
		compGo = setInterval(driveComputerCars, 1000);
		$('.glyphicon').addClass('glyphicon-spin');
		
	}

	function isAnswerCorrect(userAnswer, answer) {

		if (userAnswer === answer) {
			addSeconds();
			$('#user-input').val('');
			$('#user-input').parent().removeClass('has-error');
			numCorrectAnswers++;
			race.moveUserCarForward();
			if(numCorrectAnswers % 5 === 0) {
				race.moveCompCarBackward();
				$("#flash-message").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100);
			}
			createRandomQuestion();
		}
		else {
			$('#user-input').parent().addClass('has-error');
		}

	}

  function addSeconds() {

    race.secondsRemaining += 2;

  }

  function functionEverySecond() {

    if (race.secondsRemaining < 0) {
      clearInterval(timer);
      checkeredFlag();
    } else {
      $('#timer').text(race.secondsRemaining);
      race.secondsRemaining--;
    }

  }

  function whoHasFinished() {

  	var finishLine = race.raceTrackLength;
  	if(userDistance >= finishLine) {
  		$('.modal-title').text("Congratulations! You Win!");
  		$('.finish-modal-content').text("You scored " + numCorrectAnswers + " out of " + totalQuestions);
  		checkeredFlag();
  		return true;
  	}
  	else if (compCar1 >= finishLine || compCar2 >= finishLine || compCar3 >= finishLine) {
			$('.modal-title').text("You Lose!");
			$('.finish-modal-content').text("You scored " + numCorrectAnswers + " out of " + totalQuestions);
			checkeredFlag();
	  	return true;
		}

	}

  function checkeredFlag() {

		clearInterval(timer);
		clearInterval(compTimer);
		clearInterval(userGo);
		clearInterval(compGo);
		$('.glyphicon').removeClass('glyphicon-spin');
		$('#user-input').attr('disabled', '');
		$('#user-input').attr('placeholder', 'Game Over');
		$('#modal').modal();

  }


// choose vehicle event
	$(document).one('click', '.vehicle', function() {

	  userChoice = $(this).attr('id');
	  $(this).addClass('selected animated rubberBand');
	  $('.vehicle').removeClass('pulse infinite');
	  selectVehicles(userChoice);
	  $('.operator-checkbox').removeAttr('disabled');

	});

// On clicking Race!, remove disabled inputs
	$('#play').click(function() {

		$('#user-input').attr('id', 'user-input');
		$('#user-input').removeAttr('disabled');
		$('#user-input').removeAttr('placeholder');
		$('#user-input').focus();

	});

// On focusing on input, start timer
	$(document).one('focus', '#user-input', function() {

		startTimer();
		createRandomQuestion();

	});

// Press Spacebar to skip
  $('#user-input').keydown(function(e) {

    if (e.keyCode == '32') {
    	$("#flash-skip").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100);
      createRandomQuestion();
    }

  });

// When user types answer, check if it's right
	$(document).on('keyup', '#user-input', function() {

		userAnswer = Number($('#user-input').val());
		var answer = eval($('#question').text());
		isAnswerCorrect(userAnswer, answer);

	});

// Reset button refreshes page after finish
	$('#reset').click(function(){

		location.reload();

	});

// Click info sign, rules show
	$('#info-sign').click(function() {

		$('#infoModal').modal();

	});

});
