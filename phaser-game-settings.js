var game = new Phaser.Game(1000, 650, Phaser.AUTO, '', {preload: preload, create: create, update: update});
var ground,
    peter,
    vials,
    cursors;
function preload() {
  game.load.image('sky', 'img/sky.png');
  game.load.image('ground', 'img/ground2.png');
  game.load.image('oldBlood', 'img/old-blood.png');
  game.load.image('youngBlood', 'img/young-blood.png');
  game.load.spritesheet('character', 'img/character-spritesheet.png', 100, 97);
}

function create() {
  var youngBloodVial,
      oldBloodVial;

  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.add.sprite(0, 0, 'sky');

  // add ground
  ground = game.add.sprite(0, game.world.height - 100, 'ground');
  game.physics.arcade.enable(ground);
  ground.body.immovable = true;

  // set the vials
  vials = game.add.group();
  vials.enableBody = true;
  bloodDrop('youngBlood');

  // set the character
  peter = game.add.sprite(32, game.world.height - 305, 'character');
  game.physics.arcade.enable(peter);
  peter.body.bounce.y = 0.2;
  peter.body.gravity.y = 300;
  peter.body.collideWorldBounds = true;
  peter.animations.add('left', [9,10,11], 13, true);
  peter.animations.add('right', [6,7,8], 13, true);
  peter.animations.add('jump', [2], 10, true);

  cursors = game.input.keyboard.createCursorKeys();
}

function update() {
  var hitGround = game.physics.arcade.collide(peter, ground);
  game.physics.arcade.collide(peter, vials);
 
  // set keyboard controls
  peter.body.velocity.x = 0;

  if (cursors.left.isDown) {
    peter.body.velocity.x = -200;
    peter.animations.play('left');
  }
  else if (cursors.right.isDown) {
    peter.body.velocity.x = 200;
    peter.animations.play('right');
  }
  else {
    peter.animations.stop();
    peter.frame = 1;
  }

  if (cursors.up.isDown && peter.body.touching.down && hitGround) {
    peter.frame = 4;
    peter.body.velocity.y = -150;
  }
}

function bloodDrop(bloodType) {
  var randXCoord = Math.floor(Math.random(1001) * 1000),
      blood;
  blood = vials.create(randXCoord, -10, bloodType);
}

