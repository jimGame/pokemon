
enum HandbookState
{
    ZZZ,
    List,
    Detail,
}

class PokeHandbook extends egret.DisplayObjectContainer
{
    //private static g_instance:PokeHandbook;

    private bookScreen:egret.Bitmap;//图鉴的屏幕
    private bookFrame:egret.Bitmap;//图鉴的外壳

    private itemNum:number;//横条的数量

    private itemInfo:egret.Bitmap[] = [];//横条
    private itemText:egret.TextField[] = [];//横条上的文字
    private itemHeight:number;//横条的高度
    private lineSpace:number;//横条的间隔

    private displayDataRect:egret.DisplayObjectContainer;
    private monsterIdx:number[] = [];//要显示在图鉴中的怪物

    private screenOffsetY:number;//屏幕偏移
    private screenStartY:number;
    private screenHeight:number;

    private zzzBack:egret.Shape;
    private zzzBase:egret.Bitmap;
    private zzz0:egret.Texture;
    private zzz1:egret.Texture;
    private zzzTimer:number;
    private curZzzImg:number;
    private zzzShow:boolean;
    private hasMon:boolean;

    private detailNo:egret.TextField;
    private detailName:egret.TextField;
    private detailIntro:egret.TextField;
    private detailListBtn:egret.Bitmap;

    private leftBtn:egret.Bitmap;//左按钮
    private leftBtnPressed:egret.Texture;
    private leftBtnNormal:egret.Texture; 

    private rightBtn:egret.Bitmap;
    private rightBtnPressed:egret.Texture;
    private rightBtnNormal:egret.Texture; 
    ///关闭按钮
    private closeBtn:egret.Bitmap;
    private closeBtnPressed:egret.Texture;
    private closeBtnNormal:egret.Texture; 

    private handbookState:HandbookState;

    private zzzTargetState:HandbookState;
    private background:egret.Bitmap;

    public ChangeState(handbookState:HandbookState):void
    {
        this.handbookState = handbookState;
        switch(this.handbookState)
        {
        case HandbookState.ZZZ:
            this.zzzTotalTime = 0;
            this.showDetail(1001,false);
            this.displayDataRect.visible = false;
            this.showZZZ(true);
            break;
        case HandbookState.List:
            this.showDetail(1001,false);
            this.showZZZ(false);
            this.displayDataRect.visible = true;
            break;
        case HandbookState.Detail:
            this.showZZZ(false);
            this.displayDataRect.visible = false;
            this.showDetail(this.monsterIdx[this.curDetailIdx],true);
            break;
        }
    }

    public constructor(callback:Function,callbackObj:any)
    {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.onRemoveFromStage,this);    
    }
    
    private onRemoveFromStage(event:egret.Event)
    {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE,this.onRemoveFromStage,this);

        this.bookScreen.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.touchHandler,this);
        this.bookScreen.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchHandler,this);
        this.bookScreen.removeEventListener(egret.TouchEvent.TOUCH_END,this.touchHandler,this);
        this.bookScreen.removeEventListener(egret.TouchEvent.TOUCH_CANCEL,this.touchHandler,this);
    }

    private onAddToStage(event: egret.Event)
    {
        this.hasMon = this.initData();

        this.addEventListener(egret.Event.ENTER_FRAME, this.update, this);

        this.background = new egret.Bitmap();
        this.addChild(this.background);
        this.background.touchEnabled = true;
        this.background.width = this.stage.stageWidth*2;
        this.background.height = this.stage.stageHeight*2;
        // this.background.graphics.beginFill(0x00ffffff);
        // this.background.graphics.drawRect(0,0,this.background.width,this.background.height);
        // this.background.graphics.endFill();
        this.background.anchorOffsetX = this.background.width/2;
        this.background.anchorOffsetY = this.background.height/2;
         


/////////////// 背景 //////////////////////////
        this.screenOffsetY = -60;
        this.bookScreen = Utility.createBitmapByName("Handbook_43_png");
        this.bookScreen.touchEnabled = true;
        this.bookScreen.y = this.screenOffsetY;
        this.bookScreen.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.touchHandler,this);
        this.bookScreen.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchHandler,this);
        this.bookScreen.addEventListener(egret.TouchEvent.TOUCH_END,this.touchHandler,this);
        this.bookScreen.addEventListener(egret.TouchEvent.TOUCH_CANCEL,this.touchHandler,this);

        this.addChild(this.bookScreen);
        
        this.bookScreen.anchorOffsetX = this.bookScreen.width/2;
        this.bookScreen.anchorOffsetY = this.bookScreen.height/2;
        this.bookScreen.scaleY = 20;
        this.bookScreen.scaleX = 1.2;
