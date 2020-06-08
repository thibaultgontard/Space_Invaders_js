
//******************************* 
class Paysage {
    constructor(xp, yp) {
        this.x = xp
        this.y = yp
        this.dx = -2
        this.image = gTextures["paysage"]
    }

    update(dt) {
        //this.x += this.dx

        if (this.x <= -CANVAS_WIDTH) {
            this.x = 0
        }
    }

    render() {
        image(this.image, this.x, this.y)
    }
}

class Paysage1 {
    constructor(xp, yp) {
        this.x = xp
        this.y = yp
        this.dx = -2
        this.image = gTextures["fond"]
    }

    update(dt) {
        //this.x += this.dx

        if (this.x <= -CANVAS_WIDTH) {
            this.x = 0
        }
    }

    render() {
        image(this.image, this.x, this.y)
    }
}

class Paysage2 {
    constructor(xp, yp) {
        this.x = xp
        this.y = yp
        this.dx = -2
        this.image = gTextures["ecran_fin"]
    }

    update(dt) {
        //this.x += this.dx

        if (this.x <= -CANVAS_WIDTH) {
            this.x = 0
        }
    }

    render() {
        image(this.image, this.x, this.y)
    }
}

class Vaisseau extends Entity {

    constructor(xp,yp) {
        super(xp, CANVAS_HEIGHT - 50, gTextures["vaisseau"])
        this.explosion = new Animation(gTextures["explo"],192,192,1/30, false)
        this.echap = new ParticlesGenerator(xp, yp, 10, 100, 3.3, 3.0)
        this.echap.start()
        this.speed = 100
        this.xinit = xp
        this.yinit = yp
        this.dx = 0
        this.dy = 0
        this.state = "LIVE"
        this.inflate(2, 2)
    }

    reset() {
        this.x = this.xinit
        this.y = this.yinit
        this.state = "LIVE"
    }

    stop() {
        this.dx = 0
    }

    touched() {
        if (this.state === "LIVE") {
        this.state = "TOUCHED"
        this.explosion.play()
        }
    }

    move(direction) {
        switch (direction) {
            case "LEFT":
                this.dx = -this.speed
                break


            case "RIGHT":
                this.dx = this.speed
                break

            default:
                break
        }
    }

    update(dt) {
        super.update(dt)
        this.x += this.dx * dt
        if (this.state === "LIVE") {
            this.x += this.dx * dt
        }

        //limites
        if (this.getLeft() < 0) {
            this.setLeft(0)
        }

        if (this.getRight() > CANVAS_WIDTH-200) {
            this.setRight(CANVAS_WIDTH-200)
        }

        this.echap.move(this.x, this.y + 20)
        this.echap.update(dt)

        this.explosion.update(dt)

        if (this.state === "TOUCHED" && this.explosion.isPlaying() == false) {
            this.state = "LIVE"
            //this.x = this.xinit
            //this.y = this.yinit
            this.dx = 0
            this.dy = 0
        }

    }

    render() {
        super.render()
        if (this.state === "TOUCHED") {
            this.explosion.render(this.x-65, this.y-65)
        }
        if(this.explosion.isPlaying() == false)
        {
            this.echap.render()
        }
    }
}
//*************************** 

class Mystery extends Entity
{
    constructor(score,laser) {
        super(0,40, gTextures["mistery"])

        this.score = score
        this.laser = laser
        this.dx = 0
        this.dy = 0
        this.state = "LIVE"
        this.setLeft(-2000)
        this.inflate(2, 2)
    }

    newSpeedX() {
        this.dx = (90)
    }

    touched() {
        this.state = "TOUCHED"
    }
    
    update(dt) {
        super.update(dt)

        if (this.state === "LIVE") {
            this.x += this.dx * dt
            this.y += this.dy * dt
            this.newSpeedX()
        }

        if (this.state === "TOUCHED") {
            this.setLeft(-2000)
        }

        if(this.getRight() > CANVAS_WIDTH-200)
        {
            this.setLeft(-2000)
        }

    }
    
