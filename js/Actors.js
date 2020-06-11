

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

class Vaisseau extends Entity {

    constructor(xp) {
        super(xp, CANVAS_HEIGHT - 50, gTextures["vaisseau"])

        this.speed = 150
        this.dx = 0
        this.dy = 0

        this.inflate(2, 2)
    }

    stop() {
        this.dx = 0
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

        //limites
        if (this.getLeft() < 0) {
            this.setLeft(0)
        }

        if (this.getRight() > CANVAS_WIDTH-200) {
            this.setRight(CANVAS_WIDTH-200)
        }

    }

    render() {
        super.render()

        //super.renderDebug()
    }
}
//*************************** 

class Mystery extends Entity
{
    constructor(laser,score) {
        super(0,40, gTextures["mistery"])

        this.score = score
        this.laser = laser
        this.dx = 60
        this.dy = 0
        this.state = "MOVE"
        this.setLeft(-1000)
        this.inflate(2, 2)
    }

    touched() {
        this.state = "TOUCHED"
    }

    collideLaser(laser) {

                let item = this.mistery

                if (item != undefined && item.state === "MOVE" && laser.state === "MOVE") {
                    if (laser.collides(item)) {
                        item.touched()
                        laser.touched()
                        //gSounds["explosion"].stop()
                        //gSounds["explosion"].play()
                        this.score.incrementsPoints(10)
                        return
                    }
                }
            }
    

    update(dt) {
        super.update(dt)

        if (this.state === "MOVE") {
            this.x += this.dx * dt
            this.y += this.dy * dt
        }

        if (this.state === "TOUCHED") {
            this.setLeft(-1000)
            //this.collideLaser1(this.laser)
        }

        if(this.getRight() > CANVAS_WIDTH-200)
        {
            this.setLeft(-1000)
        }

    }
    
    render() {
        super.render()
    }

}

//*************************** 
class Bomb extends Entity {
    constructor(block,score) {
        super(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, gTextures["bomb"])
        this.score = score
        this.block = block
        this.dx = 0
        this.dy = 0

        this.state = "LOCKED"
        this.inflate(3, 3)
    }

    setLocked() {
        this.state = "LOCKED"
    }

