module.exports= { 
    RandomINT : function(min,max) 
    {
       return Math.floor(Math.random()*(max-min+1)+min);
    },

    birdPool:null,//小鸟对象池
    bloodPool:null,//血量对象池
    starsPool:null,//STARS对象池
    lovesPool:null,//loveS对象池
 };

 window.Globals = {
    Level : 0,
    Blood :3,
    Score:0,
    ScoreList:[],
    Bang:false,//是否清除所有小鸟
    GameState:true,//true进行中  false结束
}


