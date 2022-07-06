
var database, gameState;
var form, player, game;
var playerCount;
var backgroundImage
var allPlayers
var car1, car1Img
var car2, car2Img
var track
var cars = []
var fuels,coins,obstacles
var coinImg,fuelImg,obstacle1Img,obstacle2Img
var lifeImg
var boomImg

function preload() {
  backgroundImage = loadImage("assets/planodefundo.png")
  car1Img = loadImage("assets/car1.png")
  car2Img = loadImage("assets/car2.png")
  track = loadImage("assets/PISTA.png")
  coinImg = loadImage("assets/goldCoin.png")
  fuelImg = loadImage("assets/fuel.png")
  obstacle1Img = loadImage("assets/obstacle1.png")
  obstacle2Img = loadImage("assets/obstacle2.png")
  lifeImg = loadImage("assets/life.png")
  boomImg = loadImage("assets/blast.png")
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  database = firebase.database();

  game = new Game();
  game.getState();
  game.start();
}

function draw() {
  background(backgroundImage);

  if (playerCount === 2){
    game.updateState(1)
  }

  if (gameState === 1){
    game.play()
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
