cc.Class({
    extends: cc.Component,

    properties: {
        setBar: {
            default: null,
            type: cc.Node,
        },

        closeTime: 2,

        closeTimer: {
            default: 0,
            visible: false,
        },
    },

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, function (t) { }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
    },

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, function (t) { }, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
    },

    start() {
        this.setBar.active = false;
    },

    update(dt) {
        this.closeTimer -= dt;
        if (this.closeTimer <= 0 && this.setBar.active == true) {
            this.setBar.active = false;
        }
    },

    onClick: function () {
        this.setBar.active = !this.setBar.active;

        this.closeTimer = this.closeTime;
    },
});
