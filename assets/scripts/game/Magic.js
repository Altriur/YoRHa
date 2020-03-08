cc.Class({
    extends: cc.Component,

    properties: {
        //记录魔法对盾牌的伤害
        magicDamage: 0,

        //记录魔法的射速
        magicRate: 0,

        //魔法是否具有穿透性
        isPenetrativity: false,

        //是否有爆炸伤害（如果有则爆炸动画具有伤害）
        isAftereffect: false,

        //魔法持续时间
        magicTime: 10,

        //魔法爆裂时的音效
        breakAudio: {
            default: null,
            type: cc.AudioClip,
        },

        //是否存在（由于播放消失动画时仍然存在对玩家的判定 加该变量来防止这种情况的发生）
        isAlive: {
            default: true,
            visible: false,
        },

        //该节点的刚体组件
        rigidBody: {
            default: null,
            visible: false,
        },

        //刚体组件的线性速度
        linearVelocity: {
            default: null,
            visible: false,
        },

        //该节点的动画组件
        animation: {
            default: null,
            visible: false,
        },

        //当前动画的动画数据承载
        animationState: {
            default: null,
            visible: false,
        },

        //----------------------------------------------------------------------------------------------

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
            default: null,
            visible: false,
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


    onLoad() {
        this.animation = this.node.getComponent(cc.Animation);

        this.animation.on('finished', this.onFinished, this);
    },

    onDestroy() {
        this.animation.off('finished', this.onFinished, this);
        
    },

    start() {
        this.timeController = cc.find("Canvas/Game/Character/TimeController").getComponent("TimeController");

        this.rigidBody = this.node.getComponent(cc.RigidBody);

        //刚体线性速度乘以速度补正magicRate
        this.linearVelocity = this.rigidBody.linearVelocity.mul(this.magicRate);

        console.log(this.rigidBody.linearVelocity ," ", this.linearVelocity);

        this.animationState = this.animation.play();

        this.normalTimeVectory = this.timeController.normalTimeVectory;

        this.mainCamera = cc.find("Canvas/Main Camera");

        if (this.soundController == null) {
            this.soundController = cc.find("SoundController").getComponent("SoundController");
        }

        //存在以下这种情况：当magic生成时直接接触碰撞块 本来在执行playDeadAnimation的方法
        //但后又执行了onload和start的方法 导致playDeadAnimation方法的效果没有完全执行所以在start后边加上isAlive的判定 当isAlive直接播放爆炸动画
        if (!this.isAlive) {
            this.playDeadAnimation();
            this.playDeadAudio(true);
        }
    },

    update(dt) {

        this.timeVectory = this.timeController.timeVectory;

        this.magicTime -= dt * this.timeVectory;

        this.animationState.speed = this.timeVectory * 3;

        //超过魔法持续时间自然死亡
        if (this.magicTime <= 0 && this.isAlive) {
            this.playDeadAnimation();
            this.playDeadAudio(false);
        }

        this.rigidBody.linearVelocity = this.linearVelocity.mul(this.timeVectory);
    },

    //播放死亡动画
    playDeadAnimation: function () {

        this.isAlive = false;

        this.animationState = this.animation.play(this.animation._clips[1].name);

        this.linearVelocity = cc.v2(0, 0);

    },

    //播放死亡音效(isPlay表示必定播放状态)
    playDeadAudio: function (isPlay) {
        //存在玩家站在敌人身边的情况此时start代码还没执行完就判定爆炸了（这样会发生报错） 于是使用这种办法来判断是否成功获取SoundController 如果尚未获取则SoundController马上获取一遍

        if (this.soundController == null) {
            this.soundController = cc.find("SoundController").getComponent("SoundController");
        }

        if (!this.soundController.acousticSwitch) {
            return;
        }

        if (isPlay) {
            cc.audioEngine.playEffect(this.breakAudio, false);
        }
        else if (this.timeVectory == this.normalTimeVectory) {
            var isInCamera = this.judgePosition(this.node.x, this.node.y);

            if (isInCamera) {
                cc.audioEngine.playEffect(this.breakAudio, false);
            }
        }
    },

    //判断节点是否在摄像头里面
    judgePosition: function (x, y) {
        if (x > this.mainCamera.x + this.mainCamera.width / 2 || x < this.mainCamera.x - this.mainCamera.width / 2 || y > this.mainCamera.y + this.mainCamera.height / 2 || y < this.mainCamera.y - this.mainCamera.height / 2) {
            return false;
        }
        return true;
    },

    onFinished: function () {
        this.node.destroy();
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (otherCollider.node.group == "Obstruction" && !this.isPenetrativity && this.isAlive) {
            this.playDeadAnimation();
            this.playDeadAudio(false);
        }

        if (otherCollider.node.group == "Player" && !otherCollider.node.getComponent("PlayerStatus").isDead) {
            //如果存在爆炸余波则不管是否isAlive==true都攻击有效
            if (this.isAftereffect) {
                otherCollider.node.getComponent("PlayerController").die();
                if (this.isAlive) {
                    this.playDeadAnimation();
                    this.playDeadAudio(true);
                }
            }
            //如果不存在爆炸余波则判断isAlive是否为true
            else if (this.isAlive) {
                otherCollider.node.getComponent("PlayerController").die();
                this.playDeadAnimation();
                this.playDeadAudio(true);
            }
        }
    },
});
