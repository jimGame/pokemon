/**
 * FloorUI
 */
class FloorUI extends egret.DisplayObjectContainer
{
    private static g_instance:FloorUI;
    public coinVal;    
    public lvVal:egret.BitmapText;
    private upIcon:eui.Image;
    private mainMenu:eui.Image;
    private setting:eui.Image;
    private tujian:eui.Image;
    private qianghua:eui.Image;
    private uiLayer:eui.UILayer;
    private homeLvUpUI:HomeLvUpUI2;


    public static getInstance(){
        if(!FloorUI.g_instance){
            FloorUI.g_instance = new FloorUI();
        }
        return FloorUI.g_instance;
    }    

    constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    private onAddToStage(event:egret.Event) {
        
        this.init();    
    }
    private init(){
        this.uiLayer = new eui.UILayer();
        this.uiLayer.touchEnabled = false;
        this.addChild(this.uiLayer);

        this.uiLayer.addChild(GoldLvUI.getInstance());
        // console.log("GoldLvUI##############");
        // console.log("stageHeight####"+this.stage.stageHeight);
        // console.log("innerHeight#####"+window.innerHeight/2);
        // GoldLvUI.getInstance().y = (this.stage.stageHeight - window.innerHeight/2)/2;


        this.upIcon = Utility.createImageByName("upIcon");
        this.uiLayer.addChild(this.upIcon);
        this.upIcon.visible = false;

        // this.upIcon.bottom = 0;
        // this.upIcon.anchorOffsetX = this.upIcon.width/2;
        // this.upIcon.anchorOffsetY = this.upIcon.height/2;

        this.upIcon.x = 0;
        this.upIcon.y = this.stage.stageHeight-this.upIcon.height;

        this.upIcon.addEventListener(egret.TouchEvent.TOUCH_TAP,this.upIconCallback,this);
        //右下角的开发按钮
        // let deve = new eui.UILayer();
        // uiLayer.touchEnabled = true;
        // this.addChild(deve);
        let uiDeve = Utility.createImageByName("0013_png");
        this.uiLayer.addChild(uiDeve);
        uiDeve.bottom = 0;
        uiDeve.right = 0;
        uiDeve.addEventListener(egret.TouchEvent.TOUCH_TAP,this.majorCityLvUp,this);

        // 锻造
        console.log("x::"+uiDeve.x);
        this.qianghua = Utility.createImageByName("qianghua");
        this.uiLayer.addChild(this.qianghua);
        this.qianghua.bottom = 0;
        this.qianghua.x = this.stage.stageWidth-uiDeve.width - this.qianghua.width;
        this.qianghua.addEventListener(egret.TouchEvent.TOUCH_TAP,this.qianghuaCallback,this);
        this.qianghua.visible = false;
        
        //
        this.setting = Utility.createImageByName("setting");
        this.uiLayer.addChild(this.setting);
        this.setting.x = this.stage.stageWidth-this.setting.width;
        this.setting.addEventListener(egret.TouchEvent.TOUCH_TAP,this.settingCallback,this);
        this.setting.visible = false;

        this.tujian = Utility.createImageByName("tujian");
        this.uiLayer.addChild(this.tujian);  
        this.tujian.x = this.stage.stageWidth-this.tujian.width;
        this.tujian.addEventListener(egret.TouchEvent.TOUCH_TAP,this.tujianCallback,this);
        this.tujian.visible = false;
       
       
        //mainMenu
        this.mainMenu = Utility.createImageByName("mainMenu_up");
        this.uiLayer.addChild(this.mainMenu);
        // Utility.updateImageTexture(this.mainMenu,"mainMenu_down");

        this.mainMenu.bottom = uiDeve.bottom + uiDeve.height;
        this.mainMenu.x = this.stage.stageWidth-this.mainMenu.width;
        this.mainMenu.addEventListener(egret.TouchEvent.TOUCH_TAP,this.mainMenuCallback,this);
        
        this.setting.bottom = this.mainMenu.bottom;
        this.tujian.bottom = this.mainMenu.bottom;
        // this.setting.bottom = this.mainMenu.bottom + this.mainMenu.height
         // this.tujian.bottom = this.setting.bottom + this.setting.height

        //this.addChild(this.homeLvUpInfo);
        //this.homeLvUpTip.animation.gotoAndPlay("araise",0,0,1);
        var clearData = new eui.Label;
        clearData.text = "ClearData";
        this.uiLayer.addChild(clearData);
        clearData.top = 200;
        clearData.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            EffectUtils.playEffect(clearData,3,()=>{
                NativeApi.clearLocalData();
                console.log("清理数据成功");
            },this);        
        },this);
    } 


    private df(){
        console.log("touchE");
    }
    private upIconCallback(){
        console.log("回到上层");
        // this.swapLayer(false);
        EffectUtils.playEffect(this.upIcon,3,this.swapLayer,this,[false]);
    }
    // true = 回下层
    public swapLayer(type=true){
        if(type && this.upIcon.visible){
            return;
        }
        if(!type && !this.upIcon.visible){
            return;
        }
        Main.getInstance().stage.swapChildrenAt(0,1);
        this.upIcon.visible = type;
        this.qianghua.visible = type;
    }

    public showAddGold(count:number):void
    {
        if(this.upIcon.visible==true)
            return;   
    }



    public majorCityLvUpCallback(showLvup:number):void
    {
        this.removeChildAt(this.numChildren-1);
        if(showLvup>1.5)
        {
            let lv = PlayerManager.getInstance().getConfig("homeLv");
            this.addChild(new LvUpTomb(lv-1,this.stage.stageWidth,this.stage.stageHeight));
        }
    }

    public majorCityLvUp(event:egret.TouchEvent):void
    {
        // this.homeLvUpTipBack.visible = true;
        // this.homeLvUpTip.display.visible = true;
        // this.homeLvUpTip.animation.gotoAndPlay("araise");
        this.swapLayer(false);
        this.addChild(new HomeLvUpUI2(this.stage.stageWidth,this.stage.stageHeight,this.majorCityLvUpCallback,this));
    }

    // public homeLvUp(event:egret.TouchEvent):void
    // {
    //     let lv = PlayerManager.getInstance().getConfig("homeLv");
    //     let currGold = PlayerManager.getInstance().getConfig("gold");
    //     let gold = Utility.getExpByCityLv(lv+1);
    //     if(gold<=currGold)
    //     {
    //         PlayerManager.getInstance().updateConfig("gold",-gold);
    //         PlayerManager.getInstance().updateConfig("homeLv",1);
    //         MajorCity.getInstance().setLvUp();

    //         this.homeLvUpTipBack.visible = false;
    //         this.homeLvUpTip.animation.gotoAndPlay("away");
    //     }  
    //     else 
    //     {
    //         this.homeLvUpTip.animation.gotoAndPlay("nomoney");
    //     }
    // }
    // mainMenu 回调
    public mainMenuCallback()
    {
         EffectUtils.playEffect(this.mainMenu,3,this.mainMenuOperation,this);
    }

    // mainMenu功能
    public mainMenuOperation(){
        // 
        if(this.setting.visible && this.tujian.visible){
            egret.Tween.get(this.setting).to({bottom:this.mainMenu.bottom },200,egret.Ease.backIn).call(function() {
                this.setting.visible = false;
            },this);
            egret.Tween.get(this.tujian).to({bottom:this.mainMenu.bottom },200,egret.Ease.backIn).call(function() {
                this.tujian.visible = false;
                Utility.updateImageTexture(this.mainMenu,"mainMenu_up");
                // this.mainMenu.sourece = RES.getRes("mainMenu_down")
            },this);
        }else{
            this.setting.visible = true;
            this.tujian.visible = true;
            egret.Tween.get(this.setting).to({bottom:this.mainMenu.bottom + this.mainMenu.height},200,egret.Ease.bounceOut);
            egret.Tween.get(this.tujian).to({bottom:this.mainMenu.bottom + this.mainMenu.height+this.setting.height},200,egret.Ease.bounceOut).call(function() {
                Utility.updateImageTexture(this.mainMenu,"mainMenu_down");
            },this);
        }
    }

    // public OptionCallback()
    // {
    //     this.removeChildAt(this.numChildren-1);
    // }
    // setting 回调
    public settingCallback(){
        EffectUtils.playEffect(this.setting,3,this.settingOperation,this);
        this.addChild(new OptionUI(this.stage.stageWidth));//,this.OptionCallback,this));
    }
    // settiing功能
    public settingOperation(){

    }
    
    // 图鉴回调
    public tujianCallback(){
        EffectUtils.playEffect(this.tujian,3,this.tujianOperation,this);
        this.addChild(new PokeHandbook(this.tujianClose,this));
    }

    public tujianClose(){
        this.removeChildAt(this.numChildren-1);
    }
    // 图鉴功能
    public tujianOperation(){
        
    }
    // 强化回调
    public qianghuaCallback(){
        EffectUtils.playEffect(this.qianghua,3,this.qianghuaOperation,this);
    }
    // 强化功能
    public qianghuaOperation(){
        this.uiLayer.addChild(ForgeUI.getInstance());
    }
}