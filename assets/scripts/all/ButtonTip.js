cc.Class({
    extends: cc.Component,

    properties: {
        tip: {
            default: null,
            type: cc.Node,
        }
    },


    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClick, this);

    },

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
    },



    start() {

    },

    // update (dt) {},

    onClick: function () {
        this.tip.active = !this.tip.active;
    },
});
