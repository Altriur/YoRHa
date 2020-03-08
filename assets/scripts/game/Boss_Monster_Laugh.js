cc.Class({
    extends: cc.Component,

    properties: {
        audio: {
            default: null,
            type: cc.AudioClip,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},

    laugh: function () {
        cc.audioEngine.playEffect(this.audio, false);
    },
});
