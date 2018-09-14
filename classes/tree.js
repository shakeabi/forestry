function tree(){
	var level =0;
	var pos = {};
	var age = 0;
	this.lumber = 0;

	this.setPos = function(x,y){
		pos.x = x;
		pos.y = y;
	}

	this.returnPos = function(){
		return pos;
	}

	this.getOld = function(){
		++age;
	}

	this.returnAge = function(){
		return age;
	}

	this.checkLevelUp = function(){
		if(level==0){
			if(age>12) level=1;
		}
		if(level==1){
			if(age>120) level=2;
		}

		if(level==1){
			this.lumber = 1;
		}
		if(level==2){
			this.lumber = 2;
		}
		
	}
}