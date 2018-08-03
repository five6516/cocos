// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

const Game = require("Game");
const constants = require("Constants");

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
        game:{
            default:null,
            type:Game,
        },
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
    },

    onInitCarPosition:function(isLeft){
        //初始化车辆位置
        //
        if (isLeft == true) {
            this.node.x = constants.CarPositionXLeft[0];
        }
        else{
            this.node.x = constants.CarPositionXRight[0];
        }
        this.node.y = constants.CarPositionY; 
    },

    onMoveLeft:function(isLeft){
        //初始化车辆位置
        //
        if (isLeft == true) {
            this.node.x = constants.CarPositionXLeft[0];
        }
        else{
            this.node.x = constants.CarPositionXRight[0];
        }
    },

    onMoveRight:function(isLeft){
        //初始化车辆位置
        //
        if (isLeft == true) {
            this.node.x = constants.CarPositionXLeft[1];
        }
        else{
            this.node.x = constants.CarPositionXRight[1];
        }
    },

   // start () {

    //},

    // update (dt) {},
});
