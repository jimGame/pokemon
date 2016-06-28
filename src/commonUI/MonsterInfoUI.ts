/**
 * MonsterInfo 
 */
class MonsterInfoUI extends eui.Component{
    private _name:eui.Label;
    private _lv:eui.Label;
    private _wakuangVal:eui.Label;
    private _catchVal:eui.Label;
    private lv_progress:eui.ProgressBar;
    private static g_instance;
    private m_index;
    private radio;
    public static getInstance(_index=-1){
        if(_index == -1){
            return this.g_instance;
        }
        if(!this.g_instance){
            // console.log("新建一个");
            this.g_instance = new MonsterInfoUI(_index);
        }
        return this.g_instance;
    }
    constructor(_index) {
        super();
        this.m_index = _index;
        this.skinName = "resource/skin/monsterInfo.exml";
        this.anchorOffsetX = this.width/2;
        this.anchorOffsetY = this.height;
        this.initData();
    }
    private initData(){
        var info = MonsterManager.getInstance().getMonsterArrByIndex(this.m_index);
        this._name.text = this.getName();
        this._wakuangVal.text = Utility.numToString_1(this.getGold());
        this._catchVal.text = info.nums + " 匹";
        this._lv.text = "LV " + info.lv;
        
        this.lv_progress.labelDisplay.visible = false;
        var val = (info.exp/Utility.getMaxExp(info.lv)*100).toFixed(2);
        this.lv_progress.value = parseFloat(val);
        this.radio.text = val + "%";
    }
    public  remove(){
        if(!MonsterInfoUI.g_instance){
            return ;
        }
       if(this.parent){
           this.parent.removeChild(this);
           MonsterInfoUI.g_instance = null;
       }   
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
    private getGold(){
        var info = MonsterManager.getInstance().getMonsterArrByIndex(this.m_index);
        var gold_lv = Utility.getGold(info.lv);
        var gold_shovel = Utility.getGoldByShovel(info.shovel);
        var evoAdd = 0;
        if(info.isEvolution == 0){
            evoAdd = 0;
        }else{
            var eId = ConfigMonsterManager.getConfig(info.id,"evolutionId")[info.isEvolution-1];
            evoAdd = ConfigMonsterManager.getConfig(eId,"evoAddGold");
        }
        var time = ConfigMonsterManager.getConfig(info.id,"workTime")/1000;
        return (gold_lv+gold_shovel+evoAdd)*time
    }
}