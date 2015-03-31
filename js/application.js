$(document).ready(function(){
	
	var number1;
	var number2;
	var randomQuestion;
	var userAnswer;
	var randomAnswer;
	var secondsRemaining = 10;

	function createRandomQuestion() {

		number1 = Math.ceil(Math.random()*10);
		
		number2 = Math.ceil(Math.random()*10);

		randomQuestion = number1 + " + " + number2;
		randomAnswer = eval(randomQuestion)

		$('#question').text(randomQuestion);

	}

	function startTimer() {
	
		var timer = setInterval(functionEverySecond, 1000);
		$('.glyphicon').addClass('glyphicon-spin');
		
	}


	function isAnswerCorrect(userAnswer, answer) {
		if (userAnswer === answer) {
			addSeconds();
			$('#user-input').val('');
			$('#user-input').parent().removeClass('has-error');
			$('#car-1').animate({ "left": "+=50px" }, "slow" );
			createRandomQuestion();
		}
		else {
			$('#user-input').parent().addClass('has-error');
			$('#car-1').animate({ "left": "-=10px" }, "slow" );
		}
	}

  function addSeconds() {
    secondsRemaining += 2;
  }

  function functionEverySecond() {
    if (secondsRemaining < 0) {
      
      clearInterval(timer);
    } else {
      $('#timer').text(secondsRemaining);
      secondsRemaining--;
    }
  }


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
		answer = eval($('#question').text());
		isAnswerCorrect(userAnswer, answer);
	});

	
});
