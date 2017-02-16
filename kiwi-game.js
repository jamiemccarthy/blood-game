var play = new Kiwi.State('play');

play.preload = function(){
  Kiwi.State.prototype.preload.call(this);
  this.addImage('background', 'img/bg.jpg', true, 1000, 750);
  this.addSpriteSheet("character", "img/character-spritesheet.png", 110, 106.5);
  this.addImage("youngBloodVial", "img/young-blood.png");
}

play.create = function(){
  Kiwi.State.prototype.create.call(this);
  this.BLOOD_DROP_DELAY = 550;
  this.background = new Kiwi.GameObjects.StaticImage(this, this.textures.background, 0, 0);
  this.character = new Kiwi.GameObjects.Sprite(this, this.textures.character, 100, 550);
  this.youngBloodVial = new Kiwi.GameObjects.StaticImage(this, this.textures.youngBloodVial, 100, 20);
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
  this.character.animation.add("move-right", [ 4, 5 ], 0.07, true );
  this.character.animation.add("move-left", [ 6, 7], 0.07, true );

  this.character.facing = "right";
  this.character.animation.play('idle-right');
}

play.dropBlood = function() {
  if (this.lastVialDroppedAt === undefined)  this.lastVialDroppedAt = 0;
  if (this.game.time.now() - this.lastVialDroppedAt < this.BLOOD_DROP_DELAY) return;
  this.lastVialDroppedAt = this.game.time.now();

  var vial = new BloodVial;

  vial.x = Math.floor(Math.random() * 1001);
  vial.y = Math.floor(Math.random() * 751);
}

play.update = function(){
  Kiwi.State.prototype.update.call(this);
  var moveIncrementer = 5,
      facing = this.character.facing
      randDropNum = Math.floor(Math.random() * (5000-1000+1)) + 1000;
  // setInterval(dropBlood, randDropNum);;

  // setInterval(this.dropBlood, randDropNum)

  if (this.leftKey.isDown || this.rightKey.isDown || this.upKey.isDown || this.downKey.isDown) {
    if (this.leftKey.isDown) {
      this.character.facing = 'left';
      if (this.character.transform.x > 0) this.character.transform.x -= moveIncrementer;
    } 
    else if (this.rightKey.isDown) {
      this.character.facing = 'right';
      if (this.character.transform.x < 880) this.character.transform.x += moveIncrementer;
    }
    else if (this.upKey.isDown) {
      this.character.animation.play('jump-' + facing);
      this.character.transform.y = 525;
    } 
    else if (this.downKey.isDown) {
      this.character.animation.play('idle-' + facing);
      this.character.transform.y = 550;
    }
    if (this.character.animation.currentAnimation.name != 'move-' + this.character.facing && this.character.animation.currentAnimation.name != 'jump-' + this.character.facing) {
      this.character.animation.play('move-' + this.character.facing);
    }
  } 
  else {
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

var SpriteWithPhysics = function(state, texture, x, y) {
  Kiwi.GameObjects.Sprite.call(this, state, texture, x, y);
  this.box.hitbox = new Kiwi.Geom.Rectangle( 20, 20, 110, 100 );
  this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));
  this.update = function() {
    Kiwi.GameObjects.Sprite.prototype.update.call(this);
    this.physics.update();
  }
}
Kiwi.extend(SpriteWithPhysics, Kiwi.GameObjects.Sprite);

var BloodVial = function(state, x, y) { 
  Kiwi.GameObjects.StaticImage.call(this, this.textures.youngBloodVial, 100, 20, true);
  play.addChild( this.youngBloodVial );
  this.physics = this.components.add (new Kiwi.Components.ArcadePhysics(this, this.box));
  this.physics.acceleration = new Kiwi.Geom.Point(0, 15);
  this.physics.velocity = new Kiwi.Geom.Point(0, 9);
}

BloodVial.prototype.update = function() {
  Kiwi.GameObjects.StaticImage.update.call(this);

}

Kiwi.extend(BloodVial, Kiwi.GameObjects.StaticImage);





