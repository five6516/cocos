// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        // 
        
        chess: {
             // ATTRIBUTES:
             default: null,        // The default value will be used only when the component attaching
                                   // to a node for the first time
             type: cc.Prefab, // optional, default is typeof default
         },

         whiteSpriteFrame:{//白棋的图片
            default:null,
            type:cc.SpriteFrame
        },
        
        blackSpriteFrame:{//黑棋的图片
            default:null,
            type:cc.SpriteFrame
        },

        popDlg:{//弹出的对话框
            default:null,
            type:cc.Node
        },

        gameState:'over',

        chessList: [],//棋子节点数组

        currentPos:(0,0),//当前下子坐标

        fiveGroup:[],//五元组
        fiveGroupScore:[],//五元组分数
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    	var self = this;

    	for (let y = 0; y < 19; y++) {
    		for (let x = 0; x < 19; x++) {
    			var newNode = cc.instantiate(this.chess);//创建棋子节点

				this.node.addChild(newNode);
                newNode.setPosition(cc.p(x*42+20,y*42+20));//根据棋盘和棋子大小计算使每个棋子节点位于指定位置

    			newNode.on(cc.Node.EventType.TOUCH_END, function (event) {
    				if (self.gameState == 'over') {
    					return;
    				}
    				this.node.off('foobar', this._sayHello, this);

    				var touchnode = event.currentTarget;//当前触碰节点
    				this.currentPos = cc.p((touchnode.x-20)/42,(touchnode.y-20)/42);//当前下的棋子坐标

    				//cc.log(this.currentPos);
    				if (touchnode.getComponent(cc.Sprite).spriteFrame == null) {
						if (self.gameState === 'white') {
							touchnode.getComponent(cc.Sprite).spriteFrame = self.whiteSpriteFrame;//下子后添加棋子图片使棋子显示
							
							if (self.Juge() == true ) {//结束
								this.EndChess(true);
							}
							else{
								self.gameState = 'black';
								self.scheduleOnce(function(){self.ComputerSet()}, 0.5);//延迟一秒电脑下棋
							}
						}
						else{
							touchnode.getComponent(cc.Sprite).spriteFrame = self.blackSpriteFrame;//下子后添加棋子图片使棋子显示
							
							if (self.Juge() == true ) {//结束
								this.EndChess(false);
							}
							else{
								self.gameState = 'white';
								self.scheduleOnce(function(){self.ComputerSet()}, 0.3);//延迟一秒电脑下棋
							}
						}
    				}
    				
				}, this);

				this.chessList.push(newNode);
    		}
    	}
    	
    	this.AddFiveCount();
    	this.InitChess();
    },

    InitChess:function(){//初始化
    	this.popDlg.x = -10000;

		for (let i = 0; i < 19*19; i++) {
    		this.chessList[i].getComponent(cc.Sprite).spriteFrame = null;
    	}
    	if (Globals.ComputerFirstSet == true) {//电脑执黑子
    		//在最中间位置下子
    		this.chessList[9*19+9].getComponent(cc.Sprite).spriteFrame = this.blackSpriteFrame;
       		this.currentPos = cc.p(9,9);//当前下的棋子坐标
        	this.gameState = 'white';
    	}
    	else{
    		this.gameState = 'black';
    	}
    },

    EndChess:function(isWhite){//结束
    	this.gameState = 'over';
    	this.popDlg.x = 0;

    	//richtext 显示
    	var label = cc.find("Canvas/popdlg/richtext");
    	if (isWhite) {
    		if (Globals.ComputerFirstSet == true) {
    			label.getComponent(cc.RichText).string = "<color=#ff0000>您 </c><color=#ffffff>白色 </c><color=#ff0000>赢了</color>";
    		}
    		else{
    			label.getComponent(cc.RichText).string = "<color=#ff0000>电脑 </c><color=#ffffff>白色 </c><color=#ff0000>赢了</color>";
    		}
    	}
    	else{
    		if (Globals.ComputerFirstSet == true) {
    			label.getComponent(cc.RichText).string = "<color=#ff0000>电脑 </c><color=#000000>黑色 </c><color=#ff0000>赢了</color>";
    		}
    		else{
    			label.getComponent(cc.RichText).string = "<color=#ff0000>您 </c><color=#000000>黑色 </c><color=#ff0000>赢了</color>";
    		}
    	}

    	var FadeOut = cc.sequence(cc.spawn(cc.fadeTo(0.3, 200), 
    									   cc.sequence(cc.scaleTo(0.15, 1.1),cc.scaleTo(0.1, 1),null)),
    							  cc.callFunc(() => {}));

    	this.popDlg.runAction(FadeOut);
    },

	ComputerSet:function(){//电脑下棋
		this.getFiveScore();

		var index = this.getHightScorePos();

		//下子
		if (Globals.ComputerFirstSet == true){
			this.chessList[this.fiveGroup[index.x][index.y]].getComponent(cc.Sprite).spriteFrame = this.blackSpriteFrame;
		}
		else{
			this.chessList[this.fiveGroup[index.x][index.y]].getComponent(cc.Sprite).spriteFrame = this.whiteSpriteFrame;
		}
		
        this.currentPos = cc.p((this.chessList[this.fiveGroup[index.x][index.y]].x-20)/42,(this.chessList[this.fiveGroup[index.x][index.y]].y-20)/42);//当前下的棋子坐标

        if (this.gameState == 'white') {
        	if (this.Juge() == true ) {
        		this.EndChess(true);
        		return;
    	    }
    		this.gameState = 'black';	
        }
        else{
        	if (this.Juge() == true ) {
        		this.EndChess(false);
        		return;
    	    }
    		this.gameState = 'white';	
        }
    },

    getHightScorePos:function(){//获取分数最高的位置
    	var MaxScore = 0;
    	var MaxScoreGroupIndex = 0;
    	for (let i = 0; i < this.fiveGroupScore.length; i++) {
    		if (this.fiveGroupScore[i] > MaxScore) {
    			MaxScore = this.fiveGroupScore[i];
    			MaxScoreGroupIndex = i;
    		}
    	}

    	//判断这个组里可下的最优子
    	// var Flag = false;//判断周围是否为空
    	 var MaxScoreIndex = 0;
    	// for (let i = 0; i < 5; i++) {
    	// 	if (this.chessList[this.fiveGroup[MaxScoreGroupIndex][i]].getComponent(cc.Sprite).spriteFrame == null) {
    	// 		MaxScoreIndex = i;
    	// 		Flag = true;
    	// 	}
    	// 	if (this.chessList[this.fiveGroup[MaxScoreGroupIndex][i]].getComponent(cc.Sprite).spriteFrame != null) {
    	// 		Flag = true;
    	// 	}
    	// 	if (true) {}

    	// }



		var flag1 = false;//无子
        var flag2 = false;//有子
        for(var i=0;i<5;i++){
            if(!flag1&&this.chessList[this.fiveGroup[MaxScoreGroupIndex][i]].getComponent(cc.Sprite).spriteFrame == null){
                MaxScoreIndex = (function(x){return x})(i);
            }
            if(!flag2&&this.chessList[this.fiveGroup[MaxScoreGroupIndex][i]].getComponent(cc.Sprite).spriteFrame != null){
                flag1 = true;
                flag2 = true;
            }
            if(flag2&&this.chessList[this.fiveGroup[MaxScoreGroupIndex][i]].getComponent(cc.Sprite).spriteFrame == null){
                MaxScoreIndex = (function(x){return x})(i);
                break;
            }
        }
    	return cc.p(MaxScoreGroupIndex,MaxScoreIndex);
    },

    getFiveScore:function(){//获取五元组分数

    	for (let i = 0; i < this.fiveGroup.length; i++) {
    		var white=0;
    		var black=0;
    		for (let k = 0; k < 5; k++) {
    			if (this.chessList[this.fiveGroup[i][k]].getComponent(cc.Sprite).spriteFrame == this.whiteSpriteFrame) {
    				white++;
    			}
    			if (this.chessList[this.fiveGroup[i][k]].getComponent(cc.Sprite).spriteFrame == this.blackSpriteFrame) {
    				black++;
    			}
    		}

			if(black+white==0){
                this.fiveGroupScore[i] = 7;
            }else if(black>0&&white>0){
                this.fiveGroupScore[i] = 0;
            }else if(black==0&&white==1){
                this.fiveGroupScore[i] = 35;
            }else if(black==0&&white==2){
                this.fiveGroupScore[i] = 800;
            }else if(black==0&&white==3){
                this.fiveGroupScore[i] = 15000;
            }else if(black==0&&white==4){
                this.fiveGroupScore[i] = 800000;
            }else if(white==0&&black==1){
                this.fiveGroupScore[i] = 15;
            }else if(white==0&&black==2){
                this.fiveGroupScore[i] = 400;
            }else if(white==0&&black==3){
                this.fiveGroupScore[i] = 1800;
            }else if(white==0&&black==4){
                this.fiveGroupScore[i] = 100000;
            }

    	}
    },

    AddFiveCount:function(){//添加五元组

    	//横向   19*15=285
    	for (let y = 0; y<19; y++) {
    		for (let x = 0; x<15; x++) {
    			this.fiveGroup.push([19*y+x,19*y+x+1,19*y+x+2,19*y+x+3,19*y+x+4]);
    		}
    	}

    	//纵向  19*15=285
    	for (let x = 0; x<19; x++) {
    		for (let y = 0; y<15; y++) {
    			this.fiveGroup.push([19*y+x,19*(y+1)+x,19*(y+2)+x,19*(y+3)+x,19*(y+4)+x]);
    		}
    	}

    	//右上
        for(let b=-10;b<=10;b++){
            for(let x=0;x<11;x++){
                if(b+x<0||b+x>10){
                    continue;
                }
                else{
                    this.fiveGroup.push([(b+x)*19+x,(b+x+1)*19+x+1,(b+x+2)*19+x+2,(b+x+3)*19+x+3,(b+x+4)*19+x+4]);
                }
            }
        }

        //右下
        for(let b=4;b<=24;b++){
            for(let y=0;y<11;y++){
                if(b-y<4||b-y>14){
                    continue;
                }
                else{
                    this.fiveGroup.push([y*19+b-y,(y+1)*19+b-y-1,(y+2)*19+b-y-2,(y+3)*19+b-y-3,(y+4)*19+b-y-4]);
                }
            }
        }
    },

    onZero:function(number){//小于0置0  大于18置18
    	if (number <0) {
    		number = 0;
    	}
    	if (number >19) {
    		number = 19;
    	}

    	return number;
    },

    Juge:function(){//判断是否五个
    	var CheckChess;
    	var fiveCount = 0;

    	if (this.gameState == 'white') {
    		CheckChess = this.whiteSpriteFrame;
    		cc.log("Juge white");
    	}
    	else{
    		CheckChess = this.blackSpriteFrame;
    		cc.log("Juge black");
    	}

		//检查横向
		fiveCount=0;
		for (let x = this.onZero(this.currentPos.x-5); x < this.onZero(this.currentPos.x+5); x++) {

			if (this.chessList[this.currentPos.y*19+x].getComponent(cc.Sprite).spriteFrame == CheckChess) {
				fiveCount++;
			}
			else{
				fiveCount=0;
			}

			if (fiveCount >=5) {
				if (CheckChess == this.whiteSpriteFrame) {
					cc.log("is over white go");
					return true;
				}
				else{
					cc.log("is over black go");
					return true;
				}
			}
		}

		//检查纵向
		fiveCount=0;
		for (let y = this.onZero(this.currentPos.y-5); y < this.onZero(this.currentPos.y+5); y++) {

			if (this.chessList[y*19+this.currentPos.x].getComponent(cc.Sprite).spriteFrame == CheckChess) {
				fiveCount++;
			}
			else{
				fiveCount=0;
			}

			if (fiveCount >=5) {
				if (CheckChess == this.whiteSpriteFrame) {
					cc.log("is over white go");
					return true;
				}
				else{
					cc.log("is over black go");
					return true;
				}
			}
		}

		//检查右上
		fiveCount=0; 
		for (let x = 0; x < 19; x++) {
			let y = this.currentPos.y + x-this.currentPos.x;
			if(y<0 || y>18){
				continue;
			}
			if (this.chessList[y*19+x].getComponent(cc.Sprite).spriteFrame == CheckChess) {
				fiveCount++;
			}
			else{
				fiveCount=0;
			}

			if (fiveCount >=5) {
				if (CheckChess == this.whiteSpriteFrame) {
					cc.log("is over white go");
					return true;
				}
				else{
					cc.log("is over black go");
					return true;
				}
			}

			y++;
		}

		//检查左上
		fiveCount=0; 
		for (let x = 0; x < 19; x++) {
			let y = this.currentPos.y - x+this.currentPos.x;
			if(y<0 || y>18){
				continue;
			}
			if (this.chessList[y*19+x].getComponent(cc.Sprite).spriteFrame == CheckChess) {
				fiveCount++;
			}
			else{
				fiveCount=0;
			}

			if (fiveCount >=5) {
				if (CheckChess == this.whiteSpriteFrame) {
					cc.log("is over white go");
					return true;
				}
				else{
					cc.log("is over black go");
					return true;
				}
			}

			y++;
		}

		return false;
    },

    //start () {

    //},

    // update (dt) {},
    // 
    

    /****************************按钮********************************/
    Reset:function(){
    	//Alert.show("Reset", null, null, 0.1);
    	
    	this.InitChess();
    },

    Return:function(){
    	//Alert.show("Return", null, null, 0.1);
    	cc.director.loadScene("Start");
    },

    LoogScore:function(){
    	Alert.show("LoogScore", null, null, 0.1);
    },

});
