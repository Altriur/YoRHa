cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        // cc.tween(this.node)
        //     .to(0.5, { scale: 1.05 })
        //     .to(0.5, { scale: 1 })
        //     .repeat();

        var s1 = cc.scaleTo(0.5, 1.02);
        var s2 = cc.scaleTo(0.5, 1);
        var seq = cc.sequence([s1, s2]);
        var rep = cc.repeatForever(seq);
        this.node.runAction(rep);
    },

    // update (dt) {},
});
