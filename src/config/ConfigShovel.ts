class ConfigShovelManager{
    public static getConfig(_id,_type){
       return ConfigShovel[_id][_type];
    }
}

var ConfigShovel = {
    "1":{
        id:"1001",
        name:"一级矿工铲",
        getGold:0,
        upGold:100000,
        upTime:5*60
    },
    "2":{
        id:"1002",
        name:"二级矿工铲",
        getGold:50,
        upGold:500000,
        upTime:10*60// 秒
    },
    "3":{
        id:"1003",
        name:"三级矿工铲",
        getGold:100,
        upGold:1000000,
        upTime:15*60// 秒
    },
    "4":{
        id:"1004",
        name:"四级矿工铲",
        getGold:500,
        upGold:30000000,
        upTime:30*60// 秒
    },
    "5":{
        id:"1005",
        name:"五级矿工铲",
        getGold:1000,
        upGold:500000000,
        upTime:60*60// 秒
    },
    "6":{
        id:"1006",
        name:"六级矿工铲",
        getGold:5000,
        upGold:3000000000,
        upTime:120*60// 秒
    },
    "7":{
        id:"1007",
        name:"七级矿工铲",
        getGold:10000,
        upGold:8000000000,
        upTime:180*60// 秒
    },
    "8":{
        id:"1008",
        name:"八级矿工铲",
        getGold:30000,
        upGold:12000000000,
        upTime:240*60// 秒
    },
    "9":{
        id:"1009",
        name:"九级矿工铲",
        getGold:100000,
        upGold:50000000000,
        upTime:300*60// 秒
    },
    "10":{
        id:"1010",
        name:"十级矿工铲",
        getGold:300000,
        upGold:-1,
        upTime:-1// 秒
    },
}