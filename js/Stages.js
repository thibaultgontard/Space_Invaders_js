let score1 = 0
let bestscore =+ score1

//************************** */
class PlayStage extends Stage {
    constructor(gsm) {
        super(gsm)
        this.score = new ScoreManager()

        this.paysage = new Paysage(0, 0)

        this.vaisseau = new Vaisseau(CANVAS_WIDTH / 2 - 25,530)

        this.laser = new Laser(this.vaisseau,this.score, this.mystery)

        this.matrice = new Matrice(this.score)

        this.matrice1 = new Matrice1(this.score)

        this.matrice2 = new Matrice2(this.score)

        this.matrice3 = new Matrice3(this.score)

        this.bomb = new Bomb (this.matrice.getRandomBlock(),this.score,this.vaisseau)

        this.mystery = new Mystery (0,40,this.laser)

        this.lastAlienBombing = Date.now()

    }


    update(dt) {
        this.paysage.update(dt)

        this.vaisseau.update(dt)

        this.laser.update(dt)

        this.matrice.update(dt)

        this.matrice1.update(dt)

        this.matrice2.update(dt)

        this.matrice3.update(dt)

        this.bomb.update(dt)

        this.matrice.collideLaser(this.laser)

        this.matrice1.collideBomb(this.bomb)

        this.matrice2.collideBomb(this.bomb)

        this.matrice3.collideBomb(this.bomb)

        score1 = this.score.getPoints()
        localStorage.getItem('bestscore')
        console.log(localStorage.getItem('bestscore'))
        if(score1 > bestscore)
        { 
            localStorage.setItem('bestscore',score1)
        }
        
        this.mystery.update(dt)
          
        if (gInput.isKeyPressed(32)) {
            this.laser.setMouvement()
            gSounds["tir"].play()
        }
        const millis = Date.now() - this.lastAlienBombing
        if (millis >= 2000) {
			this.lastAlienBombing = Date.now()
			if (this.bomb.state = "LOCKED") {
				this.bomb.block = this.matrice.getRandomBlock()
				this.bomb.setMouvement()
            	gSounds["tir_alien"].play()
			}
        }

        if (gInput.isKeyPressed(LEFT_ARROW)) {
            this.vaisseau.move("LEFT")
        }
        if (gInput.isKeyPressed(RIGHT_ARROW)) {
            this.vaisseau.move("RIGHT")
        }

        if (gInput.isKeyReleased(LEFT_ARROW) || gInput.isKeyReleased(RIGHT_ARROW)) {
            this.vaisseau.stop()
        }
        this.score.update(dt)

        this.isGameOver()
    }

    ManageAlienBombing() {
		if (this.bomb.state == "LOCKED") {
			this.bomb.block = this.matrice.getRandomBlock()
			this.bomb.setMouvement()
			gSounds["tir"].play()
		}
    }

   /*collisions() {
        this.bomb.isCollideVaisseau()
        //this.laser.isCollideMystery()
    }*/

    isGameOver() {
        if (this.score.isGameOver()) {

            let options={
                name:this.score.getName(),
                points:this.score.getPoints()
            }

            this.gsm.changeStage(gStages.get("gameover"),options)
        }
        if (this.matrice.isMatriceDestroy()) {
            this.matrice.newWave()
            //this.matrice.reset()
        }

    }

    render() {
        this.paysage.render()

        this.vaisseau.render()

        this.laser.render()

        this.bomb.render()

        this.matrice.render()

        this.matrice1.render()

        this.matrice2.render()

        this.matrice3.render()

        this.mystery.render()

        this.score.render()

    }

    onEnter(datas) {

        gSounds["game"].setLoop(true)
        gSounds["game"].setVolume(0.5)
        gSounds["game"].play()

        if (datas != undefined) {
            this.score.setName(datas.name)
            this.score.reset()
        }
        this.matrice.newWave()
        this.vaisseau.reset()
    }

    onExit() {
        gSounds["game"].setLoop(false)
        gSounds["game"].stop()
    }
}
/**************************** */
class IntroStage extends Stage {
    constructor(gsm) {
        super(gsm)
        this.paysage1 = new Paysage1(0, 0)
        this.image = gTextures["obj"]
        this.image4 = gTextures["obj1"]
        this.image5 = gTextures["obj2"]
        this.image1 = gTextures["bouton"]
        this.image2 = gTextures["space"]
        this.image3 = gTextures["mistery"]
        this.image6 = gTextures["vaisseau_1"]
        this.image7 = gTextures["avion"]
        this.image8 = gTextures["press1"]
        this.tab = [65, 65, 65]
        this.indice = 0
        this.timer = 0
        this.toggle = true

        this.name = "a" +"a" +"a"

        this.label = new Label()
        this.label.setSize(50)
        this.label.setColor(color(250,255,0, 200))
    }

