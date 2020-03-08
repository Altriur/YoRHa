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
    },

    onLoad: function () {

        //开启鼠标点击监听
        this.node.on(cc.Node.EventType.TOUCH_START, this.clickDown, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.clickUp, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.clickUp, this);

    },
    onDestroy: function () {
        //取消鼠标点击监听
        this.node.off(cc.Node.EventType.TOUCH_START, this.clickDown, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.clickUp, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.clickUp, this);
    },

    start() {
        this.playerStatus = this.player.getComponent("PlayerStatus");

        this.playerController = this.player.getComponent("PlayerController");

        this.judgeAreaScript = this.judgeArea.getComponent("JudgeArea");
    },

    clickDown: function () {
        if (this.playerStatus.isDead) {
            return;
        }

        //只有盾牌耐久度不为零并且不处于攻击状态才可以进入防御状态
        if (this.judgeAreaScript.shieldDurability > 0 && !this.playerStatus.isAttacking) {
            this.judgeArea.active = true;
            this.judgeArea.group = "Defense";
            //处于防御状态无法运动
            this.playerController.moveX = 0;
            this.playerStatus.setDefending();
        }
    },
    clickUp: function () {
        //如果盾牌耐久度为零则
        if (this.judgeAreaScript.shieldDurability <= 0) {
            this.node.color = new cc.color(200, 200, 200);
        }

        if (this.playerStatus.isDead) {
            return;
        }

        this.judgeArea.active = false;
        this.judgeArea.group = "default";
        this.playerStatus.setStanding();
    },
});
