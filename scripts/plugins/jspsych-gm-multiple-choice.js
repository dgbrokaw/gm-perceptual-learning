/** js-psych-gm-multiple-choice.js
 *  David Brokaw
 *
 *  This plugin runs a single Grasping Math multiple choice problem.
 *  The problem consists of:
 *  	A solution presented at the top.
 *  	4 similar expressions in a list.
 *  	One of the similar expressions is equivalent to the solution if the
 *  	correct transformation is performed on it.
 *  	The user gets one chance.
 *  	If the answer is correct, that expression will be highlighted in green.
 *  	If the answer is incorrect, that expression will be highlighted in red,
 *  	and the correct answer will be highlighted in green.
 *
 * 	Parameters:
 * 		type: "gm-multiple-choice"
 * 		problems: An array of objects.
 * 			Each object contains members:
 * 		  - solution
 * 			- A, B, C, D
 * 		  *These are the ascii or latex representations of valid GM expressions
 * 		timing_post_trial: an array with a single element representing the time
 * 			in milliseconds to delay after a completed problem until the next
 */

(function($) {

	jsPsych['gm-multiple-choice'] = (function() {

		var plugin = {};

		plugin.create = function(params) {
			params = jsPsych.pluginAPI.enforceArray(params, ['problems','timing_post_trial']);

			var trials = new Array(params.problems.length);
			for (var i=0; i<trials.length; i++) {
				trials[i] = {};
				trials[i].type = 'gm-multiple-choice';

				var prob = params.problems[i];
				trials[i].solution = prob.solution;
				trials[i].A = prob.A;
				trials[i].B = prob.B;
				trials[i].C = prob.C;
				trials[i].D = prob.D;
				trials[i].correctAnswer = prob.correctAnswer;

				trials[i].timingPostTrial = params.timing_post_trial;

				trials[i].data = (typeof params.data === 'undefined') ? {} : params.data[i];
			}
			return trials;
		};

	  plugin.trial = function(display_element, block, trial, part) {
	  	var solution = trial.solution
	  	   ,choiceA = trial.A
	  	   ,choiceB = trial.B
	  	   ,choiceC = trial.C
	  	   ,choiceD = trial.D
	  	   ,correctAns = trial.correctAnswer;

	  	var choices = [];

	  	var trialData = {
	  	  interactionTime : null
	  	 ,userChoice : null
	  	 ,userAction : null
	  	 ,userResult : null
	  	 ,correctness : false
	  	 ,correctAction : null
	  	};

	  	display_element.append($('<div>', {
	  		'id': 'container'
	  	 ,'align': 'center'
	  	 ,'width': '576px'
	  	}));

	  	$('#container').append($('<div>', {
	  		'id':'solutionExpr'
	  	 ,'align': 'center'
	  	 ,'float': 'left'
	  	 ,'width': '100%'
	  	 ,'height': '256px'
	  	 ,'html': solution
	  	 // ,'css': {outline: '#0000FF solid 3px'}
	  	}));

	  	var sol = DerivationList.createStandalone($('#solutionExpr')[0], {interactive:false});
	  	sol.getLastRow().view.update_all();

	  	$('#container').append($('<div>', {
	  		'id': 'choiceA'
	  	 ,'html': choiceA
	  	 ,'align': 'center'
	  	 ,'margin-top': '2px'
	  	 ,'float': 'left'
	  	 ,'width': '100%'
	  	 ,'height': '174px'
	  	 ,'css': {border: '#000000 solid 6px'}
	  	}));

	  	var A = DerivationList.createStandalone($('#choiceA')[0], {dur:1000});
	  	A.getLastRow().view.update_all();
	  	choices.push(A);

	  	$('#container').append($('<div>', {
	  		'id': 'choiceB'
	  	 ,'html': choiceB
	  	 ,'align': 'center'
	  	 ,'margin-top': '2px'
	  	 ,'float': 'left'
	  	 ,'width': '100%'
	  	 ,'height': '174px'
	  	 ,'css': {border: '#000000 solid 6px'}
	  	}));

	  	var B = DerivationList.createStandalone($('#choiceB')[0], {dur:1000});
	  	B.getLastRow().view.update_all();
	  	choices.push(B);

	  	$('#container').append($('<div>', {
	  		'id': 'choiceC'
	  	 ,'html': choiceC
	  	 ,'align': 'center'
	  	 ,'margin-top': '2px'
	  	 ,'float': 'left'
	  	 ,'width': '100%'
	  	 ,'height': '174px'
	  	 ,'css': {border: '#000000 solid 6px'}
	  	}));

	  	var C = DerivationList.createStandalone($('#choiceC')[0], {dur:1000});
	  	C.getLastRow().view.update_all();
	  	choices.push(C);

	  	$('#container').append($('<div>', {
	  		'id': 'choiceD'
	  	 ,'html': choiceD
	  	 ,'align': 'center'
	  	 ,'margin-top': '2px'
	  	 ,'float': 'left'
	  	 ,'width': '100%'
	  	 ,'height': '174px'
	  	 ,'css': {border: '#000000 solid 6px'}
	  	}));

	  	var D = DerivationList.createStandalone($('#choiceD')[0], {dur:1000});
	  	D.getLastRow().view.update_all();
	  	choices.push(D);

  	var userAns
  	   ,userAnsDiv;

  	var getDLOfCorrectAnswer = function() {
  		switch (correctAns) {
  			case 'A':
  				return choices[0];
  			case 'B':
  				return choices[1];
  			case 'C':
  				return choices[2];
  			case 'D':
  				return choices[3];
  		}
  	}

  	var getDivOfCorrectAnswer = function() {
  		switch (correctAns) {
  			case 'A':
  				return d3.select('#choiceA');
  			case 'B':
  				return d3.select('#choiceB');
  			case 'C':
  				return d3.select('#choiceC');
  			case 'D':
  				return d3.select('#choiceD');
  		}
  	}

  	var getLetterOfUserChoice = function() {
  		if (userAns) {
  			switch (userAns) {
  				case (A):
  					return 'A';
  				case (B):
  					return 'B';
  				case (C):
  					return 'C';
  				case (D):
  					return 'D';
  			}
  		}
  	}

  	var problemAnsweredCorrectly = function() {
  		trialData.correctness = true;
  		// fade green border in and out
  		userAnsDiv.transition()
  		  .duration(1500)
  		  .style('border-color', 'lawngreen')
  		  .transition()
  		  .duration(5000)
  		  .style('border-color', 'black');
  		// go to next trial/block
  		var nextBlockTimer = setTimeout(function() {
  			clearTimeout(nextBlockTimer);
  			afterResponse();
  		}, 8000);
  	}

  	var problemAnsweredIncorrectly = function() {
  		// fade red border in and out
  		userAnsDiv.transition()
  			.duration(1500)
  			.style('border-color', 'tomato')
  			.transition()
  			.delay(1000)
  			.duration(2000)
  			.style('border-color', 'black');
  		// fade green border in and out on correct answer
  		getDivOfCorrectAnswer().transition()
  			.delay(2000)
  			.duration(1500)
  			.style('border-color', 'lawngreen')
  			.transition()
  			.delay(3500)
  			.duration(2000)
  			.style('border-color', 'black');
  		// determine action needed to be taken
  		var solutionActionTimer = setTimeout(function() {
  			var solAscii = sol.getLastModel().to_ascii();
	  		var correctAnsTree = getDLOfCorrectAnswer().getLastModel()
	  		   ,correctAnsTreeNodes = correctAnsTree.select_all().slice(1);
	  		var possibleMoveActions = [];
	  		var correctAction = []
	  		for (var i=0; i<correctAnsTreeNodes.length; i++) {
	  			possibleMoveActions = possibleMoveActions.concat(correctAnsTree.getMoveActions([correctAnsTreeNodes[i]]));
	  		}
	  		for (var i=0; i<possibleMoveActions.length; i++) {
	  			var possibleCorrectActions = [];
	  			var action = possibleMoveActions[i];
	  			action.run();
	  			if (action.newTree.to_ascii()===solAscii) {
	  				correctAction.push(action.name);
	  				//possibleCorrectActions.push(action);
	  				trialData.correctAction = correctAction;
	  				action.newTree = action.oldTree;
	  				getDLOfCorrectAnswer().getLastRow().view.interaction_handler.highlight_nodes(action.nodes || []);
	  				var performActionTimer = setTimeout(function() {
	  					clearTimeout(performActionTimer);
	  					action.doInPlace();
		  				action.newTree.hide_nodes();
		  				getDLOfCorrectAnswer().getLastRow().view.update_all();
	  				}, 1500);
	  				break;
	  			}
	  		}
	  	}, 4500);

  		// call continue function
  		var nextBlockTimer = setTimeout(function() {
  			clearTimeout(nextBlockTimer);
  			afterResponse();
  		}, 20000);
  	}

  	var on_change = function(ans, div) {
  		return function(evt) {
  			var endTime = (new Date()).getTime();
  			trialData.interactionTime = endTime - startTime;
	  		userAns = ans;
	  		userAnsDiv = div;
	  		trialData.userChoice = getLetterOfUserChoice();
	  		trialData.userAction = evt.action.name;
	  		trialData.userResult = evt.action.newTree.to_ascii();
	  		var userAnsAscii = userAns.getLastModel().to_ascii()
	  		   ,correctAnsAscii = getDLOfCorrectAnswer().getLastModel().to_ascii();
	  		if (userAnsAscii === correctAnsAscii) {
	  			problemAnsweredCorrectly();
	  		} else {
	  			problemAnsweredIncorrectly();
	  		}
	  	}
  	}

  	// var on_mistake = function(div) {
  	// 	problemAnsweredIncorrectly();
  	// }

	  var afterResponse = function() {
	  	display_element.html('');
	  	block.writeData($.extend({}, trial, trialData, trial.data));
	  	block.next();
	  }

  		A.addEventListener('change', on_change(A, d3.select('#choiceA')));
  		// A.getLastModel().addEventListener('mistake', on_mistake(d3.select('#choiceA')));
  		B.addEventListener('change', on_change(B, d3.select('#choiceB')));
  		// B.getLastModel().addEventListener('mistake', on_mistake(d3.select('#choiceB')));
  		C.addEventListener('change', on_change(C, d3.select('#choiceC')));
  		// C.getLastModel().addEventListener('mistake', on_mistake(d3.select('#choiceC')));
  		D.addEventListener('change', on_change(D, d3.select('#choiceD')));
  		// D.getLastModel().addEventListener('mistake', on_mistake(d3.select('#choiceD')));

  		var startTime = (new Date()).getTime();

	  };

	  return plugin;
	})();
})(jQuery);