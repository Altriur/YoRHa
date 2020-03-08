cc.Class({
    extends: cc.Component,

    properties: {
        buttonJump: {
            default: null,
            type: cc.Node,
        },

        buttonAttack: {
            default: null,
            type: cc.Node,
        },

        buttoDefense: {
            default: null,
            type: cc.Node,
        },

        buttonLeft: {
            default: null,
            type: cc.Node,
        },

        buttonRight: {
            default: null,
            type: cc.Node,
        },

        buttonSet: {
            default: null,
            type: cc.Node,
        },

        equipmentBar: {
            default: null,
            type: cc.Node,
        },

        setBar: {
            default: null,
            type: cc.Node,
        },

        //UI组件与屏幕边缘的距离
        distance: {
            default: 35,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.buttonJump.position = cc.v2(cc.winSize.width / 2 - this.distance - this.buttonJump.width / 2, -cc.winSize.height / 2 + this.distance + this.buttonJump.height / 2);
        this.buttonAttack.position = cc.v2(this.buttonJump.x - 150, this.buttonJump.y + 25);
        this.buttoDefense.position = cc.v2(this.buttonJump.x - 25, this.buttonJump.y + 150);
        this.buttonLeft.position = cc.v2(-cc.winSize.width / 2 + this.distance + this.buttonLeft.width / 2, this.buttonJump.y + 25);
        this.buttonRight.position = cc.v2(this.buttonLeft.x + 165, this.buttonLeft.y);
        this.equipmentBar.position = cc.v2(-cc.winSize.width / 2 + 17.5 + this.equipmentBar.width / 2, cc.winSize.height / 2 - 17.5 - this.equipmentBar.height / 2);
        this.buttonSet.position = cc.v2(-cc.winSize.width / 2 + 17.5 + this.buttonSet.width / 2, this.equipmentBar.y - this.equipmentBar.height / 2 - this.buttonSet.height / 2 - 17.5);
        this.setBar.position = cc.v2(this.buttonSet.x, this.buttonSet.y);
    },

    // update (dt) {},
});
