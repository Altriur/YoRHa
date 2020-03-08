cc.Class({
    extends: cc.Component,

    properties: {
        //是否死亡
        isDead: {
            default: false,
            visible: false,
        },

        //是否处于站立状态
        isStanding: {
            default: true,
            visible: false,
        },

        //是否处于瞄准状态
        isAiming: {
            default: false,
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

        //Boss变化成为怪物后的样子
        monster: {
            default: null,
            visible: false,
        },

    },


    onLoad() {

    },

    start() {

        this.bossController = this.node.getComponent("BossController101");

        this.animation = this.node.getComponent(cc.Animation);

        this.animation.play(this.animation._clips[0].name);

        this.soundController = cc.find("SoundController").getComponent("SoundController");

        this.monster = this.node.getParent().getChildByName("Boss0102");

        //设置变量存储正在播放的音效ID
        this.audioEngine;

        if (this.mainCamera == null) {
            this.mainCamera = cc.find("Canvas/Main Camera");
        }

    },

    update(dt) {
        if (this.isDead) {
            return;
        }

        if (this.isStanding) {
            if (this.bossController.lookDrection == 1 && this.animation.currentClip.name != this.animation._clips[1].name) {
                this.animation.play(this.animation._clips[1].name);
            }
            else if (this.bossController.lookDrection == -1 && this.animation.currentClip.name != this.animation._clips[0].name) {
                this.animation.play(this.animation._clips[0].name);
            }
        }
        else if (this.isAiming) {
            if (this.bossController.lookDrection == 1 && this.animation.currentClip.name != this.animation._clips[3].name) {
                this.animation.play(this.animation._clips[3].name);
            }
            else if (this.bossController.lookDrection == -1 && this.animation.currentClip.name != this.animation._clips[2].name) {
                this.animation.play(this.animation._clips[2].name);
            }
        }
    },

    setDead: function (drection) {

        if (this.soundController.acousticSwitch) {

            //是否在摄像头显示范围内
            var isInCamera = this.judgePosition(this.node.x, this.node.y);

            if (isInCamera) {
                //播放死亡的音效
                this.audioEngine = cc.audioEngine.playEffect(this.audio[0], false);
            }
        }

        if (drection == 1) {
            this.animation.play(this.animation._clips[7].name);
        }
        else if (drection == -1) {
            this.animation.play(this.animation._clips[6].name);
        }

        cc.tween(this.monster)
            .to(1, { opacity: 255 })
            .start();

        //隔0.5秒播放音效
        this.scheduleOnce(function () {
            this.monster.getComponent("Boss_Monster_Laugh").laugh();
        }, 0.5);

        this.isDead = true;
        this.isHiting = false;
        this.isStanding = false;
        this.isAiming = false;
    },

    setStanding: function () {
        //如果处于死亡状态则不改变成其他状态
        if (this.isDead || this.isHiting) {
            return;
        }

        this.isStanding = true;
        this.isAiming = false;
    },

    setAiming: function () {
        //如果处于死亡状态则不改变成其他状态
        if (this.isDead || this.isHiting) {
            return;
        }

        this.isStanding = false;
        this.isAiming = true;
    },

    setHitting: function (drection) {
        //如果处于死亡状态则不改变成其他状态
        if (this.isDead) {
            return;
        }

        if (this.soundController.acousticSwitch) {
            //是否在摄像头显示范围内
            var isInCamera = this.judgePosition(this.node.x, this.node.y);

            if (isInCamera) {
                //播放受击的音效
                this.audioEngine = cc.audioEngine.playEffect(this.audio[0], false);
            }
        }

        if (drection == 1) {
            this.animation.play(this.animation._clips[5].name);
        }
        else if (drection == -1) {
            this.animation.play(this.animation._clips[4].name);
        }

        this.isHiting = true;
        this.isStanding = false;
        this.isAiming = false;
    },

    //判断节点是否在摄像头里面
    judgePosition: function (x, y) {
        if (x > this.mainCamera.x + this.mainCamera.width / 2 || x < this.mainCamera.x - this.mainCamera.width / 2 || y > this.mainCamera.y + this.mainCamera.height / 2 || y < this.mainCamera.y - this.mainCamera.height / 2) {
            return false;
        }
        return true;
    },
});
