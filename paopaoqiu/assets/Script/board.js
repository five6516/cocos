// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var gfunction = require("function");

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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
     
    _Scale:function(big){

        if (big == true) {
            let action1 = cc.scaleTo(0.1, 2, 1);
            let action2 = cc.scaleTo(0.1, 1, 1);
            let action3 = cc.scaleTo(0.1, 2, 1);
             // 播放形变动画
            this.node.runAction(cc.sequence(action1, action2, action3));
        }
        else{
             // 播放形变动画
             let action1 = cc.scaleTo(0.1, 1, 1);
            let action2 = cc.scaleTo(0.1, 2, 1);
            let action3 = cc.scaleTo(0.1, 1, 1);

            this.node.runAction(cc.sequence(action1, action2, action3));
        }    
    },
    
    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {
       //cc.log(otherCollider.node.name);

        if (otherCollider.node.name == 'Stars') {
            //this.node.scaleX = 2;
            //
            if (otherCollider.node.color.getG() == 0) {
                Globals.Bang = true;
                this.scheduleOnce(function(){Globals.Bang = false;},2);
            }
            else{
                this._Scale(true);
                this.scheduleOnce(function(){this._Scale(false);},10);    
            }
    
            gfunction.starsPool.put(otherCollider.node);
        }
        if (otherCollider.node.name == 'love') {
            Globals.Blood ++;
            gfunction.lovesPool.put(otherCollider.node);
        }
    },

    // 只在两个碰撞体结束接触时被调用一次
    onEndContact: function (contact, selfCollider, otherCollider) {

    },

    // 每次将要处理碰撞体接触逻辑时被调用
    onPreSolve: function (contact, selfCollider, otherCollider) {
 
    },

    // 每次处理完碰撞体接触逻辑时被调用
    onPostSolve: function (contact, selfCollider, otherCollider) {
  
    }
});
