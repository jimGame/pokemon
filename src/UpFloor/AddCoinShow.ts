class AddCoinShow extends egret.DisplayObjectContainer
{
    private coinVal:egret.BitmapText[] = [];
    private coinEnable:boolean[] = [];
    private heightEnable:boolean[] = [];
    private coinAnim:SeqFrame[] = [];
    private coinValNum = 10;
    private gameScene:GameScene;

    private static g_instance:AddCoinShow;
    public static getInstance(){
        return AddCoinShow.g_instance;
    }

    public constructor(gameScene:GameScene)
    {
        super();
        this.gameScene = gameScene;
        AddCoinShow.g_instance = this;
        
        for(let i=0;i<this.coinValNum;++i)
        {
            //加金币的数字
            this.coinVal[i] = Utility.createBitmapText("num0_fnt");
            //this.coinVal.visible = false;
            this.addChild(this.coinVal[i]);
            this.coinEnable[i] = true;
            this.heightEnable[i] = true;

            this.coinAnim[i] = new SeqFrame("holeGold_png",0,6,6,1,36);
            this.addChild(this.coinAnim[i]);
        }
        // this.coinVal.x = 100;
        // this.coinVal.y = 100;

        // this.coinVal.text = "+1000";
        // this.coinVal.anchorOffsetX = this.coinVal.textWidth/2;
        // this.coinVal.anchorOffsetY = this.coinVal.textHeight/2;
        // this.coinVal.x = 0;
        // this.coinVal.y = -120;

        // let tw = egret.Tween.get(this.coinVal);
        // tw.to({y:-180},300).to({y:-140},50).to({y:-175},100).to({y:-140},50).to({y:-460,scaleX:0},200);
    }

    public showCoinVal(count:string):void
    {

        let fontHeight = 60;
        let enableIdx = -1;
        let enableHeightIdx = -1;
        //let disableCount = 0;
        for(let i=0;i<this.coinValNum;++i)
        {
            if(this.coinEnable[i]==true)
            {
            	enableIdx = i;
                break;
            }
        }

        for(let i=0;i<this.coinValNum;++i)
        {
            if(this.heightEnable[i]==true)
            {
                enableHeightIdx = i;
                break;
            }
        }

        if(enableIdx>=0)
        {
            SoundPlay.Instance.Play("SoundUp_coin2_mp3");
            this.heightEnable[enableHeightIdx] = false;
            this.coinEnable[enableIdx] = false;
            this.coinVal[enableIdx].text = "+" + count.toString();
            this.coinVal[enableIdx].anchorOffsetX = this.coinVal[enableIdx].textWidth/2;
            this.coinVal[enableIdx].anchorOffsetY = this.coinVal[enableIdx].textHeight/2;
            this.coinVal[enableIdx].x = 0;
            this.coinVal[enableIdx].y = -120-fontHeight*enableHeightIdx;

            this.coinVal[enableIdx].scaleX = this.coinVal[enableIdx].scaleY = 1;

            let tw = egret.Tween.get(this.coinVal[enableIdx]);
            tw.to({y:-280-fontHeight*enableHeightIdx},300).to({y:-200-fontHeight*enableHeightIdx},100).to({y:-260-fontHeight*enableHeightIdx},200).to({y:-200-fontHeight*enableHeightIdx},60).to({},80).call(function(i:number)
            {
                this.coinEnable[i] = true;
                this.heightEnable[i] = true;
            },this,[enableIdx]).to({y:-460-fontHeight*enableHeightIdx,scaleX:0},200);

            this.coinAnim[enableIdx].y = 0;
            this.coinAnim[enableIdx].scaleX = 1;
            let tw2 = egret.Tween.get(this.coinAnim[enableIdx]);
            tw2.to({y:-100},200).to({y:-50},200).to({y:-200,scaleX:0},200);
        }
        // this.coinVal.text = "+"+count.toString();
        // this.coinVal.anchorOffsetX = this.coinVal.textWidth/2;
        // this.coinVal.anchorOffsetY = this.coinVal.textHeight/2;
        // this.coinVal.x = 0;
        // this.coinVal.y = -120;
    }

    public update(deltaTime:number):void
    {
        for(let i=0;i<this.coinValNum;++i)
        {
            if(this.coinEnable[i]==false)
                this.coinAnim[i].update(deltaTime);
        }
    }
}