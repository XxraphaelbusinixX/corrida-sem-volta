class Game {
  constructor() {
    this.resetTitle = createElement("h2")
    this.resetButton = createButton("")

    this.leaderBoardTitle = createElement("h2")
    this.leader1 = createElement("h2")
    this.leader2 = createElement("h2")

    this.isMoving = false
    this.blast = false
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }

  updateState(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    player.getPlayerCount()

    form = new Form();
    form.display();

    car1 = createSprite(width/2-50, height-100)
    car1.addImage(car1Img)
    car1.scale = 0.07

    car2 = createSprite(width/2+100, height-100)
    car2.addImage(car2Img)
    car2.scale = 0.07

    cars = [car1, car2]

    fuels = new Group()
    coins = new Group()
    obstacles = new Group()

    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Img },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Img },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Img },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Img },
      { x: width / 2, y: height - 2800, image: obstacle2Img },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Img },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Img },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Img },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Img },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Img },
      { x: width / 2, y: height - 5300, image: obstacle1Img },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Img }
    ];

    this.addSprites(fuels,4,fuelImg,0.02)
    this.addSprites(coins,18,coinImg,0.09)
    this.addSprites(obstacles,obstaclesPositions.length,obstacle1Img,0.04,obstaclesPositions)
  } 

  play(){
    form.hide()
    form.title.position(40,50)
    form.title.class("gameTitleAfterEffect")

    this.resetTitle.html("Reicinar jogo")
    this.resetTitle.class("resetText")
    this.resetTitle.position(width/2+200,40)

    this.resetButton.class("resetButton")
    this.resetButton.position(width/2+230,100)

    this.leaderBoardTitle.html("Placar")
    this.leaderBoardTitle.class("resetText")
    this.leaderBoardTitle.position(width/3-60,40)

    this.leader1.class("leadersText")
    this.leader1.position(width/3-50,80)

    this.leader2.class("leadersText")
    this.leader2.position(width/3-50,130)

    this.pressButtonReset()

    player.getPlayerInfo()
    player.getCarsAtEnd()
    
    if (allPlayers !== undefined){
      image(track, 0,-height*5, width, height*6)

      this.showLeaderBoard()

      this.showLifeBar()
      this.showFuelBar()

      var index = 0
      for (var plr in allPlayers) {
        index = index +1
        var x = allPlayers[plr].positionX
        var y = height- allPlayers[plr].positionY

        cars[index -1].position.x = x
        cars[index -1].position.y = y

        var currentLife = allPlayers[plr].life
        if (currentLife<=0){
          cars[index-1].addImage(boomImg)
          cars[index-1].scale = 0.3
        }

        if (index === player.index){
          stroke(10)
          fill("red")
          ellipse(x,y,60,60)

          this.collectFuels(index)
          this.collectCoins(index)

          this.collisionWithCar(index)
          this.collisionWithObstacles(index)

          if (player.life<=0){
            this.blast = true
            this.isMoving = false
            this.gameOver()
          }

          camera.position.y = cars[index -1].position.y
        }
      }

      this.playerControls()

      var finishLine = height*6-100
      if (player.positionY>finishLine){
        gameState = 2
        player.rank +=1
        player.updateCarsAtEnd(player.rank)
        player.updatePlayer()
        this.showRank()
      }

      drawSprites()
    }
  }

  playerControls (){
    if(!this.blast){
      if (keyIsDown(UP_ARROW)){
        this.isMoving = true
        player.positionY = player.positionY +10
        player.updatePlayer()
      }else{
        this.isMoving = false
      }
  
      if (keyIsDown(LEFT_ARROW) && player.positionX > width/3-50){
        player.positionX = player.positionX -5
        player.updatePlayer()
      }
  
      if (keyIsDown(RIGHT_ARROW) && player.positionX < width/2+300){
        player.positionX = player.positionX +5
        player.updatePlayer()
      }
    }
  }

  showLeaderBoard(){
    let leader1, leader2
    let players = Object.values(allPlayers)

    if ((players[0].rank ===0 && players[1].rank === 0 ) || players[0].rank === 1){
      leader1 = players[0].rank +"&emsp;"+players[0].name+"&emsp;"+players[0].score
      leader2 = players[1].rank +"&emsp;"+players[1].name+"&emsp;"+players[1].score
    }

    if (players[1].rank === 1 ){
      leader1 = players[1].rank +"&emsp;"+players[1].name+"&emsp;"+players[1].score
      leader2 = players[0].rank +"&emsp;"+players[0].name+"&emsp;"+players[0].score
    }
    
    this.leader1.html(leader1)
    this.leader2.html(leader2)
  }

  pressButtonReset(){
    this.resetButton.mousePressed(() =>{
      database.ref("/").set({
        playerCount:0,
        gameState:0,
        players:{},
        carsAtEnd: 0
      })

      window.location.reload()
    })
  }

  addSprites(spriteGroup,numberOfSprites,spriteImg,spriteScale,positions = []){
    for(var item = 0; item < numberOfSprites;item ++){
      var x,y
      if (positions.length> 0){
        x = positions[item].x
        y = positions[item].y
        spriteImg = positions[item].image
      } else{
        x = random(width/2+150,width/2-150)
        y = random(-height*4.5,height-400)
      }

      var sprite = createSprite(x,y)
      sprite.addImage(spriteImg)
      sprite.scale = spriteScale
      spriteGroup.add(sprite)
    }
  }

  collectFuels(index){
    cars[index-1].overlap(fuels,(collector,collected) => {
      player.fuel = 185
      collected.remove()
    })

    if (player.fuel>0 && this.isMoving){
      player.fuel-=0.3
    }

    if (player.fuel<=0){
      gameState = 2
      this.gameOver()
    }
  }

  collectCoins(index){
    cars[index-1].overlap(coins,(collector,collected) => {
      player.score = player.score +21
      player.updatePlayer()
      collected.remove()
    })
  }

  showRank(){
    swal({
      title: `Incrivel! ${"\n"} ${player.rank}º lugar`,
      text: "você alcançou a linha de chegada!",
      imageUrl:"https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imgSize:"100x100",
      confirmButtonText: "ok"
    })
  }

  gameOver(){
    swal({
      title: `Fim de jogo!`,
      text: "Opss você perde a corrida!",
      imageUrl:"https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imgSize:"100x100",
      confirmButtonText: "Obrigado por jogar me deixe rico"
    })
  }

  showLifeBar(){
    push()
    image(lifeImg,width/2-130,height-player.positionY-200,20,20)
    fill("white")
    rect(width/2-100,height-player.positionY-200,185,20)
    fill("#f50057")
    rect(width/2-100,height-player.positionY-200,player.life,20)
    noStroke()
    pop()
  }

  showFuelBar(){
    push()
    image(fuelImg,width/2-130,height-player.positionY-150,20,20)
    fill("white")
    rect(width/2-100,height-player.positionY-150,185,20)
    fill("#ffc400")
    rect(width/2-100,height-player.positionY-150,player.fuel,20)
    noStroke()
    pop()
  }

  collisionWithCar(index){
    if (index === 1){
      if (cars[0].collide(cars[1])){
        if (this.isLeftKeyActive){
          player.positionX -= 100
        } else {
          player.positionX += 100
        }

        if (player.life>0){
          player.life -= 185/4
        }

        player.updatePlayer()
      }
    }

    if (index === 2){
      if (cars[1].collide(cars[0])){
        if (this.isLeftKeyActive){
          player.positionX -= 100
        } else {
          player.positionX += 100
        }

        if (player.life>0){
          player.life -= 185/4
        }
        
        player.updatePlayer()
      }
    }
  }

  collisionWithObstacles(index){
    if (cars[index-1].collide(obstacles)){
      if (this.isLeftKeyActive){
        player.positionX -= 100
      } else {
        player.positionX += 100
      }

      if (player.life>0){
        player.life -= 185/4
      }
      
      player.updatePlayer()
    }
  }
}
