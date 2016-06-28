
/**
 * name
 */
class SocketManager {
    private static g_instance;
    private webSocket;
    public static getInstance(){
        if(!this.g_instance){
            this.g_instance  = new SocketManager();
        }
        return this.g_instance;
    }
    constructor() {
        // this.initEgretWebSocket();
        // this.connect();
        this.initWebSocket();
    }
    // private initEgretWebSocket(){
    //     this.webSocket = new egret.WebSocket();
    //     //监听连接是否成功
    //     this.webSocket.addEventListener(egret.Event.CONNECT,this.onConnect,this);
    //     // 监听接收服务器数据
    //     this.webSocket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
    //     // 监听关闭连接
    //     this.webSocket.addEventListener(egret.Event.CLOSE,this.onClose,this);
    //     // 监听在出现输入/输出错误并导致发送或加载操作失败时调度。
    //     this.webSocket.addEventListener(egret.IOErrorEvent.IO_ERROR,this.onIOError,this);
    // }
    private initWebSocket(){
        this.webSocket = new WebSocket("ws://echo.websocket.org");
        this.webSocket.onopen = function(evt) {
            SocketManager.getInstance().onOpen(evt);
        }
        this.webSocket.onmessage = function(evt) {
            SocketManager.getInstance().onMessage(evt);
        }
        this.webSocket.onerror = function(evt) {
            SocketManager.getInstance().onError(evt);
        }
        this.webSocket.onclose = function(evt) {
            SocketManager.getInstance().onClose(evt);
        }
    }
    private onOpen(evt){
        console.log("onOpen:"+evt);
        this.sendMsg({"type":"goo","name":"jim","age":{"123":123,"456":456}});
    }
    private onMessage(evt){
        console.log("onMessage:"+evt);
        console.log("onMessageData:"+evt.data);
        var a =eval('('+evt.data+')');
        Utility.printArr(a);
    }
    private onError(evt){
        console.log("onError:"+evt);
    }
    private onClose(evt){
        console.log("onClose:"+evt);
    }
    private sendMsg(msg){
        JSON.stringify
        this.webSocket.send(JSON.stringify(msg));
    }
    // private connect(){
    //     this.webSocket.connect("echo.websocket.org", 80);
    // }
    // // 连接回调
    // private onConnect(){
    //     console.log("连接成功");
    //     this.sendMsg("hello world");
    // }
    // // 接收消息回调
    // private onEgretReceiveMessage(e:egret.Event){
    //     var msg = this.webSocket.readUTF();    
    //     console.log("收到数据：" + msg);
    // }
    // private onReceiveMessage(evt){

    // }
    // // 发送数据
    // private sendMsg(msg){
    //     this.webSocket.writeUTF(msg);
    // }
    // private onClose(){
    //     console.log("连接关闭");
    // }
    // private onIOError(){
    //     console.log("发生错误");
    // }
}