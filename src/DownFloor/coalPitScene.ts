/*
*  CoalPitScene 黑煤窑场景
*  jim
*  2016.06.08 
*/
class CoalPitScene extends eui.UILayer{
    // class CoalPitScene extends egret.DisplayObjectContainer{
    private referTime: number;
    private static g_instance:CoalPitScene;
    private bg2:eui.Image;
    public scroll:eui.Scroller;
    private group:eui.Group;
    // private _workTimer:egret.Timer;
    private _sleepTimer:egret.Timer;
    private _reliveTimer:egret.Timer;
    private _boomArmature;
    private hxNpc;
    private hxNpc_ani;
    public static getInstance(){
        return CoalPitScene.g_instance;
    }
    public arrMonster_down:Monster_down[] = [];
    constructor() { 
        super();
        console.log("colapitScene constructor");
        CoalPitScene.g_instance = this;
        this._boomArmature = null;
    };
    protected createChildren(): void {
        console.log("createChildren");
        console.log("w:"+this.stage.stageWidth);
        super.createChildren();
        this.stage.scaleMode = egret.StageScaleMode.SHOW_ALL;
        this.init();
        this.createTimer();
        this.touchEnabled = false;
    }
    private init():void{ 
        this.group = new eui.Group();
        // this.group.height = this.stage.stageHeight;
        this.scroll = new eui.Scroller();      
        this.scroll.bounces = false;
        this.scroll.width = this.stage.stageWidth;
        this.scroll.height = this.stage.stageHeight;
        this.scroll.viewport = this.group;
        this.addChild(this.scroll); 
        // this.scroll.touchEnabled = false;
        // this.group.touchEnabled = false;
        var bg1 = Utility.createImageByName("back_underWall_png");
        this.group.addChild(bg1);
        // var bg1_1 = Utility.createImageByName("under_wall_p_png");
        // this.group.addChild(bg1_1);
        // bg1_1.x = bg1.width;

        this.bg2 = Utility.createImageByName("back_underGround2_png");
        this.group.addChild(this.bg2);
        this.bg2.y = bg1.y+bg1.height-100;
        // var bg2_1 = Utility.createImageByName("under_ground_p_png");
        // this.group.addChild(bg2_1);
        // bg2_1.x = this.bg2.width;
        // bg2_1.y = bg1.y+bg1.height;

        var bg3 = Utility.createImageByName("back_underGround3_png");
        this.group.addChild(bg3);
        bg3.bottom = 0;
        
        // 创建唤醒NPC
        this.createNPC();
        // this.hxNpc = Utility.createImageByName("huanxing");
        // this.group.addChild(this.hxNpc);
        // this.hxNpc.x = 1400;
        // this.hxNpc.y = 50;
        // this.hxNpc.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
        //     SoundPlay.Instance.Play("hit_the_pot_mp3");
        //     EffectUtils.shakeScreen(this.hxNpc,1,function() {
                
                
        //     },this);
        // },this);
        // 成就
        this.group.addChild(AchieveUI.getInstance());
        AchieveUI.getInstance().x = 480;
        AchieveUI.getInstance().y =140;
        // 黑衣人
        this.group.addChild(HyrUI.getInstance());
        HyrUI.getInstance().x = 1110;
        HyrUI.getInstance().y = 120;

        // console.log("bg.y:"+bg1.y);
        // 创建动画
        var monList = MonsterManager.getInstance().getMonsterList();
        for (var i in monList){
            this.arrMonster_down.push(new Monster_down(i));
        }
        for(var i in this.arrMonster_down){
            this.group.addChild(this.arrMonster_down[i]);
        }
        //设置滑动层的初始位置在屏幕中央   
        this.scroll.viewport.scrollH =  this.bg2.width/2-this.stage.stageWidth/2;       
    };
    public addNewMonster(index){
        var obj = new Monster_down(index);
        this.arrMonster_down.push(obj);
        this.group.addChild(obj);
    }
    // 创建定时器
    private createTimer(){
        this._sleepTimer = new egret.Timer(GlobalData.sleepTime,0);
        this._sleepTimer.addEventListener(egret.TimerEvent.TIMER,this.sleepMon,this);
        this._sleepTimer.start();

        
    }
    // 获取未睡觉的精灵列表
    private getWorkMon(){
        var arr = [];
        for(var i in this.arrMonster_down){
            if(this.arrMonster_down[i]._curAniName =="stand" || this.arrMonster_down[i]._curAniName == "work"){
                arr.push(i);
            }
        }
        return arr;
    }
    // 计算睡眠的精灵
    private sleepMon(){     
        var workArr = this.getWorkMon();
        var len = workArr.length;
        if(len == 0){
            console.log("没有正在工作的精灵");
        }else{
            // 随机选一个让他睡觉
            var i = Utility.Random(0,len,true);
            this.arrMonster_down[workArr[i]].sleepAnimation();
        }
    }
    private reliveMon(){
        console.log("复活时间到");
        for(var i in this.arrMonster_down){
            if(this.arrMonster_down[i]._curAniName == "die"){
                // this.arrMonster_down[i].playAnimation("rebirth",1);
                this.arrMonster_down[i].stopWorkAnimation("rebirth");
            }
        }
    }
    public remove(){
        this.$parent.removeChild(this);
    }
    // 精灵死亡
    public monsterDieSelect(){
        // 计算有几个活着的
        var nums = 0;
        for(var i in this.arrMonster_down){
            if(this.arrMonster_down[i]._curAniName != "die"){
                //  this.arrMonster_down[i].dieAnimation("die");
                nums++;
            }   
        }
        console.log("还活着的："+nums);
        nums = Math.ceil(nums*0.4);
        console.log("要炸死的："+nums);
        if(nums>0){
            for(var i in this.arrMonster_down){
                if(this.arrMonster_down[i]._curAniName != "die"){
                    if(nums>0){
                         nums--;
                        this.arrMonster_down[i].dieAnimation("die");
                    }else{
                        this.arrMonster_down[i].playAnimation("stand");
                    }
                }
            }
        }
    }
    //精灵amazing
    public monsterAmazSelect(){
        for(var i in this.arrMonster_down){
            this.arrMonster_down[i].speAnimation("amazing",5);
        }
    }

