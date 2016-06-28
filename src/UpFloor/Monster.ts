
//怪物状态
enum MonsterState
{
    Null,  
    Walk,
    Catch,
    Escape,
    Fly,
    Down,
}


class Monster extends MyDisplayContainer
{
    
    //抛物线路径/////////////////////
    private deltaH: number;
    private xb: number;

    private timeXb: number = 0.55;
    private timeThrow: number;
    private yb: number;
    private yc: number;
    private a: number;
    private b: number;
    ////////////////////////////////
    
    private monsterType:number; 
    
    private existTime: number;  //呆在屏幕里的时长
    private animName: string[]; //动画的名字
    //private inStage: boolean;
    //private colliderRect: egret.Shape;
    private root: dragonBones.Bone;
    public monsterState: MonsterState;
    private armature: dragonBones.FastArmature;
    private targetPos: egret.Point;
    private screenW: number;
    private screenH: number;
    private moveSpeed: number = 120;
    private gameScene:GameScene;
    
    //private pokeBall:egret.MovieClip;
    private effect_shock3:egret.Bitmap;
    private shadow: egret.Bitmap;
    public monsterID:number;

    private ballbreakEffect:SeqFrame;

    //public selfDepth:egret.TextField;

    //构造函数
    public constructor(_gameScene:GameScene, armatureName: string, animName: string[], screenW: number, screenH: number)
    {
        super();
        this.gameScene = _gameScene;
        this.screenW = screenW;
        this.screenH = screenH;



        this.deltaH = this.screenH/3;
        
        this.animName = animName; 
        //this.setMonsterKind(this.gameScene.monsterName[Math.random()>0.5?0:4]);

        this.targetPos = new egret.Point;
        this.myPos = new egret.Point();
        
        let data = RES.getRes("ballImg_json");
        let txtr = RES.getRes("ballImg_png");
        let mcFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, txtr);
        
        this.shadow = Utility.createBitmapByName("shadow_png");
        this.addChild(this.shadow);
        this.shadow.anchorOffsetX = this.shadow.width/2;
        this.shadow.anchorOffsetY = this.shadow.height/2;
        this.shadow.scaleX = this.shadow.scaleY = 0.5;

