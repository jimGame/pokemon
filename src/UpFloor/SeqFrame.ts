
class SeqFrame extends egret.DisplayObjectContainer
{
    private originalImg:egret.Bitmap;
    private targetImg:egret.Bitmap;

    private renderer:egret.RenderTexture;
    private frameInterval:number;

    private col:number;//列数
    private row:number;//行数
    private frameW:number;//帧宽度
    private frameH:number;//帧高度
    private frameStartIdx:number;
    private frameNum:number;//动画帧数量

    private curFrameIdx:number;
    private playTimes:number;
    // 0,6,6,1,36
    public constructor(name:string,frameStartIdx:number,frameNum:number,col:number,row:number,fps:number,times:number = -1)
    {
        super();
        this.playTimes = times;

        this.frameStartIdx = frameStartIdx;
        this.frameNum = frameNum;

        this.frameInterval = 1/fps;
        this.originalImg = Utility.createBitmapByName(name);

        this.col = col;
        this.row = row;

        this.frameW = this.originalImg.width/this.col;
        this.frameH = this.originalImg.height/this.row;

        this.anchorOffsetX = this.frameW/2;
        this.anchorOffsetY = this.frameH;
        
        this.renderer = new egret.RenderTexture();
        this.targetImg = new egret.Bitmap();
        
        this.addChild(this.targetImg);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        //
        
    }

    public reset(times:number)
    {
        this.playTimes = times;
        this.curFrameIdx = this.frameStartIdx;
    }

    private onAddToStage(event: egret.Event)
    {
        //this.addEventListener(egret.Event.ENTER_FRAME, this.update, this);

        // this.renderer.drawToTexture(this.originalImg,new egret.Rectangle(0,0,100,100),1);
        // this.targetImg.texture = this.renderer;
        this.curFrameIdx = this.frameStartIdx;
        this.animTimer = 0;
        // this.originalImg.addEventListener(egret.Event.ENTER_FRAME,this.update,this);
    }

    private animTimer:number;
    public update(deltaTime : number):void
    {  
        if(this.animTimer<=0)
        {
            if(this.curFrameIdx==this.frameStartIdx)
            {
                if(this.playTimes==0)
                    return;
                else if(this.playTimes>0)
                    this.playTimes--;
            }
            let frameCol = Math.floor(this.curFrameIdx%this.col);
            let frameRow = Math.floor(this.curFrameIdx/this.col);
            this.renderer.drawToTexture(this.originalImg,new egret.Rectangle(frameCol*this.frameW,frameRow*this.frameH,this.frameW,this.frameH),1);
            this.targetImg.texture = this.renderer;

            this.curFrameIdx = (this.curFrameIdx+1)%this.frameNum+this.frameStartIdx;
            this.animTimer = this.frameInterval;
        }
        else
        {
            this.animTimer-=deltaTime;
        }
    }
}