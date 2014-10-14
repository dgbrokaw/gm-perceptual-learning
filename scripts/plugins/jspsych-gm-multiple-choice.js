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
				trials[i].id = i;

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
	  	var userAns
	  	   ,userAnsDiv;
	  	var userActions = [];

	  	var trialData = {
	  		interactionStartTime : null
	  	 ,interactionEndTime : null
	  	 ,userChoice : null
	  	 ,userAction : null
	  	 ,userResult : null
	  	 ,correctness : false
	  	 ,correctAction : null
	  	};

	  	appendContainer();
	  	var sol = appendSolutionAndMakeGMExpr()
	  	   ,A = appendChoiceAAndMakeGMExpr()
	  	   ,B = appendChoiceBAndMakeGMExpr()
	  	   ,C = appendChoiceCAndMakeGMExpr()
	  	   ,D = appendChoiceDAndMakeGMExpr();

	  	addEventListeners();

  		var startTime = (new Date()).getTime();

	  	function appendContainer() {
	  		display_element.append($('<div>', {
		  		'id': 'container'
		  	 ,'align': 'center'
		  	 ,'width': '576px'
		  	}));
	  	}

	  	function appendSolutionAndMakeGMExpr() {
	  		$('#container').append($('<div>', {
		  		'id':'solutionExpr'
		  	 ,'align': 'center'
		  	 ,'float': 'left'
		  	 ,'width': '100%'
		  	 ,'height': '256px'
		  	 ,'html': solution
		  	}));
		  	var sol = DerivationList.createStandalone($('#solutionExpr')[0], {interactive:false});
	  		sol.getLastRow().view.update_all();
	  		return sol;
	  	}

	  	function appendChoiceAAndMakeGMExpr() {
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
		  	return A;
		  }

		  function appendChoiceBAndMakeGMExpr() {
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
		  	return B;
		  }

		  function appendChoiceCAndMakeGMExpr() {
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
		  	return C;
		  }

		  function appendChoiceDAndMakeGMExpr() {
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
		  	return D;
		  }

		  function addEventListeners() {
		  	A.addEventListener('change', on_change(A, d3.select('#choiceA')));
	  		// A.getLastModel().addEventListener('mistake', on_mistake(d3.select('#choiceA')));
	  		B.addEventListener('change', on_change(B, d3.select('#choiceB')));
	  		// B.getLastModel().addEventListener('mistake', on_mistake(d3.select('#choiceB')));
	  		C.addEventListener('change', on_change(C, d3.select('#choiceC')));
	  		// C.getLastModel().addEventListener('mistake', on_mistake(d3.select('#choiceC')));
	  		D.addEventListener('change', on_change(D, d3.select('#choiceD')));
	  		// D.getLastModel().addEventListener('mistake', on_mistake(d3.select('#choiceD')));

	  		d3.select('#choiceA').on('mousedown', mouse_down());
	  		d3.select('#choiceB').on('mousedown', mouse_down());
	  		d3.select('#choiceC').on('mousedown', mouse_down());
	  		d3.select('#choiceD').on('mousedown', mouse_down());

	  		d3.select('#choiceA').on('mouseup', mouse_up(A));
	  		d3.select('#choiceB').on('mouseup', mouse_up(B));
	  		d3.select('#choiceC').on('mouseup', mouse_up(C));
	  		d3.select('#choiceD').on('mouseup', mouse_up(D));
		  }

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

	  	function problemAnsweredCorrectly() {
	  		trialData.correctness = true;
	  		var delay = 0;
	  		greenBorderAnimation(userAnsDiv, delay);
	  		// go to next trial/block
	  		var nextBlockTimer = setTimeout(function() {
	  			clearTimeout(nextBlockTimer);
	  			afterResponse();
	  		}, 8000);
	  	}

	  	var problemAnsweredIncorrectly = function() {
	  		var redAnimationDelay = 0;
	  		redBorderAnimation(userAnsDiv, redAnimationDelay);
	  		var greenAnimationDelay = 2000;
	  		greenBorderAnimation(getDivOfCorrectAnswer(), greenAnimationDelay);

	  		var solutionActionTimer = setTimeout(function() {
	  			clearTimeout(solutionActionTimer);
	  			var correctAction = breadthFirstActionSearch(2);
	  			doActionForUser(correctAction);
	  		}, 4500);

	  		// call continue function
	  		var nextBlockTimer = setTimeout(function() {
	  			clearTimeout(nextBlockTimer);
	  			afterResponse();
	  		}, 20000);
	  	}

	  	function greenBorderAnimation(div, delayT) {
	  		div.transition()
	  			.delay(delayT)
	  		  .duration(1500)
	  		  .style('border-color', 'lawngreen')
	  		  .transition()
	  		  .delay(delayT+1500)
	  		  .duration(5000)
	  		  .style('border-color', 'black');
	  	}

	  	function redBorderAnimation(div, delayT) {
	  		userAnsDiv.transition()
	  			.delay(delayT)
	  			.duration(1500)
	  			.style('border-color', 'tomato')
	  			.transition()
	  			.delay(delayT+1500)
	  			.duration(2000)
	  			.style('border-color', 'black');
	  	}

	  	function breadthFirstActionSearch(maxDepth) {
	  		var result;
	  		var correctAnsTree = getDLOfCorrectAnswer().getLastModel()
	  		   ,solutionAscii = sol.getLastModel().to_ascii()
	  		for (var i=1; i<=maxDepth; i++) {
	  			var startingDepth = 1;
	  			var searchReverse = startingDepth%2===0; // hack fix to commute the inverted nodes from the first action
	  			result = findAction(correctAnsTree, solutionAscii, startingDepth, i, searchReverse);
	  			if (result) return result;
	  		}
	  		return false;
	  	}

	  	function doActionForUser(actions) {
	  		if (actions) {
		  		if (actions.length===1) doSingleActionForUser(actions[0]);
		  		if (actions.length===2) doTwoActionsForUser(actions);
		  	}
	  		return false;
	  	}

			var findAction = function(tree, targetAscii, currDepth, maxDepth, reverse) {
				if (tree.to_ascii()===targetAscii) return [];
				if (currDepth>maxDepth) return false;
				var treeNodes = tree.select_all().slice(1).filter(function(x){return x.is_group('add')
			                                                                    || x.is_group('sub')
			                                                                    || x.is_group('num')
			                                                                    || x.is_group('var')});  // fix this to account for mul-divs etc.
				var moveActions = [];
				for (var i=0; i<treeNodes.length; i++) {
					moveActions = moveActions.concat(tree.getMoveActions([treeNodes[i]]));
				}
				if (!reverse) {
					for (var i=0; i<moveActions.length; i++) {
						var action = moveActions[i];
						action.run();
						var res = findAction(action.newTree, targetAscii, currDepth+1, maxDepth, (currDepth+1)%2===0);
						if (res) return [action].concat(res);
					}
				} else {
					for (var i=moveActions.length-1; i>=0; i--) {
						var action = moveActions[i];
						action.run();
						var res = findAction(action.newTree, targetAscii, currDepth+1, maxDepth, (currDepth+1)%2===0);
						if (res) return [action].concat(res);
					}
				}
				return false;
			}

			var doSingleActionForUser = function(action) {
				trialData.correctAction = [action.name];

				var parentDL = getDLOfCorrectAnswer();
				action.newTree = action.oldTree;
				parentDL.getLastRow().view.interaction_handler.highlight_nodes(action.nodes || []);
				var doActionTimer = setTimeout(function() {
					clearTimeout(doActionTimer);
					action.doInPlace();
					action.newTree.hide_nodes();
					parentDL.getLastRow().view.update_all();
					parentDL.getLastRow().view.interaction_handler.highlight_nodes([]);
				}, 1500);
			}

			var doTwoActionsForUser = function(actions) {
				trialData.correctAction = [actions[0].name, actions[1].name];

				var parentDL = getDLOfCorrectAnswer();
				actions[0].newTree = actions[0].oldTree;
				parentDL.getLastRow().view.interaction_handler.highlight_nodes(actions[0].nodes || []);
				var doActionTimer = setTimeout(function() {
					clearTimeout(doActionTimer);
					actions[0].doInPlace();
					actions[0].newTree.hide_nodes();
					parentDL.getLastRow().view.update_all();
					parentDL.getLastRow().view.interaction_handler.highlight_nodes([]);
					actions[1].oldTree = actions[0].newTree;
					actions[1].newTree = actions[1].oldTree;
					var nsToHighlight = actions[1].getNewTreeNode(actions[1].nodes);
					parentDL.getLastRow().view.interaction_handler.highlight_nodes(nsToHighlight || []);
					var doSecondActionTimer = setTimeout(function() {
						clearTimeout(doSecondActionTimer);
						actions[1].doInPlace();
						actions[1].newTree.hide_nodes();
						parentDL.getLastRow().view.update_all();
						parentDL.getLastRow().view.interaction_handler.highlight_nodes([]);
					}, 1500);
				}, 1500);
			}

	  	function on_change(ans, div) {
	  		return function(evt) {
	  			console.log(evt);
		  		userAns = ans;
		  		userAnsDiv = div;
		  		userActions.push(evt.action.name);
		  	}
	  	}

		  var afterResponse = function() {
		  	display_element.html('');
		  	//saveAndContinue(trial, trialData, block);
		  	block.writeData($.extend({}, trial, trialData, trial.data));
		  	block.next();
		  }

		  function mouse_down() {
		  	return function() {
		  		var endTime = (new Date()).getTime();
		  		trialData.interactionStartTime = endTime - startTime;
		  	}
		  }

		  function mouse_up(ans) {
		  	return function() {
		  		var endTime = (new Date()).getTime();
	  			trialData.interactionEndTime = endTime - startTime;
		  		trialData.userChoice = getLetterOfUserChoice();
		  		trialData.userAction = userActions;
		  		trialData.userResult = userAns.getLastModel().to_ascii();
		  		checkAnswer();
		  	}
		  }

		  function checkAnswer() {
		  	var correctAnsAscii = sol.getLastModel().to_ascii();
	  		if (trialData.userResult === correctAnsAscii) {
	  			problemAnsweredCorrectly();
	  		} else {
	  			problemAnsweredIncorrectly();
	  		}
		  }



	  };

	  var saveAndContinue = function(trial, trialData, block) {
			saveTrial(trial, trialData, block.next)
		}

		// Example save_trial code, which needs to be adapted:
		function saveTrial(trial, trialData, finished_callback) {
		  var saveData = $.extend({}, trial, trialData);
		  // if (test_mode) {
		  //   console.log('would transmit ', JSON.stringify([data]));
		  //   finished_callback();
		  // }
		  // else {
	    $.ajax({
	      type: 'post',
	      cache: false,
	      url: 'db_submit.php',
	      data: {json: JSON.stringify([saveData])
	            ,subject_id: subject_id},
	      success: function(data) {
	        //console.log(data);
	        finished_callback();
		    }
		  });
		  // }
		}

	  return plugin;
	})();
})(jQuery);