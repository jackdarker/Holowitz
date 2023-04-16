"use strict";
import {Const as Const} from './const.js';
import {GameScene as GameScene, PreLoader as PreLoader, MainMenu as MainMenu} from './game.js';
import {UIScene as UIScene} from './UI.js';
var config = {
    type: Phaser.AUTO,
    width: Const.gameWidth,
    height: Const.gameHeight,
    backgroundColor: '#000000',//transparent to support layered scenes
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: Const.gravity }
        }
    },
    scene: [ PreLoader,MainMenu,GameScene, UIScene ]
};

var game = new Phaser.Game(config);