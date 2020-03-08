cc.Class({
    extends: cc.Component,

    properties: {
        thorb_time: 0.05,

        originColor: {
            default: null,
            visible: false,
        },

    },

    onLoad: function () {

        //开启鼠标点击监听
        this.node.on(cc.Node.EventType.TOUCH_START, this.clickDown, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.clickUp, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.clickUp, this);

    },
    onDestroy: function () {
        //取消鼠标点击监听
        this.node.off(cc.Node.EventType.TOUCH_START, this.clickDown, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.clickUp, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.clickUp, this);
    },

    start() {
        this.originColor = this.node.color;
    },

    clickDown: function () {
            this.node.color = new cc.color(200, 200, 200);
    },
    clickUp: function () {
            this.node.color = this.originColor;

    },

});
