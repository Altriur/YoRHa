cc.Class({
    extends: cc.Component,

    properties: {
        //是否死亡
        isDead: {
            default: false,
            visible: false,
        },

        //是否处于漂浮状态
        isStaying: {
            default: true,
            visible: false,
        },

        //是否处于受击状态
        isHiting: {
            default: false,
            visible: false,
        },

        //该节点的动画组件
        animation: {
            default: null,
            visible: false,
        },

        //该节点上的Boss控制组件
        bossController: {
            default: null,
            visible: false,
        },

        //用于储存Boss的各种音效
        audio: {
            default: [],
            type: cc.AudioClip
        },

        //获取摄像头节点以判断是否需要播放音效
        mainCamera: {
            default: null,
            type: cc.Node,
            visible: false,
        },

        //声音控制者节点
        soundController: {
            default: null,
            visible: false,
        },

        //怪物死亡爆炸特效
        destroyEffect: {
            default: null,
            type: cc.Prefab,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.bossController = this.node.getComponent("BossController102");

        this.animation = this.node.getComponent(cc.Animation);

        // this.aimationState = this.animation.play(this.animation._clips[0].name);

        this.setStaying();

        this.soundController = cc.find("SoundController").getComponent("SoundController");

        //设置变量存储正在播放的音效ID
        this.audioEngine;

        if (this.mainCamera == null) {
            this.mainCamera = cc.find("Canvas/Main Camera");
        }

    },

    update(dt) {

        this.aimationState.speed = 3 * this.bossController.timeVectory;

    },

    setDead: function () {

        if (this.soundController.acousticSwitch) {

            //是否在摄像头显示范围内
            var isInCamera = this.judgePosition(this.node.x, this.node.y);

            if (isInCamera) {
                //播放死亡的音效
                this.audioEngine = cc.audioEngine.playEffect(this.audio[2], false);
            }
        }

        this.aimationState = this.animation.play(this.animation._clips[1].name);
        var newEffectPosition = [[-70, 150], [110, 0], [-60, -80]];

        for (let i = 0; i < 3; i++) {
            this.scheduleOnce(function () {
                var newEffect = cc.instantiate(this.destroyEffect);
                this.node.addChild(newEffect);
                newEffect.setPosition(newEffectPosition[i][0], newEffectPosition[i][1]);
            }, 0.5 * i);
        }

        this.isStaying = false;
        this.isHiting = false;
        this.isDead = true;
    },

    setStaying: function () {

        this.aimationState = this.animation.play(this.animation._clips[0].name);

        this.isStaying = true;
        this.isHiting = false;
        this.isDead = false;
    },

    setHitting: function () {

        if (this.soundController.acousticSwitch) {

            //是否在摄像头显示范围内
            var isInCamera = this.judgePosition(this.node.x, this.node.y);

            if (isInCamera) {
                //播放受击的音效
                this.audioEngine = cc.audioEngine.playEffect(this.audio[1], false);
            }
        }

        this.aimationState = this.animation.play(this.animation._clips[1].name);

        this.isStaying = false;
        this.isHiting = false;
        this.isDead = true;

        this.scheduleOnce(function () {
            this.setStaying();
        }, 1);
    },

    //判断节点是否在摄像头里面
    judgePosition: function (x, y) {
        if (x > this.mainCamera.x + this.mainCamera.width / 2 || x < this.mainCamera.x - this.mainCamera.width / 2 || y > this.mainCamera.y + this.mainCamera.height / 2 || y < this.mainCamera.y - this.mainCamera.height / 2) {
            return false;
        }
        return true;
    },
});
