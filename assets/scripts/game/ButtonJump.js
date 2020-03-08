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
    },

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.ClickDown, this);

    },

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.ClickDown, this);

    },

    start() {
        this.playerController = this.player.getComponent("PlayerController");
    },

    // update (dt) {},

    ClickDown:function() {
        this.playerController.doJump();
    },
});
