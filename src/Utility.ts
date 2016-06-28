
class Utility
{
    public static createBitmapByName(name: string): egret.Bitmap
    {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    public static createImageByName(name:string):eui.Image{
        let result = new eui.Image();
        let texture: egret.Texture = RES.getRes(name);
        result.source = texture;
        return result;
    }
    public static createBitmapText(name:string):egret.BitmapText{
        var result = new egret.BitmapText();
        result.font = RES.getRes(name);
        return result;
    }
    //
    public static updateBitmapTexture(obj:egret.Bitmap,name){
        obj.texture = RES.getRes(name); 
    }
    public static updateImageTexture(obj:eui.Image,name){
        obj.source = RES.getRes(name);
    }
    // 根据等级计算挖矿的金币数
    public static getGold(lv){
        var sum = 0;
        if(lv == 1){
            return 10;
        }else{
            sum = Utility.getGold(lv-1) + lv*2
        }
        return sum;
    }
    // 根据工具等级计算挖矿的金币数
    public static getGoldByShovel(lv){
        return ConfigShovelManager.getConfig(lv.toString(),"getGold");
    }
    // 根据等级计算升级需要的经验值
    public static getMaxExp(lv){
        var sum = 0;
        if(lv == 1 ){
            return 100;
        }else{
            sum = Utility.getMaxExp(lv-1)+20+(lv-1)*200;
        }
        return sum;
    } 
    // 计算进度条的值
    public static getProgress(val1,val2){
        return parseFloat((val1/val2*100).toFixed(2));
    } 
    public static Random(min:number,max:number,isInt:boolean = false):number
    {
        let retval = Math.random()*(max-min)+min; 
        return (isInt?Math.floor(retval):retval);
    }
    public static randRange(min:number,max:number){
        return Math.floor(Math.random()*(max-min+1))+min;
    }
    /**
     * 140 260 400 560 740
     *    120 140 160 180
     * 1 2 4 7 11 16
     *  1 2 3 4 5
     *  (N²-N+2)/2
     * 
     *  1 = 140
     *  2 = 140 + 120
     *  3 = 140 + 120 + 140
     *  
     *  140 + 
     *  120+(i)*20
     *  f(n) = f(n-1) + 
     */
    // 根据等级计算捕获到的精灵经验值
    public static getExpBylv(lv){
        var sum = 0;
        if(lv == 1){
            return 200;
        }else{
            sum = Utility.getExpBylv(lv-1)+40+100*(lv-1)+10*(lv-1)*(lv-1-1);
        }
        return sum;
    }
    // 根据成就等级计算目标值
    public static getTotalGoldByIndex(index){
        // console.log("成就等级:"+index);
        // 次数*次数*10的（次数/3+2）次幂
        return  Math.floor(index*index*Math.pow(10,index/3+2));
        // return 100;
    }
    public static getExpByCityLv(lv:number):number
    {
        var sum = 0;
        if(lv == 1){
            return 10000;
        }else{
            sum = Utility.getExpByCityLv(lv-1) + (2000 + 200 * (lv))*Math.pow(3,lv);
        }
        return sum;
    }

    public static getExpByHomelv(){
        return Utility.getExpBylv(PlayerManager.getInstance().getConfig("homeLv"));
    }

    // 创建骨骼动画
    public static createDragon(_name:string,boneName:string="Armature"){
        // var dragonbonesData = RES.getRes( _name+"DB_json");
        // var texturedata = RES.getRes(_name+"Tex_json");
        // var texture = RES.getRes(_name+"_png");
        let dragonbonesData = RES.getRes("monster_"+_name + "DB_json");
        let texturedata = RES.getRes("monster_"+_name + "_json");
        let texture = RES.getRes("monster_" + _name + "_png");
        var dragonbonesFactory = new dragonBones.EgretFactory();
        dragonbonesFactory.addDragonBonesData(dragonBones.DataParser.parseDragonBonesData(dragonbonesData));
        dragonbonesFactory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, texturedata));
        var armature = dragonbonesFactory.buildArmature(boneName);
        // this.addChild(this.armature.display);
        