        this.effect_shock3 = Utility.createBitmapByName("effect_shock3_png");
        this.effect_shock3.anchorOffsetX = this.effect_shock3.width/2;
        this.effect_shock3.anchorOffsetY = this.effect_shock3.height/2; 
        this.effect_shock3.y = -160;
        this.addChildAt(this.effect_shock3,this.numChildren);
        this.effect_shock3.visible = false; 
        this.xa = this.ya = 0;
        
        
        let dragonbonesData = RES.getRes("pokeball_catchDB_json");
        let texturedata = RES.getRes("pokeball_catch_json");
        let texture = RES.getRes("pokeball_catch_png");
        let dragonbonesFactory = new dragonBones.EgretFactory();
        dragonbonesFactory.addDragonBonesData(dragonBones.DataParser.parseDragonBonesData(dragonbonesData));
        dragonbonesFactory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, texturedata));
        this.ballDB = dragonbonesFactory.buildArmature("Armature");
        this.addChild(this.ballDB.display);
        //this.ballDB.display.y = -200;
        this.ballDB.display.visible = false;

        this.ballbreakEffect = new SeqFrame("pokeballboom_png",0,4,4,1,24,1);
        this.addChild(this.ballbreakEffect);
        this.ballbreakEffect.visible = false;
        this.ballbreakEffect.y = -380;
        // this.selfDepth = new egret.TextField();
        // this.addChild(this.selfDepth);
        // this.selfDepth.text = "0";
        this.ChangeState(MonsterState.Null);
        
    }
    private ballDB:dragonBones.Armature;
    
    public rootBone:dragonBones.FastBone;
    public setMonsterKind(monsterID:number, monsterName:string):void
    {
        //this.ballDB.display.y = -200;
        
        this.ballDB.resetAnimation();
        this.ballDB.display.visible = false;
        this.monsterID = monsterID;

        let dragonbonesData = RES.getRes("monster_"+monsterName + "DB_json");
        let texturedata = RES.getRes("monster_"+monsterName + "_json");
        let texture = RES.getRes("monster_" + monsterName + "_png");

        let dragonbonesFactory = new dragonBones.EgretFactory();
        dragonbonesFactory.addDragonBonesData(dragonBones.DataParser.parseDragonBonesData(dragonbonesData));
        dragonbonesFactory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, texturedata));

        this.armature = dragonbonesFactory.buildFastArmature("Armature");
        this.rootBone = this.armature.getBone("root");
        // this.armature = Utility.createDragon(monsterName);
        // this.rootBone = this.armature.getBone("root");
        
        
        //console.log("userData:" + this.armature.userData);
        
        this.addChildAt(this.armature.display,1);

        //this.monsterState = MonsterState.Walk;
        //let randomStart = Math.random() * this.armature.animation.gotoAndPlay(this.animName[0]).totalTime;
       // this.armature.advanceTime(randomStart);
        //this.scaleX = Math.random()>0.5?1:-1;
    }

    public showMonster(out:boolean,boom:boolean,collapse:boolean): void
    {
        //this.inStage = true;
        this.shadow.visible = true;
        this.showFront = false;
        this.existTime = 0;
        if(out==true)
        {
            this.x = Math.random()>0.5?this.screenW+160:-160;
            this.y = Math.random() * this.screenH/2+this.screenH*2/6;
        }
        else
        {
            this.x = Math.random() * this.screenW;
            this.y = Math.random() * this.screenH/2+this.screenH*2/6;
        }
        this.targetPos.x = this.x;
        this.targetPos.y = this.y;
        this.visible = true;
        
        if(collapse==true)
            this.monsterID = 1001;//修改为小拳石
        else if(boom==true)
            this.monsterID = 1499;
        else
        {
            let monsterCount = Math.min(ConfigMonsterManager.getLength(),PlayerManager.getInstance().getConfig("homeLv"));
            let totalWeight:number = 0;
            //for(let i=0;i<monsterCount;++i)
                //totalWeight += this.gameScene.monsterWeight[i];
            let homeLv = PlayerManager.getInstance().getConfig("homeLv");
            for(let i in ConfigMonster)
            {
                if(parseInt(i)>=1499)
                    break;
                let hb = ConfigMonster[i]["handbook"];
                if(hb>=0 && hb<=homeLv)
                    totalWeight += parseInt(ConfigMonster[i]["appearweight"]);
            }
            let randomNum = Utility.Random(0,totalWeight*10,true);
            let tempRandomNum = 0;

            // for(let i=0;i<monsterCount;++i)
            // {
            //     tempRandomNum+=this.gameScene.monsterWeight[i]*10;
            //     if(randomNum<tempRandomNum)
            //     {
            //         this.monsterID = 1001+i;
            //         break;
            //     }
            // }
            for(let i in ConfigMonster)
            {
                if(parseInt(i)>=1499)
                    break;
                let hb = ConfigMonster[i]["handbook"];
                tempRandomNum+=((hb>=0 && hb<=homeLv)?ConfigMonster[i]["appearweight"]*10:0);
                if(randomNum<tempRandomNum)
                {
                    this.monsterID = parseInt(i);
                    break;
                }  
            }
        }
        //this.monsterID = 1001//+Utility.Random(0,),true);


        this.setMonsterKind(this.monsterID,ConfigMonsterManager.getConfig(this.monsterID,"name2"));
        this.ChangeState(MonsterState.Walk);
    }

    public showFront:boolean;
    public ChangeState(_state: MonsterState): void
    {
        // if (this.monsterState == _state)
        //     return;
        
        this.monsterState = _state;
        if(this.monsterState == MonsterState.Walk)
        {
            this.walkOut = false;
            this.existTime = 0;
            let randomStart = Math.random() * this.armature.animation.gotoAndPlay(this.animName[0]).totalTime;
            this.armature.advanceTime(randomStart);
        }
        else if(this.monsterState == MonsterState.Escape)
        {
            //SoundUp_getFail_mp3
            SoundPlay.Instance.Play("SoundUp_getFail_mp3");
            this.armature.animation.gotoAndPlay(this.animName[2], 0, 0, 1);
            this.ballDB.animation.gotoAndPlay("notcatchmonster",0,0,1);

            this.effect_shock3.visible = true;
            this.effect_shock3.scaleX = 0.01;
            this.effect_shock3.scaleY = 0.01;
            let tw = egret.Tween.get(this.effect_shock3);
            tw.to({ scaleX: 1, scaleY: 0.8 }, 100).to({ scaleX: 0.01, scaleY: 0.01 }, 100).set({visible:false});//.to({ scaleX: 0, scaleY: 0 }, 350);//.to({ scaleX: 0.1, scaleY: 0.1 }, 40);

            this.ballDB.display.visible = true; 
            this.escapeTimer = -100;
        }
        else if (this.monsterState == MonsterState.Catch)
        {
            SoundPlay.Instance.Play("SoundUp_get_mp3");
            this.hideShadowTime = 0;
            this.armature.animation.gotoAndPlay(this.animName[1], 0, 0, 1);
            this.effect_shock3.visible = true;
            this.effect_shock3.scaleX = 0.01;
            this.effect_shock3.scaleY = 0.01;
            let tw = egret.Tween.get(this.effect_shock3);
            tw.to({ scaleX: 1, scaleY: 0.8 }, 100).to({ scaleX: 0.01, scaleY: 0.01 }, 100).set({visible:false});//.to({ scaleX: 0, scaleY: 0 }, 350);//.to({ scaleX: 0.1, scaleY: 0.1 }, 40);
            // this.pokeBall.visible = true;
            // this.pokeBall.y = -150;

            this.ballDB.animation.gotoAndPlay("catchmonster",0,0,1);
            this.ballDB.display.visible = true; 
            //this.removeChild(this.shadow);
        }
        else if(this.monsterState == MonsterState.Fly)
        {
            this.showFront = true;
            //this.pokeBall.y = 0;
        }
        else if(this.monsterState == MonsterState.Null)
        {
            //this.setMonsterKind(this.gameScene.monsterName[Math.random()>0.5?0:4]);
        }
        else if(this.monsterState == MonsterState.Down)
        {
            SoundPlay.Instance.Play("SoundUp_docan_mp3");
        }
    }

    private walkOut:boolean;
    private myPos: egret.Point;
    private hideShadowTime:number;
    private escapeTimer:number;
    //更新
    public update(deltaTime: number): void
    {
        if(this.armature!=null)
        this.armature.advanceTime(deltaTime);
        this.ballDB.advanceTime(deltaTime);

        if(this.monsterState == MonsterState.Fly || this.monsterState == MonsterState.Down)
            this.z = this.screenH;
        else this.z = this.y;
        //egret.TouchEvent.TOUCH_MOVE
        switch (this.monsterState)
        {
            case MonsterState.Walk:
                this.existTime += deltaTime;
                this.myPos.x = this.x;
                this.myPos.y = this.y;
                let dis = egret.Point.distance(this.myPos, this.targetPos);
                if (dis < 0.1)
                {
                    if(this.walkOut)
                    {
                        this.walkOut = false;
                        this.ChangeState(MonsterState.Null);
                        //this.scaleX = Math.random()>0.5?1:-1;
                        this.removeChildAt(1);
                        //this.setMonsterKind(this.gameScene.monsterName[Math.random()>0.5?0:4]);
                        break;
                    }
                    if(this.existTime>30)
                    {
                        this.targetPos.x = Math.random()>0.5?this.screenW+160:-160;
                        this.walkOut = true;
                    }
                    else
                    {
                        this.targetPos.x = Math.random() * this.screenW;
                    }
                    this.targetPos.y = Math.random() * this.screenH/2+this.screenH*2/6;
                    dis = egret.Point.distance(this.myPos, this.targetPos)
                }
                let delta: egret.Point = this.targetPos.subtract(this.myPos);//.normalize(1);
                if (dis <= deltaTime * this.moveSpeed)
                {
                    this.x = this.targetPos.x;
                    this.y = this.targetPos.y;
                } 
                else
                {
                    delta.normalize(1);
                    delta.x *= deltaTime * this.moveSpeed;
                    delta.y *= deltaTime * this.moveSpeed;
                    this.myPos = this.myPos.add(delta);
                    this.x = this.myPos.x;
                    this.y = this.myPos.y;
                }
                break;
            case MonsterState.Escape:
                if(this.escapeTimer>0)
                {
                    this.ballbreakEffect.update(deltaTime);
                    this.escapeTimer-=deltaTime;
                    if(this.escapeTimer<=0)
                    {
                        this.ballbreakEffect.visible = false;
                        this.ChangeState(MonsterState.Walk);
                    }
                }
                else if(this.armature.animation.isComplete)
                {
                    this.escapeTimer = 0.4;
                    this.ballDB.display.visible = false;
                    this.ballbreakEffect.reset(1);
                    this.ballbreakEffect.visible = true;
                }
                break;
            case MonsterState.Catch:
                if(this.armature!=null)
                {
                    if(this.armature.animation.isComplete)
                    {
                        this.armature = null;
                        this.removeChildAt(1);
                    }
                    else
                    {
                        if(this.hideShadowTime>-50)
                        {
                            this.hideShadowTime+=deltaTime;
                            if(this.hideShadowTime>0.6&& this.hideShadowTime<9)
                            {
                                this.hideShadowTime = 10;
                                SoundPlay.Instance.Play("SoundUp_koe4_mp3");
                            }
                            else if(this.hideShadowTime>10.2)
                            {
                                //this.shadow.visible = false;
                                this.hideShadowTime = -100;

                                this.shadow.scaleX = this.shadow.scaleY = 0;
                                egret.Tween.get(this.shadow).to({},400).to({scaleX:0.4,scaleY:0.4},400);
                            }
                        }
                    }
                }
                if(this.ballDB.animation.isComplete)
                {
                    
                    this.parabolaCalc();
                    //this.armature.display.visible = false;
                    this.shadow.visible = false;
                    this.ChangeState(MonsterState.Fly);
                }

                break;
            case MonsterState.Fly:
                this.timeThrow += deltaTime;
                if (this.timeThrow >= this.timeXb)
                {
                    this.timeThrow = this.timeXb;
                    this.x = this.xa + this.xb * this.timeThrow / this.timeXb;
                    this.y = this.screenH-(this.a * (this.timeThrow * this.timeThrow) + this.b * (this.timeThrow) + this.ya);
                    //console.log("final x:"+this.x+",y:"+this.y);
                    //console.log(this.y);
                    this.timeThrow = this.timeXb;
                    //this.pokeBall.visible = false;
                    //this.visible = false;
                    // Utility.getMonster(this.monsterID);
                    MonsterManager.getInstance().catachMonster(this.monsterID);

                    this.downTimer = 0.6;
                    this.ChangeState(MonsterState.Down);
                    break;
                }
                
                let deltaW = this.xb;
                this.x = deltaW * this.timeThrow / this.timeXb + this.xa;
                this.y = this.screenH-(this.a * (this.timeThrow * this.timeThrow) + this.b * (this.timeThrow)+this.ya);
                break;
            case MonsterState.Down:
                this.downTimer-=deltaTime;
                //this.y+=200*deltaTime;
                if(this.downTimer>0.5)
                {}
                else if(this.downTimer>0.25)
                    this.y+=200*deltaTime;
                else if(this.downTimer>0.1)
                    {}
                else //if(this.downTimer>0.1)
                    this.y+=200*deltaTime;
                // else //if(this.downTimer>0.1)
                //     {}
                if(this.downTimer<0)
                {
                    this.visible = false;
                    this.ChangeState(MonsterState.Null);
                }
                break;
        }
    }

    private downTimer:number = 0;
    
    private xa:number;
    private ya:number;
    //计算抛物线并扔出一个球
    public parabolaCalc(): void
    {
        //this.pokeBall.x = this.pokeBall.y = 0;
        
        this.xb = this.gameScene.holePosX-this.x;//_xb;
        this.yb = (this.gameScene.holePosY - this.screenH+this.y);//_yb;

        this.xa = this.x;
        this.ya = this.screenH-this.y;
        this.yc = this.deltaH;//_yb + this.deltaH;

        this.b = (4 * this.timeXb * this.yc + Math.sqrt(16 * this.timeXb * this.timeXb * this.yc * this.yc - 16 * this.timeXb * this.timeXb * this.yb * this.yc)) / (2 * this.timeXb * this.timeXb);
        this.a = -(this.b * this.b / (4 * this.yc));
        //this.symmetryAxis = -this.b / (2 * this.a);
        //this.isThrow = true;
        this.timeThrow = 0;

        // this.pokeBall.scaleX = 0.35;
        // this.pokeBall.scaleY = 0.35;

        //let tw = egret.Tween.get(this.pokeBall);
        //tw.to({ scaleX: 3, scaleY: 1.3 }, 50).to({ scaleX: 2, scaleY: 5 }, 50).to({ scaleX: 0.05, scaleY: 0.1 }, 350);//.to({ scaleX: 0.1, scaleY: 0.1 }, 40);
    }
}