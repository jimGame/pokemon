/**
 * HyrUI 
 */
class HyrUI extends eui.Component  {
    private _groBase;
    private _gro1;
    private _gro2;
    private _gro3;
    private _time;
    private _daizi;
    private static g_instance:HyrUI;
    private catchInterId;
    private hyrArmature;
    private hyr_ani;
    public static getInstance(){
        if(!this.g_instance){
            this.g_instance = new HyrUI();
        }
        return this.g_instance;
    }
    constructor() {
        super();
        this.skinName = "resource/skin/hyrInfo.exml";
        this.createArmature();
        this.initOperation();
        
        var reTime = this.caclTime();
        if(reTime == 0){
            this.showData(0);
            this.hyrArmature.display.visible = true;
            this.hyrArmature.animation.gotoAndPlay("stand",-1,-1,0);
        }else if(reTime == -1){
            this.hyrArmature.display.visible = true;
            this.hyrArmature.animation.gotoAndPlay("stand",-1,-1,0);
            this.showData(2);
        }
        else{
            this.hyrArmature.display.visible = false;
            this.showData(1);
            this.updateTimeText();
            this.timeOper();
        }
    }
    public caclTime(){
        var catchTime = PlayerManager.getInstance().getConfig("m_catchTime");
        console.log("catchTime:"+catchTime)
        var catchTimeStart =  PlayerManager.getInstance().getConfig("m_catchStartTime");  
        if(catchTime > 0){
            catchTime-= Math.floor((new Date().getTime() - catchTimeStart)/1000);
            if(catchTime <=0) catchTime = -1;
        }
        console.log("catchTime:"+catchTime)
        return catchTime;
    }
    public showData(index){
        this._gro1.visible = (index == 0 || index == 2);
        this._gro2.visible = (index == 1);
        this._gro3.visible = (index == 2);
    }
    public catchOperation(){
        this.hyrArmature.animation.gotoAndPlay("walk",-1,-1,0);
        // this.hyrArmature.
        var tw = egret.Tween.get(this.hyrArmature.display);
        tw.to({x:600},2000).call(()=>{
            this.hyrArmature.animation.stop();
            this.hyrArmature.display.visible = false;
            this.showData(1);
            var timeA = new Date().getTime();
            PlayerManager.getInstance().setConfig("m_catchTime",60*60);
            PlayerManager.getInstance().setConfig("m_catchStartTime",timeA);
            this.updateTimeText();
            this.timeOper();
        },this);    
    }
    public catchSuccOperation(){
        // this.showData(2);
        //袋子
        // this._gro3.x = 520;
        // egret.Tween.get(this._gro3).to({x:219},2000);
        //黑衣人
        egret.clearInterval(this.catchInterId);
        PlayerManager.getInstance().setConfig("m_catchTime",-1);
        this.hyrArmature.display.visible = true;
        this.hyrArmature.animation.gotoAndPlay("back",-1,-1,0);
        this.hyrArmature.display.x = 600;
        var tw = egret.Tween.get(this.hyrArmature.display);
        tw.to({x:0},2000).call(()=>{
            // this.showData(2);
            this.hyrArmature.animation.gotoAndPlay("stand",-1,-1,0);
            this.showData(2);
        },this);
    }
    public timeOper(){
        this.catchInterId = egret.setInterval(()=>{
            var t = PlayerManager.getInstance().getConfig("m_catchTime");
            t--;
            PlayerManager.getInstance().setConfig("m_catchTime",t);
            this.updateTimeText();
            if(t==0){
                this.catchTimeOut();
            }
        },this,1000);
    }
    public updateTimeText(){
        var t = PlayerManager.getInstance().getConfig("m_catchTime");
        this._time.text = Utility.MillisecondToDate(t);
    }
    private initOperation(){
        this.hyrArmature.display.touchEnabled = true;
        this.hyrArmature.display.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            if(this._gro1.visible && !this._gro3.visible){
                console.log("点黑衣人");
                // 点黑衣人
                if(this.hyr_ani == "stand"){
                    EffectUtils.shakeScreen(this.hyrArmature.display,1,function() {
                        Main.getInstance().stage.addChild(new HyrInfoUI());
                    },this);
                }
            }
        },this);
        // 
        this._gro2.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            if(!this._gro1.visible){
                //钻石秒回
                console.log("钻石秒回");
                EffectUtils.playEffect(this,3,()=>{
                    var t = PlayerManager.getInstance().getConfig("m_catchTime");
                    Main.getInstance().stage.addChild(new TipsUI(Utility.getDiamonByTime(t),"hyr",this.catchSuccOperation,this));
                },this)
            }
        },this);
        // 点袋子
        this._gro3.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            if(this._gro1.visible && this._gro3.visible){
                console.log("点袋子");
                if(this.hyr_ani == "stand"){
                        EffectUtils.playEffect(this._daizi,3,()=>{
                            if(this.hyr_ani == "stand"){
                                this.showData(0);
                                Main.getInstance().stage.addChild(new GetNewUI("1501"));
                                this.catchTimeOut();
                            }
                        },this);
                }
            }
        },this);
    }
    private catchTimeOut(){
        console.log("保存m_catchTime");
        egret.clearInterval(this.catchInterId);
        PlayerManager.getInstance().setConfig("m_catchTime",0);
        PlayerManager.getInstance().setConfig("m_catchStartTime",0);
        
        // this.catchSuccOperation();
    }
    private createArmature(){
        this.hyrArmature = Utility.createDragon("NPC_heiyiren");
        this.addChild(this.hyrArmature.display);
        this.hyrArmature.addEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT, this.onFrameEvent,this);
        this.hyrArmature.addEventListener(dragonBones.AnimationEvent.COMPLETE, this.onAnimationEvent,this);
        this.hyrArmature.addEventListener(dragonBones.AnimationEvent.START, this.onAnimationEvent,this);
        this.hyrArmature.addEventListener(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onAnimationEvent,this);
        this.hyrArmature.display.y = 300;
    }
    private onAnimationEvent(evt: dragonBones.AnimationEvent):void{
       switch(evt.type){
           case dragonBones.AnimationEvent.START:
                // this._curAniName = evt.animationName;
                this.hyr_ani = evt.animationName;
                break;
           case dragonBones.AnimationEvent.LOOP_COMPLETE:
                // console.log("Animation_LoopComplete");
                break;
           case dragonBones.AnimationEvent.COMPLETE:
                
                break;
       }
    }
    private onFrameEvent(evt: dragonBones.FrameEvent):void{
            //打印出事件的类型，和事件的帧标签
            // if(evt.frameLabel == "amazing"){
            //     CoalPitScene.getInstance().monsterAmazSelect();
            // }
    }
}