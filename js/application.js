$(document).ready(function(){
	
	var userChoice; 							// --> User's Car
	var compChoice; 							// --> Random Current Comp Car
	var timer; 										// --> Timer function Interval
	var checkFinished; 						// --> hasFinished function Interval
	var compGo; 									// --> Dive Comp Cars Interval
	var currentDistance; 					// --> User's current random distance generated
	var distanceTravelled = 5; 		// --> Generic Number to move Comp Cars Back
	var userDistance = 0; 				// --> Users distance down track
	var compCar1Distance = 0; 		// --> Comp Car 1's Distance down the track
	var compCar2Distance = 0; 		// --> Comp Car 2's Distance down the track
	var compCar3Distance = 0; 		// --> Comp Car 3's Distance down the track
	var	operators = []; 					// --> The operators to be chosen by user
	var numCorrectAnswers = 0; 		// --> User's correct answer counter
	var totalQuestions = 0; 			// --> Total questions generated
	
// ---------------------------------------------------------------------------- Race General Settings

	var race = {

		raceTrackLength: 100,
		secondsRemaining: 30,
		vehicles: ["vehicle-1", "vehicle-2", "vehicle-3", "vehicle-4"],
		moveUserCarForward: function() {

			currentDistance = randomDistanceGenerator();

			$('#' + userChoice).animate({ "left": "+=" + currentDistance + "%" }, "slow" );

			userDistance += currentDistance;
			
			},

		moveUserCarBackward: function() {

			$('#' + userChoice).animate(
				{ "left": "+=" + distanceTravelled + "%" }, "slow" );},

		moveCompCarForward: function() {
			
			var distance = randomDistanceGenerator()
			
			$('#' + compChoice).animate(
 				{ "left": "+=" + distance + "%" }, "slow" );

				if (compChoice === race.vehicles[0]) {
					compCar1Distance += distance;
				}
				else if (compChoice === race.vehicles[1]) {
					compCar2Distance += distance;
				}
				else if (compChoice === race.vehicles[2]) {
					compCar3Distance += distance;
				};

				$('#' + race.vehicles[0]).removeClass('animated shake');
				$('#' + race.vehicles[1]).removeClass('animated shake');
				$('#' + race.vehicles[2]).removeClass('animated shake');
		},

		moveCompCarBackward: function() {

			$('#' + race.vehicles[0]).animate(
				{ "left": "-=" + distanceTravelled + "%" }, "slow" );

			$('#' + race.vehicles[0]).addClass('animated shake');

			$('#' + race.vehicles[1]).animate(
				{ "left": "-=" + distanceTravelled + "%" }, "slow" );

			$('#' + race.vehicles[1]).addClass('animated shake');

			$('#' + race.vehicles[2]).animate(
				{ "left": "-=" + distanceTravelled + "%" }, "slow" );

			$('#' + race.vehicles[2]).addClass('animated shake');

				compCar1Distance -= distanceTravelled;

				compCar2Distance -= distanceTravelled;

				compCar3Distance -= distanceTravelled;

		}

	};

	
// ----------------------------------------------------------------------------	Generate a random car speed between 1 and 10
	
	function randomDistanceGenerator() {
		
		distanceTravelled = Math.floor(Math.random()*10);
		return distanceTravelled;
		
	}

// ---------------------------------------------------------------------------- Assign chosen maths operators to Array

	function whichOperators() {

		var checkboxes = $('.operator-checkbox');
		
		for (var i = 0; i < checkboxes.length; i++) {
			if ($(checkboxes[i]).prop('checked')) {
				var attr = $(checkboxes[i]).attr('operator-type');
				operators.push(attr);
			}
		}

	}
	
// ---------------------------------------------------------------------------- Generate a random question

	function createRandomQuestion() {
		
		var randomQuestion;
		var randomAnswer = 0;
		var number1;
		var number2;
		var randomOperator;

		while (randomAnswer <= 0 || randomAnswer % 1 !== 0) {
			number1 = Math.ceil(Math.random()*10);

			number2 = Math.ceil(Math.random()*10);

			randomOperator = operators[Math.floor(Math.random()*operators.length)];

			randomQuestion = number1 + " " + randomOperator + " " + number2;

			randomAnswer = eval(randomQuestion);
		}

		$('#question').text(randomQuestion);
		$('#timer').text(" " + race.secondsRemaining);

		totalQuestions++;

	}
	
// ---------------------------------------------------------------------------- Remove User Choice from Comp Cars Array

	function selectVehicles(userChoice) {

		for (var i = 0; i < race.vehicles.length; i++) {
			if (race.vehicles[i] === userChoice) {
				race.vehicles.splice(i,1);
			}
		}

	}
	
// ---------------------------------------------------------------------------- Move random Comp Car forward
	
	function driveComputerCars() {
	
		compChoice = race.vehicles[Math.floor(Math.random()*race.vehicles.length)];
		race.moveCompCarForward();

	}
	
// ---------------------------------------------------------------------------- Start the timer, drive comp cars

	function startTimer() {
	
		beginTimer();
		whichOperators();
		timer = setInterval(beginTimer, 1000);
		checkFinished = setInterval(hasFinished, 1000);
		compGo = setInterval(driveComputerCars, 500);
		$('.glyphicon').addClass('glyphicon-spin');
		
	}
	
// ---------------------------------------------------------------------------- Check if correct user answer

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
	
// ---------------------------------------------------------------------------- Add two secs to Timer for correct answer

  function addSeconds() {

    race.secondsRemaining += 2;

  }

// ---------------------------------------------------------------------------- Display timer and check if timer has expired
	
  function beginTimer() {

    if (race.secondsRemaining < 0) {
      clearInterval(timer);
      checkeredFlag();
    } else {
      $('#timer').text(race.secondsRemaining);
      race.secondsRemaining--;
    }

  }
	
// ---------------------------------------------------------------------------- Check if any car has crossed Finish Line

  function hasFinished() {

  	var finishLine = race.raceTrackLength;
		
  	if(userDistance >= finishLine) {
  		$('.modal-title').text("Congratulations! You Win!");
  		$('.finish-modal-content').text("You scored " + numCorrectAnswers + " out of " + totalQuestions);
  		checkeredFlag();
  	}
  	else if (compCar1Distance >= finishLine || compCar2Distance >= finishLine || compCar3Distance >= finishLine) {
			$('.modal-title').text("You Lose!");
			$('.finish-modal-content').text("You scored " + numCorrectAnswers + " out of " + totalQuestions);
			checkeredFlag();
		}

	}
	
// ---------------------------------------------------------------------------- Finish the Race

  function checkeredFlag() {

		clearInterval(timer);
		clearInterval(checkFinished);
		clearInterval(compGo);
		$('.glyphicon').removeClass('glyphicon-spin');
		$('#user-input').attr('disabled', '');
		$('#user-input').attr('placeholder', 'Game Over');
		$('#modal').modal();

  }

// ---------------------------------------------------------------------------- User Chooses Vehicle
	
	$(document).one('click', '.vehicle', function() {

	  userChoice = $(this).attr('id');
	  $(this).addClass('selected animated rubberBand');
	  $('.vehicle').removeClass('pulse infinite');
	  selectVehicles(userChoice);
		$('#main-title').hide('slow');
		$('#question-input').show('slow');
	  $('.operator-checkbox').removeAttr('disabled');

	});


// ---------------------------------------------------------------------------- User Chooses Operators
	
	$(document).one('click', '#checkboxes', function() {
		
		$('#play').show('slow');
		
	});
	
// ---------------------------------------------------------------------------- On click Race!
	
	$('#play').click(function() {

		$('#user-input').attr('id', 'user-input');
		$('#user-input').removeAttr('disabled');
		$('#user-input').removeAttr('placeholder');
		$('#play').hide('slow');
		$('#user-input').focus();
		startTimer();
		createRandomQuestion();

	});

// ---------------------------------------------------------------------------- Press Spacebar to skip
	
  $('#user-input').keydown(function(e) {

    if (e.keyCode == '32') {
    	$("#flash-skip").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100);
      createRandomQuestion();
    }

  });

// ---------------------------------------------------------------------------- On Keyup, Check Answer
	
	$(document).on('keyup', '#user-input', function() {

		var userAnswer = Number($('#user-input').val());
		var answer = eval($('#question').text());
		isAnswerCorrect(userAnswer, answer);

	});

// ---------------------------------------------------------------------------- Reset button refreshes page after finish
	
	$('#reset').click(function(){

		location.reload();

	});

// ---------------------------------------------------------------------------- Click info sign, rules show
	
	$('#info-sign').click(function() {

		$('#infoModal').modal();

	});

});

// ---------------------------------------------------------------------------- Chrome Console Hack

// setInterval(function() { 
// 	$('#user-input').val(eval($('#question').text())); 
// 	$('#user-input').keyup(); }, 1000);
