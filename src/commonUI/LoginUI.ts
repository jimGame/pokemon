/**
 * name
 */
class LoginUI extends eui.Component {
	private _mainLogin:eui.Image;
	private _cusLogin:eui.Image;

	private _loginKuang:eui.Group;
	private login_zc:eui.Image;
	private login_dl:eui.Image;
	private login_user:eui.TextInput;
	private login_passwd:eui.TextInput;

	private _reginKuang:eui.Group;
	private regin_yy:eui.Image;
	private regin_zc:eui.Image;
	private regin_user:eui.TextInput;
	private regin_passwd:eui.TextInput;
	constructor() {
		super();
		this.skinName = "resource/skin/loginInfo.exml";
	}
	protected createChildren(){
		this.initData();
		this.initOperation();
	}
	private initData(){
		// this.login_passwd.displayAsPassword = true;
		// this.regin_passwd.displayAsPassword = true;
		this.showGroup(0);
	}
	private initOperation(){
		this._mainLogin.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
			EffectUtils.playEffect(this._mainLogin,3,this.mainLoginOperation,this);
		},this);
		this._cusLogin.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
			EffectUtils.playEffect(this._cusLogin,3,this.cusLoginOperation,this);
		},this);
		this.login_zc.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
			EffectUtils.playEffect(this.login_zc,3,this.Login_zcOperation,this);
		},this);
		this.login_dl.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
			EffectUtils.playEffect(this.login_dl,3,this.Login_dlOperation,this);
		},this);
		this.regin_yy.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
			EffectUtils.playEffect(this.regin_yy,3,this.Regin_yyOperation,this);
		},this);
		this.regin_zc.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
			EffectUtils.playEffect(this.regin_zc,3,this.Regin_zcOperation,this);
		},this);
		// this.login_user.addEventListener(egret.Event.CHANGE,this.onChang,this);
		this.login_user.addEventListener(egret.Event.FOCUS_IN,()=>{
			console.log("login_user@@focus_in");
		},this);
		this.login_user.addEventListener(egret.Event.FOCUS_OUT,()=>{
			console.log("login_user@@focus_out");
		},this);
		this.login_passwd.addEventListener(egret.Event.FOCUS_IN,()=>{
			console.log("login_passwd@@focus_in");
		},this);
		this.login_passwd.addEventListener(egret.Event.FOCUS_OUT,()=>{
			console.log("login_passwd@@focus_out");
		},this);
		this.regin_user.addEventListener(egret.Event.FOCUS_IN,()=>{
			console.log("regin_user@@focus_in");
		},this);
		this.regin_user.addEventListener(egret.Event.FOCUS_OUT,()=>{
			console.log("regin_user@@focus_out");
		},this);
		this.regin_passwd.addEventListener(egret.Event.FOCUS_IN,()=>{
			console.log("regin_passwd@@focus_in");
		},this);
		this.regin_passwd.addEventListener(egret.Event.FOCUS_OUT,()=>{
			console.log("regin_passwd@@focus_out")
			
		},this);
	}
	private showGroup(type){
		this._loginKuang.visible = (type == 1);
		this._reginKuang.visible = (type == 2);
		if(type == 1){
			this.login_user.text = "";
			this.login_passwd.text = "";
		}
		if(type == 2){
			this.regin_user.text = "";
			this.regin_passwd.text = "";
		}
	}
	// 登录
	private mainLoginOperation(){
		if(this._loginKuang.visible || this._reginKuang.visible){
			return;
		}
		this.showGroup(1);
	}
	// 游客登录
	private cusLoginOperation(){
		console.log("进入游客登录功能");
	}
	// 登录界面-注册
	private Login_zcOperation(){
		this.showGroup(2);
	}
	// 登录界面-登录
	private Login_dlOperation(){

	}
	// 注册界面-已有账号
	private Regin_yyOperation(){
		this.showGroup(1);
	}
	// 注册界面-注册
	private Regin_zcOperation(){

	}
	private remove(){
		this.parent.removeChild(this);
	}
}