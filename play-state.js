var ground,
    peter,
    vials,
    cursors,
    newVial = true,
    youthScore;

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
  },

  create: function() {
    var youngBloodVial,
        oldBloodVial,
        timer = this;

    timer.startTime = new Date();
    timer.totalTime = 90;
    timer.timeElapsed = 0;


    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, 'sky');
    game.stage.backgroundColor = '#ffffff'

    // add ground
    ground = game.add.sprite(0, game.world.height - 100, 'ground');
    game.physics.arcade.enable(ground);
    ground.body.immovable = true;

    // set the vials
    vials = game.add.group();
    vials.enableBody = true;

    // set the character
    peter = game.add.sprite(32, game.world.height - 305, 'character');
    peter.bloodPower = 70;
    peter.flashUntil = 0;
    peter.facing = 'right';

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

    // set interval loop for dropping blood
    game.time.events.repeat(Phaser.Timer.SECOND * 2, 99999, this.bloodDrop, this);

    // Time is cruel and relentless, forever marching forward
    game.time.events.repeat(Phaser.Timer.SECOND, 99999, this.agePeter, this);

    cursors = game.input.keyboard.createCursorKeys();

    // add the timer
    timer.createTimer();
    timer.gameTimer = game.time.events.loop(100, function() {
      timer.updateTimer();
    });

    // get that score
    youthScore = game.add.text(16, 16, 'Youth: ' + peter.bloodPower, { font: '25px VT323', fill: '#000' });
  },

  update: function() {
    var hitGround = game.physics.arcade.collide(peter, ground),
        fallenVial = game.physics.arcade.collide(vials, ground);

    game.physics.arcade.overlap(peter, vials, this.bloodHit, null, this);

    if (! peter.body.touching.down) {
      // If his feet aren't touching something, keys have no effect on
      // Peter's action. But we still set his animation according to how
      // he's moving.
      this.setAnimation(peter.facing);
    }
    else {
      // His feet are on the ground, so set his animation and movement
      // depending on which keys are being pressed.
      if (cursors.left.isDown) {
        newDirection = 'left';
      }
      else if (cursors.right.isDown) {
        newDirection = 'right';
      }
      else {
        newDirection = 'stand';
      }

      if (cursors.up.isDown) {
        this.setVelocityJump(newDirection);
      }
      else {
        this.setVelocityNonjump(newDirection);
      }
      this.setAnimation(newDirection);
    }

    if (peter.bloodPower <= 0) {
      this.end();
    }
  },

  // directions are 'left', 'right' or 'stand'
  setVelocityNonjump: function(newDirection) {
    maxMove = 200;
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
    peter.body.velocity.y = -350;

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
      peter.bloodYoungPercent -= 1;
      if (peter.bloodYoungPercent < 25) { peter.bloodYoungPercent = 25; }
      peter.vialGravity += 10;
      if (peter.vialGravity > 400) { peter.vialGravity = 400; }
    }
    var vial = vials.create(game.world.randomX, -30, bloodType);
    vial.body.gravity.y = peter.vialGravity;
    vial.body.collideWorldBounds = true;

    // set up vial for collision change
    vial.body.onCollide = new Phaser.Signal();
    vial.body.onCollide.add(this.brokenVial, this);
    vial.anchor.setTo(0.75, 0.75);
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
      peter.bloodPower += 10;
    } else if (vial.key === "oldBlood") {
      peter.bloodPower -= 10;
      this.startFlashing();
    }
    this.updateBloodPowerText(peter);
    vial.kill();
  },

  agePeter: function() {
    peter.bloodPower -= 1;
    this.updateBloodPowerText(peter);
  },

  updateBloodPowerText: function(peter) {
    youthScore.text = 'Youth: ' + peter.bloodPower;
    if (peter.bloodPower < 50) {
      if (peter.textTweening === undefined) {
        peter.textTweening = game.add.tween(youthScore.scale).to(
          { x: 1.3, y: 1.3 },
          200,
          "Sine.easeInOut",
          true, 0, -1, true);
      }
    }
    else if (peter.bloodPower > 50) {
      if (peter.textTweening) {
        peter.textTweening.kill();
        peter.textTweening = undefined;
      }
    }
  },

  end: function() {
    game.state.start('end');
  },

  createTimer: function() {
    var timer = this;
    timer.timeLabel = game.add.text(250, 16, "00:00", {font: "25px VT323", fill: "#000"});
    timer.timeLabel.anchor.setTo(0.5, 0);
    timer.timeLabel.align = 'center';
  },

  updateTimer: function() {
    var timer = this,
        currentTime = new Date(),
        timeDifference = timer.startTime.getTime() - currentTime.getTime();
    timer.timeElapsed = Math.abs(timeDifference / 1000);

    var timeRemaining = timer.totalTime - timer.timeElapsed;
    var minutes = Math.floor(timeRemaining / 60);
    var seconds = Math.floor(timeRemaining) - (60 * minutes);
    var result = "Time left: ";
    var formattedTime = "";
    formattedTime += (minutes < 10) ? "0" + minutes : minutes;
    formattedTime += ":";
    formattedTime += (seconds < 10) ? "0" + seconds : seconds;

    if (timeRemaining < 1) {
      this.end();
    } else {
      result += formattedTime;
      timer.timeLabel.text = result;
    }
  },

  startFlashing: function() {
    peter.flashUntil = new Date(Date.now() + 2 * 1000);
  }
}
