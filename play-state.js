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
    game.load.image('youngBlood', 'img/young-blood.png');
    game.load.image('brokenYoungBlood', 'img/broken-young-blood-upright.png');
    game.load.image('brokenOldBlood', 'img/broken-old-blood-upright.png');
    game.load.spritesheet('character', 'img/character-spritesheet.png', 100, 94.75);
  },

  create: function() {
    var youngBloodVial,
        oldBloodVial,
        randTime = game.rnd.pick([2500, 3000, 3500, 4000, 5000, 6000]),
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
    peter.health = 70;
    peter.maxHealth = 100;
    peter.flashUntil = 0;
    peter.facing = 'right';
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
    game.time.events.repeat(randTime, 1000, this.bloodDrop, this);

    // Time is cruel and relentless, forever marching forward
    game.time.events.repeat(7000, 1000, this.agePeter, this);

    cursors = game.input.keyboard.createCursorKeys();

    // add the timer
    timer.createTimer();
    timer.gameTimer = game.time.events.loop(100, function() {
      timer.updateTimer();
    });

    // get that score
    youthScore = game.add.text(16, 16, 'Youth: ' + peter.health, { font: '25px VT323', fill: '#000' });
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
      this.setVelocityNonjump(newDirection);
      this.setAnimation(newDirection);

      // jump?
      if (cursors.up.isDown) {
        this.setVelocityJump();
      }
    }

    if (peter.health <= 0) {
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

  // This assumes current horizontal velocity is set correctly for
  // the beginning of a jump.
  setVelocityJump: function() {
    peter.body.velocity.y = -350;
    peter.body.velocity.x *= 1.5;
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
    // console.log("animationName: " + animationName);
    peter.animations.play(animationName);
  },

  bloodDrop: function() {
    var vial,
        bloodTypes = ['youngBlood', 'oldBlood'];
    vial = vials.create(game.world.randomX, -30, game.rnd.pick(bloodTypes));
    vial.body.gravity.y = 150;
    vial.body.collideWorldBounds = true;

    // set up vial for collision change
    vial.body.onCollide = new Phaser.Signal();
    vial.body.onCollide.add(this.brokenVial, this);
    vial.anchor.setTo(0.75, 0.75);
    vial.healthEffect = 10;
  },

  brokenVial: function(vial) {
    // Rotate it, and disable it so it can't collide with anything (including Peter).
    vial.angle = 90;
    vial.body.enable = false;

    vial.healthEffect = 0;
    if (vial.key === "youngBlood") {
      vial.loadTexture("brokenYoungBlood", 50);
    } else {
      vial.loadTexture("brokenOldBlood", 50);
    }

    // get rid of the vial after 20s
    setTimeout(function() {vial.kill();}, 20000);
  },

  bloodHit: function(peter, vial) {
    if (vial.key === "youngBlood") {
      peter.heal(vial.healthEffect);
    } else if (vial.key === "oldBlood") {
      peter.damage(vial.healthEffect);
      this.startFlashing();
    }
    youthScore.text = 'Youth: ' + peter.health;
    vial.kill();
  },

  agePeter: function() {
    peter.damage(10);
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

    if (formattedTime === "00:00") {
      this.end();
    } else {
      result += formattedTime;
      timer.timeLabel.text = result;
    }
  },

  startFlashing: function() {
    peter.flashUntil = new Date(Date.now() + 2 * 1000);
  }

  // To add a jumping effect later, maybe
  // if (cursors.up.isDown && peter.body.touching.down && hitGround) {
  //   peter.frame = 4;
  //   peter.body.velocity.y = -150;
  // }
}
