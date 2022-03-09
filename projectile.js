import platforme from '../img/platforme.png'
import petiteplat from '../img/petiteplat.png'
import fond from '../img/fond.png'
import arbre1 from '../img/arbre1.png'
import arbre2 from '../img/arbre2.png'
import dino from '../img/dino.png'
import dinocourtdroite from '../img/dinocourtdroite.png'
import dinocourtgauche from '../img/dinocourtgauche.png'
/*import pompier from '../img/pompier.png'*/



console.log(platforme)


const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 574

const gravity = 1  //si j'augmente l'objet tombe + vite

class Joueur {
    constructor() {
        this.position = {
            x: 100,
            y: 100
        }
        this.rapide = {  // rapidité à la quelle l'objet tombe
            x: 0,
            y: 0  // si je veux que l'objet tombe plus vite, j'augmente y
        }
        this.width = 150
        this.height = 150

        this.image = createImage(dino)
        this.frames = 0
        this.sprites = {
            arret: {
                droite: createImage(dino),
                gauche: createImage(dino),
                cropWidth: 442,
                width: 150
            },
            courir: {
                droite: createImage(dinocourtdroite), 
                gauche: createImage(dinocourtgauche),
                cropWidth: 442,
                width: 150
            }
        }

        this.currentSprite = this.sprites.arret.droite
        this.currentCropWidth = 442
    }


    draw() {
        c.drawImage(
            this.currentSprite,
            this.currentCropWidth * this.frames,
            0,
            this.currentCropWidth,
            400,
            this.position.x, this.position.y,
            this.width, this.height)
    }
 
    update() {
        this.frames++
        if (this.frames > 0 && (this.currentSprite ===
             this.sprites.arret.droite || this.currentSprite ===
             this.sprites.arret.gauche))
        this.frames = 0
        else if (this.frames > 25 && (this.currentSprite ===
             this.sprites.courir.droite || this.currentSprite === this.sprites.courir.gauche))
             this.frames = 0

        console.log('update')
        this.draw()
        this.position.x += this.rapide.x  //se déplacer en gauche/droite
        this.position.y += this.rapide.y  //se déplacer en haut/bas
        
        if (this.position.y +this.height +this.rapide.y <= canvas.height)
            this.rapide.y +=gravity
        /*else this.rapide.y = 0*/   //permet que l'objet ne tombe pas sous la page
    }
}

/*POMPIER*/
var dx = 50;
var dy = 0;
class Pompier {
    constructor(x, y, radius, color, rapide) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.rapide = rapide
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2,
            false)
        c.fillStyle  = this.color
        c.fill()

    }

    update() {
        this.draw()
        c.restore()
        this.x +=this.rapide.x
        this.y +=this.rapide.y
    }
}

