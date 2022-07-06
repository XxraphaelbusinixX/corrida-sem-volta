class Player {
  constructor() {
    this.name = null
    this.index = null
    this.positionX = 0
    this.positionY = 0
    this.rank = 0
    this.score = 0
    this.life = 185
    this.fuel = 185
  }

  getCarsAtEnd(){
    var carsAtEndRef = database.ref("carsAtEnd")
    carsAtEndRef.on("value",info => {
      this.rank = info.val()
    })
  }

  updateCarsAtEnd(rank){
    var carsAtEndRef = database.ref("/")
    carsAtEndRef.update({
      carsAtEnd: rank
    })
  }

  getPlayerCount(){
    var playerCountRef = database.ref("playerCount")
    playerCountRef.on("value",info => {
      playerCount = info.val()
    })
  }

  updatePlayerCount(count){
    var playerCountRef = database.ref("/")
    playerCountRef.update({
      playerCount: count
    })
  }

  addPlayer(){
    var playerIndex = "players/player" +this.index

    if (this.index === 1){
      this.positionX = width/2-100
    } else{
      this.positionX = width/2+100
    }

    var playerRef = database.ref(playerIndex)
    playerRef.set({
      name: this.name,
      positionX: this.positionX,
      positionY: this.positionY,
      rank:this.rank,
      score:this.score
    })
  }

  getPlayerInfo(){
    var playersRef = database.ref("players")
    playersRef.on("value", info => {
      allPlayers = info.val()
    })
  }

  updatePlayer(){
    var playerIndex = "players/player" +this.index
    var playerRef = database.ref(playerIndex)
    playerRef.update({
      positionX: this.positionX,
      positionY: this.positionY,
      rank:this.rank,
      score:this.score,
      life:this.life
    })
  }

  getDistance(){
    var playerIndex = "players/player" +this.index
    var playerRef = database.ref(playerIndex)
    playerRef.on("value", info =>{
      var dado = info.val()
      this.positionX = dado.positionX
      this.positionY = dado.positionY
    })
  }
}
