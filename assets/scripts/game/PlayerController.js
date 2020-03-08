cc.Class({
    extends: cc.Component,

    properties: {
        //移动速度
        moveSpeed: 250,

        //水平移动方向 -1为左 1为右 0为不动
        moveX: {
            default: 0,
            visible: false,
        },

        //玩家的朝向 -1为左 1为右
        lookDrection: {
            default: 1,
            visible: false,
        },

        //该节点的刚体组件
        rigidBody: {
            default: null,
            visible: false,
        },

        //攻击防守区域节点
        judgeArea: {
            default: null,
            visible: false,
        },

        //玩家状态组件
        playerStatus: {
            default: null,
            visible: false,
        },

        //记录玩家跳跃变量组件
        playerJump: {
            default: null,
            visible: false,
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        //为测试方便 打包后可删除
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onDestroy() {
        //为测试方便 打包后可删除
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },


    start() {
        //获取同节点上的组件PlayerStatus（玩家状态）
        this.playerStatus = this.node.getComponent("PlayerStatus");

        this.rigidBody = this.node.getComponent(cc.RigidBody);

        this.judgeArea = this.node.getChildByName("JudgeArea");

        this.playerJump = this.node.getComponent("PlayerJump");

        this.originJudgeArea = this.judgeArea.x;
    },

    update(dt) {

        if (this.playerStatus.isDead) {
            var timeVectory = cc.find("Canvas/Game/Character/TimeController").getComponent("TimeController").shortTimeVectory;
            this.rigidBody.linearVelocity = cc.v2(0, this.rigidBody.linearVelocity.y * timeVectory);
            return;
        }

        //当坐标过低直接判定为死亡
        if (this.node.y <= -2000) {
            this.die();
        }

        //当玩家从障碍物掉落时，只能再进行一次跳跃
        if (this.rigidBody.linearVelocity.y < -100) {

            if (this.playerStatus.isStanding || this.playerStatus.isMoving) {
                this.playerJump.jumpCount = 1;
            }
            if (!this.playerStatus.isDefending && !this.playerStatus.isAttacking && !this.playerStatus.isJumping) {
                this.playerStatus.setFalling();
            }
        }

        this.playerJump.jumpTimer -= dt;

        if (this.playerJump.jumpTimer > 0) {
            this.rigidBody.linearVelocity = cc.v2(this.rigidBody.linearVelocity.x, this.playerJump.jumpSpeed - this.playerJump.gravity * (this.playerJump.jumpTime - this.playerJump.jumpTimer));
        }

        //如果跳跃上升时间结束(并+0.15秒防止动画过于奇怪)并且处于跳跃状态则将其设置为下落状态
        if (this.playerJump.jumpTimer + 0.15 <= 0 && this.playerStatus.isJumping) {
            this.playerStatus.setFalling();
        }

        this.rigidBody.linearVelocity = cc.v2(this.moveX * this.moveSpeed, this.rigidBody.linearVelocity.y);
    },



    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.moveLeft();
                break;
            case cc.macro.KEY.d:
                this.moveRight();
                break;
            case cc.macro.KEY.r:
                cc.director.loadScene("Game");
                break;
            case cc.macro.KEY.space:
                this.doJump();
                break;
        }
    },

    onKeyUp(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.d:
                this.moveX = 0;
                if (this.playerStatus.isMoving) {
                    this.playerStatus.setStanding();
                }
                break;
        }
    },
    //玩家向左移动
    moveLeft: function () {
        if (this.playerStatus.isDead) {
            return;
        }
        this.lookDrection = -1;

        this.judgeArea.x = this.originJudgeArea * this.lookDrection;
        if (this.playerStatus.isStanding) {
            this.playerStatus.setMoving();
        }
        if (!this.playerStatus.isDefending) {
            this.moveX = -1;
        }
    },
    //玩家向右移动
    moveRight: function () {
        if (this.playerStatus.isDead) {
            return;
        }

        this.lookDrection = 1;

        this.judgeArea.x = this.originJudgeArea * this.lookDrection;
        if (this.playerStatus.isStanding) {
            this.playerStatus.setMoving();
        }

        if (!this.playerStatus.isDefending) {
            this.moveX = 1;
        }
    },
    //玩家停止移动
    doStop() {
        this.moveX = 0;
        if (this.playerStatus.isMoving) {
            this.playerStatus.setStanding();
        }
    },

    doJump: function () {
        if (this.playerStatus.isDead) {
            return;
        }

        if (this.playerJump.jumpCount > 0 && !this.playerStatus.isAttacking && !this.playerStatus.isDefending) {
            this.playerJump.jumpCount--;
            this.playerStatus.setJumping();
            this.playerJump.jumpTimer = this.playerJump.jumpTime;
        }
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        //不够健壮但是目前够用
        if (otherCollider.node.group == "Obstruction" && selfCollider.node.y - selfCollider.size.height / 2 * selfCollider.node.scaleY >= otherCollider.node.y + otherCollider.size.height / 2 * otherCollider.node.scaleY) {
            this.playerJump.jumpCount = 2;

            if (this.playerStatus.isDead) {
                return;
            }

            //如果处于防御状态那么接触地面时转化为静止状态
            if (this.playerStatus.isDefending) {
                this.playerStatus.setStatic();
                return;
            }
            else if (this.playerStatus.isAttacking) {
                return;
            }


            if (this.moveX != 0) {
                this.playerStatus.setMoving();
            }
            else {
                this.playerStatus.setStanding();
            }

        }
    },



    //死亡动画当死亡时慢速播放动画
    die: function () {
        this.playerStatus.setDead(this.lookDrection);
        if (cc.find("Canvas/Main Camera/User Interface/Victory").active) {
            return;
        }
        var lose = cc.find("Canvas/Main Camera/User Interface/Lose");
        lose.active = true;
        cc.tween(lose)
            .to(1, { opacity: 255 })
            .start()
    },

});
