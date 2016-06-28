/**
 * 
 */
class TipsUI extends eui.Component {
    private _info;
    // private _close:eui.Image;
    private _no:eui.Image;
    private _yes:eui.Image;
    private _zi;
    private _val;
    private m_id
    private m_diamon;
    private m_callback;
    private m_thisObj;
    private m_params;
    // private m_type;
    constructor(diamon,type?,callBack?:Function,thisObj?: any,params?: Array<any>) {
        super();
        
        this.m_diamon = diamon;
        this.m_callback = callBack;
        this.m_thisObj = thisObj;
        this.m_params = params;
        this.skinName = "resource/skin/tipsInfo.exml";
        this.initData();
        this.initOperation();
        // 消耗的钻石数量   
        // this.m_diamon = Utility.getDiamonByTime(this.getCfg().reliveDTime);
        var dd= Utility.numToString(this.m_diamon);
        this._val.text = dd;
        if(type == "fuhuo"){
            this._zi.text = "花费金币可立即复活";
        }else if(type == "hyr"){
            this._zi.text = "确定立即完成捕捉吗？";
        }
    }
    private getCfg(){
        var monList = MonsterManager.getInstance().getMonsterList();
        var _id
        if(typeof this.m_id == "number"){
            _id = this.m_id.toString();
        }else{
            _id = this.m_id;
        }
        for(var i in monList){
            if(_id == monList[i].id){
                return monList[i];
            }
        }
    }
    private initData(){

    }
    private initOperation(){
        // this._close.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
        //     EffectUtils.playEffect(this._close,3,this.remove,this);
        // },this);
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
        // this.callback();
        this.remove();
        if(PlayerManager.getInstance().getConfig("diamon") >= this.m_diamon){
            PlayerManager.getInstance().updateConfig("diamon",0-this.m_diamon);
            this.callback();
            
        }else{
            Main.getInstance().stage.addChild(new CommonTipsUI("钻石数量不足"));
        } 
    }
    private callback(){
        if(typeof this.m_callback === "function"){
            if(!this.m_params){
                this.m_callback.call(this.m_thisObj);
            }else{
                if(Utility.isArray(this.m_params)){
                    if(this.m_params.length == 1){
                        this.m_callback.call(this.m_thisObj,this.m_params[0]);
                    }else if(this.m_params.length == 2){
                        this.m_callback.call(this.m_thisObj,this.m_params[0],this.m_params[1]);
                    }else{
                        console.log("ERROR##############回调函数中暂时只设置了两个参数,请扩展");
                    }
                }else{
                    // console.log("参数为数组格式");
                    this.m_callback.call(this.m_thisObj,this.m_params);
                }                  
            }
        }
    }
}