

class PokeBall extends MyDisplayContainer
{
    public static ballMaxLv = 10;
    public static curBallLv;
    public static cost:number[] = [0,20,40,80,160,320,640,1280,10040,10080];
    private static hitrate:number[] = [0.6,0.65,0.70,0.75,0.8,0.85,0.90,0.95,1,2]; 
    //抛物线最高点
    private deltaH: number;
    private xb: number;

    private timeXb: number = 0.45;
    private timeThrow: number;
    private yb: number;
    private yc: number;
    private a: number;
    private b: number;

    private screenW: number;
    private screenH: number;
    private symmetryAxis: number;
    private gameScene: GameScene;
    //private tw: egret.Tween;
    private effect_smoke5:egret.Bitmap[] = [];
    private effect_shock3:egret.Bitmap;
    private testBall: egret.MovieClip;
    private ballBreak: egret.MovieClip;
    private isThrow: boolean;
    private shadow:egret.Bitmap;

    public constructor(_gameScene: GameScene, _screenW: number, _screenH: number,shadow:egret.Bitmap)
    {
        super();

        this.shadow = shadow;
        this.screenW = _screenW;
        this.screenH = _screenH;
        this.gameScene = _gameScene;

        this.deltaH = this.screenH*2 / 5;
        //精灵球
        // this.testBall = Utility.createBitmapByName("MasterBall_png");
        // this.addChild(this.testBall);
        // this.testBall.anchorOffsetX = this.testBall.width / 2;
        // this.testBall.anchorOffsetY = this.testBall.height / 2;

        let data = RES.getRes("ballImg_json");
        let txtr = RES.getRes("ballImg_png");
        let mcFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, txtr);
        
        this.testBall = new egret.MovieClip(mcFactory.generateMovieClipData("BallRotate"));
        
        //console.log("宽度:"+anim.width+" 高度:"+anim.height)
        this.testBall.anchorOffsetX = this.testBall.width/2;
        this.testBall.anchorOffsetY = this.testBall.height/2;
        this.addChildAt(this.testBall,this.numChildren);
        this.testBall.gotoAndPlay(0,-1);
       

       let breakData = RES.getRes("ballbreak_json");
       let breakTxtr = RES.getRes("ballbreak_png");
       let breakMc:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(breakData,breakTxtr);
       this.ballBreak = new egret.MovieClip(breakMc.generateMovieClipData("ballbreak_1"));
       this.addChild(this.ballBreak);
       this.ballBreak.visible = false;

       //this.ballBreak.visible = false;
        
        for(let i=0;i<3;++i)
        {
            this.effect_smoke5[i] = Utility.createBitmapByName("effect_smoke5_png");
            this.effect_smoke5[i].anchorOffsetY = this.effect_smoke5[i].height-(i%2==1?-5:45); 
            this.addChildAt(this.effect_smoke5[i],this.numChildren);
            this.effect_smoke5[i].visible = false;
        }
        this.effect_smoke5[0].anchorOffsetX = this.effect_smoke5[0].width*6/7;
        this.effect_smoke5[1].anchorOffsetX = this.effect_smoke5[1].width/2;
        this.effect_smoke5[2].anchorOffsetX = this.effect_smoke5[2].width/7;
        
        this.effect_shock3 = Utility.createBitmapByName("effect_shock3_png");
        this.effect_shock3.anchorOffsetX = this.effect_shock3.width/2;
        this.effect_shock3.anchorOffsetY = this.effect_shock3.height/2; 
        this.addChildAt(this.effect_shock3,this.numChildren);
        this.effect_shock3.visible = false;     
        
        this.x = this.screenW / 2;
        this.y = this.screenH;
        this.testBall.visible = false;
        this.isThrow = false;
        