    render() {
        super.render()
    }

}

//*************************** 
class Bomb extends Entity {
    constructor(block,score,vaisseau) {
        super(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, gTextures["bomb"])
        this.score = score
        this.block = block
        this.vaisseau = vaisseau
        this.dx = 0
        this.dy = 0
        this.state = "LOCKED"
        this.inflate(3, 3)
    }

    setLocked() {
        this.state = "LOCKED"
    }

    newSpeedY() {
        this.dy = (200)
    }

    setMouvement() {
        if (this.state === "LOCKED") {
            this.state = "MOVE"
            this.newSpeedY()
        }

    }

    touched() {
        this.state = "TOUCHED"
    }

    isCollideVaisseau() {
        if (this.collides(this.vaisseau)) {
            this.vaisseau.touched()
            this.state = "TOUCHED"
            this.score.decrementsLives()
            gSounds["explosion1"].play()
            return true
        } else {
            return false
        }
    }

    update(dt) {
        super.update(dt)

        if (this.state === "TOUCHED"){
            this.state = "LOCKED"
        }

        if (this.state === "LOCKED") {
            this.setBottom(this.block.y + 20)
            this.setCenterX(this.block.x + 22)
        }

        else if (this.state === "MOVE") {

            this.x += this.dx * dt
            this.y += this.dy * dt

            this.isCollideVaisseau()

            //limites
            if (this.getBottom() > CANVAS_HEIGHT) {
                this.state = "LOCKED"
            }
        
        }
    }

    render() {
        super.render()
    }
}

class Laser extends Entity {
    constructor(vaisseau, score, mystery) {
        super(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, gTextures["laser"])
        this.vaisseau = vaisseau
        this.score = score
        this.mystery = mystery
        this.speedMin = 100
        this.speedMax = 150
        this.dx = 0
        this.dy = 0

        this.state = "LOCKED"
        this.inflate(3, 3)
    }

    setLocked() {
        this.state = "LOCKED"
    }

    newSpeedY() {
        this.dy = -(300)
    }

    setMouvement() {
        if (this.state === "LOCKED") {
            this.state = "MOVE"
            this.newSpeedY()
        }

    }

    touched() {
        this.state = "TOUCHED"
    }

    /*collideMystery() {
        if (this.collides(this.mystery)) {
            this.touched()
            this.mystery.touched()
            return true
        } else {
            return false
        }
    }*/

    update(dt) {
        super.update(dt)

        if (this.state === "TOUCHED"){
            this.state = "LOCKED"
        }

        if (this.state === "LOCKED") {
            this.setBottom(this.vaisseau.getTop()+22)

            this.setCenterX(this.vaisseau.getCenterX())

        } else if (this.state === "MOVE") {

            this.x += this.dx * dt
            this.y += this.dy * dt

            //limites
            if (this.getTop() < 0 && this.dy < 0) {
                this.state = "LOCKED"
            }

            //this.collideMystery()
        
        }
    }

    render() {
        super.render()

        //super.renderDebug()
    }
}

//******************************* 

class Carre extends Entity {
    constructor(xp, yp, type = "ROUGE",state = "VISIBLE") {
        switch (type) {
            case "ROUGE":
                super(xp, yp, gTextures["carre_rouge"])
                break

            case "VIOLET":
                super(xp, yp, gTextures["carre_violet2"])
                break

            case "BLEU":
                    super(xp, yp, gTextures["carre_bleu2"])
                    break

            default:
                break;
        }
        this.state = state
        this.type = type 
        this.inflate(5, 5)
    }

    touched() {
        this.state = "TOUCHED"
    }

    update(dt) {
        super.update(dt)
    }

    render() {
        
        super.render()
        //super.renderDebug()
    }
}

//******************************* 

