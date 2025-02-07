import platforme from '../img/platforme.png'
import petiteplat from '../img/petiteplat.png'
import fond from '../img/fond.png'
import arbre1 from '../img/arbre1.png'
import arbre2 from '../img/arbre2.png'
import dino from '../img/dino.png'
import dinocourtdroite from '../img/dinocourtdroite.png'
import dinocourtgauche from '../img/dinocourtgauche.png'
import pompier from '../img/pompier.png'
import feu from '../img/boulefeu.png'




console.log(platforme)
console.log(pompier)


const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 574

const gravity = 1  //si j'augmente l'objet tombe + vite

class Joueur {
    constructor() {
        this.position = {
            x: 100,
            y: 298
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

/**** ENNEMIES Pompiers****/
class Pompier {
    constructor({x, y, image}) {
       this.position = {
           x,
           y
       } 

       this.image = image
       this.width = image.width     /*les pompiers prendront la taille de l'image*/
       this.height = image.height

    } 
    draw(){
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class Feu {
    constructor({x, y, image}) {
        this.position = {
            x,
            y
        } 
 
        this.image = image
        this.width = image.width     /*les pompiers prendront la taille de l'image*/
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
let pompierImage = createImage(pompier)

let joueur = new Joueur()
let platformes = []
let generique = []
let pompiers = []
let feux = []
var nb = platformeImage.width - 25;
var ff = joueur.position.x
var fois = 0

let isforward = true
let present = true
var nbdevant = nb  +15
var nbderriere = nb -15
let currentKey
const keys = {
    droite: {
        pressed: false
    },
    gauche: {
        pressed: false
    }
} 
/*setInterval(dessinePompier, 2000);*/
function dessinePompier() {     /*permet de faire l'animation de l'ennemi pompier */
    pompierImage = createImage(pompier)

    pompiers = [new Pompier({x: nb, y: 356, image: (pompierImage)})
        ]
        if (nb < platformeImage.width*2 -60 && isforward==true){
            nb = nb + 3;
            //nbdevant = nb + 15
            //nbderriere = nb-15
        }

        else {
            isforward = false
            if(nb <= platformeImage.width- 25) {
                isforward =true
            }
            nb = nb -3
            //nbderriere = nb - 15
            //nbdevant= nb+15


    }
}

function bouleFeu(){
    feux = [new Feu({x: ff+50, y: 200, image: createImage(feu)})]
    if (ff<300 && present == true){
        ff = ff + 3;
    }
    else{
        present == false
        delete feux[0];
        present == true
    }
}

let scrollOffset = 0 

function init(){
    platformeImage = createImage(platforme)
    
    joueur = new Joueur()
    platformes = [new Platforme({x: 0, y:455, image: platformeImage}),
        new Platforme({x: platformeImage.width, y: 455, image: platformeImage}),
        new Platforme({x: platformeImage.width *2 +200, y: 455, image: platformeImage}),
        new Platforme({x: platformeImage.width *3 + 200, y: 350, image: platformeImage}),
        new Platforme({x: platformeImage.width *4 + 350, y: 450, image: platformeImage})
        
        ]

    setInterval(dessinePompier, 50)

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

    pompiers.forEach((pompier) => {
        pompier.draw()
    })

    feux.forEach((feu) => {
        feu.draw()
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
            pompiers.forEach((pompier) => {
                pompier.position.x -= 5
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
            pompiers.forEach((pompier) => {
                pompier.position.x += 5
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

    pompiers.forEach((pompier) => {
        if (joueur.position.x + joueur.width >= pompier.position.x + 50
            && joueur.position.x <= pompier.position.x + pompier.width && joueur.position.y >= 300 )
        {
            console.log('mort')
            init()
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
        
        /*feu*/
        case 32:
            console.log('feu')
            fois++
            if (present == true){
                setInterval(bouleFeu, 50)
            }
            else { 
                
                }
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
        
        case 32:
            break
    }
    console.log(keys.droite.pressed)
})
