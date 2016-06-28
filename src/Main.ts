//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

// class Main extends eui.UILayer {
   class Main extends egret.DisplayObjectContainer{
    /**
     * 加载进度界面
     * Process interface loading
     */
    private static g_instance:Main;
    
    public static getInstance(){
        return Main.g_instance;
    }
    private loadingView:LoadingUI;
    private resArr=[
        "resource/downFloor_uiRes.json",
        "resource/upFloorRes.json",
        "resource/bmp_fontRes.json",
        "resource/effectRes.json",
        "resource/uiRes.json",
        "resource/aniFrameRes.json",
        "resource/soundRes.json",
        "resource/monsterRes.json",
    ];
    private groupArr=[
        "down_ui",
        "upMisc",
        "bmp_font",
        "effect",
        "Handbook",
        "aniFrame",
        "upFloorSound",
        "monsters",
        "BGM",
    ]
    public constructor() {
        super();
        Main.g_instance = this;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }


    private totalResFiles:number;
    private onAddToStage(event:egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        // this.totalResFiles = 2;
        this.totalResFiles = this.resArr.length;
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig(this.resArr[this.totalResFiles-1], "resource/");
        var assetAdapter = new AssetAdapter();
        this.stage.registerImplementation("eui.IAssetAdapter",assetAdapter);
        this.stage.registerImplementation("eui.IThemeAdapter",new ThemeAdapter());
    }


    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event:RES.ResourceEvent):void {


        // 加载资源
        this.totalResFiles--;
        console.log(this.totalResFiles);
        if(this.totalResFiles==0)
        {
                    // 加载主题
            var theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);

            RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            for (var i in this.groupArr){
                RES.loadGroup(this.groupArr[i]);
            }
            
            this.totalResFiles = this.groupArr.length;
        }
        else
        {
            RES.loadConfig(this.resArr[this.totalResFiles-1], "resource/");
        }
    }
    private isThemeLoadEnd = false;
    private onThemeLoadComplete(){
        this.isThemeLoadEnd = true;
        this.createGameScene();
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private isResourceLoadEnd: boolean = false;
    private onResourceLoadComplete(event:RES.ResourceEvent):void 
    {
        this.totalResFiles--;
        // if (event.groupName == "gamescene") {
        //     console.log("gamescene");
        // }
        // else if(event.groupName == "upMisc")
        // {
        //     console.log("upMisc");
        // }
        // else if(event.groupName == "upMonster")
        // {
        //     console.log("upMonster");
        // }
        for(let i in this.groupArr)
        {
            if(event.groupName == this.groupArr[i])
            {
                console.log(this.groupArr[i]);
            }
        }
        

        //console.log("conplete group:"+event.groupName);      
        //egret.log(this.totalResFiles+":"+(this.totalResFiles==0?1:0));
        if(this.totalResFiles==0)
        {
            //
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);//?
            this.isResourceLoadEnd = true;
            //egret.log("here");
            egret.log("frome res");
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event:RES.ResourceEvent):void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event:RES.ResourceEvent):void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        // if (event.groupName == "gamescene") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        // }
        
    }

    private textfield:egret.TextField;
    private BGM:MusicPlay;
    private Sound:SoundPlay;
    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene():void {
        if(this.isThemeLoadEnd && this.isResourceLoadEnd){
            this.BGM = new MusicPlay();
            this.Sound = new SoundPlay();
            // 清理数据时使用
            //NativeApi.clearLocalData();
            // SocketManager.getInstance();
            // PlayerManager.getInstance();
            // MonsterManager.getInstance();
            // // 运行黑煤窑场景
            // this.stage.addChildAt(new CoalPitScene(),0);
            // this.stage.addChildAt(new GameScene,1);
            // //egret.log("hehe");
            // this.stage.addChildAt(FloorUI.getInstance(),2);
            this.stage.addChild(new LoginUI());
        }       
        console.log("时间："+Utility.MillisecondToDate(85648));
    }
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name:string):egret.Bitmap {
        var result = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    private startAnimation(result:Array<any>):void {
        var self:any = this;

        var parser = new egret.HtmlTextParser();
        var textflowArr:Array<Array<egret.ITextElement>> = [];
        for (var i:number = 0; i < result.length; i++) {
            textflowArr.push(parser.parser(result[i]));
        }

        var textfield = self.textfield;
        var count = -1;
        var change:Function = function () {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            var lineArr = textflowArr[count];

            self.changeDescription(textfield, lineArr);
            var tw = egret.Tween.get(textfield);
            tw.to({"alpha": 1}, 200);
            tw.wait(2000);
            tw.to({"alpha": 0}, 200);
            tw.call(change, self);
        };

        change();
    }

    /**
     * 切换描述内容
     * Switch to described content
     */
    private changeDescription(textfield:egret.TextField, textFlow:Array<egret.ITextElement>):void {
        textfield.textFlow = textFlow;
    }
}


