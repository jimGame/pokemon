/**
 * name
 */
class GetNewUI extends eui.Component {
    private m_id;
    private m_type;
    private _zi;
    private _new;
    private m_armature;
    constructor(id,type="down") {
        super()
        this.skinName = "resource/skin/getNewInfo.exml";
        this.m_id = id;
        this.m_type = type;
    }
    protected createChildren(){
        this.initData();
        this.initOperation();
         
        SoundPlay.Instance.Play("new_ojimon_get_mp3");
    }
    private initData(){
        this.createArmature();
    }
    private initOperation(){
        this.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            this.remove();
            if(this.m_type == "down"){
                MonsterManager.getInstance().catachMonster(this.m_id,this.m_type);
            }else if(this.m_type == "up"){
                MonsterManager.getInstance().createNewMon(this.m_id);
            }
            
        },this);
        // this.scaleX = 0.5;
        // this.scaleY = 0.5;
        this._new.visible =false;
        egret.Tween.get(this._zi).to({scaleX:2.0,scaleY:2.0},400)
        
        .to({scaleX:1.0,scaleY:1.0},200).wait(100)
        .call(()=>{
            this._new.visible = true;
            this._new.scaleX = 5.0;
            this._new.scaleY = 5.0;
            egret.Tween.get(this._new).to({scaleX:1.0,scaleY:1.0},100);
        },this)
    }
    private createArmature(){
        this.m_armature =  Utility.createDragon(ConfigMonsterManager.getConfig(this.m_id,"dragonName_down"));
        this.addChild(this.m_armature.display);
        this.m_armature.display.y = this.stage.stageHeight/2;
        this.m_armature.display.x = this.stage.stageWidth/2;
        this.m_armature.animation.gotoAndPlay("stand",-1,-1,0)
    }
    private remove(){
        if(this.parent){
            this.parent.removeChild(this);
        }
    }
    
}