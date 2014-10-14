INSERT INTO experiments (name, description, hypothesis, experimentors, trials_table) VALUES ('GM-Perceptual Learning v1.0', 'Perceptual learning experiment using grasping math. We replicate Kellman 2009, and add a condition where the answer is given by dragging terms in a GM expression.', '1) Reaction times in post-test are much lower than in pre-test. 2) Accuracy might either be high from the start, or increase. 3) Main interest: we expect that when people have to move terms, the improvement in reaction times in post-test is larger.', 'Erik Weitnauer, David Landy, Adam Datema', 'gm_pl_v1_0');

create table gm_pl_v1.0 (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  exp_id VARCHAR(200) NOT NULL,
  subject_id VARCHAR(50) NOT NULL,
  stage VARCHAR(50) NOT NULL,
  trial_idx INT,
  cond VARCHAR(30),
  target VARCHAR(200),
  option_1 VARCHAR(200),
  option_2 VARCHAR(200),
  option_3 VARCHAR(200),
  option_4 VARCHAR(200),
  correct_option INT,
  recorded_time_to_action BIGINT,
  recorded_time_to_submit BIGINT,
  recorded_action_result VARCHAR(200),
  recorded_accuracy BOOL,
  recorded_chosen_option INT,
  timestamp TIMESTAMP,
  FOREIGN KEY (exp_id) REFERENCES experiments(id));

DELETE FROM gm_pl_v1.0 WHERE mturk_id="test"