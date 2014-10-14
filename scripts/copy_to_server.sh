if [ -z "$1" ]; then
  echo "pass things to copy as argument"
else
	args=("$@")
	scp -r $@ perceptsconcepts@perceptsconcepts.psych.indiana.edu:/Library/Server/Web/Data/Sites/Default/experiments/ew/gm-pl-1.0/
fi