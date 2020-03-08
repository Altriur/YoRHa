cc.Class({
    extends: cc.Component,

    properties: {

        buttonBack: {
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
        this.buttonBack.position = cc.v2(-cc.winSize.width / 2 + this.distance + this.buttonBack.width / 2, cc.winSize.height / 2 - this.distance - this.buttonBack.height / 2);
        this.buttonTip.position = cc.v2(this.buttonBack.x, this.buttonBack.y - this.buttonBack.height / 2 - this.distance - this.buttonTip.height / 2);
    },

    // update (dt) {},
});
