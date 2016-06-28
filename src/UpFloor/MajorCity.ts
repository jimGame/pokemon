
class MajorCity extends egret.DisplayObjectContainer
{
    //public lvupExp = [1000,10000,100000,1000000,10000000,50000000];
    public majorLv:number;
    
    private screenW:number;
    private screenH:number;
    private gameScene:GameScene;
    private ground:egret.Bitmap;

    private static g_instance:MajorCity;
    public static getInstance(){
        return MajorCity.g_instance;
    }


    public constructor(gameScene:GameScene,screenW:number,screenH:number)
    {
        super();
        MajorCity.g_instance = this;
        this.gameScene = gameScene;
        this.width = this.screenW = screenW;
        this.height = this.screenH = screenH;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    
    private onAddToStage(event: egret.Event)
    {
        let sky2:egret.Bitmap = Utility.createBitmapByName("back1_ground3_png");
        this.addChild(sky2);
        sky2.anchorOffsetX = sky2.width/2;
        sky2.anchorOffsetY = 0;
        sky2.x = this.width/2;
        sky2.y = 0;

        //console.log(Utility.getExpByCityLv(50));

        //RES.getResByUrl('/resource/assets/GameScene/back/back_ground'+PlayerManager.getInstance().getConfig("homeLv")+'.png',this.onGroundComplete,this,RES.ResourceItem.TYPE_IMAGE);
        if(this.gameScene.isCollapse==false)
            RES.getResByUrl('/resource/assets/GameScene/back/back_ground'+PlayerManager.getInstance().getConfig("homeLv")+'.png',this.onGroundComplete,this,RES.ResourceItem.TYPE_IMAGE);
        else
            RES.getResByUrl('/resource/assets/GameScene/back/back_ground0.png',this.onGroundComplete,this,RES.ResourceItem.TYPE_IMAGE);
    }
    
    private onGroundComplete(data:any):void
    {

        if(this.numChildren>1)
        {
            this.ground.texture = <egret.Texture>data;
            this.ground.anchorOffsetY = this.ground.height;
            this.ground.x = this.width / 2;
            this.ground.y = this.height;
        }
        else
        {
            this.ground = new egret.Bitmap();
            this.ground.texture = <egret.Texture>data;
            this.addChild(this.ground);
            this.ground.touchEnabled = true;
            this.ground.addEventListener(egret.TouchEvent.TOUCH_END, this.gameScene.ThrowBall, this.gameScene);
            this.ground.anchorOffsetX = this.ground.width / 2;
            this.ground.anchorOffsetY = this.ground.height;
            this.ground.x = this.width / 2;
            this.ground.y = this.height;
        }
        // var img: egret.Texture = <egret.Texture>data;
        // let sky: egret.Bitmap = new egret.Bitmap(img);
        // this.addChild(sky);
        // sky.touchEnabled = true;
        // sky.addEventListener(egret.TouchEvent.TOUCH_END, this.gameScene.ThrowBall, this.gameScene);
        // sky.anchorOffsetX = sky.width/2;
        // sky.anchorOffsetY = sky.height;
        // sky.x = this.width/2;
        // sky.y = this.height;
    }

    // public calcExp():number
    // {
    //     let currLv = 0;
    //     let goldValue = 
    //     let growthValue = ()
    // }
    public onCrackComplete(data:any):void
    {
        var img: egret.Texture = <egret.Texture>data;
        let crack: egret.Bitmap = new egret.Bitmap(img);
        this.addChild(crack);
        crack.anchorOffsetX = crack.width/2;
        crack.anchorOffsetY = crack.height;
        crack.x = this.width/2;
        crack.y = this.height;

        egret.Tween.get(this).wait(500).call(()=>{
            this.removeChildAt(this.numChildren-1);
            this.setLvUp(0);
            this.gameScene.isCollapse = true;
        });
        //
    }

    public collapse()
    {
        RES.getResByUrl('/resource/assets/GameScene/back/upperGround_hibi.png',this.onCrackComplete,this,RES.ResourceItem.TYPE_IMAGE);
    }

    public setLvUp(lv:number = -1)
    {
        if(lv==-1)
        //RES.getResByUrl('/resource/assets/GameScene/back/upperGround_hibi.png',this.onGroundComplete,this,RES.ResourceItem.TYPE_IMAGE);
            RES.getResByUrl('/resource/assets/GameScene/back/back_ground'+PlayerManager.getInstance().getConfig("homeLv")+'.png',this.onGroundComplete,this,RES.ResourceItem.TYPE_IMAGE);
        else
        {
            
            RES.getResByUrl('/resource/assets/GameScene/back/back_ground0.png',this.onGroundComplete,this,RES.ResourceItem.TYPE_IMAGE);
        }
        //this.majorLv++;
    }
}