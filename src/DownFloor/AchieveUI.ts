/**
 * AchieveUI 
 */
class AchieveUI extends eui.Component {
    private static g_instance;
    public _cjPro:eui.ProgressBar;
    public _mubiao:eui.Label;
    public _chazhi:eui.Label;
    public static getInstance(){
        if(!this.g_instance){
            this.g_instance = new AchieveUI();
        }
        return this.g_instance;
    }
    constructor() {
        super();
        this.skinName = "resource/skin/achieveInfo.exml";
        
    }
    protected createChildren() {
        this.initData();
    }
    public initData(){
       this.setData();
       this.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
           PlayerManager.getInstance().testAddGold(1000000);
        // Main.getInstance().stage.addChild(new EvolutionUI(1001));
       },this);
    }
    public updataData(){
        var totalIndex:number = PlayerManager.getInstance().getConfig("m_achieveIndex");
        var curMubiao:number = Utility.getTotalGoldByIndex(totalIndex);
        var curTotalGold:number = PlayerManager.getInstance().getConfig("m_totalGold");
        if(curTotalGold >= curMubiao ){
            // 条件达成
            console.log("成就任务条件达成了。。。。。。");
            while(curTotalGold > curMubiao){
                totalIndex++;
                curTotalGold = curTotalGold - curMubiao;
                curMubiao = Utility.getTotalGoldByIndex(totalIndex);
            }
            // DataManager.getInstance().setBaseData("m_gold",this.m_gold);
            PlayerManager.getInstance().addAchieveGold(totalIndex-1)
            CoalPitScene.getInstance().showAchieve(totalIndex-1);
            console.log("设置成就等级："+totalIndex);
            PlayerManager.getInstance().setConfig("m_achieveIndex",totalIndex);
        }
        // console.log("设置成就金币:"+curTotalGold);
        PlayerManager.getInstance().setConfig("m_totalGold",curTotalGold);
        this.setData();
    }
    public setData(){
        var totalIndex:number = PlayerManager.getInstance().getConfig("m_achieveIndex");
        var curMubiao:number = Utility.getTotalGoldByIndex(totalIndex);
        var curTotalGold:number = PlayerManager.getInstance().getConfig("m_totalGold");
        this._mubiao.text = Utility.numToString_1(curMubiao);
        this._chazhi.text = "距离任务达成还有"+Utility.numToString_1(curMubiao-curTotalGold);
        this._cjPro.value = Utility.getProgress(curTotalGold,curMubiao);
    }
}