    newSpeedY() {
        this.dy = (100)
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

    update(dt) {
        super.update(dt)
        if (this.state === "TOUCHED"){
            this.state = "LOCKED"
        }

        if (this.state === "LOCKED") {
            this.setBottom(this.block.y + 50)
            this.setCenterX(this.block.x + 22)
        }

        else if (this.state === "MOVE") {

            this.x += this.dx * dt
            this.y += this.dy * dt

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
    constructor(vaisseau, score) {
        super(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, gTextures["laser"])
        this.vaisseau = vaisseau
        this.score = score
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
        
        }
    }

    render() {
        super.render()

        //super.renderDebug()
    }
}

//******************************* 

class Carre extends Entity {
    constructor(type) {
        switch (type) {
            case "ROUGE":
                super(64,300, gTextures["carre_rouge"])
                break
            case "ROUGE_1":
                super(85,300, gTextures["carre_rouge"])
                break
            case "ROUGE_2":
                super(106,300, gTextures["carre_rouge"])
                break


            case "BLEU":
                super(11, 321, gTextures["carre_bleu"])
                break
            case "BLEU_1":
                super(32, 321, gTextures["carre_bleu"])
                break
            case "BLEU_2":
                super(53, 321, gTextures["carre_bleu"])
                break


            case "ROUGE_4":
                super(64,342, gTextures["carre_rouge"])
                break
            case "ROUGE_5":
                super(85,342, gTextures["carre_rouge"])
                break
            case "ROUGE_6":
                super(106,342, gTextures["carre_rouge"])
                break


            case "JAUNE":
                super(401,300, gTextures["carre_jaune"])
                break
            case "JAUNE_1":
                super(422,300, gTextures["carre_jaune"])
                break
            case "JAUNE_2":
                super(443,300, gTextures["carre_jaune"])
                break


            case "VIOLET":
                super(269,322, gTextures["carre_violet"])
                break
            case "VIOLET_1":
                super(290.5,322, gTextures["carre_violet"])
                break
            case "VIOLET_2":
                super(312,322, gTextures["carre_violet"])
                break


            case "JAUNE_4":
                super(401,344, gTextures["carre_jaune"])
                break
            case "JAUNE_5":
                super(422,344, gTextures["carre_jaune"])
                break
            case "JAUNE_6":
                super(443,344, gTextures["carre_jaune"])
                break


            case "ORANGE":
                super(560, 300, gTextures["carre_orange"])
                break
            case "ORANGE_1":
                super(581, 300, gTextures["carre_orange"])
                break
            case "ORANGE_2":
                super(602, 300, gTextures["carre_orange"])
                break


            case "VERT":
                super(612.5, 321, gTextures["carre_vert"])
                break
            case "VERT_1":
                super(633, 321, gTextures["carre_vert"])
                break
            case "VERT_2":
                super(654, 321, gTextures["carre_vert"])
                break


            case "ORANGE_4":
                super(560, 342, gTextures["carre_orange"])
                break
            case "ORANGE_5":
                super(581, 342, gTextures["carre_orange"])
                break
            case "ORANGE_6":
                super(602, 342, gTextures["carre_orange"])
                break

            default:
                break;
        }
        this.type = type

        //this.inflate(5, 5)
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

class Block extends Entity {
    constructor(xp, yp, type = "PURPLE",state = "VISIBLE") {
        
        switch (type) {
            case "PURPLE":
                super(xp, yp, gTextures["alien_purple"])
                this.animation = new Animation(gTextures["alien_purple"],40,40,0.5, true) 
                break

            case "BLUE":
                super(xp, yp, gTextures["alien_blue"])
                this.animation = new Animation(gTextures["alien_blue"],40,40,0.5, true)
                break


            case "GREEN":
                super(xp, yp, gTextures["alien_green"])
                this.animation = new Animation(gTextures["alien_green"],40,40,0.5, true)
                break

            default:
                break;
        }
        this.state = state
        this.type = type
        this.timer = 0
        this.startx = xp
        this.starty = yp
        this.inflate(5, 5)
    }

    touched() {
        this.state = "TOUCHED"
    }

    update(dt) {
        super.update(dt)
        if(this.state == "VISIBLE")
        {
            this.animation.update(dt)
        }
    }

    render() {
        if (this.state === "VISIBLE") {
            super.render()
            this.animation.render(this.getLeft(),this.getTop())
        }

        //super.renderDebug()
    }
}

//*******************************
class Matrice {
    constructor(score) {
        this.score = score
        this.nbCol = 5
        this.nbRow = 5
        this.py = 40
        this.tabBlocks = new Array(this.nbRow)
        this.createGrid()
        this.newWave()
        this.explosion_blue = new Animation(gTextures["explosion_blue"],BLOCK_WIDTH,BLOCK_HEIGHT,1/30,false)
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

    createRow(row, yp, type) {
        for (let i = 0; i < this.nbCol; i++) {
            this.tabBlocks[row][i] = new Block(BLOCK_WIDTH + i * BLOCK_WIDTH * 1.6, yp, type)
            this.tabBlocks[row][i].dx = 100
        }
    }

   collideLaser(laser) {
        for (let j = 0; j < this.nbRow; j++) {
            for (let i = 0; i < this.nbCol; i++) {

                let item = this.tabBlocks[j][i]

                if (item != undefined && item.state === "VISIBLE" && laser.state === "MOVE") {
                    if (laser.collides(item)) {
                        this.tabBlocks[j][i].state = "TOUCHED"
                        //console.log("collide: " + j + " : " + i)
                        laser.touched()
                        this.explosion_blue.play()
                        gSounds["explosion"].play()
                        //gSounds["explosion"].stop()
                        //gSounds["explosion"].play()
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
        for (let j = 0; j < this.nbRow; j++) {
            for (let i = 0; i < this.nbCol; i++) {

                let item = this.tabBlocks[i][j]

                item.update(dt)
            
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
	    for(let j=0 ; j< this.nbRow; j++) {
	      for(let i=0; i< this.nbCol; i++) {
	       let item = this.tabBlocks[i][j]
	       item.setTop(item.getTop() + 3)
	       item.dx = 100
	       item.update(dt)
	        }
	    }
	  }
	
	  if(isReboundRight) {
	    for(let j=0 ; j< this.nbRow; j++) {
	      for(let i=0; i< this.nbCol; i++) {
	       let item = this.tabBlocks[i][j]
	       item.setTop(item.getTop() + 10)
	       item.dx = -50
	       item.update(dt)
	        }
	    }
	  }
	}
	}

    isMatriceDestroy() {
        for (let j = 0; j < this.nbRow; j++) {
            for (let i = 0; i < this.nbCol; i++) {

                if (this.tabBlocks[j][i].state === "VISIBLE") {
                    return false
                }
            }
        }
        
        return true
    }

	getRandomBlock() {
		var x = 4
		var y = 0
		do {
			y = Math.floor(Math.random() * this.nbRow)
			while (this.tabBlocks[x][y] == undefined || this.tabBlocks[x][y].state != "VISIBLE") {
				x -= 1
				if (x == 0) {
					break			
				}
			}
		} while (this.tabBlocks[x][y] == undefined || this.tabBlocks[x][y].state != "VISIBLE")
		return this.tabBlocks[x][y];
	}

    render() {

        for (let j = 0; j < this.nbRow; j++) {
            for (let i = 0; i < this.nbCol; i++) {

                let item = this.tabBlocks[j][i]

                if (item != undefined && item.state === "VISIBLE") {
                    this.tabBlocks[j][i].render()
                }
            }
        }
    }
	
}



