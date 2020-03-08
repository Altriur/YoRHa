cc.Class({
    extends: cc.Component,

    properties: {
        player: {
            default: null,
            type: cc.Node,
        },

        playerController: {
            default: null,
            visible: false,
        },

        buttonLeft: {
            default: null,
            type: cc.Node,
        },

        isClick: {
            default: false,
            visible: false,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //开启鼠标点击监听
        this.node.on(cc.Node.EventType.TOUCH_START, this.clickDown, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.clickUp, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.clickUp, this);
    },

    onDestroy() {
        //取消鼠标点击监听
        this.node.off(cc.Node.EventType.TOUCH_START, this.clickDown, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.clickUp, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.clickUp, this);
    },


    start() {
        this.playerController = this.player.getComponent("PlayerController");
    },

    clickDown: function () {
        this.playerController.moveRight();
        this.isClick = true;
    },

    clickUp: function () {
        this.playerController.doStop();
        this.isClick = false;
    },


});
