class NewMonAppear extends eui.Component
{
    private monId:number;
    public constructor(monId)
    {
        super();
        this.monId =monId;
        this.skinName = "resource/skin/newMonAppear.exml";
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.addToStage,this);
    }

    private addToStage(event:egret.Event):void
    {
        let monsterName = ConfigMonsterManager.getConfig(this.monId,"name2");
        let dragonbonesData = RES.getRes("monster_"+monsterName + "DB_json");
        let texturedata = RES.getRes("monster_"+monsterName + "_json");
        let texture = RES.getRes("monster_" + monsterName + "_png");

        let dragonbonesFactory = new dragonBones.EgretFactory();
        dragonbonesFactory.addDragonBonesData(dragonBones.DataParser.parseDragonBonesData(dragonbonesData));
        dragonbonesFactory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, texturedata));

        let armature = dragonbonesFactory.buildFastArmature("Armature");
        this.addChild(armature.display);
        armature.display.scaleX = armature.display.scaleY = 1.6;

        //纯黑色
        let colorMat = [
            0,0,0,0,1,
            0,0,0,0,1,
            0,0,0,0,1,
            0,0,0,1,0,
        ]
        let colorFilter = new egret.ColorMatrixFilter(colorMat);
        armature.display.filters = [colorFilter];

        armature.display.x = this.stage.stageWidth+armature.display.width/2;
        armature.display.y = this.stage.stageHeight/2;
        armature.animation.gotoAndPlay("walk");
        armature.animation.advanceTime(0.1);
        SoundPlay.Instance.Play("new_comer_mp3");
        egret.Tween.get(armature.display).to({x:this.stage.stageWidth*2/3},100).wait(800).to({x:-armature.display.width},200).call(()=>{this.parent.removeChild(this)});
    }
}