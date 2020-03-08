cc.Class({
    extends: cc.Component,

    properties: {
        player: {
            default: null,
            visible: false,
        }
    },

    // onLoad () {},

    start() {
        this.node.width = cc.winSize.width;
        this.node.height = cc.winSize.height;

        this.player = cc.find("Canvas/Game/Character/Player");

        this.player.x = this.node.x;
        this.player.y = this.node.y;

    },

    update(dt) {
        var distanceX = this.player.x - this.node.x;
        this.node.x += 2*distanceX * dt;

        var distanceY = this.player.y - this.node.y;
        this.node.y += 2*distanceY * dt;

    },
});