    update(dt) {

        this.timer += dt
        if (this.timer > 0.4) {
            this.timer = 0
            this.toggle = !this.toggle
        }

        if (gInput.isKeyPressed(ENTER)) {

            this.name = "" + char(this.tab[0]) + char(this.tab[1]) + char(this.tab[2])

            let options = {
                name: this.name
            }

            this.gsm.changeStage(gStages.get("play"), options)
        }

        if (gInput.isKeyPressed(LEFT_ARROW) && this.indice > 0) {
            this.indice = this.indice - 1
        }

        if (gInput.isKeyPressed(RIGHT_ARROW) && this.indice < 2) {
            this.indice = this.indice + 1
        }

        if (gInput.isKeyPressed(UP_ARROW)) {
            this.tab[this.indice] = this.tab[this.indice] + 1
            if (this.tab[this.indice] > 90) {
                this.tab[this.indice] = 65
            }
        }

        if (gInput.isKeyPressed(DOWN_ARROW)) {
            this.tab[this.indice] = this.tab[this.indice] - 1
            if (this.tab[this.indice] < 65) {
                this.tab[this.indice] = 90
            }
        }
    }

    render() {

        this.paysage1.render()
        
        this.label.render(240,405)

        this.afficheName()
    
        image(this.image,30,20)
        image(this.image1,300,250)
        image(this.image2,175,25)
        image(this.image3,580,25)
        image(this.image4,100,200)
        image(this.image5,550,180)
        image(this.image6,50,430)
        image(this.image7,570,460)
        image(this.image8,190,280)
    }

    onEnter() {
        gSounds["intro"].setLoop(true)
        gSounds['intro'].setVolume(0.5)
        gSounds["intro"].play()
    }

    onExit() {
        gSounds["intro"].setLoop(false)
        gSounds["intro"].stop()
    }

    afficheName() {
        let xp = 300
        let yp = 550
        textFont("lettre")

        //**************** */
        if (this.indice == 0) {
            if (this.toggle) {
                text(char(this.tab[0]), xp, yp)
            }
            text(char(this.tab[1]), xp + 50, yp)
            text(char(this.tab[2]), xp + 100, yp)
        }
        //******************** */
        else if (this.indice == 1) {
            if (this.toggle) {
                text(char(this.tab[1]), xp + 50, yp)
            }
            text(char(this.tab[0]), xp, yp)
            text(char(this.tab[2]), xp + 100, yp)
        }
        //********************* */
        else if (this.indice == 2) {
            if (this.toggle) {
                text(char(this.tab[2]), xp + 100, yp)
            }
            text(char(this.tab[0]), xp, yp)
            text(char(this.tab[1]), xp + 50, yp)
        }
    }
}
/******************************* */
class GameOverStage extends Stage {
    constructor(gsm) {
        super(gsm)
        this.paysage2 = new Paysage2(0, 0)
        this.label = new Label()
        this.label1 = new Label()
        this.label.setSize(25)
        this.label.setColor(color(255, 55, 55, 200))
        this.label1.setSize(50)
        this.label1.setColor(color(255, 55, 55, 200))
        this.score = new ScoreManager()
        this.image = gTextures["game_over"]
        this.image1 = gTextures["fin"]
        this.image2 = gTextures["cadre"]
        this.image3 = gTextures["bouton_start"]
        
    }

    update(dt) {
        if (gInput.isKeyPressed(ENTER)) {
            this.gsm.changeStage(gStages.get("intro"))
        }
    }

    render() {
        this.paysage2.render()

        if (this.score != undefined) {

            image(this.image,140,-60)
            image(this.image1,550,450)
            image(this.image2,35,300)
            image(this.image3,650,450)

            this.label1.setText("Score= " + this.score.getPoints() + " pts")
            this.label1.render(250,500)

            this.label.setText('Press Enter')
            this.label.render(665, 430)

            this.label1.setText("Player : " + this.score.getName()) 
            this.label1.render(90, 400)

            this.label.setText('Press ESC')
            this.label.render(542,430)

            //this.label1.setText( this.score.getName())
            //this.label1.render(100, CANVAS_HEIGHT / 2)
        }

    }

    onEnter(datas) {

        gSounds["fin"].setLoop(true)
        gSounds['fin'].setVolume(0.5)
        gSounds["fin"].play()

        if (datas != undefined) {
            this.score.setName(datas.name)
            this.score.setPoints(datas.points)
        }
    }

    onExit() {
        gSounds["fin"].setLoop(false)
        gSounds["fin"].stop()
    }
}
//**