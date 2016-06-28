/**
 * MonsterGetinfoUI 
 */
class MonsterGetinfoUI extends eui.Component {
    private lv_progress:eui.ProgressBar
    private m_index;
    private monName:eui.Label;
    private initVal;
    private endVal;
    private radio;
    constructor(_index) {
        super();
        this.m_index = _index;
        this.skinName = "resource/skin/monsterGet.exml";
        this.y = -this.height;
        this.initData();
        // this.initTimer();
    }
    private initData(){
        var info = MonsterManager.getInstance().getMonsterArrByIndex(this.m_index);
        this.lv_progress.labelDisplay.visible = false;
        this.initVal = parseFloat((info.exp/Utility.getMaxExp(info.lv)*100).toFixed(2));
        this.endVal  = this.calcExp(Utility.getExpByHomelv());
        this.lv_progress.value = this.initVal;
        this.monName.text = this.getName();
        this.radio.text = "+" + (this.endVal-this.initVal).toFixed(2) + "%";
        // var n = new eui.Label();
        // this.addChild(n);
        // n.text = "我是手动创建的哦";
        this.animation();
    }
    private animation(){
        var tw1 = egret.Tween.get(this);
        tw1.to({y:0},100,egret.Ease.backOut).call(this.progressMove).wait(100*5)
           .to({y:-this.height},100*2,egret.Ease.backIn).call(function() {
                this.remove();
            });                  
    }
    private progressMove(){
         var tw = egret.Tween.get(this.lv_progress);
         tw.to({value:this.endVal},100*5).wait(100*3)
    }
    // 获取目标值
    public calcExp(exp){
        var info = MonsterManager.getInstance().getMonsterArrByIndex(this.m_index);  
        var needExp = Utility.getMaxExp(info.lv);
        if(exp+info.exp>needExp){
            return 100;
        }else{
            return parseFloat(((exp+info.exp)/Utility.getMaxExp(info.lv)*100).toFixed(2));
        }
    }
    private remove(){
        if(this.parent){
            this.parent.removeChild(this);
        }
    }
    private getName(){
        // var info;
        // if()
        var info = MonsterManager.getInstance().getMonsterArrByIndex(this.m_index);
        if(info.isEvolution == 0){
            return ConfigMonsterManager.getConfig(info.id,"name");
        }else{
            var eId = ConfigMonsterManager.getConfig(info.id,"evolutionId")[info.isEvolution-1];
            return ConfigMonsterManager.getConfig(eId,"name");
        }
    }
}