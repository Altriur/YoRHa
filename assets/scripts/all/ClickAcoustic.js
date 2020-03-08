cc.Class({
    extends: cc.Component,

    properties: {
        //音效类型 当类型为0时不播放任何音效
        acousticType: 0,

        //声音控制者节点
        soundController: {
            default: null,
            visible: false,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //开启鼠标点击监听
        this.node.on(cc.Node.EventType.TOUCH_START, this.onClick, this);
    },

    onDestroy() {
        //取消鼠标点击监听
        this.node.off(cc.Node.EventType.TOUCH_START, this.onClick, this);
    },

    start() {
        this.soundController = cc.find("SoundController").getComponent("SoundController");
    },

    // update (dt) {},

    onClick: function () {
        this.soundController.playClickAcoustic(this.acousticType);
    },
});
