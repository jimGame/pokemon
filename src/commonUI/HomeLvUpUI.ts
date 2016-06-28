class HomeLvUpUI extends eui.Component
{
    private _curLv:eui.BitmapLabel;
    private _nextLv:eui.BitmapLabel;
    private _money:eui.Label;
    private _goldFrame:eui.Image;

    private lvUpMoney:number;
    public constructor(LvUpMoney:number)
    {
        super();
        this.lvUpMoney = LvUpMoney;
        this.skinName = "resource/skin/HomeLvUp.exml";
        this.anchorOffsetX = this.width/2;
        this.anchorOffsetY = this.height/2;
    }

    protected createChildren() 
    {
        super.createChildren();
        this.initData();
    }
    private initData()
    {
        let curLv = PlayerManager.getInstance().getConfig("homeLv");
        let collapse = GameScene.getInstance().isCollapse;
        if(collapse)
        {
            this._curLv.text = 0+ "L";
            this._nextLv.text = curLv+"L";
        }
        else
        {
            this._curLv.text = curLv+ "L";
            this._nextLv.text = (curLv+1)+"L";
        }
        this._money.text = Utility.numToString_1(collapse?Math.pow(10,curLv).toString():this.lvUpMoney.toString());
    }

}


class HomeLvUpUI2 extends egret.DisplayObjectContainer
{

    private homeLvUpTipBack:egret.Shape;
    public homeLvUpTip:dragonBones.Armature;
    private homeLvUpInfo:HomeLvUpUI;
    private lvUpMoney:number;
    private curLv:number;
    private callback:Function;
    private callbackObj:any

    private homeLvUpUI:HomeLvUpUI;
    private noMoney:egret.TextField;

    public constructor(screenW:number,screenH:number,callback:Function,callbackObj:any)
    {
        super();
        this.callback = callback;
        this.callbackObj = callbackObj;
        this.curLv = PlayerManager.getInstance().getConfig("homeLv");
        this.lvUpMoney = Utility.getExpByCityLv(PlayerManager.getInstance().getConfig("homeLv"));
        this.x = screenW/2;
        this.y = screenH-160;

        this.homeLvUpTipBack = new egret.Shape();
        this.addChild(this.homeLvUpTipBack);
        this.homeLvUpTipBack.graphics.beginFill(GameConfig.TextColors.white,0.01);
        this.homeLvUpTipBack.width = screenW;
        this.homeLvUpTipBack.height = screenH;
        this.homeLvUpTipBack.anchorOffsetX = this.x;
        this.homeLvUpTipBack.anchorOffsetY = this.y;
        this.homeLvUpTipBack.graphics.drawRect(0,0,screenW,screenH);
        this.homeLvUpTipBack.touchEnabled = true;
        //this.homeLvUpTipBack.x = this.homeLvUpTipBack.y = 0;

        let dragonbonesData = RES.getRes("homelvupDB_json");
        let texturedata = RES.getRes("homelvup_json");
        let texture = RES.getRes("homelvup_png");
        let dragonbonesFactory = new dragonBones.EgretFactory();
        dragonbonesFactory.addDragonBonesData(dragonBones.DataParser.parseDragonBonesData(dragonbonesData));
        dragonbonesFactory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, texturedata));
        this.homeLvUpTip = dragonbonesFactory.buildArmature("Armature");
        this.addChild(this.homeLvUpTip.display);

        this.homeLvUpTip.getSlot("3").display.touchEnabled = true;
        this.homeLvUpTip.getSlot("3").display.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            this.homeLvUpTipBack.visible = false;
            this.homeLvUpTip.animation.gotoAndPlay("away");
            this.waitForDestroy = 1;
        },this);
        this.homeLvUpTip.getSlot("2").display.touchEnabled = true;
        this.homeLvUpTip.getSlot("2").display.addEventListener(egret.TouchEvent.TOUCH_TAP,this.homeLvUp,this);
        this.homeLvUpTip.animation.gotoAndPlay("araise");

        this.homeLvUpUI = new HomeLvUpUI(this.lvUpMoney);

        this.noMoney = new egret.TextField();
        this.noMoney.text = "没有那么多钱!";
        this.noMoney.anchorOffsetX = this.noMoney.width/2;
        this.noMoney.anchorOffsetY = this.noMoney.height/2;

        //this.homeLvUpTip.getSlot("67").display = this.homeLvUpUI;
        this.setNoMoney(false);


        this.referTime = 0;
        this.addEventListener(egret.Event.ENTER_FRAME,this.update,this);
        this.waitForDestroy = 0;
    }

    public setNoMoney(bln:boolean):void
    {
        if(bln==true)
            this.homeLvUpTip.getSlot("67").display = this.noMoney;
        else
            this.homeLvUpTip.getSlot("67").display = this.homeLvUpUI;
    }

    public homeLvUp(event:egret.TouchEvent):void
    {
        
        let currGold = PlayerManager.getInstance().getConfig("gold");
        let gold = this.lvUpMoney;//Utility.getExpByCityLv(lv+1);

        let collapse = GameScene.getInstance().isCollapse;
        if(collapse) gold = Math.pow(10,this.curLv);
        if(gold<=currGold)
        {
            PlayerManager.getInstance().updateConfig("gold",-gold);
            
            if(collapse)
            {
                GameScene.getInstance().isCollapse = false;
                DataManager.getInstance().setBaseData("isCollapse","-1");
            }
            else
                PlayerManager.getInstance().updateConfig("homeLv",1);
            MajorCity.getInstance().setLvUp();

            this.homeLvUpTipBack.visible = false;
            this.homeLvUpTip.animation.gotoAndPlay("away");
            this.waitForDestroy = 2;
        }  
        else 
        {
            this.homeLvUpTip.animation.gotoAndPlay("nomoney");
            egret.Tween.get(this.homeLvUpTip.getSlot("67")).call(this.setNoMoney,this,[true]).wait(1400).call(this.setNoMoney,this,[false]);
        }
    }

    private waitForDestroy:number;
    private referTime: number;
    private update(): void
    {
        let temp: number = egret.getTimer();
        let deltaTime: number = Math.min(0.1,(temp - this.referTime) / 1000);
        this.referTime = temp;
        this.homeLvUpTip.advanceTime(deltaTime);
        
        if(this.waitForDestroy>0)
        {
            if(this.homeLvUpTip.animation.isComplete)
            {
                this.callback.call(this.callbackObj,[this.waitForDestroy]);
                this.waitForDestroy = 0;
                //this.parent.removeChild(this);
                //this.parent.addChild(new LvUpTomb(this.curLv));
            }
        }
        //this.homeLvUpInfo.update(deltaTime);
    }

}