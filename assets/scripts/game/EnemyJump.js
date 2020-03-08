//存放玩家跳跃需要的各种变量防止EnemyJump代码过于臃肿
cc.Class({
    extends: cc.Component,

    properties: {
        //起跳速度
        jumpSpeed: 400,

        //跳跃次数
        jumpCount: {
            default: 2,
            visible: false
        },

        //起跳冷却时间（防止跳跃过快达不到连跳效果）
        jumpColdTime: {
            default: 0.1,
            visible: false,
        },

        //起跳冷却时间（防止跳跃过快达不到连跳效果）
        jumpColdTimer: {
            default: 0,
            visible: false,
        },

        //跳跃上升时间
        jumpTime: {
            default: 0.2,
            visible: false,
        },

        //跳跃上升时间计时器
        jumpTimer: {
            default: -1,
            visible: false,
        },

        //跳跃时受到的重力
        gravity: {
            default: 200,
            visible: false,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},
});
