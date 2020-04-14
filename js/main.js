// Variable d'environement
window.onload = function () {
    canvas = document.querySelector("canvas");
    var niv1 = document.getElementById('niveau1');
    var niv2 = document.getElementById('niveau2');
    var niv3 = document.getElementById('niveau3');

    niv1.addEventListener("click",function(e){
        niv1.parentNode.removeChild(niv1);
        niv2.parentNode.removeChild(niv2);
        niv3.parentNode.removeChild(niv3);
        loadlevel(1);
    });

    niv2.addEventListener("click",function(e){
            niv1.parentNode.removeChild(niv1);
            niv2.parentNode.removeChild(niv2);
            niv3.parentNode.removeChild(niv3);
            loadlevel(2);
    });
    
    niv3.addEventListener("click",function(e){
            niv1.parentNode.removeChild(niv1);
            niv2.parentNode.removeChild(niv2);
            niv3.parentNode.removeChild(niv3);
            loadlevel(3);
    });
  }

//On genere les informations du fichier JSON
function loadlevel(nblevel){
    fetch('../json/'+"niveau"+nblevel+".json").then(function(response) {
        if (response.ok) {
            return response.json()
        } else {
            throw ("Error " + response.status);
        }
    }).then(function(data) {
        level = data;

        setInterval(draw,level.delay);
        ctx = canvas.getContext('2d');
        largeur = hauteur = 20;
        depX = depY = 0;

        //position initial de la tete du snake
        x = level.snake[0][1];
        y = level.snake[1][0];

        //un tableau vide qui corespond au quadrillage du canva 
        trace = [];
        tailleTrace = tailleInitTrace = 1; // taille du tableau
        sautTrace = 1;

        randomColor = 0;
        collisionTrace = false;
        numLevel = nblevel;
        hist = 0;
        sautBoucle = 10;
        score = 0;
        wall = level.walls;
        PommeX = Math.trunc(Math.random()*canvas.width/largeur)*largeur;
        PommeY = Math.trunc(Math.random()*canvas.height/hauteur)*hauteur;

        //la taille de la pomme et la vitesse de deplacement en fonction du niv
        configurationLevel(numLevel)
        document.addEventListener("keydown",keyboard);

    }).catch(function(err) {
        console.log("Erreur de chargement des donnée");
    });
}

function draw(){ 

    /****************Les images***************** */
    var block = new Image();
    block.src = "./img/block.png";
    
    var tete = new Image();
    tete.src = "./img/tete.jpg";
    
    let number = Math.floor(Math.random() * 5) + 1
    switch (numLevel) {
        case 1:
            ctx.fillStyle = "#fff";
            break;
        case 2:
            colorBackground(number);
            break;
        case 3:
            colorBackground(number);
            break;
        default:
            break;
    }

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for(var i = 0; i < wall.length; i++){
        ctx.beginPath();
        var mur = ctx.drawImage(block, wall[i][0], wall[i][1]);
        ctx.fillStyle = "blue";
        ctx.fill();
    }

    for(var i = 0; i < wall.length; i++){
        if (x === wall[i][0] && y === wall[i][1]) {
            mort();
        }
    }

    x += depX*largeur;
    y += depY*hauteur;
    // On insére la valeur de x et y dans le tableau
    trace.push({x:x,y:y});

    // tant que la taille du tableau (soit la trace) depasse la taille maximum
    while(trace.length > tailleTrace){
        // alors on enlève un élément
        trace.shift();
    }

    //la coulour du corps du serpent
    ctx.fillStyle = "green";

    //la couleur de la pomme, elle change de aleatoirement 
    for(var i=0; i<trace.length; i++) {
        if(i == trace.length-1){
            switch(randomColor){
            case 0:
                ctx.fillStyle = "#7489E8";
                break;
            case 1:
                ctx.fillStyle = "#4CEB4D";
                break;
            default:
                ctx.fillStyle = "#FF8B01";
            }
        }
        ctx.fillRect(trace[i].x,trace[i].y, largeur-3, hauteur-3);
    }


    //Si le snake mange une pomme
    if(x == PommeX && y == PommeY){
        score += 10 + 2 * ((tailleTrace - tailleInitTrace)/sautTrace);
        var player = document.querySelector('#piece');
        player.play();
        //pn change de couleur
        randomColor ++;
        randomColor %= 3;
        //setInterval(draw,level.delay*2);
        // Si la taille a été augmenté on enlève un saut d'expansion de trace
        tailleTrace += sautTrace;

        // On choisit une autre position pour la pomme
        PommeX = Math.trunc(Math.random()*canvas.width/largeur)*largeur;
        PommeY = Math.trunc(Math.random()*canvas.height/hauteur)*hauteur;
    }

    positionAleatoirePomme();

    ctx.beginPath();
    ctx.arc(PommeX+PommeRadius, PommeY+PommeRadius,PommeRadius, 0, Math.PI * 2);
    ctx.drawImage(tete, x-5, y-2, largeur+5, hauteur+5);
    ctx.fill();
    ctx.closePath();


    // Affichage du score
    ctx.font = '40px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText('Score: ' + score, 50, 50); 

    if(trace.length > 2){
        for(var i=0; i<trace.length-1; i++) {
            if(trace[i].x == trace[trace.length-1].x && trace[i].y==trace[trace.length-1].y){
                collisionTrace = true;
            break
            }
        }
    }

    if(x < 0 || x > canvas.width - largeur || y < 0 || y > canvas.height - hauteur || collisionTrace == true){ 
        mort();
    }
}

