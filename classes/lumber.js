function lumber(x,y){
	var pos = {x:x,y:y};
	var movesLeft = 3;
	this.lumberStore = 0;


	this.setPos = function(x,y){
		pos.x = x;
		pos.y = y;
	}

	this.returnPos = function(){
		return pos;
	}

	this.resetMoves = function(){
		movesLeft = 3;
	}

	this.moveRand = function(availableMoves){

		var prob = Math.floor(Math.random()*availableMoves.length);

		switch(availableMoves[prob]){
			case 0: --pos.x;
					--pos.y;
					break;
			case 1: --pos.x;
					break;
			case 2: --pos.x;
					++pos.y;
					break;
			case 3: --pos.y;
					break;
			case 4: ++pos.y;
					break;
			case 5: ++pos.x;
					--pos.y;
					break;
			case 6: ++pos.x;
					break;
			case 7: ++pos.x;
					++pos.y;
					break;

		}

		--movesLeft;
	}

	
}