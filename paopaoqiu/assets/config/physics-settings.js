// LIFE-CYCLE CALLBACKS:
        cc.game.once(cc.game.EVENT_ENGINE_INITED, function () {
        // 可以使用 cc.renderer 等初始化之后才准备好的引擎对象
            
            //物理系统
            cc.director.getPhysicsManager().enabled = true;
            cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
            cc.PhysicsManager.DrawBits.e_pairBit |
            cc.PhysicsManager.DrawBits.e_centerOfMassBit |
            cc.PhysicsManager.DrawBits.e_jointBit |
            cc.PhysicsManager.DrawBits.e_shapeBit;

            cc.director.getPhysicsManager().debugDrawFlags = 0;
            //cc.director.getPhysicsManager().gravity = cc.v2(0, -20);
            cc.director.getPhysicsManager().gravity = cc.v2(0,-2);
        });