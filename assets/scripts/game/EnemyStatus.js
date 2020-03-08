cc.Class({
    extends: cc.Component,

    properties: {
        //是否死亡
        isDead: {
            default: false,
            visible: true,
        },

        //是否处于站立状态
        isStanding: {
            default: true,
            visible: false,
        },

        //是否处于奔跑状态
        isMoving: {
            default: true,
            visible: false,
        },

        //是否处于自然下落状态
        isFalling: {
            default: false,
            visible: false,
        },

        //是否处于跳跃状态
        isJumping: {
            default: false,
            visible: false,
        },

        //是否处于瞄准状态
        isAiming: {
            default: false,
            visible: false,
        },

        //该节点的动画组件
        animation: {
            default: null,
            visible: false,
        },

        //节点播放动画的函数
        aimationState: {
            default: null,
            visible: false,
        },

        //该节点上的敌人控制组件
        enemyController: {
            default: null,
            visible: false,
        },
        //---------------------------------------------------------------

        //时间控制者
        timeController: {
            default: null,
            visible: false,
        },

        //时间流速
        timeVectory: {
            default: 1,
            visible: false,
        },

        //正常时间流速
        normalTimeVectory: {
            default: 1,
            visible: false,
        },

        //---------------------------------------------------------------
        //用于储存敌人的各种音效
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


    },

    // onLoad () {},

    onDestroy() {
        //暂停正在播放的音效
        cc.audioEngine.stopEffect(this.audioEngine);
    },

    start() {
        this.enemyController = this.node.getComponent("EnemyController");

        this.animation = this.node.getComponent(cc.Animation);

        this.aimationState = this.animation.play(this.animation._clips[0].name);

        this.timeController = cc.find("Canvas/Game/Character/TimeController").getComponent("TimeController");

        this.soundController = cc.find("SoundController").getComponent("SoundController");

        //设置变量存储正在播放的音效ID
        this.audioEngine;

        //记录正常时间流速
        this.normalTimeVectory = this.timeController.normalTimeVectory;

        this.mainCamera = cc.find("Canvas/Main Camera");
    },

    update(dt) {

        if (this.isDead) {
            return;
        }

        if (this.isStanding) {
            if (this.enemyController.lookDrection == 1 && this.animation.currentClip.name != this.animation._clips[1].name) {
                this.aimationState = this.animation.play(this.animation._clips[1].name);
            }
            else if (this.enemyController.lookDrection == -1 && this.animation.currentClip.name != this.animation._clips[0].name) {
                this.aimationState = this.animation.play(this.animation._clips[0].name);
            }
        }
        else if (this.isMoving) {
            if (this.enemyController.lookDrection == 1 && this.animation.currentClip.name != this.animation._clips[3].name) {
                this.aimationState = this.animation.play(this.animation._clips[3].name);
            }
            else if (this.enemyController.lookDrection == -1 && this.animation.currentClip.name != this.animation._clips[2].name) {
                this.aimationState = this.animation.play(this.animation._clips[2].name);
            }
        }
        else if (this.isJumping) {
            if (this.enemyController.lookDrection == 1 && this.animation.currentClip.name != this.animation._clips[5].name) {
                this.aimationState = this.animation.play(this.animation._clips[5].name);
            }
            else if (this.enemyController.lookDrection == -1 && this.animation.currentClip.name != this.animation._clips[4].name) {
                this.aimationState = this.animation.play(this.animation._clips[4].name);
            }
        }
        else if (this.isFalling) {
            if (this.enemyController.lookDrection == 1 && this.animation.currentClip.name != this.animation._clips[7].name) {
                this.aimationState = this.animation.play(this.animation._clips[7].name);
            }
            else if (this.enemyController.lookDrection == -1 && this.animation.currentClip.name != this.animation._clips[6].name) {
                this.aimationState = this.animation.play(this.animation._clips[6].name);
            }
        }
        else if (this.isAiming) {
            if (this.enemyController.lookDrection == 1 && this.animation.currentClip.name != this.animation._clips[9].name) {
                this.aimationState = this.animation.play(this.animation._clips[9].name);
            }
            else if (this.enemyController.lookDrection == -1 && this.animation.currentClip.name != this.animation._clips[8].name) {
                this.aimationState = this.animation.play(this.animation._clips[8].name);
            }
        }

        this.timeVectory = this.timeController.timeVectory;

        this.aimationState.speed = 3 * this.timeVectory;

    },

    setDead: function (drection) {
        if (this.soundController.acousticSwitch) {
            //暂停正在播放的音效
            cc.audioEngine.stopEffect(this.audioEngine);

            //是否在摄像头显示范围内
            var isInCamera = this.judgePosition(this.node.x, this.node.y);

            if (isInCamera) {
                //播放死亡的音效
                this.audioEngine = cc.audioEngine.playEffect(this.audio[1], false, 0.4);
            }
        }

        if (drection == 1) {
            this.animation.play(this.animation._clips[11].name);
        }
        else if (drection == -1) {
            this.animation.play(this.animation._clips[10].name);
        }

        this.isDead = true;
    },

    setStanding: function () {
        //如果处于死亡状态则不改变成其他状态
        if (this.isDead) {
            return;
        }

        if (this.soundController.acousticSwitch) {
            //暂停正在播放的音效
            cc.audioEngine.stopEffect(this.audioEngine);
        }

        this.isStanding = true;
        this.isMoving = false;
        this.isFalling = false;
        this.isJumping = false;
        this.isAiming = false;
    },
    setMoving: function () {
        //如果处于死亡状态则不改变成其他状态
        if (this.isDead) {
            return;
        }

        if (this.soundController.acousticSwitch) {
            //暂停正在播放的音效
            cc.audioEngine.stopEffect(this.audioEngine);
            //播放移动的音效
            if (this.timeVectory == this.normalTimeVectory && isInCamera) {
                this.audioEngine = cc.audioEngine.playEffect(this.audio[0], true, 0.1);
            }
        }

        //是否在摄像头显示范围内
        var isInCamera = this.judgePosition(this.node.x, this.node.y);

        this.isStanding = false;
        this.isMoving = true;
        this.isFalling = false;
        this.isJumping = false;
        this.isAiming = false;
    },
    setFalling: function () {
        //如果处于死亡状态则不改变成其他状态
        if (this.isDead) {
            return;
        }

        if (this.soundController.acousticSwitch) {
            //暂停正在播放的音效
            cc.audioEngine.stopEffect(this.audioEngine);
        }

        this.isStanding = false;
        this.isMoving = false;
        this.isFalling = true;
        this.isJumping = false;
        this.isAiming = false;
    },
    setJumping: function () {
        //如果处于死亡状态则不改变成其他状态
        if (this.isDead) {
            return;
        }

        if (this.soundController.acousticSwitch) {
            //暂停正在播放的音效
            cc.audioEngine.stopEffect(this.audioEngine);
        }

        this.isStanding = false;
        this.isMoving = false;
        this.isFalling = false;
        this.isJumping = true;
        this.isAiming = false;
    },
    setAiming: function () {
        //如果处于死亡状态则不改变成其他状态
        if (this.isDead) {
            return;
        }

        if (this.soundController.acousticSwitch) {
            //暂停正在播放的音效
            cc.audioEngine.stopEffect(this.audioEngine);
        }

        this.isStanding = false;
        this.isMoving = false;
        this.isFalling = false;
        this.isJumping = false;
        this.isAiming = true;
    },

    //判断节点是否在摄像头里面
    judgePosition: function (x, y) {
        if (x > this.mainCamera.x + this.mainCamera.width / 2 || x < this.mainCamera.x - this.mainCamera.width / 2 || y > this.mainCamera.y + this.mainCamera.height / 2 || y < this.mainCamera.y - this.mainCamera.height / 2) {
            return false;
        }
        return true;
    },
});
