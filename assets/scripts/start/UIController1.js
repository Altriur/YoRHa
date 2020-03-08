cc.Class({
    extends: cc.Component,

    properties: {
        title: {
            default: null,
            type: cc.Node,
        },

        buttonStart: {
            default: null,
            type: cc.Node,
        },

        buttonSet: {
            default: null,
            type: cc.Node,
        },

        setBar: {
            default: null,
            type: cc.Node,
        },

        buttonTip: {
            default: null,
            type: cc.Node,
        },

        //UI组件与屏幕边缘的距离
        distance: {
            default: 17.5,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.title.x = 0;
        this.buttonStart.x = this.title.x;
        this.buttonSet.position = cc.v2(-cc.winSize.width / 2 + this.distance + this.buttonSet.width / 2, cc.winSize.height / 2 - this.distance - this.buttonSet.height / 2);
        this.buttonTip.position = cc.v2(this.buttonSet.x, this.buttonSet.y - this.buttonSet.height / 2 - this.distance - this.buttonTip.height / 2);
        this.setBar.position = cc.v2(this.buttonSet.x, this.buttonSet.y);
    },

    // update (dt) {},
});
