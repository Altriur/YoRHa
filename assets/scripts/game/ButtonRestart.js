cc.Class({
    extends: cc.Component,

    properties: {
        delay: {
            default: 0,
            visible: false,
        },

        isLoading: {
            default: false,
            visible: false,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, function (t) { }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
    },

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, function (t) { }, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
    },

    start() {
        this.delay = this.node.getComponent('ClickEffect').thorb_time * 2 + 0.05;
    },

    // update (dt) {},

    onClick: function () {
        //延迟0.5秒执行转跳到下一个场景的方法
        if (!this.isloading) {
            //预加载
            cc.director.preloadScene('Game');
            this.scheduleOnce(function () {
                this.nextScene();
            }, this.delay);
        }
    },

    nextScene: function () {

        this.isloading = true;
        //转跳到game场景
        cc.director.loadScene("Game");
    },
});