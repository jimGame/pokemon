/**
 * 
 */
class CommonTipsUI extends eui.Component {
    private _info;
    private _close:eui.Image;
    private _zi;
    constructor(data) {
        super();
        this.skinName = "resource/skin/commonTips.exml";
        this.initData(data);
        this.initOperation();
        // Main.getInstance().stage.addChild(this);
    }
    private initData(data){
        this._zi.text = data;
    }
    private initOperation(){
        this._close.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            EffectUtils.playEffect(this._close,3,this.remove,this);
        },this);
    }
    private remove(){
        this.parent.removeChild(this);
    }
}