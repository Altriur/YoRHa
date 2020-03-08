cc.Class({
    extends: cc.Component,

    properties: {
        player: {
            default: null,
            type: cc.Node,
        },

        playerController: {
            default: null,
            visible: false,
        },

        playerStatus: {
            default: null,
            visible: false,
        },

        judgeArea: {
            default: null,
            type: cc.Node,
        },

        isClick: {
            default: false,
            visible: false,
        },
    },

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.ClickDown, this);

    },

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.ClickDown, this);
    },

    start() {
        this.playerStatus = this.player.getComponent("PlayerStatus");

        this.playerController = this.player.getComponent("PlayerController");
    },

    // update (dt) {},

    ClickDown: function () {
        if (this.playerStatus.isDead) {
            return;
        }

        if (!this.playerStatus.isAttacking && !this.isClick) {
            this.isClick = true;
            this.judgeArea.active = true;
            this.judgeArea.group = "Attack";
            this.playerStatus.setAttacking();

            this.scheduleOnce(function () {
                this.judgeArea.active = false;
                this.judgeArea.group = "default";
                if (this.playerController.moveX == 0) {
                    this.playerStatus.setStanding()
                }
                else {
                    this.playerStatus.setMoving()
                }
                this.isClick = false;
            }, 0.22 );
        }
    },
});
