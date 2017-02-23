var game = new Phaser.Game(1000, 650, Phaser.AUTO, '');

// add states but hold off on turning on pregame state for now so it isnt hell to develop
// game.state.add('pregame', pregameState);
game.state.add('play', playState);
game.state.add('end', endState);
//change this to pregame later
game.state.start('play');

function bloodDrop() {
  var vial,
      bloodTypes = ['youngBlood', 'oldBlood'];
  vial = vials.create(game.world.randomX, -30, game.rnd.pick(bloodTypes));
  vial.body.gravity.y = 150;
  vial.body.collideWorldBounds = true;

  // set up vial for collision change
  vial.body.onCollide = new Phaser.Signal();
  vial.body.onCollide.add(brokenVial, this);
  vial.anchor.setTo(0.75, 0.75);
  vial.healthEffect = 10;
}

function brokenVial(vial) {
  vial.angle = 90;
  vial.healthEffect = 0;
  if (vial.key === "youngBlood") {
    vial.loadTexture("brokenYoungBlood", 50);
  } else {
    vial.loadTexture("brokenOldBlood", 50);
  }
  // get rid of the vial after 20s
  setTimeout(function() {vial.kill();}, 20000);
}

function bloodHit(peter, vial) {
  if (vial.key === "youngBlood") {
    peter.heal(vial.healthEffect);
  } else if (vial.key === "oldBlood") {
    peter.damage(vial.healthEffect);
  }
  youthScore.text = 'Youth: ' + peter.health;
  vial.kill();
}

function agePeter() {
  peter.damage(10);
}

function endGame() {
  game.add.text(game.width/2-250, 300, 'YOU LOSE.', {font: '125px VT323', fill: '#800000', align: 'center', width: '100%'});
  game.add.text(game.width/2-275, 400, "You're old now.", {font: '65px VT323', fill: '#800000', align: 'center', width: '100%'});
}

