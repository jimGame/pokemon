class msgTipUI extends eui.Component
{
    private _info:eui.Label;
    public constructor(data:string)
    {
        super();
        this.skinName = "resource/skin/msgTip.exml";
        this._info.text = data;
        this.touchEnabled = false;
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.addtoStage,this);
    }
    private addtoStage(data)
    {
        //this.anchorOffsetY = this.height;
        this.x = this.stage.stageWidth;
        this.y = this.stage.stageHeight-420;
        // this.x = this.width;
        // this.y = this.stage.stageHeight-this.height-10;
        
        egret.Tween.get(this).to({x:this.stage.stageWidth-this.width},200).wait(1600).to({x:this.stage.stageWidth},200).call(this.remove);
        //Tween.get(this).to({})
        
    }

    private remove(){
        this.parent.removeChild(this);
    } 
}