function colorBackground(number) {
    switch (number) {
        case 1:
            ctx.fillStyle = "#7489E8";
            break;
    
        case 2:
            ctx.fillStyle = "#4CEB4D";
            break;
        case 3:
            ctx.fillStyle = "#FF8B01";
            break;
        case 4:
            ctx.fillStyle = "#E856E2";
            break;
        case 5:
            ctx.fillStyle = "#49518F";
            break;
        default:
            ctx.fillStyle = "#fff";
            break;
    }
}

function positionAleatoirePomme() {
    var date = new Date();
    var seconde = date.getSeconds();
    //la pomme bouge aleatoirement et choisi une position au bout 1 seconde
    if (seconde%10 === 0) {
        PommeX = Math.trunc(Math.random()*canvas.width/largeur)*largeur;
        PommeY = Math.trunc(Math.random()*canvas.height/hauteur)*hauteur;
    }
}

function mort() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //La partie est finie, le ctx a depassé une des bordure du canva. On recharge la parge 

    //Afichage de l'image
    var loser = new Image();
    loser.src = "./img/loser.png";
    ctx.drawImage(loser, 150, 150);

    //Afichage du texte
    ctx.font = '70px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText('Votre score: ' + score, canvas.width/4, 100); 
    
    //on arrete le jeu 
    depX=0;
    depY=0;

    var player = document.querySelector('#audioPlayer');
    player.play();
    setTimeout(() => {window.location.reload(false); }, 2000);
}

function configurationLevel(numLevel) {
    switch (numLevel) {
        case 1:
            PommeRadius = 10;
            intervalID = setInterval(draw,150);
            break;

        case 2:
            PommeRadius = 7;
            intervalID = setInterval(draw,100);
            break;
        case 3:
            PommeRadius = 5;
            intervalID = setInterval(draw,30);
            break;
        default:
            PommeRadius = 10;
            intervalID = setInterval(draw,150);
            break;
    }
}

function keyboard(evt){
    
    switch(evt.keyCode) {
        case 37:
            // touche gauche
            if(hist==39){break;}
            depX=-1;
            depY=0;
            hist=evt.keyCode;
            break;

        case 38:
            // touche haut
            if(hist==40){break;}
            depX=0;
            depY=-1;
            hist=evt.keyCode;
            break;

        case 39:
            // touche droite
            if(hist==37){break;}
            depX=1;
            depY=0;
            hist=evt.keyCode;
            break;

        case 40:
            // touche bas
            if(hist==38){break;}
            depX=0;
            depY=1;
            hist=evt.keyCode;
            break;

        case 32:
            // touche espace pour l'arrêt
            depX=0;
            depY=0;
            break;
    }
}
