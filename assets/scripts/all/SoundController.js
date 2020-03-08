//声音控制者类 用于控制游戏音效是否播放
cc.Class({
    extends: cc.Component,

    properties: {
        //判断是否播放音效的开关
        acousticSwitch: {
            default: true,
            visible: false,
        },
        //游戏音效列表
        acousticsList: {
            default: [],
            type: cc.AudioClip,
        },

        //当前正在播放的背景音乐类型
        musicType: {
            default: 0,
            visible: false,
        },

        //背景音乐列表
        musicList: {
            default: [],
            type: cc.AudioClip,
        },
    },


    onLoad() {
        //令该节点变为常驻节点（即使场景变换也不会销毁）
        cc.game.addPersistRootNode(this.node);

    },

    // start() {

    // },

    // update(dt) {

    // },

    playClickAcoustic: function (i) {

        if (!this.acousticSwitch || i == 0) {
            return;
        }

        cc.audioEngine.playEffect(this.acousticsList[i - 1], false);
    },

    controllBackgroundMusic: function (musicSwitch, i) {

        if (!musicSwitch) {
            cc.audioEngine.stopMusic();
            return;
        }

        if (cc.audioEngine.isMusicPlaying()) {
            if (this.musicType != i) {
                this.musicType = i;
                cc.audioEngine.playMusic(this.musicList[i - 1], true);
            }
        }
        else {
            this.musicType = i;
            cc.audioEngine.playMusic(this.musicList[i - 1], true);
        }

    },

});
