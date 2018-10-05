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
        // 
        speed: cc.v2(),
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    _Init:function(){

        this._rigidbody = this.getComponent(cc.RigidBody);//获取刚体组件

        //随机设置刚体组件初速度
        let speedx = gfunction.RandomINT(-1*Math.abs(this.speed.x),Math.abs(this.speed.x));
        let speedy = gfunction.RandomINT(0,-1*Math.abs(this.speed.y));
        this._rigidbody.linearVelocity.x = speedx*(Globals.Level*0.1+1);
        this._rigidbody.linearVelocity.y = speedy*(Globals.Level*0.1+1);

        this._call = function () {
            if (this._CheckPosition() == -1 || Globals.GameState == false) {

               gfunction.lovesPool.put(this.node);//释放节点
            }
        };

        this.schedule(this._call,1,cc.macro.REPEAT_FOREVER);
    },

    _CheckPosition:function(){//检查当前坐标
        if (this.node.y<-10) {
            return -1;
        }

        return 0;
    },
    // update (dt) {},
});
