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
var player = require("player");
var stars = require("stars");
var loves = require("love");
var Storage = require("Storage");

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
        
        player: {//player预制体
            default: null,  
            type: cc.Prefab, 
        },

        star: {//star预制体
            default: null,  
            type: cc.Prefab, 
        },

        love: {//star预制体
            default: null,  
            type: cc.Prefab, 
        },

        board:{//弹板
            default:null,
            type:cc.Node,
        },

        score: {//分数标签
            default: null,  
            type: cc.Label, 
        },

        level: {//等级标签
            default: null,  
            type: cc.Label, 
        },

        blood:{//血量layout
            default:null,
            type:cc.Node,
        },

        bloodPic:{//血量图片
            default:null,
            type:cc.SpriteFrame,
        },

        endscene:{//结束弹框layout
            default:null,
            type:cc.Node,
        },

        btnpause:{//暂停按钮
            default:null,
            type:cc.Node,
        },
        pausePic:{//暂停图片
            default:null,
            type:cc.SpriteFrame,
        },
        resumePic:{//恢复图片
            default:null,
            type:cc.SpriteFrame,
        },

        delaytime:3,
        Startdelaytime:2,
        delaytimeStars:3,
        StartdelaytimeStars:2,

        followSpeed:90,
    },

    onLoad () {


//cc.view.enableAutoFullScreen(true) 
        if (cc.sys.platform === cc.sys.MOBILE_BROWSER) {
            cc.log("MOBILE_BROWSER");
           
        }
   
        //初始化对象池
        gfunction.birdPool = new cc.NodePool();
        let initCount = 20;
        for (let i = 0; i < initCount; ++i) {
            let bird = cc.instantiate(this.player); // 创建节点
            gfunction.birdPool.put(bird); // 通过 putInPool 接口放入对象池
        }

        gfunction.bloodPool = new cc.NodePool();
        for (let i = 0; i < 10; ++i) {
            let blood = new cc.Node(); // 创建节点
            gfunction.bloodPool.put(blood); // 通过 putInPool 接口放入对象池
        }

        gfunction.starsPool = new cc.NodePool();
        for (let i = 0; i < 10; ++i) {
            let star = cc.instantiate(this.star); // 创建节点
            gfunction.starsPool.put(star); // 通过 putInPool 接口放入对象池
        }

        gfunction.lovesPool = new cc.NodePool();
        for (let i = 0; i < 10; ++i) {
            let love = cc.instantiate(this.love); // 创建节点
            gfunction.lovesPool.put(love); // 通过 putInPool 接口放入对象池
        }

        this._Init();//初始化变量

        this._RegisterTouch();  //注册触摸响应

    },

    _Init:function(){//初始化
        Storage.getScore();

        this._lastBlood = 0;
        this._touchPos = (-1,-1);
        this.endscene.setPosition(-200,-200);
        Globals.Blood = 3;
        Globals.GameState = true;
        Globals.Score = 0;
        this.score.string = "Score: " + Globals.Score;
        Globals.Level = 0;
        this.level.string = "Level: " + Globals.Level;

        this._UpdateBlood();


        this._call = function () {
            this._CreatePlayer();
        };

        this._callStars = function () {
            this._CreateStar();
        };

        this._callLoves = function () {
            this._CreateLove();
        };

        this.schedule(this._call,this.delaytime,cc.macro.REPEAT_FOREVER,this.Startdelaytime); 
        this.schedule(this._callStars,this.delaytimeStars,cc.macro.REPEAT_FOREVER,this.StartdelaytimeStars); 
        this.schedule(this._callLoves,this.delaytimeStars+3,cc.macro.REPEAT_FOREVER,this.StartdelaytimeStars); 
    },


    _End:function(){
        Storage.setScore(Globals.Score);

        this.unschedule(this._call);
        this.unschedule(this._callStars);
        this.unschedule(this._callLoves);
        this.endscene.setPosition(this.node.width/2,this.node.height/2);
    },

    //参数n为休眠时间，单位为毫秒:
    _Sleep:function(n) {
        var start = new Date().getTime();
        //  console.log('休眠前：' + start);
        while (true) {
            if (new Date().getTime() - start > n) {
                break;
            }
        }
        // console.log('休眠后：' + new Date().getTime());
    },

    _AddScore:function(){//分数增加
        Globals.Score++;
        this.score.string = "Score: " + Globals.Score;

        let action1 = cc.scaleTo(0.1, 1.1, 0.8);
        let action2 = cc.scaleTo(0.1, 0.9, 1.2);
        let action3 = cc.scaleTo(0.1, 1, 1);
        // 播放形变动画
        this.score.node.runAction(cc.sequence(action1, action2, action3));

        if (Globals.Score%10 == 0) {
            Globals.Level++;
            this.level.string = "Level: " + Globals.Level;
            this.level.node.runAction(cc.sequence(action1, action2, action3));
        }
    },

    _RegisterTouch:function(){//注册触摸响应
        var self =this;
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            self._touchPos = event.getLocation();

        },this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            
        },this);
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            self._touchPos = (-1,-1);
        
        },this);

    },

    _UpdateBlood:function(){//更新血量
          if (Globals.Blood === this._lastBlood) {//不更新

          }
          else if (Globals.Blood > this._lastBlood) {//增加
                for (let i = 0; i < Globals.Blood - this._lastBlood; i++) {

                  let blood = null;
                  if (gfunction.bloodPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
                      blood = gfunction.bloodPool.get();
                  } 
                  else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
                      blood = new cc.Node();
                  }

                  let sp = blood.addComponent(cc.Sprite);
                  sp.spriteFrame = this.bloodPic;

                  blood.parent = this.blood;
                }
          }
          else{//减少
                let chirdnode = [];
                chirdnode = this.blood.getChildren();

                for (let i = 0; i < this._lastBlood - Globals.Blood; i++) {
                    if (chirdnode[i] != null) {
                        gfunction.bloodPool.put(chirdnode[i]);//释放节点
                    }
                }
          }

          this._lastBlood = Globals.Blood;
        
    },


    _CreateStar:function(){//生成xingxing
        let star = null;
        if (gfunction.starsPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            star = gfunction.starsPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            star = cc.instantiate(this.star);
            cc.log('stars 对象池空间不足')
        }

        let starJs = star.getComponent(stars);
        starJs._Init();
        star.parent = this.node;
        star.setPosition(gfunction.RandomINT(star.width/2+100,this.node.width-star.width/2-100),this.node.height-10-star.height/2);

    },

    _CreateLove:function(){
        let love = null;
        if (gfunction.lovesPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            love = gfunction.lovesPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            love = cc.instantiate(this.love);
            cc.log('stars 对象池空间不足')
        }

        let loveJs = love.getComponent(loves);
        loveJs._Init();
        love.parent = this.node;
        love.setPosition(gfunction.RandomINT(love.width/2+100,this.node.width-love.width/2-100),this.node.height-10-love.height/2);

    },

    _CreatePlayer:function(){//生成小鸡

        let bird = null;
        if (gfunction.birdPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            bird = gfunction.birdPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            bird = cc.instantiate(this.player);
            cc.log('bird 对象池空间不足')
        }

        let birdJs = bird.getComponent(player);
        birdJs._Init();
        bird.parent = this.node;
        bird.setPosition(gfunction.RandomINT(bird.width/2+100,this.node.width-bird.width/2-100),this.node.height-10-bird.height/2);

        this._AddScore();
    },

    start () {

    },

    update (dt) {

        if (Globals.GameState == true) {//游戏进行中
            //板子移动
            if (this._touchPos != (-1,-1)) {

                let oldPos = this.board.position;
                // get move direction
                // 
                let direction=(this._touchPos.sub(oldPos)).normalize();
                // multiply direction with distance to get new position
                let newPos = oldPos.add(direction.mul(this.followSpeed * dt));
                newPos.y = oldPos.y;
                // set new position
                this.board.setPosition(newPos);
            }

            this._UpdateBlood();

            if (Globals.Blood <=0 && Globals.GameState == true) {
                cc.log("Game OVER");
                Globals.GameState = false;
                this._End();
            }
        }
        
    },

    /*************************按钮消息*****************************/
    Btn_Return:function(){
        /************清空对象池*************/
        gfunction.birdPool.clear();
        gfunction.bloodPool.clear();
        gfunction.starsPool.clear();
        gfunction.lovesPool.clear();
        cc.director.loadScene("Start");
    },
    Btn_ReStart:function(event){
        this._Init();//初始化变量
    },
    Btn_Exit:function(){
        /************清空对象池*************/
        gfunction.birdPool.clear();
        gfunction.bloodPool.clear();
        gfunction.starsPool.clear();
        gfunction.lovesPool.clear();

        cc.game.end();
    },
    Btn_LookScore:function(){

    },
    Btn_Setting:function(){

    },
    Btn_Pause:function(){
        if (this._pause == true) {
            this.btnpause.getComponent(cc.Sprite).spriteFrame = this.pausePic;
            this._pause = false;
            cc.director.resume();
            
            
        }
        else{
            this.btnpause.getComponent(cc.Sprite).spriteFrame = this.resumePic;
            this._pause = true;
            cc.director.pause();
        }     
    },

});
