var Constants = cc.Enum({
		//地板循环移动时间间隔
        BackgroundTime:0.01,
        //地板移动速度
        BackgroundSpeed:3,
        //车辆位置
		CarPositionXLeft:[87-320,207-320],
		CarPositionXRight:[431-320,553-320],
		CarPositionY:40-180,

		//石头产生时间间隔
		SetStoneTime:1.2,
		//石头产生的Y坐标
		SetStoneY:400-180,
})



module.exports = Constants;