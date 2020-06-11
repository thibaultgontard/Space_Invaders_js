//************************** */
class PlayStage extends Stage {
    constructor(gsm) {
        super(gsm)
        this.score = new ScoreManager()

        this.paysage = new Paysage(0, 0)

        this.vaisseau = new Vaisseau(CANVAS_WIDTH / 2 - 25)

        this.laser = new Laser(this.vaisseau,this.score, this.mystery)

        this.matrice = new Matrice(this.score)

        this.bomb = new Bomb (this.matrice.getRandomBlock(),this.score)

        this.carretab = []

        this.carretab.push(new Carre("ROUGE"))
        this.carretab.push(new Carre("ROUGE_1"))
        this.carretab.push(new Carre("ROUGE_2"))

        this.carretab.push(new Carre("BLEU"))
        this.carretab.push(new Carre("BLEU_1"))
        this.carretab.push(new Carre("BLEU_2"))

        this.carretab.push(new Carre("ROUGE_4"))
        this.carretab.push(new Carre("ROUGE_5"))
        this.carretab.push(new Carre("ROUGE_6"))

        this.carretab.push(new Carre("JAUNE"))
        this.carretab.push(new Carre("JAUNE_1"))
        this.carretab.push(new Carre("JAUNE_2"))

        this.carretab.push(new Carre("VIOLET"))
        this.carretab.push(new Carre("VIOLET_1"))
        this.carretab.push(new Carre("VIOLET_2"))

        this.carretab.push(new Carre("JAUNE_4"))
        this.carretab.push(new Carre("JAUNE_5"))
        this.carretab.push(new Carre("JAUNE_6"))

        this.carretab.push(new Carre("ORANGE"))
        this.carretab.push(new Carre("ORANGE_1"))
        this.carretab.push(new Carre("ORANGE_2"))

        this.carretab.push(new Carre("VERT"))
        this.carretab.push(new Carre("VERT_1"))
        this.carretab.push(new Carre("VERT_2"))

        this.carretab.push(new Carre("ORANGE_4"))
        this.carretab.push(new Carre("ORANGE_5"))
        this.carretab.push(new Carre("ORANGE_6"))

        this.mystery = new Mystery(this.laser,this.score)

        //this.carres = new Carres(this.score)
		this.lastAlienBombing = Date.now()

    }


    update(dt) {
        this.paysage.update(dt)

        this.vaisseau.update(dt)

        this.laser.update(dt)

        this.matrice.update(dt)

        this.bomb.update(dt)

        for (let i = 0; i < 6; i++) {
            this.carretab[i].update(dt)
        }

        this.matrice.collideLaser(this.laser)

        this.mystery.collideLaser(this.laser)

       /* let mysteryperiod = 20 
        let mysterycreation = 0

       if(mysterycreation < mysteryperiod)
            {
                mysterycreation += dt
            }
            else if(mysterycreation >mysteryperiod){
            this.mystery = new Mystery(-30)
            mysterycreation = 0
            this.mystery.state = "MOVE"
            }*/

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
            	gSounds["tir"].play()
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

        //this.collisions()

        this.isGameOver()
    }

   /*collisions() {
        this.mystery.isCollideLaser()
    }*/

	ManageAlienBombing() {
		if (this.bomb.state == "LOCKED") {
			this.bomb.block = this.matrice.getRandomBlock()
			this.bomb.setMouvement()
			gSounds["tir"].play()
		}
	}

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
        }

    }

    render() {
        this.paysage.render()

        this.vaisseau.render()

        this.laser.render()

        this.matrice.render()

        this.bomb.render()

        for (const item of this.carretab) {
            item.render()
        }

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
        this.paysage = new Paysage(0, 0)
        this.label = new Label()
        this.label.setSize(50)
        this.label.setColor(color(55, 55, 55, 200))
        this.score = new ScoreManager()
    }

    update(dt) {
        if (gInput.isKeyPressed(ENTER)) {

            this.gsm.changeStage(gStages.get("intro"))
        }
    }

    render() {
        this.paysage.render()

        if (this.score != undefined) {
            this.label.setText("Game Over " + this.score.getName())
            this.label.render(CANVAS_WIDTH / 4, CANVAS_HEIGHT / 4)

            this.label.setText("Score= " + this.score.getPoints() + " pts")
            this.label.render(CANVAS_WIDTH / 4, CANVAS_HEIGHT / 2)

            this.label.setText('Press Enter to Start')
            this.label.render(0, 100 + CANVAS_HEIGHT / 2)
        }

    }

    onEnter(datas) {
        if (datas != undefined) {
            this.score.setName(datas.name)
            this.score.setPoints(datas.points)
        }
    }

    onExit() {}
}
//**
