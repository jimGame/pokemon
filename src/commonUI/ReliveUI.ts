/**
 * name
 */
class ReliveUI extends eui.Component {
    private _fhPro;
    private _fhTime;
    constructor() {
        super();
        this.skinName = "resource/skin/fhInfo.exml";
    }
    public show_fhTime(val){
        // console.log("TimeStr:"+val);
        this._fhTime.text = val; 
    }
    public show_fhPro(val){
        // console.log("fhPro:"+val);
        this._fhPro.value = val;
    }
}