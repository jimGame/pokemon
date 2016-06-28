class BallPanelUI extends eui.Component
{
    private _showBtn:eui.Image;
    private _hideBtn:eui.Image;
    private _panel:eui.Image;
    private panelHeight:number;

    private _leftSwitch:eui.Image;
    private _rightSwitch:eui.Image;
    private _ballLv:eui.BitmapLabel;
    private _ballCost:eui.BitmapLabel;
    private _costType0:eui.Image;
    private _costType1:eui.Image;

    private screenH:number;

    private show:boolean;
    public constructor(screenH:number)
    {
        super();
        this.skinName = "resource/skin/BallPanel.exml";
        this.screenH = screenH;
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.addToStage,this);
    }
    private addToStage(event:egret.Event):void
    {

        this.anchorOffsetX = this.width/2;
        this.anchorOffsetY = this.height;
        this.panelHeight = this._panel.height;
        this.y = this.screenH;//+this._panel.height;

        this._showBtn.visible = false;
        this._hideBtn.visible = true;
        this.show = true;

        this._rightSwitch.anchorOffsetX = this._rightSwitch.width/2;
        this._rightSwitch.scaleX = -1;

        this._showBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            this._showBtn.visible = false;
            this._hideBtn.visible = true;
            this.show = true;
        },this);
        this._hideBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            this._showBtn.visible = true;
            this._hideBtn.visible = false;
            this.show = false;
        },this);

        this._ballLv.text = "L"+(PokeBall.curBallLv+1);
        let tempCost = PokeBall.cost[PokeBall.curBallLv];
        this._ballCost.text = (tempCost>10000?tempCost-10000:tempCost).toString();
        this._ballCost.anchorOffsetX = this._ballCost.textWidth/2;
        this._ballCost.x = 180;
        this._costType0.visible = tempCost<10000;
        this._costType1.visible = tempCost>10000;

        this._leftSwitch.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            PokeBall.curBallLv = (PokeBall.curBallLv+PokeBall.ballMaxLv-1)%PokeBall.ballMaxLv;
            this._ballLv.text = "L"+(PokeBall.curBallLv+1);

            let tempCost = PokeBall.cost[PokeBall.curBallLv];
            this._ballCost.text = (tempCost>10000?tempCost-10000:tempCost).toString();
            this._ballCost.anchorOffsetX = this._ballCost.textWidth/2;

            this._costType0.visible = tempCost<10000;
            this._costType1.visible = tempCost>10000;

        },this);
        this._rightSwitch.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            PokeBall.curBallLv = (PokeBall.curBallLv+1)%PokeBall.ballMaxLv;
            this._ballLv.text = "L"+(PokeBall.curBallLv+1);

            let tempCost = PokeBall.cost[PokeBall.curBallLv];
            this._ballCost.text = (tempCost>10000?tempCost-10000:tempCost).toString();
            this._ballCost.anchorOffsetX = this._ballCost.textWidth/2;

            this._costType0.visible = tempCost<10000;
            this._costType1.visible = tempCost>10000;
        },this);
    }

    protected createChildren() 
    {
        super.createChildren();
        this.initData();
    }
    private initData()
    {

    }

    public update(deltaTime:number):void
    {
        if(this.show)
        {
            if(this.y>this.screenH)
            {
                this.y-=deltaTime*800;
                if(this.y<this.screenH)
                    this.y = this.screenH;
            }
        }
        else
        {
            if(this.y<this.screenH+this.panelHeight)
            {
                this.y+=deltaTime*800;
                if(this.y>this.screenH+this.panelHeight)
                    this.y = this.screenH+this.panelHeight;    
            }
        }
    }
}