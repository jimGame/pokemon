/**
 * ConinFrame
 */
class CoinFrame extends egret.Sprite {
    public _obj;
    public _timer;
    private _curIndex;
    private updateType;
    constructor(_type=0) {
        
        super();
        this.updateType = _type;
        // this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.init();
        this.createTimer();
    }
    private createTimer(){
        if(this.updateType == 0){
            this._timer = new egret.Timer(1000/12,0);
        }else{
            this._timer = new egret.Timer(1000/6,0);
        }
        
        this._timer.addEventListener(egret.TimerEvent.TIMER,this.timerCallback,this);
    }
    private timerCallback(){
        this._curIndex++;
        Utility.updateBitmapTexture(this._obj,this._curIndex.toString());
        if(this._curIndex == 34){
            if(this.updateType == 0){
                this._timer.stop();
                this._obj.visible = false;
            }else{
                this._curIndex = 29;
            }
            
        }
    }
    private init(){
        this._obj = Utility.createBitmapByName("29");
        this.addChild(this._obj);
        this._obj.visible = false;
    }
    public update(initPosY=0){
        this._obj.visible = true;
        this._curIndex = 29;
        Utility.updateBitmapTexture(this._obj,this._curIndex.toString());
        this._timer.start();
        if(this.updateType == 0){
            this.y = initPosY;
            egret.Tween.get(this).to({y:this.y-50},1000/12*6,egret.Ease.bounceOut);
        }
        
    }
}