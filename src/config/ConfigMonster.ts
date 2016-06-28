class ConfigMonsterManager{
    public static getConfig(_id,_type){
       return ConfigMonster[_id][_type];
    }
    public static getLength(){
        var i = 0;
        //var totalWeight = 0;
        for(var j in ConfigMonster){
            //totalWeight+=j["appearweight"];
            i++
        }
        return i;
    }
}

/*
    amazing     die
    evolution   levelupground
    rebirth     run
    sleeping    stand
    work

 */

var ConfigMonster = {
    1001:{
        name:"皮卡丘",
        dragonName_down:"pikaqiu",
        pos_down:new egret.Point(960,700),
        workTime:6*1000,// 单位是毫秒
        name2:"pikaqiu",
        appearweight:2,
        handbook:1,//主城等级
        handbookIdx:0,
        handbookIntro:"小志只有在停电的时候才会想起我",
        escapeRate:0.1,
        evolutionId:[2001],
        evolutionHomeLv:[3],
        evoAddGold:0
    },
    1002:{
        name:"波波鸟",
        dragonName_down:"boboniao",
        pos_down:new egret.Point(960+300,600),
        workTime:8*1000,
        name2:"boboniao",
        appearweight:0,
        handbook:100,
        handbookIdx:1,
        handbookIntro:"挥着翅膀的闹钟",
        escapeRate:0.2,
        evolutionId:-1,
        evolutionHomeLv:-1,
        evoAddGold:0
    },
    1003:{
        name:"小火龙",
        dragonName_down:"xiaohuolong",
        pos_down:new egret.Point(960+600,600),
        workTime:10*1000,
        name2:"xiaohuolong",
        appearweight:2,
        handbook:4,
        handbookIdx:2,
        handbookIntro:"我现在只玩火不玩球",
        escapeRate:0.2,
        evolutionId:[2003],
        evolutionHomeLv:[6],
        evoAddGold:0
    },
    1004:{
        name:"杰尼龟",
        dragonName_down:"jienigui",
        pos_down:new egret.Point(960-300,600),
        workTime:8*1000,
        name2:"jienigui",
        appearweight:2,
        handbook:3,
        handbookIdx:4,
        handbookIntro:"你看见我的四叶草了吗？",
        escapeRate:0.2,
        evolutionId:[2004],
        evolutionHomeLv:[5],
        evoAddGold:0
    },
    1005:{
        name:"妙蛙种子",
        dragonName_down:"miaowazhongzi",
        pos_down:new egret.Point(960-600,600),
        workTime:6*1000,
        name2:"miaowazhongzi",
        appearweight:2,
        handbook:2,
        handbookIdx:3,
        handbookIntro:"先生，种子要伐？",
        escapeRate:0.2,
        evolutionId:[2005],
        evolutionHomeLv:[4],
        evoAddGold:0
    },
    1006:{
        name:"小拳石",
        dragonName_down:"xiaoquanshi",
        pos_down:new egret.Point(960+150,800),
        workTime:10*1000,
        name2:"xiaoquanshi",
        appearweight:0,
        handbook:100,
        handbookIdx:5,
        handbookIntro:"准备好拆迁了吗！",
        escapeRate:0.2,
        evolutionId:-1,
        evolutionHomeLv:-1,
        evoAddGold:0
    },
    1499:{
        name:"顽皮蛋",
        dragonName_down:"wanpidan2",
        name2:"wanpidan",
        appearweight:0,
        handbook:0,
        handbookIdx:6,
        handbookIntro:"看着火会心情平静。*抓住后会有爆炸的极大危险",
        escapeRate:-2,
        evolutionId:-1,
        evolutionHomeLv:-1,
        evoAddGold:0
    },
    ///// 黑衣人列表
    1501:{
        name:"黑衣人专属",
        dragonName_down:"miaowazhongzi",
        pos_down:new egret.Point(960+150+200,800),
        workTime:6*1000,
        name2:"miaowazhongzi",
        appearweight:0,
        handbook:0,
        handbookIdx:7,
        handbookIntro:"研究青蛙+植物+父亲的这种奇妙组合",
        evolutionId:-1,
        evolutionHomeLv:-1,
        evoAddGold:0
    },

    /// 进化后的写在这里///////////////////////////
    2001:{
        name:"雷丘",
        dragonName_down:"leiqiu",
        pos_down:new egret.Point(960+150+200,600),
        workTime:6*1000,
        name2:"leiqiu",
        appearweight:0,
        handbook:-1001,
        handbookIdx:8,
        handbookIntro:"研究青蛙+植物+父亲的这种奇妙组合",
        evolutionId:-1,
        evolutionHomeLv:-1,
        evoAddGold:1200 // 进化后的金币收益
    },
    2003:{
        name:"火恐龙",
        dragonName_down:"huokonglong",
        pos_down:new egret.Point(960+600,600),
        workTime:10*1000,
        name2:"huokonglong",
        handbook:-1003,
        handbookIdx:9,
        handbookIntro:"我现在只玩火不玩球",
        evolutionId:-1,
        evolutionHomeLv:-1,
        evoAddGold:2000 
    },
    2004:{
        name:"卡咪龟",
        dragonName_down:"kamigui",
        pos_down:new egret.Point(960-300,600),
        workTime:8*1000,
        name2:"kamigui",
        handbook:-1004,
        handbookIdx:10,
        handbookIntro:"你看见我的四叶草了吗？",
        evolutionId:-1,
        evolutionHomeLv:-1,
        evoAddGold:1600
    },
    2005:{
        name:"妙蛙草",
        dragonName_down:"miaowacao",
        pos_down:new egret.Point(960-300,600),
        workTime:8*1000,
        name2:"miaowacao",
        handbook:-1005,
        handbookIdx:11,
        handbookIntro:"先生，种子要伐？",
        evolutionId:-1,
        evolutionHomeLv:-1,
        evoAddGold:1200
    },
}

