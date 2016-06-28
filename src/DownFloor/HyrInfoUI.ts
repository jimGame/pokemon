/**
 * name
 */
class HyrInfoUI extends eui.Component {
    private _no:eui.Image;
    private _yes:eui.Image;
    private _zi;
    constructor() {
        super();
        this.skinName = "resource/skin/hyrInfo2.exml";
    }
    protected createChildren(){
        this.initOperation();
    }
    private initOperation(){
        this._no.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            EffectUtils.playEffect(this._no,3,this.remove,this);
        },this);
        this._yes.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            EffectUtils.playEffect(this._yes,3,this.yesOperation,this);
        },this);
    }
    private remove(){
        this.parent.removeChild(this);
    }
    private yesOperation(){
        this.remove();
        if(PlayerManager.getInstance().getConfig("gold") >= 3000000){
            PlayerManager.getInstance().updateConfig("gold",-3000000); 
            HyrUI.getInstance().catchOperation();
        }else{
            Main.getInstance().stage.addChild(new CommonTipsUI("金币数量不足"));
        }
    }
}