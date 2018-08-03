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
const Storage = require("Storage");

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
        
        //画布节点
        Canvas:{
            default:null,
            type:cc.Node,
        },

        //背景节点
        BackGround:{
            default:null,
            type:cc.Node,
        },

        //Game Over节点
        GameOver:{
            default:null,
            type:cc.Node,
        },

        //石头节点
        Stone:{
            default:null,
            type:cc.Prefab,
        },

        //左车节点
        CarLeft:{
            default:null,
            type:cc.Node,
        },

        //右车节点
        CarRight:{
            default:null,
            type:cc.Node,
        },

        //score
        Score:{
            default:null,
            type:cc.Label,
        },

        //Level
        Level:{
            default:null,
            type:cc.Label,
        },

        //Highscore
        HighScore:{
            default:null,
            type:cc.Label,
        },

        //car hurt audio
        CarHurtAudio:{
            default:null,
            url:cc.AudioClip,
        },

        CarGoAudio:{
            default:null,
            url:cc.AudioClip,
        },
    },

    // LIFE-CYCLE CALLBACKS:
    // 
    onLoad () {
        cc.log(Globals.name);
        //当前场景
        this.scene = cc.director.getScene();

        //透明度
        this.BackGround.opacity  = 255;
        this.CarLeft.opacity  = 255;
        this.CarRight.opacity  = 255;

        //当前分数等级
        this.CurrentScore = 0;
        this.CurrentLevel = 0;
        constants.BackgroundSpeed = 3;
        constants.SetStoneTime = 1.2;

        this.HighScore.string = "Best  Score: " +  Storage.getScore();
        
        //重置变量
        window.Globals.IsOver = false;
        
        //获取car脚本组件
        this.CarLeftJs = this.CarLeft.getComponent("Car");
        this.CarRightJs = this.CarRight.getComponent("Car");

        //初始化car位置
        this.CarLeftJs.onInitCarPosition(true);
        this.CarRightJs.onInitCarPosition(false);

        //隐藏game over
        this.GameOver.active = false;

        //响应事件
        this.Canvas.on(cc.Node.EventType.TOUCH_START, function (event) {
            this.TouchDown(event.getLocationX());
        }, this);

        // add key down and key up event
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

        //this.Canvas.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
        //    this.TouchMove(event);
        //}, this);

        //this.Canvas.on(cc.Node.EventType.TOUCH_END, function (event) {
        //     this.TouchUp(event);
        //}, this);
        //
        
        this.PlayCarGoAudio = cc.audioEngine.play(this.CarGoAudio, true, 0.5);

        //创建stone
        this.schedule(this.onInitStoneLeft, constants.SetStoneTime,cc.macro.REPEAT_FOREVER,0.3);
        this.schedule(this.onInitStoneRight, constants.SetStoneTime,cc.macro.REPEAT_FOREVER);
    },

    onKeyDown: function (event) {
        switch(event.keyCode) {
            case cc.KEY.back:
                cc.log('Press a back key');
                cc.director.loadScene("StartScene");
                break;
        }
    },

    TouchDown:function(x){
        //移动car
        //cc.log(' down :' + x);

        if (x > 0 && x <144) {
            this.CarLeftJs.onMoveLeft(true);
        }
        else if (x >= 144 && x <318) {
            this.CarLeftJs.onMoveRight(true);
        }
         else if (x >= 318 && x <493) {
            this.CarRightJs.onMoveLeft(false);
        }
        else{
            this.CarRightJs.onMoveRight(false);
        }
    },

    TouchMove:function(x){
        //cc.log(' move :' + x);
    },

    TouchUp:function(x){
        //cc.log(' up :' + x);
    },
    //start () {
    //},

    update (dt) {
        if (this.CurrentScore > 10 *(this.CurrentLevel+1)) {
            this.onAddLevel();
        }
    },
    
    
    //增加分数
    onAddScore:function(){
        this.CurrentScore ++;
        this.Score.string = "Score: " +  this.CurrentScore;

        var action1 = cc.scaleTo(0.1, 1.1, 0.8);
        var action2 = cc.scaleTo(0.1, 0.9, 1.2);
        var action3 = cc.scaleTo(0.1, 1, 1);
        // 播放形变动画
        this.Score.node.runAction(cc.sequence(action1, action2, action3));
    },

    //增加等级
    onAddLevel:function(){
        this.CurrentLevel ++;
        this.Level.string = "Level: " +  this.CurrentLevel;

        var action1 = cc.scaleTo(0.1, 1.1, 0.8);
        var action2 = cc.scaleTo(0.1, 0.9, 1.2);
        var action3 = cc.scaleTo(0.1, 1, 1);
        // 播放形变动画
        this.Level.node.runAction(cc.sequence(action1, action2, action3));

        constants.BackgroundSpeed = 3 + this.CurrentLevel*0.4;
        constants.SetStoneTime = 1.2 + this.CurrentLevel*0.04;
    },

    onInitStoneLeft:function(){
        //获取0-1随机值
        let random0 = Math.floor(cc.random0To1()*2);

        //cc.log("random0:" + random0);

        //随机创建节点
        var nodeStone = cc.instantiate(this.Stone);
        nodeStone.parent = this.scene.getChildByName("Canvas").getChildByName("Stone");

        if (random0 == 0) {
             nodeStone.setPosition(constants.CarPositionXLeft[0],constants.SetStoneY);
        }
        else if (random0 == 1) {
            nodeStone.setPosition(constants.CarPositionXLeft[1],constants.SetStoneY);
        }

        nodeStone.getComponent('Stone').game = this;

        this.onAddScore();
    },

    onInitStoneRight:function(){
        //获取0-1随机值
        let random0 = Math.floor(cc.random0To1()*2);

        //cc.log("random0:" + random0);

        //随机创建节点
        var nodeStone = cc.instantiate(this.Stone);
        nodeStone.parent = this.scene.getChildByName("Canvas").getChildByName("Stone");

        if (random0 == 0) {
            nodeStone.setPosition(constants.CarPositionXRight[0],constants.SetStoneY);
        }
        else{
            nodeStone.setPosition(constants.CarPositionXRight[1],constants.SetStoneY);
        }

        nodeStone.getComponent('Stone').game = this;

        this.onAddScore();
    },
    
    onHitStone:function(isLeft){
        cc.log("撞击");

        // 播放弹跳音效
        cc.audioEngine.stop(this.PlayCarGoAudio);
        
        cc.audioEngine.playEffect(this.CarHurtAudio, false);
        this.onHitAction(isLeft);
        
        this.onSaveBestScore(this.CurrentScore);
        window.Globals.IsOver = true;

        this.GameOver.active = true;
        this.BackGround.opacity  = 200;
        this.CarLeft.opacity  = 200;
        this.CarRight.opacity  = 200;

        // 关闭所有定时器
        this.BackGround.getComponent('BackGround').unscheduleAllCallbacks();
        this.unscheduleAllCallbacks();

    },

    //撞击动画
    onHitAction:function(isLeft){
        let actionCar1 = cc.rotateTo(0.05, 15, 15);
        let actionCar2 = cc.rotateTo(0.05, 25, 25);
        let actionCar3 = cc.moveBy(0.1, cc.p(1,0));
        let actionCar4 = cc.rotateTo(0.05, 40, 40);
        let actionCar5 = cc.moveBy(0.1, cc.p(3,0));
        let actionCar6 = cc.rotateTo(0.3, 15, 15);

        if (isLeft == true) {
            this.CarLeft.runAction(cc.sequence(actionCar1, actionCar2, actionCar3,
                actionCar4,actionCar5,actionCar6));
        }
        else{
            this.CarRight.runAction(cc.sequence(actionCar1, actionCar2, actionCar3,
                actionCar4,actionCar5,actionCar6));
        } 
    },

    //保存最高分
    onSaveBestScore:function(Score){
        if (window.Globals.IsOver == false) {
            Storage.setScore(Score);
        }
    },

});