        //this.tw = egret.Tween.get(this.testBall);
        //this.tw.to({ scaleX: 3, scaleY: 0.8 }, 50).to({ scaleX: 3, scaleY: 5 }, 50).to({ scaleX: 0.5, scaleY: 0.75 }, 350);//.to({ scaleX: 0.1, scaleY: 0.1 }, 40);
        //this.tw.
        //this.tw.pause();
    }

    //计算抛物线并扔出一个球
    public parabolaCalc(_xb: number, _yb: number): void
    {
        if (this.isThrow == true) return;
        this.testBall.visible = true;
        this.xb = _xb;
        this.yb = _yb;
        this.yc = _yb + this.deltaH;
        this.x = this.screenW / 2;
        this.y = this.screenH;

        this.b = (4 * this.timeXb * this.yc + Math.sqrt(16 * this.timeXb * this.timeXb * this.yc * this.yc - 16 * this.timeXb * this.timeXb * this.yb * this.yc)) / (2 * this.timeXb * this.timeXb);
        this.a = -(this.b * this.b / (4 * this.yc));
        this.symmetryAxis = -this.b / (2 * this.a);
        this.isThrow = true;
        this.timeThrow = 0;

        this.testBall.scaleX = 3;
        this.testBall.scaleY = 3;

        let tw = egret.Tween.get(this.testBall);
        tw.to({ scaleX: 3, scaleY: 1.3 }, 50).to({ scaleX: 2, scaleY: 5 }, 50).to({ scaleX: 0.05, scaleY: 0.1 }, 350);//.to({ scaleX: 0.1, scaleY: 0.1 }, 40);
        //y = ax^2 + bx; => (-y+screenH) = a*(x-screenW/2)^2 + b*(x-screenW/2);

        this.shadow.x = this.screenW/2;
        this.shadow.y = this.screenH;
        this.shadow.visible = true;

    }

    public update(deltaTime: number): void
    {
        // if(this.ballBrokenTime>0)
        // {
        //     this.updateBallBroken(deltaTime);
        // }
        if(this.ballBreak.visible&&this.ballBreak.isPlaying==false)
            this.ballBreak.visible = false;

        if (this.isThrow == false) return;
        this.timeThrow += deltaTime;
        if (this.timeThrow >= this.timeXb)
        {

            let deltaW = this.xb - this.screenW / 2;
            this.x = this.screenW / 2 + deltaW;
            this.y = this.screenH - (this.a * (this.timeXb * this.timeXb) + this.b * (this.timeXb));

            console.log(this.y);
            this.isThrow = false;
            this.timeThrow = this.timeXb;
            this.testBall.visible = false;
            if (this.checkHitMonster())
            {
                console.log("捕捉");
            }
            else 
            {
                SoundPlay.Instance.Play("SoundUp_explosion_mp3");
                this.showBallBroken();
            }

            this.shadow.visible = false;
            return;
        }

        let deltaW = this.xb - this.screenW / 2;
        this.x = this.screenW / 2 + deltaW * this.timeThrow / this.timeXb;
        this.y = this.screenH - (this.a * (this.timeThrow * this.timeThrow) + this.b * (this.timeThrow));

        this.shadow.x = (this.xb-this.screenW/2)*(this.timeThrow/this.timeXb)+this.screenW/2;
        this.shadow.y = this.screenH - this.yb*(this.timeThrow/this.timeXb);
        this.shadow.scaleX = this.shadow.scaleY = 2*(1-(this.timeThrow/this.timeXb));
        //if (this.timeThrow > this.symmetryAxis)
        //{//检测碰撞
        //    if (this.checkHitMonster())
        //    {
        //        console.log("捕捉");
        //        this.isThrow = false;
        //        this.timeThrow = this.timeXb;
        //        this.testBall.visible = false;
        //    }
        //}

        //if (this.xb>

    }

    //private ballBrokenTime:number;
    private showBallBroken():void
    {
        this.ballBreak.visible = true;
        this.ballBreak.gotoAndPlay(0,1);
        //this.ballBrokenTime = 0.5;
        this.effect_shock3.visible = true;
        this.effect_shock3.scaleX = 0.01;
        this.effect_shock3.scaleY = 0.01;
        let tw = egret.Tween.get(this.effect_shock3);
        
        tw.to({ scaleX: 1, scaleY: 0.8 }, 100).to({ scaleX: 0.01, scaleY: 0.01 }, 100).to({visible:false},0);//.to({ scaleX: 0, scaleY: 0 }, 350);//.to({ scaleX: 0.1, scaleY: 0.1 }, 40);
  
        for(let i=0;i<3;++i)
        {
            this.effect_smoke5[i].visible = true;
            this.effect_smoke5[i].alpha = 1;
            this.effect_smoke5[i].scaleX = 1;
            this.effect_smoke5[i].scaleY = 1;
            let tw = egret.Tween.get(this.effect_smoke5[i]);
            tw.to({scaleX:1.5,scaleY:1.5,alpha:0},500).to({visible:false},0);
        }
    }
    
    // private updateBallBroken(deltaTime:number):void
    // {
    //     this.ballBrokenTime -= deltaTime;
    //     console.log(this.ballBrokenTime);
    //     if(this.ballBrokenTime<=0)
    //     {
    //         //this.effect_shock3.visible = false;
    //         for(let i=0;i<3;++i)
    //         {
    //             this.effect_smoke5[i].visible = false;
    //         }
    //     }
    // }
    
    private checkHitMonster(): boolean
    {
        for (let i = 0; i < this.gameScene.screenMonsterCount; ++i)
        {
            if(this.gameScene.testMonster[i].monsterState == MonsterState.Null)
                continue;
            let mx = this.gameScene.testMonster[i].x + this.gameScene.testMonster[i].rootBone.global.x;
            let my = this.gameScene.testMonster[i].y + this.gameScene.testMonster[i].rootBone.global.y;
            if (Math.abs(mx - this.x) < 80 && (my - this.y < 180 && this.y < my))
            {
                if (this.gameScene.testMonster[i].monsterState == MonsterState.Walk)
                {
                    let rate:number = PokeBall.hitrate[PokeBall.curBallLv]-ConfigMonsterManager.getConfig(this.gameScene.testMonster[i].monsterID,"escapeRate");
                    let ranRate = Math.random();
                    console.log("PokeBall--抓怪概率:"+ranRate);
                    if(ranRate<rate)
                    {
                        this.gameScene.testMonster[i].ChangeState(MonsterState.Catch);
                    }
                    else
                    {
                        this.gameScene.testMonster[i].ChangeState(MonsterState.Escape);
                    }
                    
                    return true;
                }
            }
        }
        return false;
    }
}