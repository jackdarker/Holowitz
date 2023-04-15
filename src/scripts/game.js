"use strict";

class GameScene extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'GameScene' });
    }

    preload ()
    {
        this.load.image('bg', 'assets/skies/sky4.png');
        this.load.image('crate', 'assets/sprites/crate.png');
    }

    create ()
    {
        this.add.image(400, 300, 'bg');

        for (let i = 0; i < 64; i++)
        {
            const x = Phaser.Math.Between(0, 800);
            const y = Phaser.Math.Between(0, 600);

            const box = this.add.image(x, y, 'crate');

            //  Make them all input enabled
            box.setInteractive();
        }

        this.input.on('gameobjectup', this.clickHandler, this);
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

export { GameScene };
