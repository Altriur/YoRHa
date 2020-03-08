cc.Class({
    extends: cc.Component,

    properties: {

        //盾牌初始的耐久度
        durability: {
            default: null,
            visible: false,
        },

        //显示盾牌耐久度的文字
        durabilityLabel: {
            default: null,
            visible: false,
        },

    },

    onLoad() {

    },

    start() {
        this.durabilityLabel = this.node.getChildByName("DurabilityLabel").getComponent(cc.Label);
    },

    updateDurabilityLabel: function (presentDurability) {
        if (presentDurability < 10) {
            presentDurability = "0" + presentDurability;
        }

        this.durabilityLabel.string = presentDurability + "/" + this.durability;

        if (presentDurability == 0) {
            this.node.color = new cc.color(150, 150, 150);
        }
    },
});
