class ForgeUI extends eui.Component {
    private static g_instance;
    // private _gold:eui.BitmapLabel;
    // private _lv:eui.BitmapLabel;
    // private _lvIcon:eui.Image;
    private _scroll:eui.Scroller;
    private _group:eui.Group;
    private _close:eui.Image;
    private mainLayer:eui.Group;
    private forgeSingleArr;
    public static getInstance(){
        if(!this.g_instance){
            this.g_instance  = new ForgeUI();
        }
        return this.g_instance;
    }
    constructor() {
       super();
       this.skinName = "resource/skin/dzLayer.exml";
       this.touchEnabled = true;
       this.forgeSingleArr = [];
        this.initData();
        this.initOperation();
    }
    // protected createChildren() {
    //     super.createChildren();
    //     this.x = this.stage.stageWidth/2 - this.width/2;
    //     this.y = this.stage.stageHeight/2 - this.height/2;
    // }
    private initOperation(){
        this._close.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            // EffectUtils.playEffect(this._close,3,this.gg,this);
            EffectUtils.playEffect(this._close,3,this.remove,this);
        },this);
    }
    public gg(){
        EffectUtils.playEffect(this.mainLayer,3,this.remove,this);
    }
    private initData(){
        //
        // 加内容
        console.log("数量：："+MonsterManager.getInstance().getMonsterList().length);
        for(var i in MonsterManager.getInstance().getMonsterList()){
        // for(var i=0;i<=10;i++){
            console.log("iii::"+i);
            var aa = new ForgeSingleUI(parseInt(i));
            // var aa = new ForgeSingleUI(0);
            this._group.addChild(aa);
            aa.horizontalCenter = 0;
            aa.y = aa.height*parseInt(i);
            this.forgeSingleArr.push(aa);
        }
    }
    private remove(){
        this.parent.removeChild(this);
        ForgeUI.g_instance = null;
    }
    public updateAll(){
        for(var i in this.forgeSingleArr){
            this.forgeSingleArr[i].updateData();
        }
    }

}