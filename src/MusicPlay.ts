class MusicPlay
{
    public musicCount:number;
    public music:egret.Sound;
    public musicChannel:egret.SoundChannel;
    public curIdx:number;

    private loader:egret.URLLoader;

    public static isOn:boolean;
    public static Instance:MusicPlay;

    public constructor()
    {
        MusicPlay.Instance = this;
        this.musicCount = 2;
        this.curIdx = 0;
        this.musicChannel = null;


        let musicData = DataManager.getInstance().getBaseData_number("MyMusic")||false;
        if(!musicData)
        { 
            DataManager.getInstance().setBaseData("MyMusic","1");
            MusicPlay.isOn = true;
            this.setBGM();
        }
        else if(musicData == 0)
        {
            MusicPlay.isOn = false;
        }
        else if(musicData == 1)
        {
            MusicPlay.isOn = true;
            this.setBGM();
        }

        


    }

    public stop()
    {
        this.musicChannel.stop();
        this.music = null;
        this.musicChannel = null;
    }

    public setBGM()
    {
        if(this.musicChannel!=null)
            this.musicChannel.stop();
        this.music = RES.getRes("town_level"+(this.curIdx+1)+"_mp3");//this.loader.data;
        this.musicChannel = this.music.play(0,-1);

        // this.loader = new egret.URLLoader();
        // this.loader.addEventListener(egret.Event.COMPLETE,this.loadCompate,this);
        // this.loader.dataFormat = egret.URLLoaderDataFormat.SOUND;
        // this.loader.load(new egret.URLRequest("resource/assets/BGM/town_level"+(this.curIdx+1)+".mp3"));
    }

    public nextBGM():number
    {
        this.curIdx = (this.curIdx+1)%this.musicCount;
        if(MusicPlay.isOn) this.setBGM();
        return this.curIdx;
    }

    public prevBGM():number
    {
        this.curIdx = (this.curIdx+this.musicCount-1)%this.musicCount;
        if(MusicPlay.isOn) this.setBGM();
        return this.curIdx;
    }

    private loadCompate(event:egret.Event):void
    {
        this.music = this.loader.data;
        this.music.play(0,-1);
    }
}