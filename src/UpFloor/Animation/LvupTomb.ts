class LvUpTomb extends egret.DisplayObjectContainer
{
    private tomb:egret.Bitmap;
    private num1:egret.BitmapText;
    private num2:egret.BitmapText;
    private screenW:number;
    private screenH:number;

    private maskBG:egret.Bitmap;

    private startLv:number;
    public constructor(startLv:number,screenW:number,screenH:number)
    {
        super();


        this.screenW = screenW;
        this.screenH = screenH;

        this.maskBG = new egret.Bitmap();
        this.addChild(this.maskBG);
        this.maskBG.touchEnabled = true;
        this.maskBG.width = this.screenW*2;
        this.maskBG.height = this.screenH*2;
        this.maskBG.anchorOffsetX = this.maskBG.width/2;
        this.maskBG.anchorOffsetY = this.maskBG.height/2;;

        this.x = this.screenW/2;
        this.y = this.screenH/2;//-screenH/3;
        this.startLv = startLv;
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.addToStage,this);
    }

    private addToStage(event:egret.Event):void
    {
        this.tomb = Utility.createBitmapByName("homelvup_tomb_png");
        this.addChild(this.tomb);
        this.tomb.anchorOffsetX = this.tomb.width/2;
        this.tomb.anchorOffsetY = this.tomb.height/2;

        this.num1 = new egret.BitmapText();
        this.addChild(this.num1);
        this.num1.scaleX = this.num1.scaleY = 3;
        
        this.num1.y = 120;
        this.num1.font = RES.getRes("lv_fnt");
        this.num1.text = this.startLv.toString();
        this.num1.anchorOffsetX = this.num1.textWidth/2;
        this.num1.anchorOffsetY = this.num1.textHeight/2;
        //this.num1.x = -30;//this.num1.width/2;

        this.num2 = new egret.BitmapText();
        this.addChild(this.num2);
        this.num2.scaleX = this.num2.scaleY = 16;
        this.num2.alpha = .5;
        this.num2.font = RES.getRes("lv_fnt");
        this.num2.text = (this.startLv+1).toString();
        this.num2.anchorOffsetX = this.num2.textWidth/2;
        this.num2.anchorOffsetY = this.num2.textHeight/2;
        this.num2.y = 120;

        SoundPlay.Instance.Play("SoundUp_lvup2_mp3");
        egret.Tween.get(this.num2).to({scaleX:3,scaleY:3,alpha:1},160).call(()=>{this.num1.visible = false}).wait(900).call(()=>{
            this.parent.removeChild(this);
            let homeLv = PlayerManager.getInstance().getConfig("homeLv");
            for(let i in ConfigMonster)
            {
                if(parseInt(i)>=1499)
                    break;
                if(ConfigMonster[i]["handbook"]==homeLv)
                {
                    Main.getInstance().addChild(new NewMonAppear(i));
                    break;
                }
            }
            
        });
        //this.num1.textAlign = egret.HorizontalAlign.CENTER;
    }
}