class Matrice1 {
    constructor(score) {
        this.score = score
        this.nbCol = 3
        this.nbRow = 3
        this.py = 350
        this.tabCarre = new Array(this.nbRow)
        this.createGrid()
    }

    createGrid() {
        for (let j = 0; j < this.nbRow; j++) {
            this.tabCarre[j] = new Array(this.nbCol)
        }

        let row = 0

        
        this.createRow(row, this.py, "ROUGE")

        this.py += 30
        row++
        this.createRow(row, this.py, "ROUGE")

        this.py += 30
        row++

        this.createRow(row, this.py, "ROUGE")

    }

    createRow(row, yp, type) {
        for (let i = 0; i < this.nbCol; i++) {
            this.tabCarre[row][i] = new Carre(BLOCK_WIDTH + i * BLOCK_WIDTH * 0.55 + 50, yp, type)
        }
    }

    collideBomb(bomb) {
        for (let j = 0; j < this.nbRow; j++) {
            for (let i = 0; i < this.nbCol; i++) {

                let item = this.tabCarre[j][i]

                if (item != undefined && item.state === "VISIBLE" && bomb.state === "MOVE") {
                    if (bomb.collides(item)) {
                        this.tabCarre[j][i].state = "TOUCHED"
                        //console.log("collide: " + j + " : " + i)
                        bomb.touched()
                        return
                    }
                }
            }
        }
    }

    update(dt) {
        
        for (let j = 0; j < this.nbRow; j++) {
            for (let i = 0; i < this.nbCol; i++) {

                let item = this.tabCarre[j][i]

                if (item != undefined) {
                    this.tabCarre[j][i].update(dt)
                }
            }
        }

}

    render() {

        for (let j = 0; j < this.nbRow; j++) {
            for (let i = 0; i < this.nbCol; i++) {

                let item = this.tabCarre[j][i]

                if (item != undefined && item.state === "VISIBLE") {
                    this.tabCarre[j][i].render()
                }
            }
        }
    }
}

//******************************* 

class Matrice2 {
    constructor(score) {
        this.score = score
        this.nbCol = 3
        this.nbRow = 3
        this.py = 349
        this.tabCarre = new Array(this.nbRow)
        this.createGrid()
    }

    createGrid() {
        for (let j = 0; j < this.nbRow; j++) {
            this.tabCarre[j] = new Array(this.nbCol)
        }

        let row = 0

        
        this.createRow(row, this.py, "VIOLET")

        this.py += 29
        row++
        this.createRow(row, this.py, "VIOLET")

        this.py += 29
        row++

        this.createRow(row, this.py, "VIOLET")

    }

    createRow(row, yp, type) {
        for (let i = 0; i < this.nbCol; i++) {
            this.tabCarre[row][i] = new Carre(BLOCK_WIDTH + i * BLOCK_WIDTH * 0.55 + 310, yp, type)
        }
    }

    collideBomb(bomb) {
        for (let j = 0; j < this.nbRow; j++) {
            for (let i = 0; i < this.nbCol; i++) {

                let item = this.tabCarre[j][i]

                if (item != undefined && item.state === "VISIBLE" && bomb.state === "MOVE") {
                    if (bomb.collides(item)) {
                        this.tabCarre[j][i].state = "TOUCHED"
                        //console.log("collide: " + j + " : " + i)
                        bomb.touched()
                        return
                    }
                }
            }
        }
    }

    update(dt) {
        
        for (let j = 0; j < this.nbRow; j++) {
            for (let i = 0; i < this.nbCol; i++) {

                let item = this.tabCarre[j][i]

                if (item != undefined) {
                    this.tabCarre[j][i].update(dt)
                }
            }
        }

}

    render() {

        for (let j = 0; j < this.nbRow; j++) {
            for (let i = 0; i < this.nbCol; i++) {

                let item = this.tabCarre[j][i]

                if (item != undefined && item.state === "VISIBLE") {
                    this.tabCarre[j][i].render()
                }
            }
        }
    }
}

