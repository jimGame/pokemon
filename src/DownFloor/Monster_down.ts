/**
 * Monster_down 
 */
// amazing     die
//     evolution   levelupground
//     rebirth     run
//     sleeping    stand
//     work
// enum MonsterState
// {
//     Stand,
//     Walk,
//     Catch,
// }
class Monster_down extends egret.Sprite {
    
    // private maxAnimationNum = 0;
    // private curAnimationIndex = -1;
    private pos:egret.Point;   
    // 节点变量
    public _coin;
    public _coinFrame;
    private armature:dragonBones.Armature = null;
    private _shadow;
    private _relive:ReliveUI;
    private smoke;
    // 数值变量
    private _indexList; // 在奴隶列表中索引
    public _curAniName;
    // 其他变量
    public _workTimer:egret.Timer;
    // 死亡相关
    private dieInterId;
    // private dieTime;//复活剩余时间
    /************************************************************************/
    constructor(index){
        super();
        this._indexList = index;
        this.pos = ConfigMonsterManager.getConfig(this.getCfg().id,"pos_down");       
        this.initData();
        this.initTimer();
        this.init();
        this.initArmatureAni();
        this.x = this.pos.x;
        this.y = this.pos.y;

    }
    public getCfg(){
        var monList = MonsterManager.getInstance().getMonsterList();
        return monList[this._indexList];
    }
    /*
    *   私有方法
    */
    // 初始化数据
    private initData(){
        // this.maxAnimationNum = 0;
        // this.curAnimationIndex = -1;
    }
    // 初始化
    private　init(){
        // var monsterName = "pikaqiu_down";
        this._shadow = Utility.createBitmapByName("shadow_png");
        this._shadow.anchorOffsetX = this._shadow.width/2;
        this._shadow.anchorOffsetY = this._shadow.height/2;
        this.addChild(this._shadow);
        this.smoke = Utility.createBitmapByName("effect_smoke7_png");
        this.addChild(this.smoke);
        this.smoke.anchorOffsetX = this.smoke.width/2;
        this.smoke.anchorOffsetY = this.smoke.height/2;
        this.smoke.visible = false;

        var monsterName = ConfigMonsterManager.getConfig(this.getCfg().id,"dragonName_down");
        if(this.getCfg().isEvolution == 0){
            monsterName = ConfigMonsterManager.getConfig(this.getCfg().id,"dragonName_down");
        }else{
            var evId = ConfigMonsterManager.getConfig(this.getCfg().id,"evolutionId")[this.getCfg().isEvolution-1];
            monsterName = ConfigMonsterManager.getConfig(evId,"dragonName_down");
        }
        // this.curAnimationIndex = 0;
        this.createDragon(monsterName);
        
        this._relive = new ReliveUI();
        this.addChild(this._relive);
        this._relive.visible = false;
        // this._relive.show_fhPro(2);
        this._relive.anchorOffsetX = this._relive.width/2;
        this._relive.x = this.armature.display.x;
        this._relive.y = this.armature.display.y;
        // this._relive.x = 100;
        // this._relive.y = 100;
        this._shadow.x = this.armature.display.x;
        this._shadow.y = this.armature.display.y;
        this._shadow.scaleX = 0.5;
        this._shadow.scaleY = 0.5;
        this.addEvent();
        
        
        this._coin = Utility.createBitmapText("num0_fnt");    
        this._coin.text = "+10";
        this.addChild(this._coin);
        this._coin.anchorOffsetX = this._coin.width/2;
        this._coin.anchorOffsetY = this._coin.height/2;
        this._coin.x = this.armature.display.x;
        this._coin.y = this.armature.display.y-150;
        this._coin.visible = false;


        this._coinFrame = new CoinFrame();
        this.addChild(this._coinFrame);
        console.log("ww:"+this._coinFrame.width/2+":::"+ this._coinFrame.height/2);
        this._coinFrame.anchorOffsetX = this._coinFrame.width/2;
        this._coinFrame.anchorOffsetY = this._coinFrame.height/2;
        this._coinFrame.x = this.armature.display.x;
        this._coinFrame.y = this.armature.display.y-150;
    }
    // 更新龙骨
    public updateDragon(){
        this.armature.animation.stop();
        this.removeChild(this.armature.display);
        var evId = ConfigMonsterManager.getConfig(this.getCfg().id,"evolutionId")[this.getCfg().isEvolution-1];
        var    monsterName = ConfigMonsterManager.getConfig(evId,"dragonName_down");
        this.armature = Utility.createDragon(monsterName);
        this.addChild(this.armature.display);
        this.addEvent();
        this.playAnimation("stand");
    }
    // 初始化角色动作
    private initArmatureAni(){
        if(this.getCfg().reliveDTime > 0){
            this.armature.animation.gotoAndPlay("die");
            this._relive.visible = true;
            this.showReliveData();
            this.dieActionTime();
        }else{
            if(this.getCfg().curAni == "stand"){
                this._workTimer.start();
            }
            this.armature.animation.gotoAndPlay(this.getCfg().curAni);
                
        }
    }
    // 初始化定时器
    private initTimer(){
        this._workTimer = new egret.Timer(ConfigMonsterManager.getConfig(this.getCfg().id,"workTime"),0);
        this._workTimer.addEventListener(egret.TimerEvent.TIMER,this.timerFunc,this);
    }
    // 创建动画
    private createDragon(_name:string,boneName:string="Armature"){              
        this.armature = Utility.createDragon(_name,boneName);
        this.addChild(this.armature.display);
        // this.armature.display.x = this.pos.x;
        // this.armature.display.y = this.pos.y;
    }
    // 删除动画
    private removeDragon(){
      if(!this.armature){
          console.log("动画为NULL");
      }
      this.removeChild(this.armature.display);
      dragonBones.WorldClock.clock.remove(this.armature);
      this.armature.dispose();
      this.armature = null;
    }
    // 播放动画
    // _duration -1 使用动画的播放时间
    // _playTimes 0 循环播放
    public playAnimation(_name,_playTimes=0){
        this.armature.animation.gotoAndPlay(_name,-1,-1,_playTimes);
    }
    // 注册动画事件
    private addEvent(){
        if(!this.armature){
            console.log("ERROR::动画为NULL");
            return;
        }
        // console.log("addEvent");
        this.armature.addEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT, this.onFrameEvent,this);
        // this.armature.addEventListener(dragonBones.FrameEvent.BONE_FRAME_EVENT,this.onFrameEvent,this);
        this.armature.addEventListener(dragonBones.AnimationEvent.COMPLETE, this.onAnimationEvent,this);
        this.armature.addEventListener(dragonBones.AnimationEvent.START, this.onAnimationEvent,this);
        this.armature.addEventListener(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onAnimationEvent,this);
        this.armature.display.touchEnabled = true;
        this.armature.display.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchCallback, this);
        this.armature.display.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchCallback, this);
        this.armature.display.addEventListener(egret.TouchEvent.TOUCH_END, this.touchCallback, this);
        this.armature.display.addEventListener(egret.TouchEvent.TOUCH_CANCEL,this.touchCallback,this);
    }
    // 挖矿定时器回调
    private timerFunc(){
        // console.log("");
        if(this._curAniName == "stand"){
            this.playAnimation("work",1);
            this._workTimer.stop(); 
        }else{
            console.log("ERROR###############当前不是站立动作，但是竟然响应了挖矿的定时器回调");
            console.log("curAnimation####"+this._curAniName);
            console.log("ERROR#########还不快点检查检查###############");
        }
        
    }
    private onFrameEvent(evt: dragonBones.FrameEvent):void{
            //打印出事件的类型，和事件的帧标签
            // console.log("FrameEvent@@@");
            // console.log(evt.type, evt.frameLabel);
            if(evt.frameLabel == "wakuang"){
                this.coinShow();
            }
    }
    // 动画被触摸到
    private touchCallback(event:egret.TouchEvent){
        if(event.type == egret.TouchEvent.TOUCH_BEGIN){
            if(this._curAniName == "sleeping"){
                // this.stopWorkAnimation("rebirth");
                this.rebirthAnimation();
            }else if(this._curAniName == "die"){
                var _tt = Utility.getDiamonByTime(this.getCfg().reliveDTime);
                Main.getInstance().stage.addChild(new TipsUI(_tt,"fuhuo",CoalPitScene.getInstance().monsterRelive,CoalPitScene.getInstance(),this.getCfg().id));
            }
            else{
                Main.getInstance().stage.addChild(MonsterInfoUI.getInstance(this._indexList));
                MonsterInfoUI.getInstance().x = event.stageX;
                MonsterInfoUI.getInstance().y = event.stageY;
            }
        }else if(event.type == egret.TouchEvent.TOUCH_MOVE){
            if(MonsterInfoUI.getInstance()){
                 MonsterInfoUI.getInstance().remove();
            } 
        }else if(event.type == egret.TouchEvent.TOUCH_END){
            if(MonsterInfoUI.getInstance()){
                 MonsterInfoUI.getInstance().remove();
            }
        }else if(event.type == egret.TouchEvent.TOUCH_CANCEL){
            if(MonsterInfoUI.getInstance()){
                 MonsterInfoUI.getInstance().remove();
            }
        }
    }
    // 龙骨动画事件回调
    private onAnimationEvent(evt: dragonBones.AnimationEvent):void{
       switch(evt.type){
           case dragonBones.AnimationEvent.START:
                this._curAniName = evt.animationName;
                if(evt.animationName == "rebirth"){
                    this.createGantan();
                }else if(evt.animationName == "amazing"){
                    this.createGantan();
                    egret.Tween.get(this).to({x:this.pos.x-400},500);
                }
                break;
           case dragonBones.AnimationEvent.LOOP_COMPLETE:
                // console.log("Animation_LoopComplete");
                break;
           case dragonBones.AnimationEvent.COMPLETE:
                // if(evt.animat)
                if(evt.animationName == "rebirth"){
                    // this.createGantan();
                }
                if(evt.animationName == "amazing"){
                    this.playAnimation("run");
                    egret.Tween.get(this).to({x:this.pos.x},1000).call(()=>{
                        // this.playAnimation("stand");
                    },this);
                }else{
                    if(evt.animationName != "stand"){
                        this.playAnimation("stand");
                        this._workTimer.start();
                    }
                }
                
                break;
       }
    }
    // 金币动画
    private coinShow(){
        
        this._coin.visible = true;

        let count = Utility.numToString_font(this.getGold());
        this._coin.text = "+"+count;

        AddCoinShow.getInstance().showCoinVal(count);

        var tw = egret.Tween.get(this._coin);
        this._coin.scaleX = 1;
        this._coin.scaleY = 1;  
        // ,scaleX:1,scaleY:1
        tw.to({y:this._coin.y-150},400,egret.Ease.bounceOut)
          .wait(150)
          .to({y:this._coin.y-200},300,egret.Ease.backIn).call(function() {
           this._coin.visible = false;
           this._coin.y = this.armature.display.y-150;
           PlayerManager.getInstance().updateConfig("gold",this.getGold());
        },this);

        this.smokeShow();

        ////////////////////////////
        // this._coinFrame.x = this.armature.display.x;
        // this._coinFrame.y = this.armature.display.y-150;
        this._coinFrame.update(this.armature.display.y-150);
    }
    // 挖矿烟花动画
    private smokeShow(){
        this.smoke.visible = true;
            this.smoke.alpha = 1;
            this.smoke.scaleX = 0.2;
            this.smoke.scaleY = 0.2;
            let tw = egret.Tween.get(this.smoke);
            tw.to({scaleX:0.5,scaleY:0.5,alpha:0},500).to({visible:false},0);
    }
    // 计算挖矿金币数
    private getGold(){
        var gold_lv = Utility.getGold(this.getCfg().lv);
        var gold_shovel = Utility.getGoldByShovel(this.getCfg().shovel);
        var evoAdd = 0;
        if(this.getCfg().isEvolution == 0){
            evoAdd = 0;
        }else{
            var eId = ConfigMonsterManager.getConfig(this.getCfg().id,"evolutionId")[this.getCfg().isEvolution-1];
            evoAdd = ConfigMonsterManager.getConfig(eId,"evoAddGold");
        }
        var time = ConfigMonsterManager.getConfig(this.getCfg().id,"workTime")/1000;
        return (gold_lv+gold_shovel+evoAdd)*time
    }
    /*
    *   公有方法
    */
    public lvUpAnimation(){
        if(this._curAniName == "die"){
            return;
        }
        if(this._curAniName == "work"){
           this.coinShow();
        }else if(this._curAniName == "stand"){
            this._workTimer.stop();
        }
        this.playAnimation("levelupground",2);
        SoundPlay.Instance.Play("ojimon_lvup_mp3");
    }
    public sleepAnimation(){
        if(this._curAniName == "die"){
            return;
        }
        if(this._curAniName == "work"){
            this.coinShow();
        }else if(this._curAniName == "stand"){
            this._workTimer.stop();
        }
        this.playAnimation("sleeping");
        this.getCfg().curAni = "sleeping";
        MonsterManager.getInstance().saveMonsterList();
    }
    // 唤醒
    public rebirthAnimation(){
        this.playAnimation("rebirth",1);
        this.getCfg().curAni = "stand";
        MonsterManager.getInstance().saveMonsterList();
    }
    // amazing
    public speAnimation(ani,_playTimes=0){
        if(this._curAniName == "die"){
            return;
        }
        if(this._curAniName == "work"){
            this.coinShow();
        }else if(this._curAniName == "stand"){
            this._workTimer.stop();
        }
        this.playAnimation(ani,_playTimes);
    }
    public stopWorkAnimation(ani,_playTimes=1){
        // this._workTimer.stop();
        this.playAnimation(ani,_playTimes);
    }
    public dieAnimation(ani){
        this._workTimer.stop();
        this.playAnimation(ani);
        this._relive.visible = true;
        this.getCfg().reliveDTime = PlayerManager.getInstance().getConfig("homeLv") * 10 * 60 // 单位是秒
        this.getCfg().reliveAllTime = PlayerManager.getInstance().getConfig("homeLv") * 10 * 60;
        this.getCfg().reliveStartTime = new Date().getTime();
        MonsterManager.getInstance().saveMonsterList();
        this.showReliveData();
        this.dieActionTime();
    }
    public remove(){
       this.$parent.removeChild(this);
    }
    // 创建感叹号
    private createGantan(){
        var gg = Utility.createImageByName("gantan");
        this.addChild(gg);
        gg.anchorOffsetX = gg.width/2;
        gg.x = this.armature.display.x;
        gg.y = this.armature.display.y-this.armature.display.height-gg.height/2;
        EffectUtils.blinkEffect(gg,500,function() {
            this.removeChild(gg);
        },this);
    }
    // 死亡计时
    private dieActionTime(){
        this.dieInterId =  egret.setInterval(()=>{
            this.getCfg().reliveDTime--;
            console.log("死亡计时："+this.getCfg().reliveDTime);
            MonsterManager.getInstance().saveMonsterList();
            this.showReliveData();
            if(this.getCfg().reliveDTime == 0){
                this.dieTimeout();
            }
        },this,1000)
    }
    private showReliveData(){
        this._relive.show_fhPro(Utility.getProgress(this.getCfg().reliveAllTime-this.getCfg().reliveDTime,this.getCfg().reliveAllTime));
        this._relive.show_fhTime(Utility.MillisecondToDate(this.getCfg().reliveDTime));
    }
    // 死亡时间到
    private dieTimeout(){
        egret.clearInterval(this.dieInterId);
        // this.stopWorkAnimation("rebirth");
        this.rebirthAnimation();
        this._relive.visible = false;
        this.getCfg().reliveDTime = 0;
        this.getCfg().reliveStartTime;
        MonsterManager.getInstance().saveMonsterList();
    }
}