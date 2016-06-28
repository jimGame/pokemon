/**
 * AchieveSuccInfo 
 */
class AchieveSuccInfo extends eui.Component {
    private _val;
    private _bg1;
    private _bg2;
    private _gg;
    private m_index;
    private _interId;
    constructor(index) {
        super();
        this.m_index = index;
        this.skinName = "resource/skin/achieveSucc.exml";
        this.initData();
    }
    private initData(){
        this._val.text = "+"+Utility.numToString_font(Utility.getTotalGoldByIndex(this.m_index));
        SoundPlay.Instance.Play("gold_rush_mp3");
        this._interId = egret.setTimeout(()=>{  
            egret.clearTimeout(this._interId);
            // EffectUtils.playScaleEffect(this._gg);
            this._gg.alpha = 1;
            egret.Tween.get(this._gg).to({ scaleX:1.5,scaleY:1.5,alpha:0}, 1000).call(this.remove,this);
        },this,1000);
    }
    private remove(){
        this.parent.removeChild(this);
        
    }

}