///////////////////////////////////////////////////

/////////////////// TEST //////////////////////
        // for(let i=0;i<3;++i)
        // {
        //     this.monsterIdx.push(1010+i);
        // }
///////////////////////////////////////////////

//////////////////// List /////////////////////////////////
        this.lineSpace = 10;
        this.itemNum = 8;
        this.itemHeight = 74;
        this.itemTotalHeight = this.itemHeight*this.itemNum+this.lineSpace*(this.itemNum-1)-this.itemHeight;

        this.screenStartY = -300;
        this.screenHeight = 472;//472;        //74*6+7*4
        this.displayDataRect = new egret.DisplayObjectContainer;
        this.addChild(this.displayDataRect);
        this.displayDataRect.width = 0;
        this.displayDataRect.height = Math.max(0,this.itemHeight*this.monsterIdx.length+this.lineSpace*(this.monsterIdx.length-1));
        this.displayDataRect.anchorOffsetX = 0;
        this.displayDataRect.anchorOffsetY = 0;
        this.displayDataRect.y = this.screenStartY;//屏幕上边缘
        this.displayDataRect.visible = false;

        this.curFirstInfoIdx = 0;
        for(let i=0;i<this.itemNum;++i)
        {
            this.itemInfo[i] = Utility.createBitmapByName("Handbook_47_png");
            this.displayDataRect.addChild(this.itemInfo[i]);
            this.itemInfo[i].anchorOffsetX = this.itemInfo[i].width/2;
            this.itemInfo[i].anchorOffsetY = this.itemInfo[i].height/2;
            this.itemInfo[i].y = this.itemHeight/2+i*(this.itemHeight+this.lineSpace);//- this.itemTotalHeight/2+(this.lineSpace+this.itemHeight)*i+this.screenOffsetY;
            this.itemInfo[i].visible = (i<this.monsterIdx.length);

            this.itemText[i] = new egret.TextField();
            this.displayDataRect.addChild(this.itemText[i]);
            this.setItemData(i,i);
            this.itemText[i].anchorOffsetX = this.itemText[i].width/2;
            this.itemText[i].anchorOffsetY = this.itemText[i].height/2;
            this.itemText[i].y = this.itemInfo[i].y;
            this.itemText[i].visible = (i<this.monsterIdx.length);
        }
///////////////////////////////////////////////////////////


        this.zzzTargetState = null;
/////////////////// 详细信息 //////////////////////
        this.armature = null;
        this.detailNo = new egret.TextField();
        this.addChild(this.detailNo);
        this.detailNo.x = 20;
        this.detailNo.y = -80;

        this.detailName = new egret.TextField();
        this.addChild(this.detailName);
        this.detailName.x = 20;
        this.detailName.y = -40;

        this.detailIntro = new egret.TextField();
        this.addChild(this.detailIntro);
        this.detailIntro.width = 360;
        this.detailIntro.x = -180;
        this.detailIntro.y = 30;

        //切换到列表的按钮
        this.detailListBtn = Utility.createBitmapByName("Handbook_46_png");
        this.addChild(this.detailListBtn);
        this.detailListBtn.anchorOffsetX = this.detailListBtn.width;
        this.detailListBtn.x = 200;
        this.detailListBtn.y = -300;
        this.detailListBtn.touchEnabled = true;
        this.detailListBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{this.zzzTargetState = HandbookState.List; this.ChangeState(HandbookState.ZZZ);},this);
        this.curDetailIdx = 0;
        //this.showDetail(this.monsterIdx[this.curDetailIdx],true);
///////////////////////////////////////////////////

////////// 滋滋滋马赛克 ///////////////////
        this.zzzBack = new egret.Shape();
        this.addChild(this.zzzBack);
        this.zzzBack.width = 600;
        this.zzzBack.height = 700;
        this.zzzBack.anchorOffsetX = this.zzzBack.width/2;
        this.zzzBack.anchorOffsetY = this.zzzBack.height/2;
        this.zzzBack.graphics.beginFill(0x8b918f);
        this.zzzBack.graphics.drawRect(0,0,this.zzzBack.width,this.zzzBack.height);
        this.zzzBack.graphics.endFill();

        this.zzz1 = RES.getRes("Handbook_0008_png");
        this.zzzBase = Utility.createBitmapByName("Handbook_0007_png");
        this.curZzzImg = 0;
        this.zzz0 = this.zzzBase.texture;
        this.addChild(this.zzzBase);
        this.zzzBase.anchorOffsetX = this.zzzBase.width/2;
        this.zzzBase.anchorOffsetY = this.zzzBase.height/2;
        this.zzzBase.scaleY = 1.36;
        this.zzzBase.y = this.screenOffsetY;
        this.showZZZ(true);

