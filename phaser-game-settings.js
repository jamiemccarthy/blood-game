var game = new Phaser.Game(1000, 750, Phaser.AUTO, '', {preload: preload, create: create, update: update});
var platforms,
    peter;

function preload() {
  game.load.image('background', 'img/bg.png');
  game.load.image('oldBlood', 'img/old-blood.png');
  game.load.image('youngBlood', 'img/young-blood.png');
  game.load.spritesheet('character', 'img/character-spritesheet.png');
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.add.sprite(0, 0, 'background');

  peter = game.add.sprite(32, game.world.height - 150, 'character');
  game.physics.arcade.enable(peter);
  peter.body.bounce.y = 0.2;
  peter.body.gravity.y = 300;
  peter.body.collideWorldBounds = true;
  peter.animations.add('left', [6,7,8], 10, true);
  peter.animations.add('right', [9,10,11], 10, true)
}

function update() {

}