/**
 * g
 */
class GoldLvUI extends eui.Component {
    private static g_instance;
    private _gold:eui.BitmapLabel;
    private _lv:eui.BitmapLabel;
    private _diamon:eui.BitmapLabel;
    // private input_homeName:eui.TextInput;
    private addJB;
    private _addZS;
    public static getInstance(){
        if(!this.g_instance){
            this.g_instance  = new GoldLvUI();
        }
        return this.g_instance;
    }
    constructor() {
       super();
       this.skinName = "resource/skin/goldInfo.exml";
    }
    protected createChildren() {
        super.createChildren();
        this.initData();
        var dd = new CoinFrame(1);
        this.addChild(dd);
        dd.x = 13;
        dd.y = 65;
        dd.update();
        this.addJB = Utility.createImageByName("addIcon");
        this.addChild(this.addJB);
        this.addJB.x = 55;
        this.addJB.y = 105;
        this.initOperation();
    }
    private initData(){
       this.setGold();
       this.setLv();
       this.setDiamon();
    //    this.input_homeName.text = PlayerManager.getInstance().getConfig("m_homeName");
    //    this.input_homeName.text.horizontalCenter = "0";

    //    this.input_homeName.addEventListener(egret.Event.CHANGE,(e:egret.Event)=>{
    //     //    egret.log("input@@@"+e.target.text);
    //     PlayerManager.getInstance().setConfig("m_homeName",e.target.text);
    //    },this);
    //    this.input_homeName.addEventListener(egret.Event.FOCUS_OUT,(e:egret.Event)=>{
    //        egret.log("FocusOut@input@@@"+e.target.text);
    //    },this);
    }
    public setGold(){   
        // console.log("gold:"+PlayerManager.getInstance().getConfig("gold"));
        this._gold.text = Utility.numToString(PlayerManager.getInstance().getConfig("gold"));
    }
    public setLv(){
        this._lv.text = "L"+Utility.numToString(PlayerManager.getInstance().getConfig("homeLv"));
    }
    public setDiamon(){
        this._diamon.text = Utility.numToString(PlayerManager.getInstance().getConfig("diamon"));
    }
    private initOperation(){
        this._addZS.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            PlayerManager.getInstance().updateConfig("diamon",100);
        },this);
        this.addJB.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            PlayerManager.getInstance().testAddGold(10000);
        },this);
    }
}