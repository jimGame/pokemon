/**
 * DataManager
 */
class DataManager {
    private static g_instance:DataManager;
    public  static getInstance(){
        if(!this.g_instance){
            this.g_instance = new DataManager();
        }
        return this.g_instance;
    }
    constructor() {
        
    }
    getBaseData_number(key:string){
        var a = NativeApi.getLocalData(key) || "0";
        if(key == "m_catchTime"){
            console.log("读取m_catchTime####"+NativeApi.getLocalData(key));
            console.log("读取m_catchTime:"+a);
        }
        return parseFloat(a);
    }
    getBaseData_string(key:string){
         return NativeApi.getLocalData(key);
    }
    setBaseData(key:string, value:string){
        if(key == "diamod"){
            console.log("保存m_catchTime:"+value);
        }
        NativeApi.setLocalData(key,value);
    }
    
}