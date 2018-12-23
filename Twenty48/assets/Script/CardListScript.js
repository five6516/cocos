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
        
        CardPrefab: {
        	default:null,
        	type:cc.Prefab,
        },

        CardPicture:{
            default:[],
            type:[cc.SpriteFrame],
        },

        Card1:null,
        Card2:null,

        canvas: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    	this.onCreateCardaList();

    	this.onSendCard();
    },

    start () {

    },

    onSendCard:function(){
  
    	cc.log(gfunction.GetCardValue(Globals.CardsList[Globals.CardNum]));
    	cc.log(gfunction.GetCardValue(Globals.CardsList[Globals.CardNum+1]));

    	this.Card1.getComponent(cc.Sprite).spriteFrame = this.CardPicture[Globals.CardsList[Globals.CardNum]];
    	this.Card2.getComponent(cc.Sprite).spriteFrame = this.CardPicture[Globals.CardsList[Globals.CardNum+1]];

    },

    onCreateCardaList:function(){

    	for (var i = 0; i <Globals.MaxCardNum; i++) {
    		Globals.CardsList[i] = gfunction.RandomINT(0,5);
    	}


    	// for (var i = 0; i <Globals.MaxCardNum; i++) {
    	// 	cc.log(Globals.CardsList[i]);

    	// 	cc.log(gfunction.GetCardValue(Globals.CardsList[i]));
    	// }

    	this.Card1 = cc.instantiate(this.CardPrefab);
        this.Card1.parent = this.canvas;
        this.Card1.setPosition(cc.v2(0, 0));

        this.Card2 = cc.instantiate(this.CardPrefab);
        this.Card2.parent = this.canvas;
        this.Card2.setPosition(cc.v2(0, 0));

    },

    // update (dt) {},
});
