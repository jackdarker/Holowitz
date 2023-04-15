"use strict";

class PreLoader extends Phaser.Scene {
    constructor (){
        super({ key: 'PreLoader' });
    }
    preload(){
        //display loading...
        this.loadText = this.add.text(512, 360, 'Loading ...', { fontFamily: 'Arial', fontSize: 74, color: '#e3f2ed' });
        this.loadText.setOrigin(0.5);
        this.loadText.setStroke('#203c5b', 6);
        this.loadText.setShadow(2, 2, '#2d2d2d', 4, true, false);

        //  Audio ...
        this.load.setPath('assets/sounds/');
        this.load.audio('music', [ 'sci_fi_platformer02.ogg']);
    }
    create(){
        if (this.sound.locked){ //Mobile devices require sounds to be triggered from an explicit user action, such as a tap, before any sound can be loaded/played on a web page.
            this.loadText.setText('Click to Start');
            this.input.once('pointerdown', () => {
                this.scene.start('GameScene');
            });
        } else {
            this.scene.start('GameScene');
        }
    }
}
class MainMenu extends Phaser.Scene {
    constructor (){
        super({ key: 'MainMenu' });
    }
    preload(){
        
        this.loadText = this.add.text(512, 360, 'Main-Menu', { fontFamily: 'Arial', fontSize: 74, color: '#e3f2ed' });
        this.loadText.setOrigin(0.5);
        this.loadText.setStroke('#203c5b', 6);
        this.loadText.setShadow(2, 2, '#2d2d2d', 4, true, false);
    }
    create(){
        this.input.keyboard.on('keyup-ESC', () => {
            this.scene.switch('GameScene');
        }, this);
        /*this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('GameScene');
        }, this);
        this.input.once('pointerdown', () => {
            this.scene.start('GameScene');

        });*/
    }
}

class GameScene extends Phaser.Scene
{
    constructor () {
        super({ key: 'GameScene' });
    }

    preload ()
    {
        this.load.image('bg', 'assets/skies/sky4.png');
        this.load.image('crate', 'assets/sprites/crate.png');
        this.load.image('star', 'assets/sprites/star.png');
        this.loadText = this.add.text(512, 360, 'Game', { fontFamily: 'Arial', fontSize: 74, color: '#e3f2ed' });
        this.loadText.setOrigin(0.5);
        this.loadText.setStroke('#203c5b', 6);
        this.loadText.setShadow(2, 2, '#2d2d2d', 4, true, false);
    }

    create () {
        this.sound.play('music', { loop: true, delay: 2 });
        this.add.image(400, 300, 'bg');

        for (let i = 0; i < 64; i++)
        {
            const x = Phaser.Math.Between(0, 800);
            const y = Phaser.Math.Between(0, 600);

            const box = this.add.image(x, y, 'star');

            //  Make them all input enabled
            box.setInteractive();
        }
        const combo2 = this.input.keyboard.createCombo('TZU',{resetOnMatch:true}); //triggers when keys are pressed in order - usable for combos?
        this.input.keyboard.on('keycombomatch', event => {
            debugger
            console.log('Key Combo matched!'+event.keyCodes);
        });
        let spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        spaceKey.on('up', ()=> {
            // event.stopPropagation();     //disable propagation to other scenes
            // event.stopImmediatePropagation();    //disable propagation to other, more global handlers in this scene
            this.scene.switch('MainMenu');
        });
        /*this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.switch('MainMenu');
        }, this);*/
        this.input.on('gameobjectup', this.clickHandler, this);
    }

    update(){

    }

    clickHandler (pointer, box)
    {
        //  Disable our box
        box.input.enabled = false;
        box.setVisible(false);

        //  Dispatch a Scene event
        this.events.emit('addScore');
    }
}

export { PreLoader,GameScene,MainMenu };
