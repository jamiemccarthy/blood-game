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
    game.load.spritesheet('character', 'img/character-spritesheet.png', 100, 97);
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
    game.physics.arcade.enable(peter);
    peter.body.bounce.y = 0.2;
    peter.body.gravity.y = 300;
    peter.body.collideWorldBounds = true;
    peter.animations.add('left', [9,10,11], 13, true);
    peter.animations.add('right', [6,7,8], 13, true);
    peter.animations.add('jump', [2], 10, true);

    // set interval loop for dropping blood
    game.time.events.repeat(randTime, 1000, bloodDrop, this);

    // Time is cruel and relentless, forever marching forward
    game.time.events.repeat(7000, 1000, agePeter, this);

    cursors = game.input.keyboard.createCursorKeys();

    //add the timer
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

    game.physics.arcade.overlap(peter, vials, bloodHit, null, this);
   
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

    if (peter.health < 10) {
      this.end;
    }
  },

  end: function() {
    game.state.start('endState');
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

    var result = "Time left: "
    result += (minutes < 10) ? "0" + minutes : minutes;
    result += ":";
    result += (seconds < 10) ? "0" + seconds : seconds;
    timer.timeLabel.text = result;
  }

  // To add a jumping effect later, maybe
  // if (cursors.up.isDown && peter.body.touching.down && hitGround) {
  //   peter.frame = 4;
  //   peter.body.velocity.y = -150;
  // }
}