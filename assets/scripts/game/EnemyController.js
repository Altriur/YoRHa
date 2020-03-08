cc.Class({
    extends: cc.Component,

    properties: {

        //移动速度
        moveSpeed: 200,

        //移动方向
        moveX: {
            default: 0,
            visible: false,
        },

        //敌人的朝向 -1为左 1为右
        lookDrection: {
            default: 1,
            visible: false,
        },

        //是否跟随玩家 初始化为false(当player跟AI敌人达到一定距离才会跟随)
        isFollow: {
            default: false,
            visible: false,
        },

        //敌人受到攻击时闪避闪避率 100为100%（幻术魔法师为70(70%) 其他）
        dodgeChance: 0,

        //敌人现在的闪避概率
        dodgePresent: {
            default: null,
            visible: false,
        },

        // 魔法预制体
        magicPrefab: {
            default: null,
            type: cc.Prefab,
        },

        //魔法发动的时间间隔
        spaceTime: {
            default: 1,
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

        //敌人状态
        enemyStatus: {
            default: null,
            visible: false,
        },

        //该节点的刚体
        rigidBody: {
            default: null,
            visible: false,
        },

        //记录敌人跳跃变量组件
        enemyJump: {
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

        //---------------------------------------------------------------

        //获取玩家节点以便获取玩家的坐标
        player: {
            default: null,
            type: cc.Node,
            visible: false,
        },

        //获取摄像头节点以判断是否需要播放音效
        mainCamera: {
            default: null,
            type: cc.Node,
            visible: false,
        },

    },

    // onLoad () {},

    start() {
        this.player = cc.find("Canvas/Game/Character/Player");

        this.spaceTimer = this.spaceTime;

        this.timeLabel = this.node.getChildByName("Timer").getComponent(cc.Label);

        this.timeController = cc.find("Canvas/Game/Character/TimeController").getComponent("TimeController");

        this.rigidBody = this.node.getComponent(cc.RigidBody);

        this.enemyStatus = this.node.getComponent("EnemyStatus");

        this.enemyJump = this.node.getComponent("EnemyJump");

        this.mainCamera = cc.find("Canvas/Main Camera");

        //一开始闪避率为最高闪避
        this.dodgePresent = this.dodgeChance;
    },

    update(dt) {

        this.timeVectory = this.timeController.timeVectory;

        //如果当前闪避率低于刚开始的闪避率则1秒回10点
        if (this.dodgePresent < this.dodgeChance) {
            this.dodgePresent += dt * 10 * this.timeVectory;
        }

        if (!this.isFollow) {
            if (Math.abs(this.node.x - this.player.x) <= 300 && Math.abs(this.node.y - this.player.y) <= 20) {
                this.isFollow = true;
            }
        }

        //当y轴坐标低于-2000则直接判定死亡
        if (this.node.y <= -2000) {
            this.die(this.lookDrection);
        }

        if (this.enemyStatus.isDead) {
            this.rigidBody.linearVelocity = cc.v2(this.rigidBody.linearVelocity.x, this.rigidBody.linearVelocity.y * this.timeVectory);
            return;
        }

        if (this.enemyJump.jumpCount > 0) {
            this.enemyJump.jumpColdTimer -= dt * this.timeVectory;
        }

        if (this.rigidBody.linearVelocity.y < 0) {
            if (this.enemyStatus.isStanding || this.enemyStatus.isMoving) {
                this.enemyStatus.jumpCount = 1;
            }
            this.enemyStatus.setFalling();
        }

        this.enemyJump.jumpTimer -= dt * this.timeVectory;


        this.doAim(dt);

    },

    doAim: function (dt) {

        //发出射线判断是否能够打到玩家
        var myPosition = this.player.convertToWorldSpaceAR(cc.v2(0, 0));
        var playerPosition = this.node.convertToWorldSpaceAR(cc.v2(0, 0));

        var isObstruct = false;

        var results = cc.director.getPhysicsManager().rayCast(playerPosition, myPosition, cc.RayCastType.All);

        for (let i = 0; i < results.length; i++) {
            if (results[i].collider.node.group == "Obstruction") {
                isObstruct = true;
                break;
            }
        }

        //可以打到的话进入瞄准状态
        if (!isObstruct && !this.enemyStatus.isJumping && !this.enemyStatus.isFalling) {
            //使敌人不再移动
            this.moveX = 0;
            this.spaceTimer -= dt * this.timeVectory;
            this.enemyStatus.setAiming();
            if (this.player.x > this.node.x) {
                this.lookDrection = 1;
            }
            else if (this.player.x < this.node.x) {
                this.lookDrection = -1;
            }
            //如果魔法发动剩余时间为零 则发动魔法
            if (this.spaceTimer < 0) {
                this.magicAttack(myPosition.sub(playerPosition).normalize());
                //是否在摄像头显示范围内
                var isInCamera = this.judgePosition(this.node.x, this.node.y);

                if (this.enemyStatus.soundController.acousticSwitch && this.enemyStatus.normalTimeVectory == this.enemyStatus.timeVectory && isInCamera) {
                    cc.audioEngine.playEffect(this.enemyStatus.audio[2], false);
                }
            }
        }

        //不可以则移动状态
        else {
            //重置魔法发动剩余时间
            this.spaceTimer = this.spaceTime;

            //执行移向玩家的方法
            this.moveToPlayerX();
            this.moveToPlayerY();
        }

        this.rigidBody.linearVelocity = cc.v2(this.moveX * this.moveSpeed * this.timeVectory, this.rigidBody.linearVelocity.y);

        //改变上方显示的玩家瞄准倒计时
        this.timeLabel.string = this.spaceTimer < 0 ? 0 : parseInt(this.spaceTimer * 100);

    },

    //进行攻击操作
    magicAttack: function (vector) {
        //创建魔法节点
        var newMagic = cc.instantiate(this.magicPrefab);

        newMagic.opacity = 0;
        cc.tween(newMagic)
            .to(0.2, { opacity: 255 })
            .start();
            
        this.node.getParent().addChild(newMagic);
        newMagic.setPosition(this.node.x, this.node.y);


        //改变角度
        newMagic.angle = -this.vectorsToDegress(vector);

        //向质心施加力发射魔法
        var newMagicRigidBody = newMagic.getComponent(cc.RigidBody);
        newMagicRigidBody.applyLinearImpulse(vector.mul(113), newMagicRigidBody.getWorldCenter(), true);
        //重置魔法发动倒计时
        this.spaceTimer = this.spaceTime;
    },


    //进行跳跃操作
    doJump: function () {
        if (this.enemyJump.jumpCount > 0 && this.enemyJump.jumpColdTimer <= 0) {
            this.enemyJump.jumpCount--;
            this.enemyStatus.setJumping();
            this.enemyJump.jumpTimer = this.enemyJump.jumpTime;
            this.enemyJump.jumpColdTimer = this.enemyJump.jumpColdTime;
        }
    },

    //水平方向向玩家移动
    moveToPlayerX: function () {
        if (this.player.x > this.node.x) {
            this.lookDrection = 1;
        }
        else if (this.player.x < this.node.x) {
            this.lookDrection = -1;
        }

        if (this.player.x - this.node.x <= 2 && this.player.x - this.node.x >= -2) {
            if (this.enemyStatus.isMoving || this.enemyStatus.isAiming) {
                this.enemyStatus.setStanding();
            }
            this.moveX = 0;
        }

        else if (this.player.x - this.node.x > 2) {
            if (!this.isFollow) {
                return;
            }
            this.moveX = 1;
            if (this.enemyStatus.isStanding || this.enemyStatus.isAiming) {
                this.enemyStatus.setMoving();
            }
        }

        else {
            if (!this.isFollow) {
                return;
            }
            this.moveX = -1;
            if (this.enemyStatus.isStanding || this.enemyStatus.isAiming) {
                this.enemyStatus.setMoving();
            }
        }
    },

    //垂直方向向玩家移动
    moveToPlayerY: function () {
        if (!this.isFollow) {
            return;
        }

        if (this.player.y - this.node.y > 20) {
            this.doJump();
        }

        if (this.enemyJump.jumpTimer > 0) {
            if (this.timeVectory == 1) {
                this.rigidBody.linearVelocity = cc.v2(this.rigidBody.linearVelocity.x, this.enemyJump.jumpSpeed - this.enemyJump.gravity * (this.enemyJump.jumpTime - this.enemyJump.jumpTimer));
            }
            else {
                this.rigidBody.linearVelocity = cc.v2(this.rigidBody.linearVelocity.x, this.enemyJump.jumpSpeed * this.timeVectory * 2 - this.enemyJump.gravity * this.timeVectory * (this.enemyJump.jumpTime - this.enemyJump.jumpTimer));
            }
            return;
        }

        this.rigidBody.linearVelocity = cc.v2(this.rigidBody.linearVelocity.x, this.rigidBody.linearVelocity.y * this.timeVectory);
    },

    //敌人死亡方法 drection为应该播放死亡方法的方向
    die: function (drection) {
        this.enemyStatus.setDead(drection);
        this.scheduleOnce(function () {
            this.node.destroy();
            cc.find("Canvas/Game").getComponent("Game").reduceEnemy();
        }, 0.5);
    },

    //敌人被攻击时执行的方法
    hitted: function (drection) {
        var isDodge = Math.random() * 100;
        if (this.dodgePresent < isDodge) {
            this.die(drection);
        }
        else {
            this.dodgePresent -= 20;
            this.dodge();
        }
    },

    //敌人闪避攻击后移动到玩家后方 并立马发动攻击
    dodge: function () {
        var distance = this.node.x - this.player.x;
        this.node.x = this.player.x - distance * 1.1;
        //立马发动时间减半
        this.spaceTimer /= 2;
        //防止在空中受到攻击后发生错误
        this.enemyStatus.setStanding();
    },

    //将发射向量转化成角度
    vectorsToDegress: function (dirVec) {
        let comVec = cc.v2(1, 0);    // 水平向右的对比向量
        let radian = dirVec.signAngle(comVec);    // 求方向向量与对比向量间的弧度
        let degree = cc.misc.radiansToDegrees(radian);    // 将弧度转换为角度
        return degree;
    },

    //判断节点是否在摄像头里面
    judgePosition: function (x, y) {
        if (x > this.mainCamera.x + this.mainCamera.width / 2 || x < this.mainCamera.x - this.mainCamera.width / 2 || y > this.mainCamera.y + this.mainCamera.height / 2 || y < this.mainCamera.y - this.mainCamera.height / 2) {
            return false;
        }
        return true;
    },


    onBeginContact: function (contact, selfCollider, otherCollider) {
        //不够健壮但是目前够用
        if (otherCollider.node.group == "Obstruction" && selfCollider.node.y - selfCollider.size.height / 2 * selfCollider.node.scaleY >= otherCollider.node.y + otherCollider.size.height / 2 * otherCollider.node.scaleY) {

            this.enemyJump.jumpCount = 2;

            if (this.moveX != 0) {
                this.enemyStatus.setMoving();
            }
            else {
                this.enemyStatus.setStanding();
            }
        }
    },

    onCollisionEnter: function (other, self) {
        //摧毁敌人
        if (other.node.group == "Attack" && self.node.group == "Enemy" && !this.isDead) {
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