////////////////////////////////////////////////

////////////////// 外框 //////////////////////////////

        this.curFirstItemIdx = 0;
        this.bookFrame = Utility.createBitmapByName("Handbook_42_png");
        this.addChild(this.bookFrame);
        this.bookFrame.anchorOffsetX = this.bookFrame.width/2;
        this.bookFrame.anchorOffsetY = this.bookFrame.height/2;
        this.bookFrame.scaleX = 1.5;
        this.bookFrame.scaleY = 1.5;

////////////////////////////////////////////////

        this.closeBtn = Utility.createBitmapByName("Handbook_53_png");
        this.addChild(this.closeBtn);
        this.closeBtn.touchEnabled = true;

        this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.closeHandler,this);
        this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_END,this.closeHandler,this);
        this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_CANCEL,this.closeHandler,this);

        this.closeBtn.anchorOffsetX = this.closeBtn.width/2;
        this.closeBtn.anchorOffsetY = this.closeBtn.height/2;
        this.closeBtn.y = 420;
        this.closeBtnNormal = this.closeBtn.texture;
        this.closeBtnPressed = RES.getRes("Handbook_54_png");

//////////////// LEFT ///////////////////
        this.leftBtn = Utility.createBitmapByName("Handbook_49_png");
        this.addChild(this.leftBtn);
        this.leftBtn.touchEnabled = true;

        this.leftBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.leftHandler,this);
        this.leftBtn.addEventListener(egret.TouchEvent.TOUCH_END,this.leftHandler,this);
        this.leftBtn.addEventListener(egret.TouchEvent.TOUCH_CANCEL,this.leftHandler,this);

        this.leftBtn.anchorOffsetX = this.leftBtn.width/2;
        this.leftBtn.anchorOffsetY = this.leftBtn.height/2;
        this.leftBtn.y = 420;
        this.leftBtn.x = -140;
        this.leftBtnNormal = this.leftBtn.texture;
        this.leftBtnPressed = RES.getRes("Handbook_50_png");

////////////////// RIGHT ///////////////////////
        this.rightBtn = Utility.createBitmapByName("Handbook_51_png");
        this.addChild(this.rightBtn);
        this.rightBtn.touchEnabled = true;

        this.rightBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.rightHandler,this);
        this.rightBtn.addEventListener(egret.TouchEvent.TOUCH_END,this.rightHandler,this);
        this.rightBtn.addEventListener(egret.TouchEvent.TOUCH_CANCEL,this.rightHandler,this);

        this.rightBtn.anchorOffsetX = this.rightBtn.width/2;
        this.rightBtn.anchorOffsetY = this.rightBtn.height/2;
        this.rightBtn.y = 420;
        this.rightBtn.x = 140;
        this.rightBtnNormal = this.rightBtn.texture;
        this.rightBtnPressed = RES.getRes("Handbook_52_png");

