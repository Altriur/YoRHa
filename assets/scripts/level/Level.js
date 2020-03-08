cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        //预加载Game场景
        cc.director.preloadScene('Game');
    },

    // update (dt) {},
});
