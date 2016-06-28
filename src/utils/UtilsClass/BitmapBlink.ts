/**
 * Created by 有来有去 on 2014/11/5.
 */
class BitmapBlink extends egret.EventDispatcher {
    private _target:egret.Bitmap;
    private _time:number;
    private _currTime:number;
 
/*** @param target 目标位图
* @param time 闪啊闪的时间
* @isAuto 是否立即执行，默认是ture，也可以设置false，外部调用start方法
*/
    /**
     *  增加回调函数
     */
    private callBack:Function;
    private thisObj:any;
    private params:Array<any>;


    public constructor(target:egret.Bitmap,time:number,isAuto:boolean=true,callBack:Function,thisObj?: any,params?: Array<any>) {
        super();
        this._target = target;
        this._time = time;
        this.callBack = callBack;
        this.thisObj = thisObj;
        this.params = params;

        if(isAuto){
            this.start();
        }

    }
 
    public start():void {
        this._currTime = egret.getTimer();
        this._target.addEventListener(egret.Event.ENTER_FRAME,this.runDown,this);
    }
 
    private runDown(e:egret.Event):void{
        this._target.alpha -= 0.045;
        if(this.checkOver()){
            return;
        }
        if(this._target.alpha <= 0.6){
            this._target.removeEventListener(egret.Event.ENTER_FRAME,this.runDown,this);
            this._target.addEventListener(egret.Event.ENTER_FRAME,this.runUp,this);
        }
    }
 
    private runUp(e:egret.Event):void {
        this._target.alpha += 0.045;
        if(this.checkOver()){
            return;
        }
        if(this._target.alpha >= 1){
            this._target.removeEventListener(egret.Event.ENTER_FRAME,this.runUp,this);
            this._target.addEventListener(egret.Event.ENTER_FRAME,this.runDown,this);
        }
    }
 
    private checkOver():boolean {
        var nowTime:number = egret.getTimer();
        if(nowTime - this._currTime >= this._time){
            this.destroy();
            return true;
        }
        return false;
    }
 
    private destroy():void {
        this._target.alpha = 1;
        this._target.removeEventListener(egret.Event.ENTER_FRAME,this.runDown,this);
        this._target.removeEventListener(egret.Event.ENTER_FRAME,this.runUp,this);
 
        this.dispatchEventWith(egret.Event.COMPLETE,false,this._target);
 
        this._target = null;
        if(typeof this.callBack === "function"){
                if(!this.params){
                    this.callBack.call(this.thisObj);
                }else{
                    if(Utility.isArray(this.params)){
                        if(this.params.length == 1){
                            this.callBack.call(this.thisObj,this.params[0]);
                        }else if(this.params.length == 2){
                            this.callBack.call(this.thisObj,this.params[0],this.params[1]);
                        }else{
                            console.log("ERROR##############回调函数中暂时只设置了两个参数,请扩展");
                        }
                    }else{
                        // console.log("参数为数组格式");
                        this.callBack.call(this.thisObj,this.params);
                    }                  
                }
            }
    }
}