//////////////////////////////////////////////////////////



        this.referTime = 0;

        this.scaleX = 0.7;
        this.scaleY = 0.7;

        this.x = this.stage.stageWidth/2;
        this.y = this.stage.stageHeight*3/2;
        if(this.hasMon)
        {
            let tw = egret.Tween.get(this);
            //this.showDetail(this.monsterIdx[this.curDetailIdx],true);
            tw.to({y:this.stage.stageHeight/2},200).to({},200).to({scaleX:0.9,scaleY:0.9},160).call(this.ChangeState,this,[HandbookState.Detail]);
        }
        else
        {
            let tw = egret.Tween.get(this);
            tw.to({y:this.stage.stageHeight/2},200);
        }

        this.ChangeState(HandbookState.ZZZ);
    }

    private curDetailIdx:number;
    private detailWords:string;
    private detailShowWordInterval:number;
    private stateTimer:number;
    private detailCatch:boolean;
    private showDetail(id:number,isShow:boolean):void
    {
        if(isShow)
        {
            this.detailShowWordInterval = 0.2;
            this.stateTimer = 0;
            let black = id<10000;
            this.detailCatch = !black;
            id = id>10000?id-10000:id;
            this.setMonAnim(id);
            this.detailNo.text = "No. "+id;
            this.detailNo.anchorOffsetX = 0;
            this.detailNo.anchorOffsetY = this.detailNo.height/2;

            this.detailName.text = black?"???":ConfigMonsterManager.getConfig(id,"name");
            this.detailName.anchorOffsetX = 0;
            this.detailName.anchorOffsetY = this.detailNo.height/2;

            this.detailWords = ConfigMonsterManager.getConfig(id%1000+1000,"handbookIntro");
            this.detailIntro.text = black?"??????????????":"";


            if(this.armature!=null)
                this.armature.display.visible = true;
            this.detailIntro.visible = true;
            this.detailListBtn.visible = true;
            this.detailName.visible = true;
            this.detailNo.visible = true;
        }
        else
        {
            if(this.armature!=null)
                this.armature.display.visible = false;
            this.detailIntro.visible = false;
            this.detailListBtn.visible = false;
            this.detailName.visible = false;
            this.detailNo.visible = false;
        }
    }

    private updateWords(deltaTime:number):void
    {
        if(!this.detailCatch) return;
        this.stateTimer+=deltaTime;
        if(this.stateTimer>=this.detailShowWordInterval)
        {
            if(this.detailIntro.text.length<this.detailWords.length)
            {
                this.stateTimer = 0;
                this.detailIntro.text += this.detailWords[this.detailIntro.text.length];
            }
        }
    }


    private armature:dragonBones.Armature;
    private setMonAnim(id:number):void
    {
        let animIdx = this.numChildren;
        if(this.armature!=null)
        {
            animIdx = this.getChildIndex(this.armature.display);
            this.removeChildAt(animIdx);
        }
        let monsterName = ConfigMonsterManager.getConfig(id,"name2");
        let dragonbonesData = RES.getRes("monster_"+monsterName + "DB_json");
        let texturedata = RES.getRes("monster_"+monsterName + "_json");
        let texture = RES.getRes("monster_"+monsterName + "_png");

        let dragonbonesFactory = new dragonBones.EgretFactory();
        dragonbonesFactory.addDragonBonesData(dragonBones.DataParser.parseDragonBonesData(dragonbonesData));
        dragonbonesFactory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, texturedata));

        this.armature = dragonbonesFactory.buildArmature("Armature");
        this.armature.animation.gotoAndPlay("tujian");
        this.armature.display.x = -100;
        this.addChildAt(this.armature.display,animIdx);

        if(!this.detailCatch)
        {
                //纯黑色
            let colorMat = [
                0,0,0,0,1,
                0,0,0,0,1,
                0,0,0,0,1,
                0,0,0,1,0,
            ]
            let colorFilter = new egret.ColorMatrixFilter(colorMat);
            this.armature.display.filters = [colorFilter];
        }
    }

    private close():void
    {
        this.zzzTargetState = null;
        if(this.hasMon)
        {
            let tw = egret.Tween.get(this);
            tw.call(this.ChangeState,this,[HandbookState.ZZZ]).to({scaleX:0.7,scaleY:0.7},200).to({y:this.stage.stageHeight*3/2},200).call(this.Destroy);//FloorUI.getInstance().tujianClose);
        }
        else
        {
            let tw = egret.Tween.get(this);
            tw.to({y:this.stage.stageHeight*3/2},200).call(this.Destroy);//FloorUI.getInstance().tujianClose);
        }
    }

    private Destroy():void
    {
        this.parent.removeChild(this);
    }

    private showZZZ(show:boolean):void
    {
        if(show)
        {
            this.zzzTimer = 0.03;
            this.zzzShow = true;
            this.zzzBack.visible = true;
            this.zzzBase.visible = true;
        }
        else 
        {
            this.zzzShow = false;
            this.zzzBack.visible = false;
            this.zzzBase.visible = false;
        }
    }

    private referTime: number;
    private zzzTotalTime:number;
    private update(): void
    {
        let temp: number = egret.getTimer();
        let deltaTime: number = Math.min(0.1,(temp - this.referTime) / 1000);
        this.referTime = temp;
        
        switch (this.handbookState) {
            case HandbookState.ZZZ:
                this.updateZZZ(deltaTime);
                if(this.zzzTargetState!=null)
                {
                    this.zzzTotalTime+=deltaTime;
                    if(this.zzzTotalTime>0.2)
                    {
                        this.ChangeState(this.zzzTargetState);
                        this.zzzTargetState = null;
                    }
                }
                break;
            case HandbookState.Detail:
                this.updateWords(deltaTime);
                if(this.armature!=null && this.detailCatch)
                    this.armature.advanceTime(deltaTime);
                break;
            case HandbookState.List:
                break;
            default:
                break;
        }

    }

    private updateZZZ(deltaTime:number):void
    {
        if(this.zzzShow)
        {
            this.zzzTimer-=deltaTime;
            if(this.zzzTimer<0)
            {
                if(this.curZzzImg==0)
                {
                    this.curZzzImg=1;
                    this.zzzBase.texture = this.zzz1;
                }
                else 
                {
                    this.curZzzImg = 0;
                    this.zzzBase.texture = this.zzz0;
                }
                this.zzzTimer = 0.03;
            }
        }
    }

    private setItemData(itemIdx:number,dataidx:number):void
    {
    	let blnCatch = this.monsterIdx[dataidx]>10000;
    	let monNo = (this.monsterIdx[dataidx]-(blnCatch?10000:0));
    	this.itemText[itemIdx].text = "No."+monNo+" "+(blnCatch?ConfigMonsterManager.getConfig(monNo,"name"):"??????");
    }

    private itemTotalHeight:number;
    private curFirstItemIdx:number;
    private curFirstInfoIdx:number;
    private updateItems(up2down:boolean):void
    {
        let curLastItemIdx = (this.curFirstItemIdx+this.itemNum-1)%this.itemNum;
        if(up2down)
        {
            if(this.itemInfo[this.curFirstItemIdx].y+this.displayDataRect.y<this.screenOffsetY-this.itemTotalHeight/2-10)
            {
                let temp = this.itemInfo[curLastItemIdx].y+this.lineSpace+this.itemHeight;
                if(temp>this.displayDataRect.height)
                    return;
                this.itemInfo[this.curFirstItemIdx].y = temp;
                this.itemText[this.curFirstItemIdx].y = this.itemInfo[this.curFirstItemIdx].y;

                this.setItemData(this.curFirstItemIdx,this.curFirstInfoIdx+this.itemNum);
                this.curFirstItemIdx = (this.curFirstItemIdx+1)%this.itemNum;

                this.curFirstInfoIdx++;
                //console.log("PokeHandbook--curFirstInfoIdx: "+this.curFirstInfoIdx);
            }
        }
        else
        {
            if(this.itemInfo[curLastItemIdx].y+this.displayDataRect.y>this.screenOffsetY+this.itemTotalHeight/2+10)
            {
                let temp = this.itemInfo[this.curFirstItemIdx].y-this.lineSpace-this.itemHeight;
                if(temp<0)
                    return;
                this.itemInfo[curLastItemIdx].y = temp;
                this.itemText[curLastItemIdx].y = this.itemInfo[curLastItemIdx].y;
                this.curFirstItemIdx = (this.curFirstItemIdx+this.itemNum-1)%this.itemNum;
                this.curFirstInfoIdx--;
                this.setItemData(this.curFirstItemIdx,this.curFirstInfoIdx);
                //console.log("PokeHandbook--curFirstInfoIdx: "+this.curFirstInfoIdx);
            }
        }
    }

    private leftHandler(event:egret.TouchEvent):void
    {
        switch (event.type) {
            case egret.TouchEvent.TOUCH_BEGIN:
                this.leftBtn.texture = this.leftBtnPressed;
                break;
            case egret.TouchEvent.TOUCH_CANCEL:
            case egret.TouchEvent.TOUCH_END:
                this.leftBtn.texture = this.leftBtnNormal;
                if(this.handbookState == HandbookState.Detail)
                {
                    this.curDetailIdx = (this.curDetailIdx+this.monsterIdx.length-1)%this.monsterIdx.length;
                    //this.showDetail(this.monsterIdx[this.curDetailIdx],true);
                    this.zzzTargetState = HandbookState.Detail;
                    this.ChangeState(HandbookState.ZZZ);
                }
                break;
            default:
                break;
        }
    }

    private rightHandler(event:egret.TouchEvent):void
    {

        switch (event.type) {
            case egret.TouchEvent.TOUCH_BEGIN:
                this.rightBtn.texture = this.rightBtnPressed;
                break;
            case egret.TouchEvent.TOUCH_CANCEL:
            case egret.TouchEvent.TOUCH_END:
                this.rightBtn.texture = this.rightBtnNormal;
                if(this.handbookState == HandbookState.Detail)
                {
                    this.curDetailIdx = (this.curDetailIdx+1)%this.monsterIdx.length;
                    this.zzzTargetState = HandbookState.Detail;
                    this.ChangeState(HandbookState.ZZZ);
                    //this.showDetail(this.monsterIdx[this.curDetailIdx],true);
                }
                break;
            default:
                break;
        }
    }

    private closeHandler(event:egret.TouchEvent):void
    {
        switch (event.type) {
            case egret.TouchEvent.TOUCH_BEGIN:
                this.closeBtn.texture = this.closeBtnPressed;
                break;
            case egret.TouchEvent.TOUCH_CANCEL:
            case egret.TouchEvent.TOUCH_END:
                this.closeBtn.texture = this.closeBtnNormal;
                this.close();
                break;
            default:
                break;
        }
    }

    private touchPointY:number;
    private pressed:boolean;
    private hasMoved:boolean;
    private touchHandler(event:egret.TouchEvent):void
    {
        switch (event.type) {
            case egret.TouchEvent.TOUCH_BEGIN:
                this.hasMoved = false;
                this.touchPointY = event.stageY;
                this.pressed = true;
                break;
            case egret.TouchEvent.TOUCH_MOVE:
                {
                    if(this.pressed==false) break;
                    this.hasMoved = true;
                    let delta = event.stageY-this.touchPointY;
                    if(delta!=0)
                    {
                        this.displayDataRect.y+=delta;
                        let temp = this.screenHeight-this.displayDataRect.height+this.screenStartY;
                        if(this.displayDataRect.y>this.screenStartY||temp-this.screenStartY>=0)
                            this.displayDataRect.y = this.screenStartY;
                        else if(this.displayDataRect.y<temp)
                            this.displayDataRect.y=temp;
                        this.updateItems(delta<0);
                        this.touchPointY = event.stageY;

                    }
                }
                break;
            case egret.TouchEvent.TOUCH_END://未划动后离开
            case egret.TouchEvent.TOUCH_CANCEL://划动后离开
                if(this.hasMoved==false)
                {
                    let point = this.displayDataRect.globalToLocal(event.stageX,event.stageY);
                    for(let i=0;i<this.itemNum;++i)
                    {
                        if(Math.abs(this.itemInfo[i].y-point.y)<this.itemInfo[i].height/2 &&
                           Math.abs(this.itemInfo[i].x-point.x)<this.itemInfo[i].width/2)
                           {
                               //console.log(i);
                               if(i<this.monsterIdx.length)
                               {
                                   //this.showDetail(this.monsterIdx[this.curFirstInfoIdx+i],true);
                                   this.curDetailIdx = this.curFirstInfoIdx+(i+this.itemNum-this.curFirstItemIdx)%this.itemNum;
                                   this.zzzTargetState = HandbookState.Detail;
                                   this.ChangeState(HandbookState.ZZZ);
                               }
                               break;
                           }
                    }
                }
                this.pressed = false;
                break;
            default:
                break;
        }
    }

    private initData():boolean
    {
        //console.log(this.monsterData[1])
        let retval = false;
        //检查满足主城等级的精灵
        for(let i in ConfigMonster)
        {
            //console.log(i);
            let data = this.checkShow(i); 
            if(data>0)
            {
                if(data>10000) 
                    retval = true;
                this.monsterIdx.push(data);
            }
        }
        this.monsterIdx.sort((a:number,b:number)=>{
            let aa = ConfigMonsterManager.getConfig(a%10000,"handbookIdx");
            let bb = ConfigMonsterManager.getConfig(b%10000,"handbookIdx");
            
            if(aa>bb) return 1;
            else if(aa<bb) return -1;
            return 0;
        });

        return retval;
        //console.log(this.monsterData[0][1003]);
    }

    private checkShow(id:string):number
    {
        //let retval = 0;
        if(MonsterManager.getInstance().checkIfHaveMon(id))
            return 10000+parseInt(id);//有的
        //判断是否显示在图鉴中
        let handbookID = ConfigMonsterManager.getConfig(id,"handbook");//id["handbook"];
        if(handbookID<=PlayerManager.getInstance().getConfig("homeLv"))
        {
	        //显示阴影
        	return parseInt(id);
        }
        else if(handbookID<0)//与已有精灵相关的进化精灵    //黑衣人才能抓到的精灵，存放精灵最初形态的ID
        {
            if(MonsterManager.getInstance().checkIfNew(Math.abs(parseInt(handbookID))))
            {
                return parseInt(id);
            }
        }
        return 0;
    }
}