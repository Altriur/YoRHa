cc.Class({
    extends: cc.Component,

    properties: {
        character: {
            default: null,
            type: cc.Node,
        },

        player: {
            default: null,
            type: cc.Node,
        },

        scenePrefabs: {
            default: [],
            type: cc.Prefab,
        },

        //用于保存当前关卡的json文件配置
        json: {
            default: null,
            visible: false,
        },

        //用于保存该场景中加在的敌人的预制体
        enemyList: {
            default: null,
            visible: false,
        },

        //用于保存敌人的数量（以判断游戏是否胜利）
        enemyNumber: {
            default: null,
            visible: false,
        },

        UITime: {
            default: null,
            visible: false,
        },

        levelNote: {
            default: null,
            visible: false,
        }

    },



    onLoad() {
        //开启物理系统
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().enabledAccumulator = true;

        //开启碰撞监听
        cc.director.getCollisionManager().enabled = true;

        this.UITime = cc.find("Canvas/Main Camera/User Interface/EquipmentBar/Time").getComponent("UITime");

        this.levelNote = cc.find("LevelNote").getComponent("LevelNote");

        //加载时读取对应关卡的json文件
        this.setNewScene();
    },

    // start() {},

    // update (dt) {},

    setNewScene: function () {

        //创建变量script用于在cc中使用本脚本
        var script = this;

        //创建一个存储prefab的数组
        this.enemyList = [];
        var level = this.levelNote.level;

        if (level < 10) {
            level = "0" + level;
        }

        //加载地图(目前这么写但需要改进)
        var newScene = cc.instantiate(this.scenePrefabs[this.levelNote.level - 1]);
        script.node.addChild(newScene, 1);
        newScene.setPosition(0, 0);

        //加载玩家位置和敌人
        var levelUrl = "json/Level" + level;
        // console.log("levelUrl " + levelUrl);

        cc.loader.loadRes(levelUrl, function (err, object) {
            if (err) {
                console.log("json文件读取发生了错误" + err);
                return;
            }

            script.greet(object.json);
        });


    },

    greet: function (json) {
        this.enemyNumber = json.enemy.length;
    },

    //减少敌人数量
    reduceEnemy: function () {
        this.enemyNumber--;
        this.judgeWin();
    },

    //判断是否胜利
    judgeWin: function () {
        // console.log("enemyNumber "+this.enemyNumber)
        if (this.enemyNumber <= 0 && !this.player.getComponent("PlayerStatus").isDead) {
            this.UITime.isWin = true;
            this.UITime.sendTime();
            var victory = cc.find("Canvas/Main Camera/User Interface/Victory");
            victory.active = true;
            cc.tween(victory)
                .to(1, { opacity: 255 })
                .start();

            var levelname = this.levelNote.level;

            if (levelname < 10) {
                levelname = "0" + levelname;
            }

            levelname = "Level" + levelname;

            this.UITime.recordTime(levelname);
            var highLevel = cc.sys.localStorage.getItem('HighLevel');
            // console.log(highLevel);
            if (this.levelNote.level + 1 > highLevel) {
                cc.sys.localStorage.setItem('HighLevel', this.levelNote.level + 1);
            }
            this.player.group = 'Enemy';
        }
    },


});
