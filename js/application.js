$(document).ready(function(){
	
	var userAnswer;
	var randomAnswer;
	var userChoice;
	var compChoice;
	var timer;
	var compTimer;
	var userGo;
	var compGo;
	var speed = 100;

	var race = {
		raceTrackLength: $('.track').width(),
		secondsRemaining: 30,
		vehicles: ["vehicle-1", "vehicle-2", "vehicle-3", "vehicle-4"],
		moveUserCarForward: function() {$('#' + userChoice).animate({ "left": "+="+ speed +"px" }, "slow" );},
		moveUserCarBackward: function() {$('#' + userChoice).animate({ "left": "-="+ speed +"px" }, "slow" );},
		moveCompCarForward: function() {$('#' + compChoice).animate({ "left": "+="+ speed +"px" }, "slow" );},
		moveCompCarBackward: function() {$('#' + compChoice).animate({ "left": "-="+ speed +"px" }, "slow" );}
	}

	function convertWidthToNumber(widthString) {
			var converted = widthString.substr(0, widthString.length-2);
			return Number(converted);
	}

	function createRandomQuestion() {
	
		var randomQuestion;
		var number1;
		var number2;

		number1 = Math.ceil(Math.random()*10);
		
		number2 = Math.ceil(Math.random()*10);

		randomQuestion = number1 + " + " + number2;
		randomAnswer = eval(randomQuestion);

		$('#question').text(randomQuestion);
		$('#timer').text(" " + race.secondsRemaining);

	}

	
	function selectVehicles(userChoice) {
		for (var i = 0; i < race.vehicles.length; i++) {
			if (race.vehicles[i] === userChoice) {
				race.vehicles.splice(i,1);
			}
		};
	}
	
	function driveComputerCars() {
		
		compChoice = race.vehicles[Math.floor(Math.random()*race.vehicles.length)];
		race.moveCompCarForward();

	}


	function startTimer() {
	
		timer = setInterval(functionEverySecond, 1000);
		compTimer = setInterval(race.moveCompCarForward, 2000);
		userGo = setInterval(whoHasFinished, 500);
		compGo = setInterval(driveComputerCars, 300);
		$('.glyphicon').addClass('glyphicon-spin');
		
	}


	function isAnswerCorrect(userAnswer, answer) {
		if (userAnswer === answer) {
			addSeconds();
			$('#user-input').val('');
			$('#user-input').parent().removeClass('has-error');
			race.moveUserCarForward();
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

  	var userCarPosition = $('#' + userChoice).position().left;
  	var finishLine = race.raceTrackLength;
  	if(userCarPosition > finishLine) {
  		console.log("You win!");
  		checkeredFlag();
  		return true;
  	}
  	else {
	  	for (var i = 0; i < race.vehicles.length; i++) {
		  	var compCarPosition = $('#'+ race.vehicles[i]).position().left;
	  		if(compCarPosition > finishLine) {
			  		console.log("You Lose!");
			  		checkeredFlag();
			  		return true;
	  		}
	  	}
  	}
  }

  function checkeredFlag() {
		clearInterval(timer);
		clearInterval(compTimer);
		clearInterval(userGo);
		clearInterval(compGo);
		$('.glyphicon').removeClass('glyphicon-spin');
		$('#user-input').attr('disabled');
		$('#user-input').attr('placeholder', 'Game Over');
  }

	$(document).one('click', '.vehicle', function() {
	  userChoice = $(this).attr('id');
	  $(this).addClass('selected animated rubberBand');
	  selectVehicles(userChoice);
	});

	createRandomQuestion();

	$('#play').click(function() {
		$('#user-input').attr('id', 'user-input');
		$('#user-input').removeAttr('disabled');
		$('#user-input').removeAttr('placeholder');
		$('#user-input').focus();
	});

	$(document).one('focus', '#user-input', function() {
		startTimer();
	});

	$(document).on('keyup', '#user-input', function() {
		userAnswer = Number($('#user-input').val());
		var answer = eval($('#question').text());
		isAnswerCorrect(userAnswer, answer);
	});

	
});
