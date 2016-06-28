
enum AwardType
{
    Gold,
    Diamond,
}

class SignIn01 extends eui.Component
{
    private _awardIconName:string[] = ["SignInRes_json.140_png","SignInRes_json.139_png"];

    private _awardDetail:eui.Image;//更多奖励
    private _leijiAward01:eui.Image;//累计奖励图标
    private _leijiAward02:eui.Label;//累计奖励数量 (x2000)
    private _leijiAward03:eui.Label;//累计奖励名称 (金币x3000)
    private _leijiAward04:eui.Label;//累计奖励获得方法说明
    private _leijiAward05:eui.ProgressBar;//累计奖励进度条

    private _1st01:eui.Image;//首签图标
    private _1st02:eui.Label;//首签数量
    private _1st03:eui.Image;//首签已领取

    private _2nd01:eui.Image;//次签图标
    private _2nd02:eui.Image;//次签数量
    private _2nd03:eui.Image;//次签已领取

    private _3rd01:eui.Image;//次签图标
    private _3rd02:eui.Image;//次签数量
    private _3rd03:eui.Image;//次签已领取

    private _sign01:eui.Label;//距离下次签到还剩...
    private _sign02:eui.Image;//签到按钮

    private accumulateSignStage:number[] = [9,21,33,45,63,84,105,135,315];
/////////从服务器获得的数据///////////////////////////////////////////
    private accumulateSignTimes:number = 20;//累计签到次数

////////////////////////////////////////////////////////////////////

    public constructor()
    {
        super();
        this.skinName = "resource/skin/SignIn.exml";
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.addToStage,this);
    }

    
    private addToStage(event:egret.Event):void
    {
        this._awardDetail.addEventListener(egret.TouchEvent.TOUCH_TAP,this.moreAward,this);
        this._sign02.addEventListener(egret.TouchEvent.TOUCH_TAP,this.signClick,this);
        this._leijiAward01.texture = RES.getRes(this._awardIconName[0]);

/////////累计签到数据初始化//////////////////
        if(this.accumulateSignTimes>=this.accumulateSignStage[this.accumulateSignStage.length-1])
        {
            this._leijiAward01.visible = false;
            this._leijiAward02.visible = false;
            this._leijiAward03.visible = false;
            this._leijiAward04.text = "累计签到"+this.accumulateSignTimes+"次";
            this._leijiAward05.maximum = this.accumulateSignTimes;
            this._leijiAward05.value = this.accumulateSignTimes;
        }
        else
        {
            for(let i=0;i<this.accumulateSignStage.length;++i)
            {
                if(this.accumulateSignTimes<this.accumulateSignStage[i])
                {
                    this._leijiAward02.text = "X"+2000;
                    this._leijiAward04.text = "累计签到"+this.accumulateSignStage[i]+"次即可获得";
                    this._leijiAward05.maximum = this.accumulateSignStage[i];
                    this._leijiAward05.value = this.accumulateSignTimes;
                }
            }
        }
/////////////////////////////////////////////



    }

    private moreAward(event:egret.Event):void
    {

    }

    private signClick(event:egret.Event):void
    {
        
    }
}