/**
 * name
 */
class EvolutionUI extends eui.Component {
    private m_id;
    private _gro;
    private _yuan;
    private _info;
    private m_armature:dragonBones.Armature;
    private m_armatureUp;
    private m_callback;
    private m_thisObj;
    private m_params;
    private smoke;
    constructor(id,callBack?:Function,thisObj?: any,params?: Array<any>) {
        super();
        this.skinName = "resource/skin/evolutionInfo.exml";
        this.m_id = id;
        this.m_callback = callBack;
        this.m_thisObj = thisObj;
        this.m_params = params;
    }
    protected createChildren(){
        EffectUtils.typerEffect(this._info,"我好像. . .吃错了什么药 ! !",100,()=>{
            // this.m_armature.animation.gotoAndPlay("evolution",-1,-1,1);
        },this);
        this.initData();
    }
    private initData(){
         ///
        

        this.m_armature = Utility.createDragon(ConfigMonsterManager.getConfig(this.m_id.toString(),"dragonName_down"));
        this._gro.addChild(this.m_armature.display);
        // this.m_armature.display.x = this._yuan.x+this._yuan.width/2;
        this.m_armature.display.x = this.stage.stageWidth/2;
        this.m_armature.display.y = this._yuan.y + this._yuan.height/2;
        // this.m_armature.addEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT, this.onFrameEvent,this);
        this.m_armature.addEventListener(dragonBones.AnimationEvent.COMPLETE, this.onAnimationEvent,this);
        this.m_armature.addEventListener(dragonBones.AnimationEvent.START, this.onAnimationEvent,this);
        this.m_armature.addEventListener(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onAnimationEvent,this);
        this.m_armature.animation.gotoAndPlay("evolution",-1,-1,1);

        //////////////
        var index = MonsterManager.getInstance().getArrById(this.m_id).isEvolution;
        var evoId = ConfigMonsterManager.getConfig(this.m_id.toString(),"evolutionId")[index-1];
        this.m_armatureUp = Utility.createDragon(ConfigMonsterManager.getConfig(evoId.toString(),"dragonName_down"));
        this._gro.addChild(this.m_armatureUp.display);
        this.m_armatureUp.display.x = this.stage.stageWidth/2;
        this.m_armatureUp.display.y = this._yuan.y + this._yuan.height/2;
        this.m_armatureUp.display.visible = false;
        /// 
        this.smoke = Utility.createBitmapByName("effect_smoke7_png");
        this._gro.addChild(this.smoke);
        this.smoke.visible = false;
        this.smoke.anchorOffsetX = this.smoke.width/2;
        this.smoke.anchorOffsetY = this.smoke.height/2;
        this.smoke.x = this.stage.stageWidth/2;
        this.smoke.y = this._yuan.y-this._yuan.height-100;

       
    }
     private onAnimationEvent(evt: dragonBones.AnimationEvent):void{
       switch(evt.type){
           case dragonBones.AnimationEvent.START:
                // this._curAniName = evt.animationName;
                break;
           case dragonBones.AnimationEvent.LOOP_COMPLETE:
                // console.log("Animation_LoopComplete");
                break;
           case dragonBones.AnimationEvent.COMPLETE:
                if(evt.animationName == "evolution"){
                    this.change();
                }
                break;
       }
    }
    private change(){
        console.log("change");
        this.m_armature.display.visible = false;
        this.smokeShow();
        this.newShow();
    }
    private smokeShow(){
        this.smoke.visible = true;
            this.smoke.alpha = 1;
            this.smoke.scaleX = 0.5;
            this.smoke.scaleY = 0.8;
            let tw = egret.Tween.get(this.smoke);
            tw.to({scaleX:0.8,scaleY:2,alpha:0.8},300).to({visible:false},0).call(()=>{
                
            },this)
    }
    private newShow(){
        this.m_armatureUp.display.visible = true;
        this.m_armatureUp.animation.gotoAndPlay("levelupground",-1,-1,0);
            egret.Tween.get(this.m_armatureUp.display).to({scaleX:2.0,scaleY:2.0},500).call(()=>{
                
                egret.setTimeout(()=>{
                    this.callback();
                    this.remove();
                },this,2000);
            },this);
    }
    private remove(){
        this.parent.removeChild(this);
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