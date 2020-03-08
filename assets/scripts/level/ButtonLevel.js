cc.Class({
    extends: cc.Component,

    properties: {
        myLevel: 1,

        delay: {
            default: 0,
            visible: false,
        },

        isLoading: {
            default: false,
            visible: false,
        },

        isLock: {
            default: false,
            visible: false,
        },

    },


    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, function (t) { }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
    },

    start() {
        this.delay = this.node.getChildByName("Background").getComponent('ClickEffect').thorb_time * 2 + 0.05;

        this.setBestTime();

        this.setLevelStatus();

        this.node.getChildByName("LevelLabel").getComponent(cc.Label).string = this.myLevel;


    },

    // update (dt) {},

    onClick: function () {
        if (this.isLock) {
            return;
        }
        //延迟0.5秒执行转跳到下一个场景的方法
        if (!this.isloading) {
            //预加载
            cc.director.preloadScene('Game');
            cc.find("LevelNote").getComponent("LevelNote").level = this.myLevel;
            this.scheduleOnce(function () {
                this.nextScene();
            }, this.delay);
        }
    },

    nextScene: function () {

        this.isloading = true;
        //转跳到game场景
        cc.director.loadScene("Game");

    },

    //设置显示最佳时间的Label内容
    setBestTime: function () {
        var levelname = this.myLevel;

        if (levelname < 10) {
            levelname = "0" + levelname;
        }

        levelname = "Level" + levelname;

        var bestTime = cc.sys.localStorage.getItem(levelname);

        var clearanceTime = this.node.getChildByName("ClearanceTime");

        if (bestTime != null) {
            clearanceTime.active = true;
            clearanceTime.getComponent(cc.Label).string = this.changeTime(bestTime);
        }
        else {
            clearanceTime.active = false;
        }


    },

    //设置关卡状态
    setLevelStatus: function () {
        var highLevel = cc.sys.localStorage.getItem('HighLevel');

        if (highLevel == null) {
            highLevel = 1;
            cc.sys.localStorage.setItem('HighLevel', 1);
        }

        highLevel = 15;

        var maxLevel = cc.find("LevelNote").getComponent("LevelNote").maxLevel;


        if (this.myLevel > maxLevel) {
            this.node.getChildByName("Lock").active = true;
            this.node.getChildByName("LevelLabel").active = false;
            this.node.getComponent("ButtonLevel").active = false;
            this.isLock = true;
            return;
        }

        if (highLevel < this.myLevel) {
            this.node.getChildByName("Lock").active = true;
            this.node.getChildByName("LevelLabel").active = false;
            this.node.getComponent("ButtonLevel").active = false;
            this.isLock = true;
        }
        else {
            this.node.getChildByName("Lock").active = false;
            this.node.getChildByName("LevelLabel").active = true;
            this.isLock = false;
        }

    },

    //将浮点数转化成00:00:00的时间格式
    changeTime(bestTime) {
        //分钟
        var minute = parseInt(bestTime / 3600);

        //秒
        var second = parseInt(bestTime / 60 % 60);

        //微秒
        var microsecond = parseInt((bestTime / 60 % 60 - second) * 60);

        if (minute < 10) {
            minute = "0" + minute;
        }

        if (second < 10) {
            second = "0" + second;
        }

        if (microsecond < 10) {
            microsecond = "0" + microsecond;
        }

        return minute + ":" + second + ":" + microsecond;
    }
});
