cc.Class({
    extends: cc.Component,

    properties: {
        // 魔法预制体
        magicPrefab: {
            default: [],
            type: cc.Prefab,
        },

        //魔法发动的时间间隔(第一个时间为使用魔法时间 第二个时间魔法后续操作时间)
        spaceTime: {
            default: null,
            visible: false,
        },

        //时间间隔计时器
        spaceTimer: {
            default: 0,
            visible: false,
        },

        //魔法后续发动的次数
        magicTime: {
            default: 0,
            visible: false,
        },


        //显示魔法发动时间间隔的文字
        timeLabel: {
            default: null,
            visible: false,
        },

        //Boss的生命值
        life: {
            default: 3,
            // visible: false,
        },

        //选择的魔法类型
        magicType: {
            default: 0,
            visible: false,
        },

        bossStatus: {
            default: null,
            visible: false,
        },

        //----------------------------------------

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

        this.bossStatus = this.node.getComponent("BossStatus102");

        this.timeLabel = this.node.getChildByName("Timer").getComponent(cc.Label);

        this.timeController = cc.find("Canvas/Game/Character/TimeController").getComponent("TimeController");

        this.normalTimeVectory = this.timeController.timeVectory;

        this.spaceTime = [[1.8, 0.5], [1.5, 0.2], [2, 0.4], [1, 0.4]];

        this.selectMagicType();
    },

    update(dt) {
        this.timeVectory = this.timeController.timeVectory;

        this.spaceTimer -= dt * this.timeVectory;

        //改变上方显示的Boss瞄准倒计时
        this.timeLabel.string = this.spaceTimer < 0 ? 0 : parseInt(this.spaceTimer * 100);

        if (this.spaceTimer < 0) {
            console.log("type" + this.magicType);
            if (this.magicType == 0) {
                this.magicOne();
            }
            else if (this.magicType == 1) {
                this.magicTwo();
            }
            else if (this.magicType == 2) {
                this.magicThree();
            }
            else {
                this.magicFour();
            }
            if (this.bossStatus.soundController.acousticSwitch && this.timeVectory == this.normalTimeVectory) {

                //播放攻击的音效
                this.audioEngine = cc.audioEngine.playEffect(this.bossStatus.audio[0], false);
            }
        }

    },

    selectMagicType: function () {
        var random = Math.random() * 20;
        //1 2 3 4魔法发动的比例 6:6:3:6
        if (random >= 0 && random < 6) {
            random = 0;
        }
        else if (random >= 6 && random < 12) {
            random = 1;
        }
        else if (random >= 12 && random < 15) {
            random = 2;
        }
        else {
            random = 3;
        }
        this.spaceTimer = this.spaceTime[random][0];
        this.magicTime = 0;
        this.magicType = random;
    },

    //第一种魔法
    magicOne: function () {
        //如果刚开始发动魔法的瞬间
        if (this.magicTime == 0) {
            this.magicTime++;
            for (let i = 0; i < 8; i++) {
                //创建魔法节点
                var vector = cc.v2(1, 0);
                var newMagic = cc.instantiate(this.magicPrefab[0]);

                newMagic.opacity = 0;
                cc.tween(newMagic)
                    .to(0.2, { opacity: 255 })
                    .start();

                this.node.getParent().addChild(newMagic);
                newMagic.setPosition(this.node.x, this.node.y);
                //改变角度
                var realVector = 6.28 * i * 1 / 8;
                realVector = vector.rotate(realVector);
                newMagic.angle = -this.vectorsToDegress(realVector);
                //向质心施加力发射魔法
                newMagic.getComponent(cc.RigidBody).applyLinearImpulse(realVector.mul(113), newMagic.getComponent(cc.RigidBody).getWorldCenter(), true);
            }
            this.spaceTimer = this.spaceTime[this.magicType][1];
        }
        else {
            for (let i = 0; i < 8; i++) {
                //创建魔法节点
                var vector = cc.v2(1, 0);
                var newMagic = cc.instantiate(this.magicPrefab[0]);

                newMagic.opacity = 0;
                cc.tween(newMagic)
                    .to(0.2, { opacity: 255 })
                    .start();

                this.node.getParent().addChild(newMagic);
                newMagic.setPosition(this.node.x, this.node.y);
                //改变角度
                var realVector = 6.28 * i * 1 / 8 + 1 / 16 * 6.28;
                realVector = vector.rotate(realVector);
                newMagic.angle = -this.vectorsToDegress(realVector);
                //向质心施加力发射魔法
                newMagic.getComponent(cc.RigidBody).applyLinearImpulse(realVector.mul(113), newMagic.getComponent(cc.RigidBody).getWorldCenter(), true);
            }
            this.selectMagicType();
        }
    },

    //第二种魔法
    magicTwo: function () {
        this.magicTime++;
        var myPosition = this.player.convertToWorldSpaceAR(cc.v2(0, 0));
        var playerPosition = this.node.convertToWorldSpaceAR(cc.v2(0, 0));

        //创建魔法节点
        var vector = myPosition.sub(playerPosition).normalize();

        var newMagic = cc.instantiate(this.magicPrefab[0]);
        this.node.getParent().addChild(newMagic);
        newMagic.setPosition(this.node.x, this.node.y);

        //改变角度
        newMagic.angle = -this.vectorsToDegress(vector);
        //向质心施加力发射魔法
        newMagic.getComponent(cc.RigidBody).applyLinearImpulse(vector.mul(113), newMagic.getComponent(cc.RigidBody).getWorldCenter(), true);
        this.spaceTimer = this.spaceTime[this.magicType][1];

        if (this.magicTime == 8) {
            this.selectMagicType();
        }
    },

    //第三种魔法
    magicThree: function () {
        if (this.magicThreeDrection == null) {
            this.magicThreeDrection = 1;
        }
        else {
            this.magicThreeDrection = -this.magicThreeDrection;
        }

        for (let i = 0; i < 8; i++) {

            //创建魔法节点
            var vector = cc.v2(1, 0).mul(this.magicThreeDrection);
            var newMagic = cc.instantiate(this.magicPrefab[1]);
            newMagic.opacity = 0;
            cc.tween(newMagic)
                .to(0.2, { opacity: 255 })
                .start();
            this.node.getParent().addChild(newMagic);
            //改变角度
            var realVector = 6.28 * i * 1 / 8;
            realVector = vector.rotate(realVector);
            newMagic.setPosition(this.node.x + realVector.x * 300, this.node.y + realVector.y * 300);
            if (i == 7) {
                this.selectMagicType();
            }
        }
    },

    //第四种魔法
    magicFour: function () {
        this.magicTime++;
        var myPosition = this.player.convertToWorldSpaceAR(cc.v2(0, 0));
        var playerPosition = this.node.convertToWorldSpaceAR(cc.v2(0, 0));

        //创建魔法节点
        var vector = myPosition.sub(playerPosition).normalize();

        var newMagic = cc.instantiate(this.magicPrefab[1]);
        this.node.getParent().addChild(newMagic);
        newMagic.setPosition(this.node.x, this.node.y);

        //改变角度
        newMagic.angle = -this.vectorsToDegress(vector);
        //向质心施加力发射魔法
        newMagic.getComponent(cc.RigidBody).applyLinearImpulse(vector.mul(113), newMagic.getComponent(cc.RigidBody).getWorldCenter(), true);
        this.spaceTimer = this.spaceTime[this.magicType][1];

        if (this.magicTime == 6) {
            this.selectMagicType();
        }
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

    //当Boss收到攻击
    hitted: function () {
        this.life--;

        if (this.life <= 0) {
            this.die();
        }
        else {
            this.bossStatus.setHitting();
        }

        //被攻击后强制切换攻击状态
        this.selectMagicType();
        this.spaceTimer += 0.5;
    },

    die: function () {
        this.bossStatus.setDead();
        this.scheduleOnce(function () {
            this.node.destroy();
            cc.find("Canvas/Game").getComponent("Game").reduceEnemy();
        }, 2);
    },


    onCollisionEnter: function (other, self) {
        //摧毁敌人
        if (other.node.group == "Attack" && self.node.group == "Enemy" && !this.bossStatus.isHiting && !this.bossStatus.isDead) {
            this.hitted();
        }
    }
});
