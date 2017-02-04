var play = new Kiwi.State('play');

play.preload = function(){
  Kiwi.State.prototype.preload.call(this);
  this.addImage('background', 'img/bg.jpg', true, 1000, 750);
  this.addSpriteSheet("character", "img/character-actions.png", 110, 106.5);
  this.addImage("bloodDrop", "img/blood.svg", true, 100, 100);
}

play.create = function(){
  Kiwi.State.prototype.create.call(this);
  this.background = new Kiwi.GameObjects.StaticImage(this, this.textures.background, 0, 0);
  this.character = new Kiwi.GameObjects.Sprite(this, this.textures.character, 100, 550);
  this.addChild( this.background );
  this.addChild( this.character );

  this.leftKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.LEFT);
  this.rightKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.RIGHT);
  this.upKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.UP);
  this.downKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.DOWN);

  this.character.animation.add("idle-right", [ 0 ], 0.1, false );
  this.character.animation.add("idle-left", [ 1 ], 0.1, false );
  this.character.animation.add("jump-right", [ 2 ], 0.1, false );
  this.character.animation.add("jump-left", [ 3 ], 0.1, false );
  this.character.animation.add("move-right", [ 4, 5 ], 0.1, true );
  this.character.animation.add("move-left", [ 6, 7], 0.1, true );

  this.character.facing = "right";
  this.character.animation.play('idle-right');
}

play.update = function(){
  Kiwi.State.prototype.update.call(this);
  var moveIncrementer = 6;
  var facing = this.character.facing;

  if (this.leftKey.isDown || this.rightKey.isDown || this.upKey.isDown || this.downKey.isDown) {
    if (this.leftKey.isDown) {
      this.character.facing = 'left';
      if (this.character.transform.x > 0) this.character.transform.x -= moveIncrementer;
      this.character.animation.play('move-left');
    } 
    else if (this.rightKey.isDown) {
      this.character.facing = 'right';
      if (this.character.transform.x < 880) this.character.transform.x += moveIncrementer;
      this.character.animation.play('move-right');
    }
    else if (this.upKey.isDown) {
      this.character.animation.play('jump-' + facing);
      this.character.transform.y = 525;
    } 
    else if (this.downKey.isDown) {
      this.character.animation.play('idle-' + facing);
      this.character.transform.y = 550;
    }
  } else if (this.leftKey.justReleased || this.rightKey.justReleased) {
    this.character.animation.play('idle-' + facing);
  }
};

var gameOptions = {
  renderer: Kiwi.RENDERER_CANVAS,
  width: 1000,
  height: 750
};

var game = new Kiwi.Game("game-container", 'testGame', null, gameOptions);

game.states.addState(play, true);
game.states.switchState( "play" );