//******************************* 

class Matrice3 {
    constructor(score) {
        this.score = score
        this.nbCol = 3
        this.nbRow = 3
        this.py = 353
        this.tabCarre = new Array(this.nbRow)
        this.createGrid()
    }

    createGrid() {
        for (let j = 0; j < this.nbRow; j++) {
            this.tabCarre[j] = new Array(this.nbCol)
        }

        let row = 0

        
        this.createRow(row, this.py, "BLEU")

        this.py += 29
        row++
        this.createRow(row, this.py, "BLEU")

        this.py += 29
        row++

        this.createRow(row, this.py, "BLEU")

    }

    createRow(row, yp, type) {
        for (let i = 0; i < this.nbCol; i++) {
            this.tabCarre[row][i] = new Carre(BLOCK_WIDTH + i * BLOCK_WIDTH * 0.57 + 550, yp, type)
        }
    }

    collideBomb(bomb) {
        for (let j = 0; j < this.nbRow; j++) {
            for (let i = 0; i < this.nbCol; i++) {

                let item = this.tabCarre[j][i]

                if (item != undefined && item.state === "VISIBLE" && bomb.state === "MOVE") {
                    if (bomb.collides(item)) {
                        this.tabCarre[j][i].state = "TOUCHED"
                        //console.log("collide: " + j + " : " + i)
                        bomb.touched()
                        return
                    }
                }
            }
        }
    }

    update(dt) {
        
        for (let j = 0; j < this.nbRow; j++) {
            for (let i = 0; i < this.nbCol; i++) {

                let item = this.tabCarre[j][i]

                if (item != undefined) {
                    this.tabCarre[j][i].update(dt)
                }
            }
        }

}

    render() {

        for (let j = 0; j < this.nbRow; j++) {
            for (let i = 0; i < this.nbCol; i++) {

                let item = this.tabCarre[j][i]

                if (item != undefined && item.state === "VISIBLE") {
                    this.tabCarre[j][i].render()
                }
            }
        }
    }
}

//******************************* 

class Block extends Entity {
    constructor(xp, yp, type = "PURPLE",state = "LIVE") {
        
        switch (type) {
            case "PURPLE":
                super(xp, yp,gTextures["explosion_purple"])
                this.animation = new Animation(gTextures["alien_purple"],40,40,1, true) 
                break

            case "BLUE":
                super(xp, yp,gTextures["explosion_blue"])
                this.animation = new Animation(gTextures["alien_blue"],40,40,1, true)
                break


            case "GREEN":
                super(xp, yp,gTextures["explosion_green"])
                this.animation = new Animation(gTextures["alien_green"],40,40,1, true)
                break

            default:
                break;
        }
        this.animation.play()
        this.state = state
        this.type = type
        this.timer = 0
        this.startx = xp
        this.starty = yp
        this.inflate(3, 3)
    }

    touched() {
        if (this.state === "LIVE") {
        this.state = "TOUCHED"
        }
    }

    update(dt) {
        super.update(dt)
        if(this.state == "VISIBLE")
        {
            this.animation.update(dt)
        }
        if(this.state == "TOUCHED")
        {
            super.update(dt)
        }
    }

    render() {
        if (this.state === "VISIBLE") {
            this.animation.render(this.getLeft(),this.getTop())
        }
        if (this.state === "TOUCHED") {
            super.render(this.getLeft(),this.getTop())
        }
        }

        //super.renderDebug()
    }


//*******************************
class Matrice {
    constructor(score) {
        this.score = score
        this.nbCol = 8
        this.nbRow = 5
        this.py = 40
        this.tabBlocks = new Array(this.nbRow)
        this.createGrid()
        this.newWave()
    }

