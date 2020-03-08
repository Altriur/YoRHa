cc.Class({
    extends: cc.Component,

    properties: {
        level: {
            default: null,
            visible: false,
        },
        maxLevel: 4,
        minLevel: {
            default: 0,
            visible: false,
        },
    },

    onLoad() {
        //令该节点变为常驻节点（即使场景变换也不会销毁）
        cc.game.addPersistRootNode(this.node);
    },

    // update (dt) {},
});
