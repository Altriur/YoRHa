cc.Class({
    extends: cc.Component,

    properties: {
        //获取玩家节点以便获取玩家的状态
        player: {
            default: null,
            type: cc.Node,
        },
        playerStatus: {
            default: null,
            visible: false,
        },

        //时间减慢的时间流速
        shortTimeVectory: {
            default: 0.1,
            // visible: false,
        },
        //正常的时间流速
        normalTimeVectory: {
            default: 1,
            visible: false,
        },

        //当前的时间流速
        timeVectory: {
            default: null,
            visible: false,
        },
    },

    onLoad() {
        this.playerStatus = this.player.getComponent("PlayerStatus");

        this.timeVectory = this.normalTimeVectory;
    },

    start() {

    },

    update(dt) {
        if (this.playerStatus.isDead) {
            this.timeVectory = this.shortTimeVectory;
            return;
        }

        if (this.playerStatus.isStatic) {
            this.timeVectory = this.shortTimeVectory;
        }
        else {
            this.timeVectory = this.normalTimeVectory;
        }

    },
});
