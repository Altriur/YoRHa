cc.Class({
    extends: cc.Component,

    properties: {
        //盾牌耐久度
        shieldDurability: {
            default: 10,
            visible: false
        },

        playerController: {
            default: null,
            visible: false,
        },

        //盾牌UI节点
        weapon: {
            default: null,
            type: cc.Node,
        },

        //盾牌的耐久度UI组件
        UIdurability: {
            default: null,
            visible: false,
        },

    },

    // onLoad () {},

    start() {
        this.playerController = this.node.getParent().getComponent("PlayerController");

        this.UIdurability = this.weapon.getComponent("UIDurability");

        this.UIdurability.durability = this.shieldDurability;
    },

    update(dt) {

    },

    onCollisionEnter: function (other, self) {
        if (other.node.group == "Magic") {
            if (self.node.group == "Attack") {
                //执行魔法破坏相关方法
                this.magicDestroy(other);
            }
            else if (self.node.group == "Defense") {
                //执行魔法防御相关方法
                this.magicDefense(other);
            }
        }

    },

    //魔法破坏
    magicDestroy: function (other) {
        var magic = other.node.getComponent("Magic");
        //当魔法isAlive==false不对其进行判定
        if (!magic.isAlive) {
            return;
        }

        //如果该魔法存在爆炸伤害则直接摧毁该节点
        if (magic.isAftereffect) {
            other.node.destroy();
            return;
        }
        magic.playDeadAnimation();
        magic.playDeadAudio(true);
    },

    //魔法防御
    magicDefense: function (other) {
        var magic = other.node.getComponent("Magic");
        //当魔法isAlive==false不对其进行判定
        if (!magic.isAlive) {
            return;
        }

        this.shieldDurability -= magic.magicDamage;
        if (this.shieldDurability <= 0) {
            this.shieldDurability = 0;
            this.node.active = false;
            //当盾牌被破坏的时候玩家状态从防御转变成站立
            this.playerController.node.getComponent("PlayerStatus").setStanding();
        }
        this.UIdurability.updateDurabilityLabel(this.shieldDurability);
        magic.playDeadAnimation();
        magic.playDeadAudio(true);
    },
});
