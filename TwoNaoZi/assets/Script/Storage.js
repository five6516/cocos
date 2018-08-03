var Storage = {
    getScore: function() {
    	let scoreNum = 10;
    	for (var i = 0; i < scoreNum; i++) {
    		var scorestring = "Score" + i;
    		Globals.Score[i] = cc.sys.localStorage.getItem(scorestring) || 0;

    		cc.log(scorestring+":"+Globals.Score[i]);
    	}

        return parseInt(Globals.Score[0]);
    },
    
    setScore: function(score) {
    	let scoreNum = 10;
    	for (let i = 0; i < scoreNum; i++) {
    		if (score > Globals.Score[i] ) {

    			for (let j = scoreNum - 1; j > i; j--) {
    				Globals.Score[j] = Globals.Score[j-1];
    			}
    			Globals.Score[i] = score;
    			break;
    		}
    		 
    	}

    	for (let i = 0; i < scoreNum; i++) {
    		var scorestring = "Score" + i;
    		cc.sys.localStorage.setItem(scorestring,Globals.Score[i]);

    		//cc.log(scorestring+":"+Globals.Score[i]);
    	}
    }
};

module.exports = Storage;

