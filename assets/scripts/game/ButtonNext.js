cc.Class({
    extends: cc.Component,

    properties: {
        delay: {
            default: 0,
            visible: false,
        },

        isLoading: {
            default: false,
            visible: false,
        },

        buttonMax: {
            default: null,
            type: cc.Node,
        },

        //判断是否存在下一关
        isMax: {
            default: false,
            visible: false,
        },

        levelNote: {
            default: null,
            visible: false,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, function (t) { }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
    },

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, function (t) { }, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
    },

    start() {
        this.delay = this.node.getComponent('ClickEffect').thorb_time * 2 + 0.05;

        this.levelNote = cc.find("LevelNote").getComponent("LevelNote");

        this.isMax = !(this.levelNote.level < this.levelNote.maxLevel);

        if (!this.isMax) {
            this.buttonMax.active = false;
            this.node.active = true;
        }
        else {
            this.buttonMax.active = true;
            this.node.active = false;
        }
    },

    // update (dt) {},

    onClick: function () {
        if (this.isMax) {
            return;
        }

        //延迟0.5秒执行转跳到下一个场景的方法
        if (!this.isloading) {
            //预加载
            this.levelNote.level += 1;
            cc.director.preloadScene('Game');
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
});