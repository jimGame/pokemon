

enum GameSceneState {
    Normal,
    Lvup,
    Pause,
}

class GameScene extends egret.DisplayObjectContainer {

    //public monsterName = ["025Pikachu","016Pidgey","004Charmander","007Squirtle","001Bulbasaur","074Geodude"];
    public monsterWeight = [2, 2, 0, 2, 2, 2, 2, 2, 2];
    public testMonster: Monster[] = [];//怪物
    private pokeBall: PokeBall[] = [];//精灵球
    private orderObj: MyDisplayContainer[] = [];
    public screenMonsterCount: number = 6//怪物数量
    private majorCity: MajorCity;//主城
    private pipeline: PipelineBack;//下水道背后
    private pipeline0: egret.Bitmap;//下水道前面
    private boomTimer: number;
    private ballShadow: egret.Bitmap[] = [];//精灵球的影子

    private homeLvUpTip: dragonBones.Armature;
    private monsterLvUp: dragonBones.Armature;
    private monsterLvUpWords:egret.Bitmap;


    private ballPanel:BallPanelUI;

    public isCollapse: boolean;
    //下水道入口的位置
    public holePosX: number;
    public holePosY: number;

    private addCoinShow: AddCoinShow;
    //
    private static g_instance: GameScene;
    public static getInstance() {
        return GameScene.g_instance;
    }

    public constructor() {
        super();
        
        this.boomTimer = 0;
        console.log("GameScene--hello world");
        GameScene.g_instance = this;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        this.createGameScene();
        
        this.addEventListener(egret.Event.ENTER_FRAME, this.update, this);
    }

    private stageW: number;
    private stageH: number;
    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene(): void {

        this.monsterLvUpWords = Utility.createBitmapByName("tip_lvup_png");
        

        this.stageW = this.stage.stageWidth;
        this.stageH = this.stage.stageHeight;

        this.holePosX = 100;
        this.holePosY = 100;

        PokeBall.curBallLv = 0;
        let collapseData =DataManager.getInstance().getBaseData_number("isCollapse"); 
        this.isCollapse = (collapseData!=null&&collapseData>0?true:false);
        this.majorCity = new MajorCity(this, this.stageW, this.stageH);
        this.addChildAt(this.majorCity, 0);

        for (let i = 0; i < 2; ++i) {
            this.ballShadow[i] = Utility.createBitmapByName("shadow_png");
            this.addChild(this.ballShadow[i]);
            this.ballShadow[i].anchorOffsetX = this.ballShadow[i].width / 2;
            this.ballShadow[i].anchorOffsetY = this.ballShadow[i].height / 2;
            this.ballShadow[i].visible = false;
        }

        for (let i = 0; i < this.screenMonsterCount; ++i) {
        //for (let i = 0; i < 2; ++i) {
            //创建怪物
            this.orderObj[i] = this.testMonster[i] = new Monster(this, "Armature", ["walk", "catch","notcatch"], this.stageW, this.stageH);
            this.addChild(this.testMonster[i]);
            if(i<2)
                this.testMonster[i].showMonster(false, false,this.isCollapse);
        }

        //精灵球
        this.orderObj[this.orderObj.length] = this.pokeBall[0] = new PokeBall(this, this.stageW, this.stageH, this.ballShadow[0]);
        this.addChildAt(this.pokeBall[0], this.numChildren);
        this.pokeBall[0].z = this.stageH - 2;


        this.orderObj[this.orderObj.length] = this.pokeBall[1] = new PokeBall(this, this.stageW, this.stageH, this.ballShadow[1]);
        this.addChildAt(this.pokeBall[1], this.numChildren);
        this.pokeBall[1].z = this.stageH - 2;

        this.referTime = 0;
        this.lastThrowBall = 0;
        this.pokeBallThrowInterval = 250;
        this.lastThrowBallTime = -100;

        ///// 管道后 ////////////////////////
        this.orderObj[this.orderObj.length] = new PipelineBack(this.holePosX, this.holePosY, this.stageH);
        this.addChild(this.orderObj[this.orderObj.length - 1]);
        ///////////////////////////////////////////////////////////

        this.addCoinShow = new AddCoinShow(this);
        this.addChild(this.addCoinShow);
        this.addCoinShow.x = this.holePosX;
        this.addCoinShow.y = this.stageH - this.holePosY;

        ////// 管道前 ////////////////////////////////////////////
        this.pipeline0 = Utility.createBitmapByName("0021_png");
        this.pipeline0.anchorOffsetX = this.pipeline0.width / 2;
        this.pipeline0.anchorOffsetY = 0;
        this.pipeline0.scaleX = 0.5;
        this.pipeline0.scaleY = 0.5;
        this.pipeline0.x = this.holePosX;
        this.pipeline0.y = this.stageH - this.holePosY - 120;

        this.addChild(this.pipeline0);
        this.pipeline0.touchEnabled = true;
        this.pipeline0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.swapLayer, this);

