class ForgeSingleUI extends eui.Component {
    private static g_instance;
    private _name:eui.Label;
    private _weaponLv;
    private _group_qh1;
    private _group_qh2;
    private _group_qh3;
    private _info;
    private _groupArr;
    private _wkVal;
    private _goldVal;
    private _upBar;
    private _upTime;
    private _needVal;
    private _lkwc;

    private _qhIcon_null
    private _qhIcon;
    private m_index;
    
    private m_armature;
    // private lvupTime;// 升级剩余时间
    private lvupInterId;
    public static getInstance(){
        if(!this.g_instance){
            // this.g_instance  = new ForgeSingleUI();
        }
        return this.g_instance;
    }
    constructor(_index) {
       super();
       this.m_index = _index;
       this.skinName = "resource/skin/dzSingleInfo.exml";  
       this.initData();
       this.initOperation();
    }
    private initData(){
        this._upBar.value = 30;
        this._groupArr = [];
        this._groupArr.push(this._group_qh1);
        this._groupArr.push(this._group_qh2);
        this._groupArr.push(this._group_qh3);
       

        // this.lvupTime = 0;

        this.createArmature();
        // var info = MonsterManager.getInstance().getMonsterArrByIndex(this.m_index);
        // this._name.text = ConfigMonsterManager.getConfig(info.id,"name");
        // console.log("info.shovelUpTime@@@"+info.shovelUpTime);
        this._name.text = this.getName();
        this.updateData();
    }
    public updateData(){
        var info = MonsterManager.getInstance().getMonsterArrByIndex(this.m_index);
        if(info.shovel == 10){
             this.showGroupIndex(2);
         }else if(info.shovelUpTime > 0){
             this.showGroupIndex(1);
             this.showCurData();
             this.lvUp();
         }else{
             this.showGroupIndex(0);
             this.showCurData();
         }
    }
    private showCurData(){
        var info = MonsterManager.getInstance().getMonsterArrByIndex(this.m_index);
        var worktimes = ConfigMonsterManager.getConfig(info.id,"workTime");
        this._weaponLv.text = "LV " + info.shovel.toString();
        //
        this.updateIcon();
        // 升级后的挖矿数
        this._wkVal.text   =  "+" + Utility.numToString_1(Utility.getGoldByShovel(info.shovel+1)*worktimes/1000);            
        var upgold =  ConfigShovelManager.getConfig(info.shovel,"upGold");
        // 升级需要的金币数
        this._goldVal.text =  Utility.numToString_1(upgold);
        // 立即完成需要的钻石数  ConfigShovelManager.getConfig(info.shovel,"upTime")/60/5*10
        // this._needVal.text = Utility.numToString_1(Utility.getDiamonByTime(info.shovelUpTime));
        // 升级剩余时间
        // this.showLvupTime();
    }
    private initOperation(){
        this._group_qh1.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            if(!this.checkGoldAll()){
                EffectUtils.playEffect(this._group_qh1,3,this.qh1_callback,this);
            }
        },this);
        this._lkwc.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            EffectUtils.playEffect(this._lkwc,3,this.lkwcCallback,this);
        },this);
    }
    private showGroupIndex(index){
        for(var i in this._groupArr){
            this._groupArr[i].visible = (i == index.toString());
        }
    }
    // 点击升级回调
    private qh1_callback(){
        if(!this.checkGoldAll()){
            // this.showGroupIndex(1);
            var info = MonsterManager.getInstance().getMonsterArrByIndex(this.m_index);
            info.shovelUpTime = ConfigShovelManager.getConfig(info.shovel,"upTime")
            info.shovelUpStart = new Date().getTime();
            MonsterManager.getInstance().saveMonsterList();
            // this.lvUp();
            var info = MonsterManager.getInstance().getMonsterArrByIndex(this.m_index);
            var upgold =  ConfigShovelManager.getConfig(info.shovel,"upGold");
            PlayerManager.getInstance().updateConfig("gold",0-upgold);
            ForgeUI.getInstance().updateAll();
        }else{
            console.log("金币不足");
        }
    }
    // 立即完成回调
    private lkwcCallback(){
       var dd =  Utility.getDiamonByTime(this.getInfo().shovelUpTime);
        if(PlayerManager.getInstance().getConfig("diamon") >= dd){
            PlayerManager.getInstance().updateConfig("diamon",0-dd);
            this.lvupSucc();
        }else{
            Main.getInstance().stage.addChild(new CommonTipsUI("钻石数量不足"));
        }
    }
    private createArmature(){
        var info = MonsterManager.getInstance().getMonsterArrByIndex(this.m_index);
        this.m_armature =  Utility.createDragon(ConfigMonsterManager.getConfig(info.id,"dragonName_down"));
        this.addChild(this.m_armature.display);
        this.swapChildren(this._info,this.m_armature.display);
        this.m_armature.animation.gotoAndPlay("stand",-1,-1,0)
        this.m_armature.display.x = 100;
        this.m_armature.display.y = 150;
        this.m_armature.display.scaleX = 0.8;
        this.m_armature.display.scaleY = 0.8;
    }
    // 显示是否能升级
    private updateIcon(){
        if(this.checkGoldAll()){
            Utility.updateImageTexture(this._qhIcon,"qh_81");
            this._group_qh1.touchEnabled = false;
        }else{
            Utility.updateImageTexture(this._qhIcon,"qh_73");
            this._group_qh1.touchEnabled = false;
        }
    }
    // 显示升级剩余的时间
    private showLvupTime(){
         var info = MonsterManager.getInstance().getMonsterArrByIndex(this.m_index);
         this._upTime.text = "升级中  "+Utility.MillisecondToDate(ConfigShovelManager.getConfig(info.shovel,"upTime"));
    }
    // 判断金币是否够用了 == true不够用 false够用
    private checkGoldAll(){
        var info = MonsterManager.getInstance().getMonsterArrByIndex(this.m_index);
        var upgold =  ConfigShovelManager.getConfig(info.shovel,"upGold");
        return (PlayerManager.getInstance().getConfig("gold") < upgold);
    }
    private lvUp(){
        // 初始化升级剩余时间

        this.updateTimeAndProgress();
        console.log("初始化：shovelUpTime:"+MonsterManager.getInstance().getMonsterArrByIndex(this.m_index).shovelUpTime);
        this.lvupInterId = egret.setInterval(()=>{
            console.log("ddd");
            var info = MonsterManager.getInstance().getMonsterArrByIndex(this.m_index);
            info.shovelUpTime--;
            console.log("shovelUpTime:"+info.shovelUpTime);
            MonsterManager.getInstance().saveMonsterList();
            this.updateTimeAndProgress();
            if(info.shovelUpTime == 0){
                this.lvupSucc();   
            }
        },this,1000);
    }
    // 更新时间和进度条
    private updateTimeAndProgress(){
        var info = MonsterManager.getInstance().getMonsterArrByIndex(this.m_index);
        var alltime = ConfigShovelManager.getConfig(info.shovel,"upTime");
        this._needVal.text = Utility.numToString_1(Utility.getDiamonByTime(info.shovelUpTime))
        this._upTime.text = "升级中  "+Utility.MillisecondToDate(info.shovelUpTime);
        this._upBar.value = Utility.getProgress(alltime-info.shovelUpTime,alltime);
    }
    private lvupSucc(){
        console.log("取消定时器");
        console.log("定时器："+this.lvupInterId);
        egret.clearInterval(this.lvupInterId);
        var info = MonsterManager.getInstance().getMonsterArrByIndex(this.m_index);
        info.shovel++;
        info.shovelUpTime = 0;
        MonsterManager.getInstance().saveMonsterList();
         if(info.shovel == 10){
            this.showGroupIndex(2);
        }else{
            this.showGroupIndex(0);
            this.showCurData();
        }      
    }
    private getInfo(){
        return MonsterManager.getInstance().getMonsterArrByIndex(this.m_index);
    }
    private getName(){
        var info = MonsterManager.getInstance().getMonsterArrByIndex(this.m_index);
        if(info.isEvolution == 0){
            return ConfigMonsterManager.getConfig(info.id,"name");
        }else{
            var eId = ConfigMonsterManager.getConfig(info.id,"evolutionId")[info.isEvolution-1];
            return ConfigMonsterManager.getConfig(eId,"name");
        }
    }
}