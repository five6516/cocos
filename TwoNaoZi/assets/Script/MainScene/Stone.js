// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
const constants = require("Constants");
const Game = require("Game");

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
        // 
        // 暂存 Game 对象的引用
        game: {
            default: null,
            serializable: false
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //this.node.x = 200;
        //this.node.y = 100;
        
        this.Stone_height = this.node.getContentSize().height;

        this.schedule(this.StoneMove, constants.BackgroundTime);
     },

    StoneMove:function(){
        //y坐标递减，石头向下移动
        this.node.y -= constants.BackgroundSpeed; 

        //cc.log(this.node.y);

        //到达最底部时销毁
        if (this.node.y < -1*(this.Stone_height/2) - cc.winSize.height/2) {
            this.node.destroy();
        }

        if (window.Globals.IsOver == true) {
            this.node.destroy();
        }

     },
    //start () {

    //},

    update (dt) {

        this.car_height = this.game.CarLeft.getContentSize().height;
        //cc.log(this.car_height);
        
        
        //cc.log("CarLeft:" + this.game.CarLeft.x + "node:" +this.node.x);
        if (this.game.CarLeft.x == this.node.x){
            if (this.node.y < this.game.CarLeft.y) {
                if (Math.abs(this.game.CarLeft.y - this.node.y) < (this.Stone_height/4 + this.car_height/4)) {
                    this.game.onHitStone(true);
                    this.unscheduleAllCallbacks();
                }
            }
            else {
                if (Math.abs(this.game.CarLeft.y - this.node.y) < (this.Stone_height/2 + this.car_height/2)) {
                    this.game.onHitStone(true);
                    this.unscheduleAllCallbacks();
                }
            }
        }

        if (this.game.CarRight.x == this.node.x){
            if (this.node.y < this.game.CarRight.y) {
                if (Math.abs(this.game.CarRight.y - this.node.y) < (this.Stone_height/4 + this.car_height/4)) {
                    this.game.onHitStone(false);
                    this.unscheduleAllCallbacks();
                }
            }
            else {
                if (Math.abs(this.game.CarRight.y - this.node.y) < (this.Stone_height/2 + this.car_height/2)) {
                    this.game.onHitStone(false);
                    this.unscheduleAllCallbacks();
                }
            }
        }

    },
});
