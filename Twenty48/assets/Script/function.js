module.exports= { 
    RandomINT : function(min,max) 
    {
       return Math.floor(Math.random()*(max-min+1)+min);
    },

    GetCardValue : function(card) 
    {
        if (card>0) {
            return 2*this.GetCardValue(card-1);
        }
        else{
            return (card+1)*2;
        }            
    },

    
 };

 window.Globals = {
    Level : 0,      
    Score:0,//分数     
    MaxCardNum :1000,//最大牌数      
    CardNum:0,//总牌数 
    ScoreList:[],
    GameState:true,//true进行中  false结束 
    

    CardsPool:null,//牌对象池
    CardsList:[],//发牌列表





    card_2 : 0,                      
    card_4 : 1,
    card_8 : 2,
    card_16 : 3,
    card_32 : 4,
    card_64 : 5,
};



 

