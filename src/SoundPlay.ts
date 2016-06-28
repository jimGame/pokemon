class SoundPlay
{
    private sound:egret.Sound;

    public static isOn:boolean = true;
    public static Instance:SoundPlay;

    public constructor()
    {
        SoundPlay.Instance = this;

        let soundData = DataManager.getInstance().getBaseData_string("MySound")||false;
        console.log("soundData："+soundData);
        if(!soundData)
        { 
            DataManager.getInstance().setBaseData("MySound","1");
            SoundPlay.isOn = true;
        }
        else if(soundData == "0")
        {
            SoundPlay.isOn = false;
        }
        else if(soundData == "1")
            SoundPlay.isOn = true;
    }

    public Play(soundName:string,times:number = 1):void
    {
        if(SoundPlay.isOn==false) 
            return;
        this.sound = RES.getRes(soundName);
        this.sound.play(0,times);
    }

}