class Form {
  constructor() {
    this.name = createInput("").attribute("placeholder", "Digitr seu nome")
    this.playButton = createButton("Jogar")
    this.title = createImg("assets/title.png")
    this.greeting = createElement("h2")
  }

  setElementsPosition(){
    this.name.position(width/2-110,height/2-80)
    this.playButton.position(width/2-90,height/2-20)
    this.title.position(120,50)
    this.greeting.position(width/2-300,height/2-100)
  }

  setElementsStyle(){
    this.name.class("customInput")
    this.playButton.class("customButton")
    this.title.class("gameTitle")
    this.greeting.class("greeting")
  }

  hide(){
    this.name.hide()
    this.playButton.hide()
    this.greeting.hide()
  }

  pressMouse(){
    this.playButton.mousePressed(() => {
      this.name.hide()
      this.playButton.hide()
      var message = `Olar, ${this.name.value()}!</br>Espere o outro jogador entrar`
      this.greeting.html(message)
      playerCount = playerCount +1 
      player.name = this.name.value()
      player.index = playerCount
      player.addPlayer()
      player.updatePlayerCount(playerCount)
      player.getDistance()
    })
  }

  display(){
    this.setElementsPosition()
    this.setElementsStyle()
    this.pressMouse()
  }
}
