class OptionUI extends eui.Component
{

    private musicName:string[] =  ["轉業之村","杯酒之路"];
    private _musicOff:eui.Image;
    private _musicOn:eui.Image;

    private _soundOff:eui.Image;
    private _soundOn:eui.Image;

    private _musicName:eui.Label;
    private _musicSelLeft:eui.Image;
    private _musicSelRight:eui.Image;

    private _closeOption:eui.Image;

    // private callback:Function;
    // private callbackObj:any;

    public constructor(screenH:number)//,callback:Function,callbackObj:any)
    {
        super();
        // this.callback = callback;
        // this.callbackObj = callbackObj;
        this.skinName = "resource/skin/Options.exml";
        this._musicSelRight.scaleX = -1;
        this._musicSelRight.anchorOffsetX = this._musicSelRight.width;
        this._soundOn.visible = false;
        this._musicOn.visible = false;

        //let soundData:number = DataManager.getInstance().getBaseData_number("sound"); 
        if(SoundPlay.isOn)
        {
            this._soundOn.visible = false;
            this._soundOff.visible = true;
            //SoundPlay.isOn = true;
        }
        else
        {
            this._soundOn.visible = true;
            this._soundOff.visible = false;
            //SoundPlay.isOn = false;
        }
        // else
        // {
        //     DataManager.getInstance().setBaseData("sound","1");
        //     this._soundOn.visible = false;
        //     this._soundOff.visible = true;
        //     SoundPlay.isOn = true;
        // }
        

        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.addToStage,this);
    }
    private addToStage(event:egret.Event):void
    {
        this._musicName.text = this.musicName[0];
        this._closeOption.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            egret.Tween.get(this).to({scaleX:1.15,scaleY:1.15},80).to({scaleX:0.5,scaleY:0.5},80).call(this.close);
        },this);
        this.anchorOffsetX = this.width/2;
        this.anchorOffsetY = this.height/2;
        this.x = this.stage.stageWidth/2;
        this.y = this.stage.stageHeight/2;
        this.scaleX = this.scaleY = 0.5;
        egret.Tween.get(this).to({scaleX:1.2,scaleY:1.2},120).to({scaleX:0.9,scaleY:0.9},100).to({scaleX:1,scaleY:1},100);

        this._musicSelLeft.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            this._musicName.text = this.musicName[MusicPlay.Instance.prevBGM()];
        },this);//切换背景音乐左
        this._musicSelRight.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            this._musicName.text = this.musicName[MusicPlay.Instance.nextBGM()];
        },this);//切换背景音乐右

        this._soundOff.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            this._soundOff.visible = false;
            this._soundOn.visible = true;
            SoundPlay.isOn = false;
            DataManager.getInstance().setBaseData("MySound","0");
        },this);

        this._soundOn.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            this._soundOff.visible = true;
            this._soundOn.visible = false;
            SoundPlay.isOn = true;
            DataManager.getInstance().setBaseData("MySound","1");
        },this);

        this._musicOff.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            this._musicOff.visible = false;
            this._musicOn.visible = true;
            MusicPlay.isOn = false;
            DataManager.getInstance().setBaseData("MyMusic","0");
            MusicPlay.Instance.stop();
        },this);

        this._musicOn.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            this._musicOff.visible = true;
            this._musicOn.visible = false;
            MusicPlay.isOn = true;
            DataManager.getInstance().setBaseData("MyMusic","1");
            MusicPlay.Instance.setBGM();
        },this);
    } 

    private close():void
    {
        this.parent.removeChild(this);
        //this.callback.call(this.callbackObj)
    }

    protected createChildren() 
    {
        super.createChildren();
        this.initData();
    }
    private initData()
    {

    }

}