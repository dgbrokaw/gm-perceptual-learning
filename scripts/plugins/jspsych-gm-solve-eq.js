/** js-psych-gm-solve-eq.js
 *  David Brokaw
 *
 * 	This plugin presents a non-interactible Grasping Math equation and the
 * 	user must enter the value of the variable in the text box.
 *
 * 	Parameters:
 * 		type: "gm-solve-eq"
 * 		problems: a list of objects containing:
 * 		  equation: the ascii or latex representations of a GM equation
 * 		  variable: a string, the variable to be solved for
 * 		  val: a string, the value of the variable to be solved
 * 		timing_post_trial: an array with a single element representing the time
 * 			in milliseconds to delay after a completed problem until the next
 */

(function($) {

	jsPsych['gm-solve-eq'] = (function() {

		var plugin = {};

		plugin.create = function(params) {
			params = jsPsych.pluginAPI.enforceArray(params, ['problems','timing_post_trial']);

			var trials = new Array(params.problems.length);
			for (var i=0; i<trials.length; i++) {
				trials[i] = {};
				trials[i].type = 'gm-solve-eq';
				trials[i].id = i;

				var prob = params.problems[i];
				trials[i].equation = prob.equation;
				trials[i].variable = prob.variable;
				trials[i].val = prob.val;

				trials[i].timingPostTrial = params.timing_post_trial;

				trials[i].data = (typeof params.data === 'undefined') ? {} : params.data[i];
			}
			return trials;
		};

		plugin.trial = function(display_element, block, trial, part) {
			var equation = trial.equation
			   ,variable = trial.variable
			   ,val = trial.val;

			var trialData = {
			  firstInputTime : null
			 ,submitTime : null
			 ,userInput : null
			 ,correctness : false
			};

			appendContainer();
			var eq = appendEqAndMakeGMExpr();
			appendSubmissionBoxAndButton();
			addEventListeners();

			var startTime = (new Date()).getTime();

			function appendContainer() {
				display_element.append($('<div>', {
		  		'id': 'container'
		  	 ,'align': 'center'
		  	 ,'width': '576px'
		  	}));
			}

			function appendEqAndMakeGMExpr() {
				$('#container').append($('<div>', {
					'id': 'gm-eq'
				 ,'html': equation
				 ,'align': 'center'
		  	 ,'height': '256px'
		  	 ,'float': 'left'
				}));
				var eq = DerivationList.createStandalone($('#gm-eq')[0], {interactive:false});
				eq.getLastRow().view.update_all();
				return eq;
			}

			function appendSubmissionBoxAndButton() {
				$('#container').append($('<div>', {
					'id': 'response'
				 ,'align': 'center'
				 ,'height': '256px'
		  	 ,'float': 'left'
		  	 ,'text': variable + '='
				}));
				document.getElementById('response').style.fontSize = '28pt';

				$('#response').append('<input type="text" id="solution" name="solution" style="height:50px;font-size:24pt;"></input>');

				$('#response').append($('<button>', {
					'id': 'submitButton'
				}));

				$('#submitButton').html('Submit Answer');
			}

			function addEventListeners() {
				$('input[name="solution"]').keyup(function() {
					if (!trialData.firstInputTime) {
						var endTime = (new Date()).getTime();
						trialData.firstInputTime = endTime - startTime;
					}
				});

				$('#submitButton').click(function() {
					var endTime = (new Date()).getTime();
					trialData.submitTime = endTime - startTime;
					trialData.userInput = document.getElementById('solution').value;
					if (trialData.userInput && trialData.userInput===val) {
						trialData.correctness = true;
					}

					display_element.html('');
					//saveAndContinue(trial, trialData, block);
					block.writeData($.extend({}, trial, trialData, trial.data));
			  	block.next();
				});
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