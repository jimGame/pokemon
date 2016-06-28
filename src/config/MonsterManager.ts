/**
 * MonsterManager 玩家拥有的精灵
 */
class MonsterManager{


    private static g_instance:MonsterManager;
    public static getInstance(){
        if(!MonsterManager.g_instance){
            MonsterManager.g_instance = new MonsterManager();
        }
        return MonsterManager.g_instance;
    }
    private m_monsterList
    public m_offGold;
    public constructor() {
        this.initData();
        this.init();
    }
    private initData(){
        this.m_monsterList = [];
    }
    private init(){
        // 本地读取
        var monsterList = [];
        var get_monsterList = DataManager.getInstance().getBaseData_string("monsterList");
        if(get_monsterList){
            monsterList = eval('('+get_monsterList+')');
        }
        // var b = JSON.stringify([{"a":1}]);
        // console.log("json:::"+b);
        // var a = 
        // eval("("+'[{"a":1}]'+")");
        // 从服务器获得的列表
        // var monsterList = [
        //     {
        //         id:"1001",
        //         lv:1,
        //         weaponLv:1,
        //         exp:0,
        //         nums:1
        //     },
        //     {
        //        id:"1002",
        //        lv:1,
        //        weaponLv:1,
        //        exp:0,
        //        nums:1
        //     }
        // ]
        // 写入到我的列表中
        for(var i in monsterList){
            var curTime = new Date().getTime();
            if(monsterList[i].shovelUpTime && monsterList[i].shovelUpTime> 0){               
                monsterList[i].shovelUpTime -= Math.floor((curTime - monsterList[i].shovelUpStart)/1000);
                if(monsterList[i].shovelUpTime < 0) monsterList[i].shovelUpTime = 0;
                console.log("shovelUpTime_init:"+monsterList[i].shovelUpTime);
            }
            if(monsterList[i].reliveDTime && monsterList[i].reliveDTime > 0){
               monsterList[i].reliveDTime -= Math.floor((curTime-monsterList[i].reliveStartTime)/1000);
               if(monsterList[i].reliveDTime < 0) monsterList[i].reliveDTime = 0;
               console.log("初始化死亡时间#"+monsterList[i].reliveDTime);
            }
            this.m_monsterList.push(monsterList[i]);
        }
        this.m_offGold = this.caclSleepMon();
        PlayerManager.getInstance().testAddGold(this.m_offGold);

        console.log("离线收益："+this.m_offGold);
        this.saveMonsterList();
    }
    // 计算睡觉的精灵
    public caclSleepMon(){
        var sTime = PlayerManager.getInstance().getConfig("m_startTime");
        // if(sTime == 0){}
        var shouyi = 0;
        if(sTime >0){
            var cTime = new Date().getTime();
            var difTime = Math.floor((cTime - sTime)/1000);
            console.log("差值的时间秒数："+difTime);
            if(difTime > 3600){
                // 离线大于一小时
                var num_hour = parseInt((difTime/3600).toString());
                for(var i=0;i<num_hour;i++){
                    for(var j in this.m_monsterList){
                        if(this.m_monsterList[j].curAni == "stand"){
                            
                            this.m_monsterList[j].curAni = "sleeping";
                            shouyi += this.caclOffGold(this.m_monsterList[j],(i+1)*60*60);
                            break;
                        }
                    }
                }
            }else{
                //
                for(var j in this.m_monsterList){
                    if(this.m_monsterList[j].curAni == "stand"){
                        shouyi += this.caclOffGold(this.m_monsterList[j],difTime);
                    }
                }
                
            }
        }
        return shouyi;
    }
    // 计算一个精灵的收益
    public caclOffGold(list,secs){
         var gold_lv = Utility.getGold(list.lv);
        var gold_shovel = Utility.getGoldByShovel(list.shovel);
        var evoAdd = 0;
        if(list.isEvolution == 0){
            evoAdd = 0;
        }else{
            var eId = ConfigMonsterManager.getConfig(list.id,"evolutionId")[list.isEvolution-1];
            console.log("eId:"+eId);
            evoAdd = ConfigMonsterManager.getConfig(eId,"evoAddGold");
        }
        var wtime = ConfigMonsterManager.getConfig(list.id,"workTime")/1000;
        var nums = parseInt((secs/wtime).toString());
        return (gold_lv+gold_shovel+evoAdd)*wtime * nums;
    }
    // 捕获一个精灵
    public catachMonster(id,type="up"){
         console.log("抓到一个，ID："+id);
         if(id == 1499){
            console.log("恭喜你，抓到了一个炸弹。BOOM#####");
            //  CoalPitScene.getInstance().createBoom();
            // swapLayer()
            FloorUI.getInstance().swapLayer();
            // CoalPitScene.getInstance().createBoom();
            var obj = new BoomEffectUI();
            // Main.getInstance().stage.addChild(new BoomEffect2(obj));
            Main.getInstance().stage.addChild(obj);
            return;
         }
         if(this.checkIfNew(id)){            
            Main.getInstance().stage.addChild(new MonsterGetinfoUI(this.getArrIndexById(id)));
            this.calcExp(id);
         }else{
             console.log("获得新的精灵");
             if(id!=1499){
                //  this.createNewMon(id);
                if(type == "up"){
                    Main.getInstance().stage.addChild(new GetNewUI(id));
                }else if(type == "down"){
                    this.createNewMon(id);
                }
             }    
            //  this.createNewMon(id);
         }
    }
    // 新建一个精灵类型Json
    public createNewMon(id){
        var newMon = {
                 id:"1001",
                 lv:1,
                 exp:0,
                 nums:1,
                 shovel:1,
                 shovelUpTime:0,    //升级剩余秒数
                 shovelUpStart:0,   //升级开始的时间节点
                 curAni:"stand",    //当前的状态
                 reliveDTime:0,     // 复活剩余时间
                 reliveAllTime:0,    // 复活全部时间
                 reliveStartTime:0,  // 复活开始的时间节点
                 isEvolution:0, // 0=未进化 1= 进化1级 2=进化2级
             }
        newMon.id = id.toString();
        this.m_monsterList.push(newMon);
        CoalPitScene.getInstance().addNewMonster(this.m_monsterList.length-1);
        DataManager.getInstance().setBaseData("monsterList",JSON.stringify(this.m_monsterList));
    }
    // 计算抓到一个获取多少经验值
    public calcExp(id){
        var exp = Utility.getExpByHomelv();
        var curArr = this.getArrById(id);
        curArr.nums++;   
        var needExp = Utility.getMaxExp(curArr.lv);
        if(exp+curArr.exp>needExp){
            // 触发升级
            while (exp+curArr.exp>needExp) {
                curArr.lv++;
                exp = exp+curArr.exp-needExp;
                curArr.exp = 0;
                needExp = Utility.getMaxExp(curArr.lv);
            }
            if(this.calcEveolution(id)){
                // 触发进化;
                this.getArrById(id).isEvolution++;
                this.saveMonsterList();
                CoalPitScene.getInstance().monsterEvolve(id);
            }else{
                CoalPitScene.getInstance().monsterLvUp(id);
                GameScene.getInstance().setMonsterLvUp(id);
            }
        }
        curArr.exp += exp;
        DataManager.getInstance().setBaseData("monsterList",JSON.stringify(this.m_monsterList));
        // console.log("")
    }
    // 计算精灵是否进化
    public calcEveolution(id){
        var monEvoId = ConfigMonsterManager.getConfig(id.toString(),"evolutionId");
        if(monEvoId == -1){
            console.log("此精灵暂不支持进化");
            return false;
        }else{
            if(this.getArrById(id).isEvolution == monEvoId.length){
                // 已经完全进化
                console.log("此精灵已进化为完全体");
                return false;
            }else{
                var hLv = PlayerManager.getInstance().getConfig("homeLv");
                var nLv = ConfigMonsterManager.getConfig(id.toString(),"evolutionHomeLv");
                return (hLv >= nLv[this.getArrById(id).isEvolution]);
            }
        }
        // if(this.getArrById(id).isEvolution >1){
        //     // 已经进化过了
        //     return false;
        // }
        // var hLv = PlayerManager.getInstance().getConfig("homeLv");
        // var nLv = ConfigMonsterManager.getConfig(id.toString(),"evolutionHomeLv");
        // return (hLv>=nLv)
    }
    // 根据Id获取数组
    public getArrById(id){
        var _id = id.toString();
        for(var i in this.m_monsterList){
            if(_id == this.m_monsterList[i].id){
                return this.m_monsterList[i];
            }
        }
        console.log("ERROR:#########当前列表中没有这个精灵，快检查检查吧");
        return undefined;
    }
    // 根据Id获取数组的索引
    public getArrIndexById(id){
        var _id = id.toString();
        for(var i in this.m_monsterList){
            if(_id == this.m_monsterList[i].id){
                return i;
            }
        }
        console.log("ERROR:#########当前列表中没有这个精灵，快检查检查吧");
        return undefined;
    }
    // 判断是否拥有这类精灵 true 已拥有
    public checkIfNew(id){
        var _id  = id.toString();
        var re = false;
        for(var i in this.m_monsterList){
            if(_id == this.m_monsterList[i].id){
                re = true;
                break;
            }
        }
        return re;
    }

    public checkIfHaveMon(id):boolean
    {
        for(let i in this.m_monsterList)
        {
            let evo = this.m_monsterList[i].isEvolution+1;
            for(let j=1;j<=evo;++j)
            {
                let _id = this.m_monsterList[i].id%1000+j*1000;
                if(id==_id)
                    return true;
            }
        }
        return false;
    }

    public getMonsterList(){
        return this.m_monsterList;
    }
    public getMonsterArrByIndex(index){
        return this.m_monsterList[index];
    }
    public saveMonsterList(){
        DataManager.getInstance().setBaseData("monsterList",JSON.stringify(this.m_monsterList));
    }
}