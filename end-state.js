var title,
    ground,
    vials,
    audioMusic;

var endState = {
  preload: function() {
    game.load.spritesheet('title', 'img/end_screen/game_over_spritesheet.png', 528, 275);
    game.load.image('background', 'img/end_screen/bg.png');

    // assets for blood vials
    game.load.image('ground', 'img/ground2.png');
    game.load.image('oldBlood', 'img/old-blood.png');
    game.load.image('youngBlood', 'img/young-blood.png');
    game.load.image('bloodSplash1', 'img/blood_drop_1.png');
    game.load.image('bloodSplash2', 'img/blood_drop_2.png');
    game.load.image('brokenYoungBlood', 'img/broken-young-blood-upright.png');
    game.load.image('brokenOldBlood', 'img/broken-old-blood-upright.png');
    game.load.audio('endMusic', 'audio/Heartbeat-Drone2.mp3');
  },

  create: function() {
    var rkey = game.input.keyboard.addKey(Phaser.Keyboard.R);
    game.add.sprite(0, 0, 'background');
    title = game.add.sprite(game.world.centerX - 263, 100, 'title');
    game.add.text(game.world.centerX - 95, 450, "press 'r' to restart", {font: "25px VT323", fill: "white"});
    title.animations.add('blink', [0, 1], 2, true);
    title.animations.play('blink');

    rkey.onDown.addOnce(this.restart, this);

    audioMusic = game.add.audio('endMusic', 5.0, true);
    audioMusic.play();

    // add ground
    ground = game.add.sprite(0, game.world.height - 100, 'ground');
    game.physics.arcade.enable(ground);
    ground.body.immovable = true;

    // set the vials
    vials = game.add.group();
    vials.enableBody = true;

    // set interval loop for dropping blood
    game.time.events.repeat(Phaser.Timer.SECOND * 2, 99999, this.bloodDrop, this);
  },

  update: function() {
    var fallenVial = game.physics.arcade.collide(vials, ground);
    game.physics.arcade.collide(vials);
  },

  bloodDrop: function() {
    var bloodTypes = ['youngBlood', 'oldBlood'];
    var vial = vials.create(game.world.randomX, -30, game.rnd.pick(bloodTypes));

    vial.body.gravity.y = 300;
    vial.body.collideWorldBounds = true;

    // set up vial for collision change
    vial.body.onCollide = new Phaser.Signal();
    vial.body.onCollide.add(this.brokenVial, this);
    vial.anchor.setTo(.75, .99);
  },

  brokenVial: function(vial) {
    // Rotate it, and disable it so it can't collide with anything (including Peter).
    vial.angle = 90;
    vial.body.enable = false;

    if (vial.key === "youngBlood") {
      vial.loadTexture("brokenYoungBlood", 50);
    } else {
      vial.loadTexture("brokenOldBlood", 50);
    }
    this.bloodSplash(vial.body.x, vial.body.y + 60);
  },

  bloodSplash: function(x, y) {
    emitter = game.add.emitter(x, y, 10);
    emitter.makeParticles(['bloodSplash1', 'bloodSplash2'], undefined, undefined,
        false, // collide
        false, // collideWorldBounds,
        undefined);
    emitter.gravity = 400;
    emitter.width = 60;
    emitter.minParticleScale = 0.1;
    emitter.maxParticleScale = 0.2;
    emitter.minAngle = -120;
    emitter.maxAngle = -60;
    emitter.angularDrag = 50;
    emitter.start(true,
        600, // duration
        null, 20);
  },

  restart: function() {
    audioMusic.stop();
    game.state.start('play');
  }
}
