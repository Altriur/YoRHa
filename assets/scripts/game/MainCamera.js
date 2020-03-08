cc.Class({
    extends: cc.Component,

    properties: {
        player: {
            default: null,
            type: cc.Node,
        }
    },

    // onLoad () {},

    start() {
        this.node.x = this.player.x;
        this.node.y = this.player.y;

        this.node.width = cc.winSize.width;
        this.node.height = cc.winSize.height;
    },

    update(dt) {
        var distanceX = this.player.x - this.node.x;
        this.node.x += 2 * distanceX * dt;

        var distanceY = this.player.y - this.node.y;
        this.node.y += 2 * distanceY * dt;
    },
});
