class PipelineBack extends MyDisplayContainer
{
    private pipeline:egret.Bitmap;//下水道背后
    public constructor(holePosX:number,holePosY:number,stageH:number)
    {
        super();
        this.pipeline = Utility.createBitmapByName("0022_png");
        this.pipeline.anchorOffsetX = this.pipeline.width/2;
        this.pipeline.anchorOffsetY = 0;
        this.pipeline.scaleX = 0.5;
        this.pipeline.scaleY = 0.5;
        
        this.pipeline.x = holePosX;
        this.pipeline.y = stageH-holePosY-120;

        this.addChild(this.pipeline);
        this.z = stageH-1;
    }
}