    createGrid() {
        for (let j = 0; j < this.nbRow; j++) {
            this.tabBlocks[j] = new Array(this.nbCol)
        }

        let row = 0

        
        this.createRow(row, this.py, "PURPLE")

        this.py += 40
        row++
        this.createRow(row, this.py, "BLUE")

        this.py += 40
        row++

        this.createRow(row, this.py, "BLUE")

        this.py += 40
        row++

        this.createRow(row, this.py, "GREEN")

        this.py += 40
        row++
        
        this.createRow(row, this.py, "GREEN")
    }

    newWave() {
        for (let j = 0; j < this.nbRow; j++) {
            for (let i = 0; i < this.nbCol; i++) {
                this.tabBlocks[j][i].state = "VISIBLE"
            }
        }
    }

    /*reset() {
        this.tabBlocks[j][i].xp = 40
        this.tabBlocks[j][i].yp = 100
    }*/
        
    createRow(row, yp, type) {
        for (let i = 0; i < this.nbCol; i++) {
            this.tabBlocks[row][i] = new Block(i * BLOCK_WIDTH * 1.3 , yp, type)
            this.tabBlocks[row][i].dx = 58.9
        }
    }

   collideLaser(laser) {
        for (let i = 0; i < this.nbRow; i++) {
            for (let j = 0; j < this.nbCol; j++) {

                let item = this.tabBlocks[i][j]

                if (item != undefined && item.state === "VISIBLE" && laser.state === "MOVE") {
                    if (laser.collides(item)) {
                        this.tabBlocks[i][j].state = "TOUCHED"
                        laser.touched()
                        gSounds["explosion"].play()
                        this.score.incrementsPoints(1)
                        return
                    }
                }
            }
        }
    }

    update(dt) {

    let isReboundLeft = false
    let isReboundRight = false

        for (let i = 0; i < this.nbRow; i++) {
            for (let j = 0; j < this.nbCol; j++) {

                let item = this.tabBlocks[i][j]

                if (item != undefined) {
                    this.tabBlocks[i][j].update(dt)
                }
            
        if(!isReboundLeft)
        {
            isReboundLeft = (item.getLeft() < 0)
        }
        if(!isReboundRight)
        {
            isReboundRight = (item.getRight() > CANVAS_WIDTH-200)
        }
    }

if(isReboundLeft) {
    for(let i=0 ; i< this.nbRow; i++) {
      for(let j=0; j< this.nbCol; j++) {
       let item = this.tabBlocks[i][j]
       item.setTop(item.getTop() + 3)
       this.x += this.dx * dt
       this.y += this.dy * dt
       item.dx = 60
       item.update(dt)
        }
    }
  }

  if(isReboundRight) {
    for(let i=0 ; i< this.nbRow; i++) {
      for(let j=0; j< this.nbCol; j++) {
       let item = this.tabBlocks[i][j]
       item.setTop(item.getTop() + 2)
       item.dx = -10
       item.update(dt)
        }
    }
  }
}
}

    isMatriceDestroy() {
        for (let i = 0; i < this.nbRow; i++) {
            for (let j = 0; j < this.nbCol; j++) {

                if (this.tabBlocks[i][j].state === "VISIBLE") {
                    return false
                }
            }
        }
        
        return true
    }

    getRandomBlock() {
		var x = 0
        var y = 0
        while(true)
		{
			y = Math.floor(Math.random() * 4)
			for(x = 4 ; x>=0 ; x--){
                if(this.tabBlocks[x][y]!=undefined){
                if(this.tabBlocks[x][y].state == "VISIBLE"){
		return this.tabBlocks[x][y];
    }
   }
  }
 }
}

    render() {

        for (let i = 0; i < this.nbRow; i++) {
            for (let j = 0; j < this.nbCol; j++) {

                let item = this.tabBlocks[i][j]

                if (item != undefined && item.state === "VISIBLE") {
                    this.tabBlocks[i][j].render()
                }
            }
        }
    }
}



