var Storage = {
    getScore: function() {
    	let scoreNum = 10;
    	for (var i = 0; i < scoreNum; i++) {
    		var scorestring = "BirdScore" + i;
    		Globals.ScoreList[i] = cc.sys.localStorage.getItem(scorestring) || 0;

    		cc.log(scorestring+":"+Globals.ScoreList[i]);
    	}

        return parseInt(Globals.ScoreList[0]);
    },
    
    setScore: function(score) {
    	let scoreNum = 10;
    	for (let i = 0; i < scoreNum; i++) {
    		if (score > Globals.ScoreList[i] ) {

    			for (let j = scoreNum - 1; j > i; j--) {
    				Globals.ScoreList[j] = Globals.ScoreList[j-1];
    			}
    			Globals.ScoreList[i] = score;
    			break;
    		}
    		 
    	}

    	for (let i = 0; i < scoreNum; i++) {
    		var scorestring = "BirdScore" + i;
    		cc.sys.localStorage.setItem(scorestring,Globals.ScoreList[i]);

    		//cc.log(scorestring+":"+Globals.Score[i]);
    	}
    }
};

module.exports = Storage;

