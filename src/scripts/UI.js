"use strict";
import {Const as Const} from './const.js';
class UIScene extends Phaser.Scene{
    constructor (){
        super({ key: 'UIScene', active: false });
        this.score = 0;
    }

    create (){
        //  Our Text object to display the Score
        const info = this.add.text(10, 10, 'Score: 0', { font: '48px Arial', fill: '#000000' });

        //  Grab a reference to the Game Scene
        const ourGame = this.scene.get('GameScene');

        //  Listen for events from it
        ourGame.events.on('addScore', function () {

            this.score += 10;

            info.setText(`Score: ${this.score}`);

        }, this);
    }
}

export { UIScene };