class Platforme {
    constructor({x, y, image}) {
       this.position = {
           x,
           y
       } 

       this.image = image
       this.width = image.width     /*les plateformes prendront la taille de l'image*/
       this.height = image.height

    } 
    draw(){
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}


class Generique {
    constructor({x, y, image}) {
       this.position = {
           x,
           y
       } 

       this.image = image
       this.width = image.width     /*les sprites*/
       this.height = image.height

    } 
    draw(){
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

function createImage(imageSrc) {
    const image = new Image()
    image.src = imageSrc
    return image
}

let platformeImage = createImage(platforme)

let joueur = new Joueur()
let platformes = []
let generique = []
let enemies = []
/*let pompiers = [
    new Pompier({
        position: {
            x: 550,
            y: 400
        },
        rapide: {
            x: 0,
            y: 0
        }
    })
]*/
let currentKey

const keys = {
    droite: {
        pressed: false
    },
    gauche: {
        pressed: false
    }
}


let scrollOffset = 0 

function enemiesPompiers(){
    
    setInterval(() => {
        const x = 600  /*où il commence */
        const y = 400
        const radius = 30
        const color = 'red'
        const rapide = {
            x: 3,    /*avancement à droite*/
            y: 0    /*vers où il avance, (ici horizontal)*/
        }
        enemies.push(new Pompier(x, y, radius, color, rapide))
        console.log(enemies);
    }, 0 /*rapidité à la quelles ils vont*/)
}
function init(){
    platformeImage = createImage(platforme)
    
    joueur = new Joueur()
    platformes = [new Platforme({x: 0, y:455, image: platformeImage}),
        new Platforme({x: platformeImage.width, y: 455, image: platformeImage}),
        new Platforme({x: platformeImage.width *2 +200, y: 455, image: platformeImage}),
        new Platforme({x: platformeImage.width *3 + 200, y: 350, image: platformeImage}),
        new Platforme({x: platformeImage.width *4 + 350, y: 450, image: platformeImage})
        
        ]


    generique = [
        new Generique({x: 0, y:0, image: createImage(fond)}),
        new Generique({x: -650, y:-800, image: createImage(arbre1)})
    ]


    scrollOffset = 0    //permet de défiler tout en même temps que le joueur
} 
 

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'white' /*afin de voir la partie "jouable"*/
    c.fillRect(0,0, canvas.width, canvas.height) // permet à ce que l'objet tombe et ne "coule" pas
    generique.forEach(generique => {
        generique.draw()
    })

    platformes.forEach((platforme) => {
        platforme.draw()
    })

    enemies.forEach((pompier) => {
        pompier.update()
    })

    joueur.update() /*placé ici afin que le joueur soit devant la plateforme et non caché dedrrière */

    if (keys.droite.pressed && joueur.position.x < 400) {  //si on appue sur droite on avance et il s'arrête s'il dépasse la poistion x=400
        joueur.rapide.x = 5
    } else if ((keys.gauche.pressed && joueur.position.x > 100) 
    || keys.gauche.pressed && scrollOffset === 1 && joueur.pisition.x > 0
    ){//si on appue sur gauche on va à gauche
        joueur.rapide.x = -5
    } else {
        joueur.rapide.x = 0
        if (keys.droite.pressed) {
            scrollOffset += 5
            platformes.forEach((platforme) => {
                platforme.position.x -= 5
            })

            generique.forEach((generique) => {
                generique.position.x -= 3   /*le fond bouge en même temps vers la gauche quand j'avance à droite*/
            })
        }  
        else if (keys.gauche.pressed && scrollOffset >0) {
            scrollOffset -= 5
            platformes.forEach((platforme) => {
                platforme.position.x += 5
            })
            
            generique.forEach((generique) => { /*fonc qui bouge de l'autre côte quand je recule*/
                generique.position.x += 3
            })
        }
    }  //sinon on reste sur place

    console.log(scrollOffset)

    platformes.forEach((platforme) => {
        if (joueur.position.y + joueur.height <= platforme.position.y && joueur.position.y
            + joueur.height + joueur.rapide.y >= platforme.position.y &&
            joueur.position.x + joueur.width >= platforme.position.x
            && joueur.position.x <= platforme.position.x + platforme.width)
        {
            joueur.rapide.y = 0
        }
    })


     /*switch des sprites*/
    if (
        keys.droite.pressed &&
        currentKey == 'droite' && joueur.currentSprite != joueur.sprites.courir.droite)
    {
        joueur.frames = 1
        joueur.currentSprite = joueur.sprites.courir.droite
        joueur.currentCropWidth = joueur.sprites.courir.cropWidth
        joueur.width = joueur.sprites.courir.width
    }   
    else if (
        keys.gauche.pressed &&
        currentKey === 'gauche' && joueur.currentSprite !== joueur.sprites.courir.gauche)
        {
        joueur.currentSprite = joueur.sprites.courir.gauche
        joueur.currentCropWidth = joueur.sprites.courir.cropWidth
        joueur.width = joueur.sprites.courir.width
        }
    else if (  /*revenir = l'arrêt quand on appuie pas sur les touches*/
        !keys.gauche.pressed &&
        currentKey === 'gauche' && joueur.currentSprite !== joueur.sprites.arret.gauche)
        {
        joueur.currentSprite = joueur.sprites.arret.gauche
        joueur.currentCropWidth = joueur.sprites.arret.cropWidth
        joueur.width = joueur.sprites.arret.width
        }
    
    else if (  /*revenir = l'arrêt quand on appuie pas sur les touches*/
        !keys.droite.pressed &&
        currentKey === 'droite' && joueur.currentSprite !== joueur.sprites.arret.droite)
        {
        joueur.currentSprite = joueur.sprites.arret.droite
        joueur.currentCropWidth = joueur.sprites.arret.cropWidth
        joueur.width = joueur.sprites.arret.width
        }    

    if (scrollOffset > 800) {
        console.log('gagné!')
    }

    /*perdre*/


    if (joueur.position.y > canvas.clientHeight) {
        console.log("perdu")
        init() /* permet de reset le jeu dès que le joueur tombe "sous le canvas"*/
    }
}

init()
animate()
enemiesPompiers()

addEventListener('keydown', ({ keyCode}) => {  //si on appue sur une de ces touches, le personnage se déplace
    console.log(keyCode)
    if (keys.gauche.pressed || keys.droite.pressed) {
        console.log('here')
        if (keyCode === 38) {
            joueur.rapide.y -= 17
        }
    } else {
    switch (keyCode) {
        case 37:
            console.log('gauche')
            keys.gauche.pressed = true
            currentKey = 'gauche'
            break
        case 38:
            console.log('haut')
            joueur.rapide.y -= 20
            break
        case 39:
            console.log('droite')
            keys.droite.pressed = true
            currentKey = 'droite'

            break
        case 40:
            console.log('bas')
            break
    }
}

    console.log(keys.droite.pressed)
})

addEventListener('keyup', ({ keyCode}) => {   
    console.log(keyCode)
    switch (keyCode) {
        case 37:
            console.log('gauche')       //permet à ce que le personnage ne part pas à gauche à l'infini
            keys.gauche.pressed = false
            break
        case 38:
            console.log('haut')
            //joueur.rapide.y -= 0
            break
        case 39:
            console.log('droite')
            keys.droite.pressed = false
            break
        case 40:
            console.log('bas')
            break
    }
    console.log(keys.droite.pressed)
})