        var slowClock:dragonBones.WorldClock = new dragonBones.WorldClock();
        slowClock.add(armature);
        egret.Ticker.getInstance().register(function (advancedTime) {
            slowClock.advanceTime(advancedTime / 1000);
        }, this);
        return armature;
    }
    public static isArray (v){
        return toString.apply(v) === '[object Array]';
    }
    public static numToString(num){
        // var _num = 1000;
        var reArr = [];
        var re = "";
        var str = "";
        if(typeof num == "string"){
            str = num;
        }else{
            str = num.toString();
        }  
        if(str.length<3){
            re =  str;
        }else{
            while (str.length>3) {
                reArr.unshift(","+str.substring(str.length-3,str.length));
                str = str.substring(0,str.length-3);
            }
            reArr.unshift(str);
            for(var i in reArr){
                re = re + reArr[i];
            }
        }
        return re;
    }
    public static numToString_font(num){
        var str = num.toString();
        var mstr = "";
        var dstr = "";
        // if(str.length)
        if(str.length>4 && str.length<=8){// 万
            dstr = "e";
            mstr = str.substring(0,str.length-4);
            
        }else if(str.length>8 && str.length <= 12){ // 亿
            dstr = "f";
            mstr = str.substring(0,str.length-8);
        }else{
            mstr = str;
        }
        return Utility.numToString(mstr)+dstr;
    }
    // 亿
    // 1111 11,11  0,000
    public static numToString_1(num){
        var str = num.toString();
        var mstr = "";
        var dstr = "";
        // if(str.length)
        if(str.length>4 && str.length<=8){// 万
            dstr = "万";
            mstr = str.substring(0,str.length-4);
            
        }
        else if(str.length>8 && str.length <= 12){ // 亿
            dstr = "亿";
            mstr = str.substring(0,str.length-8);
        }else if(str.length>12 && str.length<=16){ //兆
            dstr = "兆";
            mstr = str.substring(0,str.length-12);
        }else if(str.length>16 && str.length<=20){ //京
            dstr = "京";
            mstr = str.substring(0,str.length-16);
        }else if(str.length>20 && str.length<=24){ //垓
            dstr = "垓";
            mstr = str.substring(0,str.length-20);
        }else if(str.length>24 && str.length<=28){ //秭
            dstr = "秭";
            mstr = str.substring(0,str.length-24);
        }else if(str.length>28 && str.length<=32){ //穰
            dstr = "穰";
            mstr = str.substring(0,str.length-28);
        }else if(str.length>32 && str.length<=36){ //沟
            dstr = "沟";
            mstr = str.substring(0,str.length-32);
        }else if(str.length>36 && str.length<=40){ //涧
            dstr = "涧";
            mstr = str.substring(0,str.length-36);
        }else if(str.length>40 && str.length<=44){ //正
            dstr = "正";
            mstr = str.substring(0,str.length-40);
        }else if(str.length>44 && str.length<=48){ //载
            dstr = "载";
            mstr = str.substring(0,str.length-44);
        }else{
            mstr = str;
        }
        return Utility.numToString(mstr)+dstr;
    }
    // 秒数转为时间
    public static MillisecondToDate(msd) {
        var g_parseInt = function(num) {
            if(typeof num == "string"){
                // var v = parseInt(num);
                return parseInt(num);
            }else{
                return parseInt(num.toString());
            }
        }

        var g_parseFloat = function(num) {
            if(typeof num == "string"){
                return parseFloat(num);
            }else{
                return parseFloat(num.toString());
            }
        }
        var g_numToString = function(num){
            var str = "";
            if(typeof num == "string"){
                str = num;
            }else{
                str = num.toString();
            }
            if(str.length == 1){
                return "0"+str;
            }else{
                return str;
            }
        }


        var time = Math.floor(msd) ;
        var str = "";
        if (time > 60 && time < 60 * 60) {
            var min_z =   parseInt((time / 60.0).toString());  
            var min_f =   parseFloat((time/60.0).toString());
            var c = (min_f-min_z)*60;
            var sec =  parseInt(c.toString())
            str = g_numToString(min_z) + ":" +g_numToString(sec);

            // str = Math.floor(time / 60.0) + "分钟" + Math.floor((Math.floor(time / 60.0) -Math.floor(time / 60.0)) * 60) + "秒";
        }
        else if (time >= 60 * 60 && time < 60 * 60 * 24) {
            str = g_numToString(g_parseInt(time / 3600.0)) + ":" + 
                  g_numToString(g_parseInt((g_parseFloat(time / 3600.0) - g_parseInt(time / 3600.0)) * 60)) + ":" +
                g_numToString(g_parseInt((g_parseFloat((g_parseFloat(time / 3600.0) - g_parseInt(time / 3600.0)) * 60) - g_parseInt((g_parseFloat(time / 3600.0) - g_parseInt(time / 3600.0)) * 60)) * 60));
        }
        else {
            str = g_parseInt(time) + "秒";
        }
        return str;
    }
    // 根据时间计算砖石数量
    public static getDiamonByTime(time){
        // 5*60 300 ???? 10钻
        return Math.ceil(time / 300) * 10
    }
    // 输出一个一维数组
    public static printArr(arr){
        for(var i in arr){
            if(Utility.isArray(arr[i])){
                console.log("array["+i+"]=>");
                Utility.printArr(arr[i]);
            }else{
                console.log("array["+i+"]=>"+arr[i]);
            }
        }
    }
}