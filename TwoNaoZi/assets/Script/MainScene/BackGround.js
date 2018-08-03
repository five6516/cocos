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
         //获取用来循环背景的图片节点，一般两张
        BackGroundNode:{
            default:[],
            type:[cc.Node],
        },

        //背景图片
        BackGroundImage:{
            default:null,
            type:cc.Sprite,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        this._size = cc.winSize;
        cc.log("屏幕尺寸:" + this._size);
        cc.log("循环速度:" + constants.BackgroundTime);

        //获取背景图片高度
        this._height = this.BackGroundImage.spriteFrame.getRect().height;

        //背景循环
        this.schedule(this.GroundMove, constants.BackgroundTime);
    },

    GroundMove:function(){
        //y坐标递减，图片向下移动
        this.BackGroundNode[0].y -= constants.BackgroundSpeed; 
        this.BackGroundNode[1].y -= constants.BackgroundSpeed; 

         //图片到达最底部时返回顶部
        if (this.BackGroundNode[0].y - constants.BackgroundSpeed < this._height *-1 ) {
            this.BackGroundNode[0].y = this._height;
        }
        if (this.BackGroundNode[1].y - constants.BackgroundSpeed< this._height *-1 ) {
            this.BackGroundNode[1].y = this._height;
        }
     },

    //start () {

    //},

    update (dt) {
        
    },
});
