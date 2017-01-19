$(function(){
  document.body.addEventListener("keydown", moveCharacter);
  dropBlood();
});

function moveCharacter(evt) {
  var character = character || $('.character'),
      xVal = parseInt(character.css("left").replace("px", "")),
      gameContainerWidth = $('.game-container').width() - character.width();

  // var evt = evt || window.event;
  switch (evt.keyCode) {
    case 37:
      xVal = xVal-10;
      character.addClass('flip');
      break;
    case 39:
      xVal = xVal+10;
      character.removeClass('flip');
      break;
  }

  if (xVal > gameContainerWidth) {
    xVal = gameContainerWidth;
  } else if (xVal < 0) {
    xVal = 0;
  }
  character.css("left", xVal + "px");
}

function dropBlood() {
  var vial = $('#blood-vial-1');



  // somewhere between every .5 seconds and 2 seconds, drop a new vial of blood in a random area

}