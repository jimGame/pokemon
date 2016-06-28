// TypeScript file
/**
 * name
 */
class BoomEffectUI extends eui.Component {
    private _t1;
    private _t2;
    private _t3;
    private _t4;
    private _gro1;
    private _gro2;

    private _interId;
    private _tId;
    private _boomArmature;
    constructor() {
        super();
        this.skinName = "resource/skin/BoomEffect.exml";
    }
    protected createChildren(){
        this.initData();
        this.initEffect();
        SoundPlay.Instance.Play("bomb_mp3");
    }
    private initData(){
        this.createBoom();
    }
    private initEffect(){
        this._t1.visible = false;
        this._t2.visible = false;
        this._t3.visible = false;
        this._t4.visible = false;
        this._gro2.visible = false;

        this._tId = 0;
        this._interId = egret.setInterval(()=>{
            this._tId++;
            if(this._tId == 1){
                this._t1.visible = true;
            }else if(this._tId == 2){
                this._t2.visible = true;
            }else if(this._tId == 3){
                this._t3.visible = true;
            }else if(this._tId == 4){
                this._t4.visible = true;
                egret.clearInterval(this._interId);
            }
        },this,300);
    }
    public groEffect(){
        this._gro1.visible = false;
        this._gro2.visible = true;
        egret.Tween.get(this._gro2).to({ scaleX:1.5,scaleY:1.5,alpha:0}, 1000).call(this.remove,this)
        .wait(500)
        .call(()=>{
            GameScene.getInstance().SetCollapse();
        },this);
    }


    
    public remove(){
        this.parent.removeChild(this);
    }

    ////// 创建炸弹
    private createBoom(){
        this._boomArmature = Utility.createDragon(ConfigMonsterManager.getConfig("1499","dragonName_down"));
        this.addChild(this._boomArmature.display);
        this._boomArmature.display.y = this.stage.stageHeight/2;
        this._boomArmature.display.x = this.stage.stageWidth/2;
        this._boomArmature.addEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT, this.onFrameEvent,this);
        this._boomArmature.addEventListener(dragonBones.AnimationEvent.COMPLETE, this.onAnimationEvent,this);
        this._boomArmature.addEventListener(dragonBones.AnimationEvent.START, this.onAnimationEvent,this);
        this._boomArmature.addEventListener(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onAnimationEvent,this);
        this._boomArmature.animation.gotoAndPlay("bow",-1,-1,1);
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
                this.removeChild(this._boomArmature.display);
                this._boomArmature = null;
                CoalPitScene.getInstance().monsterDieSelect();
                this.groEffect();
                
                
                break;
       }
    }
    private onFrameEvent(evt: dragonBones.FrameEvent):void{
            //打印出事件的类型，和事件的帧标签
            if(evt.frameLabel == "amazing"){
                CoalPitScene.getInstance().monsterAmazSelect();
            }
    }
}