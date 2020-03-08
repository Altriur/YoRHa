cc.Class({
    extends: cc.Component,

    properties: {
        //是否处于静止
        isStatic: {
            default: true,
            visible: false,
        },

        //是否处于运动
        isAthletic: {
            default: false,
            visible: false,
        },

        //是否死亡（当死亡时时间一直处于慢速状态）
        isDead: {
            default: false,
            visible: false,
        },

        // 静止与运动（非死亡）属于总领状态 
        // 站立，属于静止状态
        // 奔跑，下落，跳跃，攻击属于运动状态
        // 防御由于在空中是运动状态 在地面是静止状态

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

        //是否处于攻击状态
        isAttacking: {
            default: false,
            visible: false,
        },

        //是否实处防御状态
        isDefending: {
            default: false,
            visible: false,
        },

        //该节点的PlayerController组件
        playerController: {
            default: false,
            visible: false,
        },

        //该节点的动画组件
        animation: {
            default: null,
            visible: false,
        },

        //存储玩家运动时的各个音效
        audio: {
            default: [],
            type: cc.AudioClip
        },

        //声音控制者节点
        soundController: {
            default: null,
            visible: false,
        },

    },

    onDestroy() {
        //暂停正在播放的音效
        cc.audioEngine.stopEffect(this.audioEngine);
    },

    // onLoad () {},

    start() {
        this.animation = this.node.getComponent(cc.Animation);

        this.playerController = this.node.getComponent("PlayerController");

        this.animation.play("Player_Stand_Right");

        if (this.soundController == null) {
            this.soundController = cc.find("SoundController").getComponent("SoundController");
        }

        //设置变量存储正在播放的音效ID
        this.audioEngine;
    },

    update(dt) {

        if (this.isDead) {
            return;
        }


        // 动画播放部分
        if (this.isStanding) {
            if (this.playerController.lookDrection == 1 && this.animation.currentClip.name != "Player_Stand_Right") {
                this.animation.play("Player_Stand_Right");
            }
            else if (this.playerController.lookDrection == -1 && this.animation.currentClip.name != "Player_Stand_Left") {
                this.animation.play("Player_Stand_Left");
            }
        }
        else if (this.isMoving) {
            if (this.playerController.lookDrection == 1 && this.animation.currentClip.name != "Player_Walk_Right") {
                this.animation.play("Player_Walk_Right");
            }
            else if (this.playerController.lookDrection == -1 && this.animation.currentClip.name != "Player_Walk_Left") {
                this.animation.play("Player_Walk_Left");
            }
        }
        else if (this.isJumping) {
            if (this.playerController.lookDrection == 1 && this.animation.currentClip.name != "Player_Jump_Right") {
                this.animation.play("Player_Jump_Right");
            }
            else if (this.playerController.lookDrection == -1 && this.animation.currentClip.name != "Player_Jump_Left") {
                this.animation.play("Player_Jump_Left");
            }
        }
        else if (this.isFalling) {
            if (this.playerController.lookDrection == 1 && this.animation.currentClip.name != "Player_Fall_Right") {
                this.animation.play("Player_Fall_Right");
            }
            else if (this.playerController.lookDrection == -1 && this.animation.currentClip.name != "Player_Fall_Left") {
                this.animation.play("Player_Fall_Left");
            }
        }
        else if (this.isAttacking) {
            if (this.node.getComponent(cc.RigidBody).linearVelocity.y == 0) {
                if (this.playerController.lookDrection == 1 && this.animation.currentClip.name != "Player_Attack_Floor_Right" && this.animation.currentClip.name != "Player_Attack_Sky_Right") {
                    this.animation.play("Player_Attack_Floor_Right");
                }
                else if (this.playerController.lookDrection == -1 && this.animation.currentClip.name != "Player_Attack_Floor_Left" && this.animation.currentClip.name != "Player_Attack_Sky_Left") {
                    this.animation.play("Player_Attack_Floor_Left");
                }
            }
            else {
                if (this.playerController.lookDrection == 1 && this.animation.currentClip.name != "Player_Attack_Sky_Right" && this.animation.currentClip.name != "Player_Attack_Floor_Right") {
                    this.animation.play("Player_Attack_Sky_Right");
                }
                else if (this.playerController.lookDrection == -1 && this.animation.currentClip.name != "Player_Attack_Sky_Left" && this.animation.currentClip.name != "Player_Attack_Floor_Left") {
                    this.animation.play("Player_Attack_Sky_Left");
                }
            }
        }
        else if (this.isDefending) {
            if (this.playerController.lookDrection == 1 && this.animation.currentClip.name != "Player_Defense_Right") {
                this.animation.play("Player_Defense_Right");
            }
            else if (this.playerController.lookDrection == -1 && this.animation.currentClip.name != "Player_Defense_Left") {
                this.animation.play("Player_Defense_Left");
            }
        }

    },

    setStanding: function () {
        //如果处于死亡状态则不改变成其他状态
        if (this.isDead) {
            return;
        }

        if (this.soundController == null) {
            this.soundController = cc.find("SoundController").getComponent("SoundController");
        }

        if (this.soundController.acousticSwitch) {
            //暂停正在播放的音效
            cc.audioEngine.stopEffect(this.audioEngine);
        }

        this.setStatic();
        this.isStanding = true;
        this.isMoving = false;
        this.isFalling = false;
        this.isJumping = false;
        this.isAttacking = false;
        this.isDefending = false;

    },
    setMoving: function () {
        //如果处于死亡状态则不改变成其他状态
        if (this.isDead) {
            return;
        }

        if (this.soundController == null) {
            this.soundController = cc.find("SoundController").getComponent("SoundController");
        }

        if (this.soundController.acousticSwitch) {
            //暂停正在播放的音效
            cc.audioEngine.stopEffect(this.audioEngine);
            //播放移动的音效
            this.audioEngine = cc.audioEngine.playEffect(this.audio[0], true);
        }

        this.setAthletic();
        this.isStanding = false;
        this.isMoving = true;
        this.isFalling = false;
        this.isJumping = false;
        this.isAttacking = false;
        this.isDefending = false;

    },
    setFalling: function () {
        //如果处于死亡状态则不改变成其他状态
        if (this.isDead) {
            return;
        }

        if (this.soundController == null) {
            this.soundController = cc.find("SoundController").getComponent("SoundController");
        }

        if (this.soundController.acousticSwitch) {
            //暂停正在播放的音效
            cc.audioEngine.stopEffect(this.audioEngine);
        }

        this.setAthletic();
        this.isStanding = false;
        this.isMoving = false;
        this.isFalling = true;
        this.isJumping = false;
        this.isAttacking = false;
        this.isDefending = false;
    },
    setJumping: function () {
        //如果处于死亡状态则不改变成其他状态
        if (this.isDead) {
            return;
        }

        if (this.soundController == null) {
            this.soundController = cc.find("SoundController").getComponent("SoundController");
        }

        if (this.soundController.acousticSwitch) {
            //暂停正在播放的音效
            cc.audioEngine.stopEffect(this.audioEngine);
            //播放跳跃音效
            this.audioEngine = cc.audioEngine.playEffect(this.audio[1], false);
        }

        this.setAthletic();
        this.isStanding = false;
        this.isMoving = false;
        this.isFalling = false;
        this.isJumping = true;
        this.isAttacking = false;
        this.isDefending = false;

    },
    setAttacking: function () {
        //如果处于死亡状态则不改变成其他状态
        if (this.isDead) {
            return;
        }

        if (this.soundController == null) {
            this.soundController = cc.find("SoundController").getComponent("SoundController");
        }

        if (this.soundController.acousticSwitch) {
            //暂停正在播放的音效
            cc.audioEngine.stopEffect(this.audioEngine);
            //播放跳跃音效
            this.audioEngine = cc.audioEngine.playEffect(this.audio[2], false);
        }

        this.setAthletic();
        this.isStanding = false;
        this.isMoving = false;
        this.isFalling = false;
        this.isJumping = false;
        this.isAttacking = true;
        this.isDefending = false;

    },
    setDefending: function () {
        //如果处于死亡状态则不改变成其他状态
        if (this.isDead) {
            return;
        }

        if (this.soundController == null) {
            this.soundController = cc.find("SoundController").getComponent("SoundController");
        }

        if (this.soundController.acousticSwitch) {
            //暂停正在播放的音效
            cc.audioEngine.stopEffect(this.audioEngine);
            //播放死亡音效
            this.audioEngine = cc.audioEngine.playEffect(this.audio[3], false);
        }

        //若转换之前处于跳跃或下落状态则处于运动状态 否则处于静止状态
        if (this.isFalling || this.isJumping) {
            this.setAthletic();
        }
        else {
            this.setStatic();
        }

        this.isStanding = false;
        this.isMoving = false;
        this.isFalling = false;
        this.isJumping = false;
        this.isAttacking = false;
        this.isDefending = true;

    },
    setStatic: function () {
        this.isStatic = true;
        this.isAthletic = false;
    },
    setAthletic: function () {
        this.isStatic = false;
        this.isAthletic = true;
    },
    setDead: function (lookDrection) {

        this.isDead = true;

        if (this.soundController == null) {
            this.soundController = cc.find("SoundController").getComponent("SoundController");
        }

        if (this.soundController.acousticSwitch) {
            //暂停正在播放的音效
            cc.audioEngine.stopEffect(this.audioEngine);
            //播放死亡音效
            this.audioEngine = cc.audioEngine.playEffect(this.audio[4], false);
        }

        if (lookDrection == -1) {
            var animationState = this.animation.play("Player_Die_Left");
            var timeVectory = cc.find("Canvas/Game/Character/TimeController").getComponent("TimeController").shortTimeVectory;
            animationState.speed *= timeVectory;
        }
        else if (lookDrection == 1) {
            var animationState = this.animation.play("Player_Die_Right");
            var timeVectory = cc.find("Canvas/Game/Character/TimeController").getComponent("TimeController").shortTimeVectory;
            animationState.speed *= timeVectory;
        }
    },

});
