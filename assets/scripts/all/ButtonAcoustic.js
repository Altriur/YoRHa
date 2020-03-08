cc.Class({
    extends: cc.Component,

    properties: {
        //按钮的开关
        onoff: {
            default: true,
            visible: false,
        },

        buttonSprite: {
            default: [],
            type: cc.SpriteFrame,
        },

        sprite: {
            default: null,
            type: cc.Sprite,
            visible: false,
        },

        //声音控制者节点
        soundController: {
            default: null,
            visible: false,
        },


    },

    onLoad() {
        //开启鼠标点击监听
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
    },

    onDestroy() {
        //取消鼠标点击监听
        this.node.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
    },

    start() {
        this.sprite = this.node.getComponent(cc.Sprite);

        this.soundController = cc.find("SoundController").getComponent("SoundController");

        //注：获取的数据类型为字符串而非布尔型
        this.onoff = cc.sys.localStorage.getItem('buttonAcoustics');
        
        //转化成为布尔型
        this.onoff = this.toBoolean(this.onoff);

        //如果获取值为null则赋初值
        if (this.onoff == null) {
            this.onoff = true;
            cc.sys.localStorage.setItem('buttonAcoustics', this.onoff);
        }

        //初始化按钮状态
        if (this.onoff) {
            this.sprite.spriteFrame = this.buttonSprite[0];
        }
        else {
            this.sprite.spriteFrame = this.buttonSprite[1];
        }

        this.soundController.acousticSwitch = this.onoff;
    },

    // update (dt) {},

    toBoolean: function (onoff) {
        if (onoff == 'true') {
            return true;
        }
        else if (onoff == 'false') {
            return false;
        }
    },

    onClick: function () {
        //如果为true点击后为false
        if (this.onoff) {
            this.sprite.spriteFrame = this.buttonSprite[1];
            this.onoff = false;
        }
        //如果为false点击后为true
        else {
            this.sprite.spriteFrame = this.buttonSprite[0];
            this.onoff = true;
        }
        this.soundController.acousticSwitch = this.onoff;
        cc.sys.localStorage.setItem('buttonAcoustics', this.onoff);
    },

});
