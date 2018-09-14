//check random spawn
function forest(n,t,l,b,speed,ctx){
	this.terrain = new Array(n);
	this.boxLength = n;
	this.area = n*n;
	this.ctx=ctx;
	this.speed = speed;

	this.treeP = t;
	this.lJackP = l;
	this.bearP = b;
	
	this.time = 1;
	
	this.noOfTrees = 0;
	this.noOfLJacks = 0;
	this.noOfBears = 0;
	
	this.logs = 0;
	this.mauls = 0;

	this.movements = [
	{x:-1,y:-1},
	{x:0,y:-1},
	{x:1,y:-1},
	{x:-1,y:0},
	{x:0,y:0},
	{x:1,y:0},
	{x:-1,y:1},
	{x:0,y:1},
	{x:1,y:1},
	];


	this.nearByRandom = function(xpos,ypos,type){
		outerThis = this;
		var availableNearbySpots = this.movements.select(function(e){
				if(((xpos+e.x)>=0)&&((xpos+e.x)<outerThis.boxLength)&&((ypos+e.y)>=0)&&((ypos+e.y)<outerThis.boxLength)){
					var temp = outerThis.terrain[xpos+e.x][ypos+e.y];
					if(type==1){
						if(temp&&temp.lJack==0) return true;
					}
					else if(type==2){
						if(temp&&temp.treeAge<=120&&temp.bear==0) return true;
					}
					else{
						if(temp&&(temp.treeAge==0)&&temp.lJack==0&&temp.bear==0) return true;
					}
					
				}
				
				return false;
			});
		return availableNearbySpots[randInt(0,availableNearbySpots.length-1)];
	}

	this.printScreen = function(){
		var scale = cwidth/this.boxLength;
		for(var i=0; i<this.boxLength; ++i){
			for(var j=0; j<this.boxLength; ++j){
				var x = i*scale;
				var y = j*scale;
				var color;
				
				if(this.terrain[i][j].lJack > 0){
						color = '#ff9079';
					}
					else if(this.terrain[i][j].bear > 0){
							color = '#562c10';
						}
						else if(this.terrain[i][j].treeAge>0){
							if(this.terrain[i][j].treeAge<10){color = '#9aec99';}
							else if(this.terrain[i][j].treeAge<120){color = '#5ae03a';}
									else{color = '#0f7216';}
						}
						else{
							color = '#ffffff';
						}

				this.ctx.fillStyle = color;
				this.ctx.fillRect(x,y,scale,scale);
			}
		}
	}

	this.moveLJack = function(xpos,ypos){
		var moves = 3;
		var flag = 1;
			while((moves--)&&flag){
				var spot = this.nearByRandom(xpos,ypos,1);
				if(spot){
					var x = xpos + spot.x;
					var y = ypos + spot.y;

					this.terrain[xpos][ypos].lJack = 0;
					this.terrain[x][y].lJack = this.time+1;

					if(this.terrain[x][y].treeAge>0){
						if(this.terrain[x][y].treeAge>=10){
							++this.logs;
						}
						if(this.terrain[x][y].treeAge>=120){
							++this.logs;
						}

						this.terrain[x][y].treeAge = 0;
						--this.noOfTrees;

						flag=0;
					}

					if(this.terrain[x][y].bear>0){
						--this.noOfLJacks;
						this.terrain[x][y].lJack = 0;
						++this.mauls;
						if(this.noOfLJacks==0){
							this.randomSpawn(1,this.time+1);
						}

						flag=0;
					}

					xpos = x;
					ypos = y;

				}

			}

			flag = 1;
			moves=3;
		
		
	}

	this.moveBear = function(xpos,ypos){
		var moves = 5;
		var flag = 1;

			while((moves--)&&flag){
				var spot = this.nearByRandom(xpos,ypos,2);
				if(spot){
					var x = xpos + spot.x;
					var y = ypos + spot.y;

					this.terrain[xpos][ypos].bear = 0;
					this.terrain[x][y].bear = this.time+1;


					if(this.terrain[x][y].lJack>0){
						--this.noOfLJacks;
						this.terrain[x][y].lJack=0;
						++this.mauls;

						flag=0;
					}

					xpos = x;
					ypos = y;

				}

			}

			flag=1;
			moves=5;
		
	}

	this.getAllOfAType = function(type){
		var all = [];
	    for (var i = 0; i < this.boxLength; ++i) {
	        for (var j = 0; j < this.boxLength; ++j) {
	            if (this.terrain[i][j][type]) {
	                all.push({x: i, y: j});
	            }
	        }
	    }
	    return all;
	}

	this.removeRand = function(type){
		 var arr = this.getAllOfAType(type);
		    if (arr.length > 0) {
		        var p = arr[randInt(0,arr.length-1)];
		        this.terrain[p.x][p.y][type] = 0;
		        switch(type){
					case 'treeAge': --this.noOfTrees;break;
					case 'lJack': --this.noOfLJacks;break;
					case 'bear': --this.noOfBears;break;
				}
		    }
		    return this;
	}

	this.yearEvent = function(){
		if(this.logs<this.noOfLJacks){
			if(this.noOfLJacks>1){
				this.removeRand('lJack');
			}
		}
		else{
			this.randomSpawn(1,this.time+1);
		}
		this.logs=0;

		if(this.mauls>0){
			this.removeRand('bear');
		}
		else{
			this.randomSpawn(2,this.time+1);
		}
		this.mauls = 0;
	}

	this.updateTree = function(xpos,ypos){
		var probability = 0;
		if(this.terrain[xpos][ypos].treeAge<12){
			probability = 0;
		}
		else{
			probability = 10; // 10 percent chance
		}

		if(randInt(0,100)<=10){
			var spot = this.nearByRandom(xpos,ypos,0);

			if(spot){
				var x = xpos+spot.x;
				var y = ypos+spot.y; 
				this.terrain[x][y].treeAge = 1;
				++this.noOfTrees;
			}

			// var outerThis = this;

			// var availableNearbySpots = this.movements.select(function(e){
			// 	if(((xpos+e.x)>=0)&&((xpos+e.x)<outerThis.boxLength)&&((ypos+e.y)>=0)&&((ypos+e.y)<outerThis.boxLength)){
			// 		var temp = outerThis.terrain[xpos+e.x][ypos+e.y];
			// 		if(temp&&(temp.treeAge==0)&&temp.lJack==0&&temp.bear==0) return true;
			// 	}
				
			// 	return false;
			// });
			// if(availableNearbySpots.length){
			// 	var rand = randInt(0,availableNearbySpots.length-1);
			// 	var relLoc = availableNearbySpots[rand];
			// 	this.terrain[xpos+relLoc.x][ypos+relLoc.y].treeAge = 1;
			// }
		}

		++this.terrain[xpos][ypos].treeAge;
	}

	this.update = function(){
		console.log(this.noOfBears);

		for(var i=0; i<this.boxLength; ++i){
			for(var j=0; j<this.boxLength; ++j){
				
				if(this.terrain[i][j].treeAge){
					this.updateTree(i,j);
				}
				if(this.terrain[i][j].lJack == this.time){
					this.moveLJack(i,j);
				}
				if(this.terrain[i][j].bear == this.time){
					this.moveBear(i,j);
				}
			}
		}

		this.printScreen();

		++this.time;
		if(this.time%12==0){
			this.yearEvent();
		}

		treeid.innerHTML = Math.floor((this.noOfTrees/this.area)*100);
		lumberid.innerHTML = Math.floor((this.noOfLJacks/this.area)*100);
		bearid.innerHTML = Math.floor((this.noOfBears/this.area)*100); 


	}

	this.randomSpawn = function(cat, val){
		switch(cat){
			case 0: cat='treeAge';break;
			case 1: cat='lJack';break;
			case 2: cat='bear';break;

		}
		while(true){//instead of a recursive function
			var x = randInt(0,this.boxLength-1);
			var y = randInt(0,this.boxLength-1);
			if(firstTime){
				if(this.terrain[x][y].treeAge==0&&this.terrain[x][y].lJack==0&&this.terrain[x][y].bear==0)
				{
					this.terrain[x][y][cat] = val;
					switch(cat){
						case 'treeAge': ++this.noOfTrees;break;
						case 'lJack': ++this.noOfLJacks;break;
						case 'bear': ++this.noOfBears;break;
					}
					return 0;
				}
			}
			else{
				if(this.terrain[x][y].lJack==0&&this.terrain[x][y].bear==0)
				{
					this.terrain[x][y][cat] = val;
					switch(cat){
						case 'treeAge': ++this.noOfTrees;break;
						case 'lJack': ++this.noOfLJacks;break;
						case 'bear': ++this.noOfBears;break;
					}
					return 0;
				}
			}
			
		}
		return 0;
	}

	this.initSpawn = function(){
		var initTrees = this.area*(this.treeP/100);
		var initLJacks = this.area*(this.lJackP/100);
		var initBears = this.area*(this.bearP/100);
		//trees
		for(var i=0; i<initTrees; ++i){
			this.randomSpawn(0,10);
		}
		//lJacks
		for(var i=0; i<initLJacks; ++i){
			this.randomSpawn(1,this.time);
		}
		//bears
		for(var i=0; i<initBears; ++i){
			this.randomSpawn(2,this.time);
		}
	}

	this.startSimulation = function(){
		var outerThis = this;
		setInterval(function(){
			outerThis.update();
		},this.speed || 300)
	}

	this.initialise = function(){
		for(var i=0; i<this.boxLength; ++i){
			this.terrain[i] = new Array(n);
		}

		for(var i=0; i<this.boxLength; ++i){
			for(var j=0; j<this.boxLength; ++j){
				this.terrain[i][j] = {
					treeAge:0,
					lJack:0,
					bear:0
				};


			}
		}

		this.initSpawn();
		this.startSimulation();
	}

	this.initialise();



}