// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
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
        
        //分数项
        ScoreListItem:{
            default:null,
            type:cc.Prefab,
        },

        //
        scrollview:{
            default:null,
            type:cc.ScrollView,
        },

        currentItem:null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Storage.getScore();
        this.content = this.scrollview.content;
        this.items = [];//存储的
        this.initListData();
    },

    initListData:function(){
        this.content.height = 0;
        for (var i = 0; i < 10; i++) {
            let itemPrefab = cc.instantiate(this.ScoreListItem);
            let ItemHeight = itemPrefab.getContentSize().height*11/8;
            this.content.height = this.content.height + ItemHeight;
            this.content.addChild(itemPrefab);
            itemPrefab.setPosition(-100,-1*i*ItemHeight-ItemHeight/2);
            itemPrefab.getComponent(cc.Label).string = "Socre " + (i+1) + " :  " + Globals.Score[i];
            this.items.push(itemPrefab);
            cc.log(i);
        }
    },
    //start () {
///
    //},

    // update (dt) {},
});
