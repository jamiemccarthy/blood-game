var ground,
    peter,
    vials,
    bloodLoop, bloodTime,
    leftKey, rightKey, jumpKey,
    newVial = true,
    youthScore,
    audioMusic, audioGotYoungBlood, audioGotOldBlood,
    audioJump, audioFailToJump, audioLand,
    audioVialBreak;

var playState = {

  preload: function() {
    game.load.image('sky', 'img/sky.png');
    game.load.image('ground', 'img/ground2.png');
    game.load.image('oldBlood', 'img/old-blood.png');
    game.load.image('bloodSplash1', 'img/blood_drop_1.png');
    game.load.image('bloodSplash2', 'img/blood_drop_2.png');
    game.load.image('youngBlood', 'img/young-blood.png');
    game.load.image('brokenYoungBlood', 'img/broken-young-blood-upright.png');
    game.load.image('brokenOldBlood', 'img/broken-old-blood-upright.png');
    game.load.spritesheet('character', 'img/character-spritesheet.png', 100, 94.75);
    game.load.audio('playMusic', 'audio/Arcade-Fantasy.mp3');
    game.load.audio('gotYoungBlood', 'audio/162467__kastenfrosch__gotitem.mp3');
    game.load.audio('gotOldBlood', 'audio/338960__dorr1__yuck.mp3');
    game.load.audio('jump', 'audio/157569__elektroproleter__cartoon-jump.mp3');
    game.load.audio('failToJump', 'audio/252235__reitanna__soft-grunt.wav');
    game.load.audio('land', 'audio/146981__jwmalahy__thud1.wav');
    game.load.audio('vialBreak', 'audio/93079__cgeffex__splash.mp3');
  },

  create: function() {
    var youngBloodVial,
        oldBloodVial;

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, 'sky');
    game.stage.backgroundColor = '#ffffff'

    // add ground
    ground = game.add.sprite(0, game.world.height - 100, 'ground');
    game.physics.arcade.enable(ground);
    ground.body.immovable = true;

    // start the music
    audioMusic = game.add.audio('playMusic', 0.2, true);
    audioMusic.play();

    // prep the sound effects
    audioGotYoungBlood = game.add.audio('gotYoungBlood');
    audioGotOldBlood = game.add.audio('gotOldBlood', 2.0);
    audioJump = game.add.audio('jump', 2.0);
    audioFailToJump = game.add.audio('failToJump');
    audioLand = game.add.audio('land', 0.1);
    audioVialBreak = game.add.audio('vialBreak');

    // set the vials
    vials = game.add.group();
    vials.enableBody = true;

    // set the character
    peter = game.add.sprite(32, game.world.height - 305, 'character');
    peter.bloodPower = 49;
    peter.flashUntil = 0;
    peter.facing = 'right';
    peter.airborne = true;

    peter.bloodYoungPercent = 50;
    peter.vialGravity = 150;

    game.physics.arcade.enable(peter);
    peter.body.bounce.y = 0.0;
    peter.body.gravity.y = 800;
    peter.body.collideWorldBounds = true;
    peter.animations.add('leftRun',         [11,9,10],       13, true);
    peter.animations.add('leftRunFlash',    [9,2,10,2,11,2],  8, true);
    peter.animations.add('leftJump',        [9],             13, true);
    peter.animations.add('leftJumpFlash',   [9,2],            8, true);
    peter.animations.add('leftStand',       [10],            99, true);
    peter.animations.add('leftStandFlash',  [10,2],           8, true);
    peter.animations.add('rightRun',        [8,6,7],         13, true);
    peter.animations.add('rightRunFlash',   [6,2,7,2,8,2],    8, true);
    peter.animations.add('rightJump',       [6],             13, true);
    peter.animations.add('rightJumpFlash',  [6,2],            8, true);
    peter.animations.add('rightStand',      [7],             99, true);
    peter.animations.add('rightStandFlash', [7,2],            8, true);

    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    jump1Key = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    jump2Key = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    // set interval loop for dropping blood
    bloodTime = Phaser.Timer.SECOND * 2;
    bloodLoop = game.time.events.loop(bloodTime, this.bloodDrop, this);

    // Time is cruel and relentless, forever marching forward
    // game.time.events.repeat(Phaser.Timer.SECOND, 99999, this.agePeter, this);
    game.time.events.loop(Phaser.Timer.SECOND, this.agePeter, this);

    // get that score
    game.add.text(20, 16, 'Youth', { font: '25px VT323', fill: '#000' });
    youthScore = game.add.text(20, 35, peter.bloodPower, { font: '60px VT323', fill: '#000' });
  },

  update: function() {
    var hitGround = game.physics.arcade.collide(peter, ground),
        fallenVial = game.physics.arcade.collide(vials, ground);

    game.physics.arcade.overlap(peter, vials, this.bloodHit, null, this);

    if (! peter.body.touching.down) {
      // If his feet aren't touching something, keys have no effect on
      // Peter's action. But we still set his animation according to how
      // he's moving.
      peter.airborne = true;
      this.setAnimation(peter.facing);
    }
    else {
      // Did he just land?
      if (peter.airborne) {
        audioLand.play();
        peter.airborne = false;
      }

      // His feet are on the ground, so set his animation and movement
      // depending on which keys are being pressed.
      if (leftKey.isDown) {
        newDirection = 'left';
      }
      else if (rightKey.isDown) {
        newDirection = 'right';
      }
      else {
        newDirection = 'stand';
      }

      if (jump1Key.isDown || jump2Key.isDown) {
        if (peter.bloodPower < 70) {
          this.setVelocityJump(newDirection);
          audioJump.play();
        }
        else {
          // You can't jump when you're 70 or older, it's too dangerous
          audioFailToJump.play();
        }
      }
      else {
        this.setVelocityNonjump(newDirection);
      }
      this.setAnimation(newDirection);
    }

    if (peter.bloodPower >= 125) {
      this.end();
    }
  },

  // directions are 'left', 'right' or 'stand'
  setVelocityNonjump: function(newDirection) {
    // Speed Peter can move is cut roughly in half as he ages.
    maxMove = 250 - peter.bloodPower;
    deltaForMove = 40;
    deltaForStand = 40;
    if (newDirection == 'left') {
      peter.body.velocity.x -= deltaForMove;
      if (peter.body.velocity.x < -maxMove) { peter.body.velocity.x = -maxMove; }
    }
    else if (newDirection === 'right') {
      peter.body.velocity.x += deltaForMove;
      if (peter.body.velocity.x > maxMove) { peter.body.velocity.x = maxMove; }
    }
    else if (newDirection === 'stand') {
      xVelocityAbs = Math.abs(peter.body.velocity.x)
      if (xVelocityAbs <= deltaForStand) {
        peter.body.velocity.x = 0;
      }
      else {
        xVelocityVector = peter.body.velocity.x > 0 ? 1 : -1;
        peter.body.velocity.x -= xVelocityVector * deltaForStand;
      }
    }
  },

  // directions are 'left', 'right' or 'stand'
  setVelocityJump: function(newDirection) {

    // Whatever else happens, we launch vertically.
    // Height/speed of the jump is cut roughly in half as Peter ages.
    peter.body.velocity.y = -400 + (peter.bloodPower*2);

    if (newDirection === 'stand') {
      // Just jump with current facing and speed.
    }
    else if (newDirection === 'left' || newDirection === 'right') {
      // Horizontal velocity changes, as well as maximum velocity,
      // can be quicker when jumping.
      jumpSpeedBoost = 1.3;
      minJumpSpeed = 100;

      // Set the current and new vector values.
      newDirectionVector     =  newDirection === 'right' ? 1 : -1;
      currentXVelocityVector = peter.body.velocity.x > 0 ? 1 : -1;
      if (peter.body.velocity.x == 0) { currentXVelocityVector = 0; }

      if (newDirectionVector == -currentXVelocityVector) {
        // We're jumping in the opposite direction as we're moving.
        // Peter will turn around and jump straight up.
        peter.body.velocity.x = 0;
      }
      else {
        // Peter's either standing still or moving in the right direction,
        // but it could be quickly or slowly. Either way, increase his speed.
        if (Math.abs(peter.body.velocity.x) < minJumpSpeed) {
          // He's moving slowly or standing still. Give him a speed boost
          // to some minimum speed.
          peter.body.velocity.x = minJumpSpeed * newDirectionVector;
        }
        else {
          // He's moving. Give him a speed boost.
          peter.body.velocity.x *= jumpSpeedBoost;
        }
      }
    }
  },

  // directions are 'left', 'right' or 'stand'
  setAnimation: function(newDirection) {
    actionName = 'Run';
    if (! peter.body.touching.down) {
      actionName = 'Jump';
    }
    else if (newDirection === 'stand') {
      actionName = 'Stand';
    }
    else {
      if (! (newDirection === 'left' || newDirection === 'right')) {
        console.log("bad newDirection " + newDirection);
      }
      peter.facing = newDirection;
    }
    flashStatus = peter.flashUntil > new Date()
      ? 'Flash' // not done flashing yet
      : '';     // any flashing was in the past

    animationName = peter.facing + actionName + flashStatus;
    peter.animations.play(animationName);
  },

  bloodDrop: function() {
    bloodType = 'oldBlood';
    if (Math.random() * 100 < peter.bloodYoungPercent) {
      bloodType = 'youngBlood';
      peter.bloodYoungPercent -= 3;
      if (peter.bloodYoungPercent < 20) { peter.bloodYoungPercent = 20; }
      peter.vialGravity += 10;
      if (peter.vialGravity > 400) { peter.vialGravity = 400; }
    }
    var vial = vials.create(game.world.randomX, -30, bloodType);
    vial.body.gravity.y = peter.vialGravity;
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

    // get rid of the vial after 10s
    setTimeout(function() {vial.kill();}, 10000);
  },

  bloodSplash: function(x, y) {
    audioVialBreak.play();
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

  bloodHit: function(peter, vial) {
    if (vial.key === "youngBlood") {
      audioGotYoungBlood.play();
      peter.bloodPower -= 10;
      // Don't age him into childhood
      peter.bloodPower = Math.max(18, peter.bloodPower);
      // Speed up the blood. Remove the previous blood timer and add another.
      bloodTime = Math.max(bloodTime - (Phaser.Timer.SECOND / 20), Phaser.Timer.SECOND * 0.5);
      game.time.events.remove(bloodLoop);
      bloodLoop = game.time.events.loop(bloodTime, this.bloodDrop, this);
    } else if (vial.key === "oldBlood") {
      audioGotOldBlood.play();
      peter.bloodPower += 10;
      this.startFlashing();
    }
    youthScore.text = peter.bloodPower;
    vial.kill();
  },

  agePeter: function() {
    peter.bloodPower += 1;
    youthScore.text = peter.bloodPower;
  },

  end: function() {
    audioMusic.stop();
    game.state.start('end');
  },

  startFlashing: function() {
    peter.flashUntil = new Date(Date.now() + 2 * 1000);
  }
}
