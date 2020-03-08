cc.Class({
    extends: cc.Component,

    properties: {
        setBar: {
            default: null,
            type: cc.Node,
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

    },

    onClick: function () {
        this.setBar.active = !this.setBar.active;
    },
});