        //this.homeLvUpTip.display.visible = false;

        this.pause = false;

        this.ballPanel = new BallPanelUI(this.stageH);
        this.addChild(this.ballPanel);
        this.ballPanel.x = this.stageW/2+20;
        this.ballPanel.y = this.stageH;

        onkeydown = (ev: KeyboardEvent) => {
            // if (ev.keyCode == 65)
            // {
            //     let tip = new msgTipUI("不劳而获");
            //     Main.getInstance().addChild(tip);
            // } 
            //this.setMonsterLvUp(1001); 
        };
        this.monsterLvUp = null;
        //onkeyup = (ev:KeyboardEvent)=>{ if(ev.keyCode == 65) this.pause = false;};
        this.monsterLvUpWords.x = this.holePosX;
        this.monsterLvUpWords.y = this.stageH-this.holePosY-80;
        this.monsterLvUpWords.anchorOffsetX = this.monsterLvUpWords.width/2;
        this.monsterLvUpWords.anchorOffsetY = this.monsterLvUpWords.height;

        //this.m_offGold = 1000;
        let offGold = MonsterManager.getInstance().m_offGold; 
        if(offGold>0)
        {
            SoundPlay.Instance.Play("coin_funsya_mp3");
            let tip = new msgTipUI("不劳而获\n"+offGold);
            Main.getInstance().addChild(tip);

            let offGoldFont = new egret.BitmapText();
            this.addChild(offGoldFont);
            offGoldFont.font = RES.getRes("num0_fnt");
            offGoldFont.text = "+"+offGold;
            offGoldFont.anchorOffsetX = offGoldFont.width/2;
            offGoldFont.anchorOffsetY = offGoldFont.height/2;
            offGoldFont.scaleX = 1.5;
            offGoldFont.scaleY = 1.5;
            offGoldFont.x = this.stageW;
            offGoldFont.y = this.stageH-300;
            egret.Tween.get(offGoldFont).to({x:this.stageW-100,y:this.stageH-320},100).to({x:this.stageW-200,y:this.stageH-400},100).wait(500).to({y:0},200).call(()=>{this.removeChild(offGoldFont);});
        }

    }

    private hasMonsterLvUp:boolean;
    public setMonsterLvUp(monsterID:number):void
    {
        if(this.hasMonsterLvUp==true)
            return;
        this.hasMonsterLvUp = true;
        let monsterName = ConfigMonsterManager.getConfig(monsterID,"name2");
        let dragonbonesData = RES.getRes("monster_"+monsterName+ "DB_json");
        let texturedata = RES.getRes("monster_"+monsterName + "_json");
        let texture = RES.getRes("monster_" + monsterName + "_png");

        let dragonbonesFactory = new dragonBones.EgretFactory();
        dragonbonesFactory.addDragonBonesData(dragonBones.DataParser.parseDragonBonesData(dragonbonesData));
        dragonbonesFactory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, texturedata));

        this.monsterLvUp = dragonbonesFactory.buildArmature("Armature");        
        let idx = this.getChildIndex(this.pipeline0);
        this.addChildAt(this.monsterLvUpWords,idx);
        this.addChildAt(this.monsterLvUp.display,idx);


        this.monsterLvUp.display.x = this.holePosX;
        this.monsterLvUp.display.y =this.stageH;

        this.monsterLvUp.animation.gotoAndPlay("levelup",0,0,1);

    }

    private pause: boolean;
    //切换到下层
    private swapLayer(event: egret.TouchEvent): void {
        console.log("GameScene--回到下层");
        FloorUI.getInstance().swapLayer(true);
    }

    //扔球
    private lastThrowBall: number;
    private pokeBallThrowInterval: number;
    private lastThrowBallTime: number;
    public ThrowBall(event: egret.TouchEvent): void {
        //this.addCoinShow.showCoinVal(1000);
        if(PokeBall.curBallLv>7)
        {
            if(!PlayerManager.getInstance().updateConfig("diamon",-PokeBall.cost[PokeBall.curBallLv]+10000,false))
            {
                Main.getInstance().addChild(new CommonTipsUI("没有那么多钱!"));
                return;
            }
        }
        else
        {
            if(!PlayerManager.getInstance().updateConfig("gold",-PokeBall.cost[PokeBall.curBallLv],false))
            {
                Main.getInstance().addChild(new CommonTipsUI("没有那么多钱!"));
                return;
            }
        }

        if (this.referTime - this.lastThrowBallTime > this.pokeBallThrowInterval) {
            this.pokeBall[this.lastThrowBall].parabolaCalc(event.stageX, this.stageH - event.stageY);
            this.lastThrowBall = (this.lastThrowBall + 1) % 2;
            this.lastThrowBallTime = this.referTime;
            this.swapChildren(this.pokeBall[0], this.pokeBall[1]);
        }
    }

    //刷新
    private referTime: number;
    private update(): void
    {
        let temp: number = egret.getTimer();
        let deltaTime: number = Math.min(0.1, (temp - this.referTime) / 1000);
        this.referTime = temp;

        for (let i = 0; i < this.screenMonsterCount; ++i) {
            this.testMonster[i].update(deltaTime);
        }

        let p = 0;
        for (let i = 1; i < this.screenMonsterCount + 3; ++i) {
            let temp = this.orderObj[i];
            p = i - 1;
            while (p >= 0 && temp.z < this.orderObj[p].z) {
                this.orderObj[p + 1] = this.orderObj[p];
                p--;
            }
            this.orderObj[p + 1] = temp;
        }

        for (let i = 0; i < this.screenMonsterCount + 3; ++i) {
            this.setChildIndex(this.orderObj[i], i + 3);
        }

        this.pokeBall[0].update(deltaTime);
        this.pokeBall[1].update(deltaTime);

        this.refreshMonsters(deltaTime);
        this.addCoinShow.update(deltaTime);
        this.ballPanel.update(deltaTime);

        if(this.monsterLvUp!=null)
        {
            this.monsterLvUp.advanceTime(deltaTime);
            if(this.monsterLvUp.animation.isComplete)
            {
                this.removeChild(this.monsterLvUpWords);
                this.removeChild(this.monsterLvUp.display);
                this.monsterLvUp = null;
                this.hasMonsterLvUp = false;
            }
        }
    }


    public SetCollapse():void
    {
        if(this.isCollapse == true) 
            return;

        
        FloorUI.getInstance().swapLayer(false);
        this.isCollapse = true;
        this.majorCity.collapse();
        DataManager.getInstance().setBaseData("isCollapse","1");
    }

    //生成新的怪物
    private newMonsterInterval: number = 5;
    private createMonsterTimer: number = 0;
    private currMonsterCount: number = 0;
    private refreshMonsters(deltaTime: number): void {
        this.boomTimer += deltaTime;
        this.createMonsterTimer += deltaTime;
        if (this.createMonsterTimer > this.newMonsterInterval) {
            this.createMonsterTimer = 0;
            for (let i = 0; i < this.screenMonsterCount; ++i) {
                // console.log(this.testMonster[i].monsterState);
                if (this.testMonster[i].monsterState == MonsterState.Null) {
                    this.testMonster[i].showMonster(true, this.boomTimer > 300,this.isCollapse);
                    this.setChildIndex(this.testMonster[i], 1);
                    if (this.boomTimer > 300)
                        this.boomTimer = 0;
                    break;
                }
            }
        }
    }
}