cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.animation = this.node.getComponent(cc.Animation);

        this.animation.on('finished', this.onFinished, this);

        this.animation.play(this.animation._clips[0].name);
    },

    onDestroy() {
        // this.animation.off('finished', this.onFinished, this);
    },

    start() {
    },

    // update (dt) {},

    onFinished: function () {
        this.node.opacity = 0;
        this.scheduleOnce(function () {
            this.node.destroy();
        }, 1);
    },
});
