cc.Class({
    extends: cc.Component,

    properties: {
        //敌人的朝向 -1为左 1为右
        lookDrection: {
            default: 1,
            visible: false,
        },

        // 魔法预制体
        magicPrefab: {
            default: [],
            type: cc.Prefab,
        },

        //魔法发动的时间间隔
        spaceTime: {
            default: 1.2,
        },

        //时间间隔计时器
        spaceTimer: {
            default: 0,
            visible: false,
        },

        //显示魔法发动时间间隔的文字
        timeLabel: {
            default: null,
            visible: false,
        },

        //Boss传送到对面的时间
        transmitTime: {
            default: 3,
        },

        //Boss传送到对面的初始冷却时间
        originTransmitTime: {
            default: 3,
            visible: false,
        },

        //Boss传送到对面时间的计时器
        transmitTimer: {
            default: 0,
            visible: false,
        },

        //Boss传送的坐标（只记录右半边）
        transmitPosition: {
            default: [],
            type: cc.Vec2
        },

        //魔法攻击时连发还是单发（连发时间间隔是单发的三倍 0为单发 1为连发）
        attackType: {
            default: 0,
            visible: false,
        },

        //Boss的生命值
        life: {
            default: 2,
            // visible: false,
        },

        //Boss的状态
        bossStatus: {
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

        //获取玩家节点以便获取玩家的坐标
        player: {
            default: null,
            type: cc.Node,
            visible: false,
        },

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},


    start() {

        this.player = cc.find("Canvas/Game/Character/Player");

        this.bossStatus = this.node.getComponent("BossStatus101");

        this.spaceTimer = this.spaceTime;

        this.timeLabel = this.node.getChildByName("Timer").getComponent(cc.Label);

        this.timeController = cc.find("Canvas/Game/Character/TimeController").getComponent("TimeController");

        this.normalTimeVectory = this.timeController.timeVectory;

        this.soundController = cc.find("SoundController").getComponent("SoundController");

        this.originTransmitTime = this.transmitTime;

        this.transmitTimer = this.transmitTime;

        //初始化为站立状态
        this.bossStatus.setStanding();

    },

    update(dt) {
        this.timeVectory = this.timeController.timeVectory;

        this.transmitTimer -= dt * this.timeVectory;

        //当y轴坐标低于-2000则直接判定死亡
        if (this.node.y <= -2000) {
            this.die(this.lookDrection);
        }

        var distance = Math.abs(this.player.x - this.node.x);
        if (this.transmitTimer < 0 && distance <= 125) {
            this.transmit();
        }

        if (this.bossStatus.isAiming || this.bossStatus.isStanding) {
            this.doAim(dt);
        }

    },

    doAim: function (dt) {
        //进入瞄准状态
        this.spaceTimer -= dt * this.timeVectory;

        //设置为瞄准状态
        this.bossStatus.setAiming();

        if (this.player.x > this.node.x) {
            this.lookDrection = 1;
        }
        else if (this.player.x < this.node.x) {
            this.lookDrection = -1;
        }
        //如果魔法发动剩余时间为零 则发动魔法
        if (this.spaceTimer < 0) {
            var myPosition = this.player.convertToWorldSpaceAR(cc.v2(0, 0));
            var playerPosition = this.node.convertToWorldSpaceAR(cc.v2(0, 0));

            this.magicAttack(myPosition.sub(playerPosition).normalize());

            //是否在摄像头显示范围内
            var isInCamera = this.bossStatus.judgePosition(this.node.x, this.node.y);

            if (this.bossStatus.soundController.acousticSwitch && this.normalTimeVectory == this.timeVectory && isInCamera) {
                cc.audioEngine.playEffect(this.bossStatus.audio[1], false);
            }
        }

        //改变上方显示的玩家瞄准倒计时
        this.timeLabel.string = this.spaceTimer < 0 ? 0 : parseInt(this.spaceTimer * 100);

    },

    //进行攻击操作
    magicAttack: function (vector) {
        if (this.attackType == 0) {
            //创建魔法节点
            var index = parseInt(Math.random() * 2);
            var newMagic = cc.instantiate(this.magicPrefab[index]);

            this.node.getParent().addChild(newMagic);
            newMagic.setPosition(this.node.x, this.node.y);

            //改变角度
            newMagic.angle = -this.vectorsToDegress(vector);
            var newMagicRigidBody = newMagic.getComponent(cc.RigidBody);
            //向质心施加速度发射魔法
            newMagicRigidBody.applyLinearImpulse(vector.mul(113), newMagicRigidBody.getWorldCenter(), true);
        }
        else if (this.attackType == 1) {
            var index = parseInt(Math.random() * 2);
            //当index=0时是飞叶快刀
            if (index == 0) {
                for (let i = 0; i < 3; i++) {
                    //创建魔法节点
                    var newMagic = cc.instantiate(this.magicPrefab[index]);
                    newMagic.opacity = 0;
                    cc.tween(newMagic)
                        .to(0.2, { opacity: 255 })
                        .start();
                    this.node.getParent().addChild(newMagic);
                    newMagic.setPosition(this.node.x, this.node.y);
                    //改变角度
                    var realVector = 0.2 - i * 0.2;
                    realVector = vector.rotate(realVector);
                    newMagic.angle = -this.vectorsToDegress(realVector);
                    var newMagicRigidBody = newMagic.getComponent(cc.RigidBody);
                    //向质心施加速度发射魔法
                    newMagicRigidBody.applyLinearImpulse(realVector.mul(113), newMagicRigidBody.getWorldCenter(), true);
                }
            }
            //否则（index=1）是能量球
            else {
                for (let i = 0; i < 2; i++) {
                    //创建魔法节点
                    var newMagic = cc.instantiate(this.magicPrefab[index]);
                    newMagic.opacity = 0;
                    cc.tween(newMagic)
                        .to(0.2, { opacity: 255 })
                        .start();
                    this.node.getParent().addChild(newMagic);
                    newMagic.setPosition(this.node.x, this.node.y);
                    //改变角度
                    var realVector = 0.1 - i * 0.2;
                    realVector = vector.rotate(realVector);
                    var newMagicRigidBody = newMagic.getComponent(cc.RigidBody);
                    //向质心施加速度发射魔法
                    newMagicRigidBody.applyLinearImpulse(realVector.mul(113), newMagicRigidBody.getWorldCenter(), true);
                }
            }

        }
        this.selectAttackType();

    },

    //将发射向量转化成角度
    vectorsToDegress: function (dirVec) {
        // 水平向右的对比向量
        let comVec = cc.v2(1, 0);
        // 求方向向量与对比向量间的弧度
        let radian = dirVec.signAngle(comVec);
        // 将弧度转换为角度
        let degree = cc.misc.radiansToDegrees(radian);
        return degree;
    },

    //Boss传送到对面
    transmit: function () {

        var random = parseInt(Math.random() * 5);

        if (this.life >= 2) {
            //第一阶段 出现在1 2 3层的概率是1:2:2
            if (random == 0) {
                random = 0;
            }
            else if (random > 0 && random < 3) {
                random = 1;
            }
            else {
                random = 2;
            }
        }
        else if (this.life == 1) {
            //第一阶段 出现在1 2 3层的概率是0:3:2
            if (random >= 0 && random < 3) {
                random = 1;
            }
            else {
                random = 2;
            }
        }
        else {
            return;
        }

        if (this.node.x > 0) {
            this.node.setPosition(-this.transmitPosition[random].x, this.transmitPosition[random].y);
        }
        else {
            this.node.setPosition(this.transmitPosition[random].x, this.transmitPosition[random].y);
        }

        //每一次传送都会增加下一次传送的冷却时间
        this.transmitTime += 1.5;
        this.transmitTimer = this.transmitTime;
    },

    //选择魔法攻击的方式（是单发还是连发）
    selectAttackType: function () {
        //当处于第一阶段时只能使用单发魔法
        if (this.life >= 2) {
            this.attackType = 0;
            this.spaceTimer = this.spaceTime;
        }
        //当处于第二阶段则可以选择单发还是连发
        else if (this.life == 1) {
            var type = parseInt(Math.random() * 5);
            if (type == 4) {
                this.attackType = 1;
                this.spaceTimer = this.spaceTime * 2;
            }
            else {
                this.attackType = 0;
                this.spaceTimer = this.spaceTime;
            }
        }
    },

    //当Boss收到攻击
    hitted: function (drecion) {
        this.life--;

        if (this.life <= 0) {
            this.die(drecion);
        }
        else {
            //转化成为下一阶段
            //重置传送冷却时间
            this.transmitTime = this.originTransmitTime;
            this.bossStatus.setHitting(drecion);
            //0.2秒后传送左上位置或右上位置
            this.scheduleOnce(function () {
                if (this.node.x > 0) {
                    this.node.setPosition(-this.transmitPosition[2].x, this.transmitPosition[2].y);
                }
                else {
                    this.node.setPosition(this.transmitPosition[2].x, this.transmitPosition[2].y);
                }
                this.bossStatus.isHiting = false;
                this.bossStatus.setStanding();
            }, 0.2);
        }
    },

    die: function (drection) {
        this.bossStatus.setDead(drection);
        this.scheduleOnce(function () {
            this.node.destroy();
            cc.find("Canvas/Game").getComponent("Game").reduceEnemy();
        }, 2);
    },

    onCollisionEnter: function (other, self) {
        //摧毁敌人
        console.log(self.node.isHiting);
        if (other.node.group == "Attack" && self.node.group == "Enemy" && !this.bossStatus.isHiting && !this.bossStatus.isDead) {
            var drecion;
            if (other.node.getParent().x > self.node.x) {
                drecion = 1;
            }
            else {
                drecion = -1;
            }
            this.hitted(drecion);
        }
    }
});
