/**
 * playerManager
 */
class PlayerManager {
    // 变量
    private m_homeLv;
    private m_gold;
    private m_achieveIndex;
    private m_totalGold;
    private m_diamon;
    private m_catchTime;//剩余抓捕时间
    private m_catchStartTime;//抓捕的开始时间
    private m_homeName;
    private m_startTime;// 游戏开始的时间
    private timeInterId; 
    private static g_instance:PlayerManager = null;
    public static getInstance(){
        if(!PlayerManager.g_instance){
            PlayerManager.g_instance = new PlayerManager();
        }
        return PlayerManager.g_instance;
    }
    
    public constructor() 
    {
        this.m_homeLv = 1;
        this.m_gold = 0 ;
        this.m_achieveIndex = 1;
        this.m_totalGold = 0;
        this.m_diamon = 0;
        this.m_catchStartTime = 0;
        this.m_catchTime = 0;
        this.m_startTime;
        this.init();
        this.createTimeInter();
    }
    private init()
    {
        this.m_homeLv = DataManager.getInstance().getBaseData_number("m_homeLv") || 1;
        this.m_gold  = DataManager.getInstance().getBaseData_number("m_gold") || 0;
        this.m_achieveIndex = DataManager.getInstance().getBaseData_number("m_achieveIndex") || 1;
        this.m_totalGold = DataManager.getInstance().getBaseData_number("m_totalGold") || 0;
        this.m_diamon = DataManager.getInstance().getBaseData_number("m_diamon") || 0;
        this.m_catchStartTime = DataManager.getInstance().getBaseData_number("m_catchStartTime") || 0;
        this.m_catchTime = DataManager.getInstance().getBaseData_number("m_catchTime") || 0;
        this.m_homeName = DataManager.getInstance().getBaseData_string("m_homeName") || "未命名";
        this.m_startTime = DataManager.getInstance().getBaseData_number("m_startTime") || 0;
        console.log("m_homeLv:"+this.m_homeLv);
    }
    public setConfig(type,value){
        if(type == "m_achieveIndex"){
            this.m_achieveIndex = value;
            // DataManager.getInstance().setBaseData("m_achieveIndex",value);
        }else if(type == "m_totalGold"){
            this.m_totalGold = value;
            // DataManager.getInstance().setBaseData("m_totalGold",value);
        }else if(type == "m_catchTime"){
            this.m_catchTime = value;
        }else if(type == "m_catchStartTime"){
            this.m_catchStartTime = value;
        }else if(type == "m_homeName"){
            this.m_homeName = value;
        }else if(type == "m_startTime"){
            this.m_startTime = value;
        }
        ////////////////
        var str_val;
        if(typeof value == "number"){
            str_val = value.toString();
        }
        DataManager.getInstance().setBaseData(type,str_val);
    }
    // testing
    public testAddGold(value){
        this.m_gold += value;
        GoldLvUI.getInstance().setGold();
        DataManager.getInstance().setBaseData("m_gold",this.m_gold);
    }
    public updateConfig(type,value,save = true):boolean{
        if(type == "gold" || type == "m_gold"){
            if(this.m_gold+value<0) 
                return false;
            this.m_gold += value;
            GoldLvUI.getInstance().setGold();
            if(save)
                DataManager.getInstance().setBaseData("m_gold",this.m_gold);
            if(value>0){
                this.m_totalGold += value;
                AchieveUI.getInstance().updataData();
            }
            
        }else if(type == "homeLv"){
            this.m_homeLv += value;
            GoldLvUI.getInstance().setLv();
            if(save)
                DataManager.getInstance().setBaseData("m_homeLv",this.m_homeLv);
        }else if(type = "diamon" || type == "m_diamon"){
            if(this.m_diamon+value<0) 
                return false;
            this.m_diamon += value;
            GoldLvUI.getInstance().setDiamon();
            if(save)
                DataManager.getInstance().setBaseData("m_diamon",this.m_diamon);
        }
        return true;
    }
    //成就加金币
    public addAchieveGold(index){
        var value = Utility.getTotalGoldByIndex(index);
        this.m_gold+=value;
        GoldLvUI.getInstance().setGold();
        DataManager.getInstance().setBaseData("m_gold",this.m_gold);
    }
    public getConfig(type){
        if(type == "gold"){
            return this.m_gold;
        }
        else if(type == "homeLv"){
            return this.m_homeLv;
        }
        else if(type == "diamon"){
            return this.m_diamon;
        }
        else if(type == "m_achieveIndex"){
            return this.m_achieveIndex;
        }else if(type == "m_totalGold"){
            return this.m_totalGold;
        }else if(type == "m_catchTime"){
            return this.m_catchTime;
        }else if(type == "m_catchStartTime"){
            return this.m_catchStartTime;
        }else if(type == "m_homeName"){
            return this.m_homeName
        }else if(type == "m_startTime"){
            return this.m_startTime;
        }
    }
    // 定时器
    public createTimeInter(){
        // 每5分钟计时一次
        this.timeInterId =  egret.setInterval(()=>{
            this.setConfig("m_startTime",new Date().getTime());
        },this,1000)
    }
}