    public showAchieve(index){
        FloorUI.getInstance().swapLayer();
        Main.getInstance().stage.addChild(new AchieveSuccInfo(index));
    }
    //单个精灵升级
    public monsterLvUp(id){
        var _index=this.getMonsterById(id);
        if(_index){
            this.arrMonster_down[_index].lvUpAnimation();
        }
    }
    //单个精灵进化
    public monsterEvolve(id){
        // var _index=this.getMonsterById(id);
        // if(_index){
            FloorUI.getInstance().swapLayer();
            Main.getInstance().stage.addChild(new EvolutionUI(id,this.evolutionUp,CoalPitScene.getInstance(),[id]));
        // }
    }
    // 单个精灵复活
    public monsterRelive(id){
        var _index=this.getMonsterById(id);
        if(_index){
            this.arrMonster_down[_index].dieTimeout();
        }
    }
    public evolutionUp(id){
        var _index=this.getMonsterById(id);
        if(_index){
            this.arrMonster_down[_index].updateDragon();
        }
    }
    //根据Id获得精灵对象
    public getMonsterById(id){
        var _id;
        if(typeof id == "number"){
            _id = id.toString();
        }else{
            _id = id;
        }
        for(var i in this.arrMonster_down){
            if(_id == this.arrMonster_down[i].getCfg().id){
                return i;
            }
        }
        console.log("兄弟，你的列表中根本没有这个Id:"+id);
        return undefined;
    }

    // 显示炸弹
    private showBoom(){
        console.log("现在的位置："+this.scroll.viewport.scrollH);
        this.scroll.viewport.scrollH = this.bg2.width/2-this.stage.stageWidth/2;
        var obj = new BoomEffectUI();
        this.group.addChild(obj);
        obj.x = this.scroll.viewport.scrollH;
        
    }

    // 创建NPC
    private createNPC(){
        this.hxNpc = Utility.createDragon("NPC_huanxing");
        this.group.addChild(this.hxNpc.display);
        this.hxNpc.display.x = 1700;
        this.hxNpc.display.y = 440;
        this.hxNpc.display.touchEnabled = true;
        this.hxNpc.addEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT, this.npcOnFrameEvent,this);
        this.hxNpc.addEventListener(dragonBones.AnimationEvent.COMPLETE, this.npcOnAnimationEvent,this);
        this.hxNpc.addEventListener(dragonBones.AnimationEvent.START, this.npcOnAnimationEvent,this);
        this.hxNpc.addEventListener(dragonBones.AnimationEvent.LOOP_COMPLETE, this.npcOnAnimationEvent,this);
        this.hxNpc.animation.gotoAndPlay("stand",-1,-1,0);
        this.hxNpc_ani = "stand";
        this.hxNpc.display.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            if(this.hxNpc_ani == "stand"){
                this.hxNpc.animation.gotoAndPlay("rebirth",-1,-1,1);
                for(var i in this.arrMonster_down){
                    if(this.arrMonster_down[i]._curAniName == "sleeping"){
                        this.arrMonster_down[i].rebirthAnimation();
                    }
                }
            }
        },this);
    }
    private npcOnFrameEvent(evt: dragonBones.FrameEvent):void{

    }
    private npcOnAnimationEvent(evt: dragonBones.AnimationEvent):void{
        switch(evt.type){
           case dragonBones.AnimationEvent.START:
                 this.hxNpc_ani = evt.animationName;
                break;
           case dragonBones.AnimationEvent.LOOP_COMPLETE:
                // console.log("Animation_LoopComplete");
                break;
           case dragonBones.AnimationEvent.COMPLETE:
                if(evt.animationName == "rebirth"){
                    this.hxNpc.animation.gotoAndPlay("stand",-1,-1,0);
                }
                break;
       }
    }
}