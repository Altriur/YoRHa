cc.Class({
    extends: cc.Component,

    properties: {
        time: {
            default: 0,
            visible: false,
        },

        timeLabel: {
            default: null,
            visible: false,
        },

        timeController: {
            default: null,
            visible: false,
        },

        //当玩家打到所有的敌人则判定获胜
        isWin: {
            default: false,
            visible: false,
        },

        //获取玩家组件
        player: {
            default: null,
            type: cc.Node,
        },

        //获胜面板的所花时间显示
        victoryTime: {
            default: null,
            type: cc.Node,
        },
    },

    // onLoad () {},

    start() {
        this.timeLabel = this.node.getComponent(cc.Label);

        this.timeController = cc.find("Canvas/Game/Character/TimeController").getComponent("TimeController");

        this.playerStatus = this.player.getComponent("PlayerStatus");
    },

    update(dt) {
        if (!this.isWin && !this.playerStatus.isDead) {
            this.drawTimeLabel(dt);
        }
    },

    drawTimeLabel: function (dt) {

        var timeVectory = this.timeController.timeVectory;


        //乘以60使时间运算转化为时分秒模式
        this.time += dt * 60 * timeVectory;

        //分钟
        var minute = parseInt(this.time / 3600);

        //秒
        var second = parseInt(this.time / 60 % 60);

        //微秒
        var microsecond = parseInt((this.time / 60 % 60 - second) * 60);

        if (minute < 10) {
            minute = "0" + minute;
        }

        if (second < 10) {
            second = "0" + second;
        }

        if (microsecond < 10) {
            microsecond = "0" + microsecond;
        }
        if (this.time < 60 * 60 * 60) {
            this.timeLabel.string = minute + ":" + second + ":" + microsecond;
        }
    },

    //将分数传递到获胜面板
    sendTime: function () {
        this.victoryTime.getComponent(cc.Label).string = this.timeLabel.string;
    },

    //记录最快通关时间
    recordTime: function (levelname) {
        var bestTime = cc.sys.localStorage.getItem(levelname);
        if (bestTime == null) {
            cc.sys.localStorage.setItem(levelname, this.time);
        }
        else {
            if (this.time < bestTime) {
                cc.sys.localStorage.setItem(levelname, this.time);
            }
        }
    },
});
