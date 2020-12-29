var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage, birdImg, tunnelImg,backgroundImg,tunnel2Img;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var life = 10;
var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  groundImage = loadImage("ground2.png");
  birdImg = loadImage("bird.png");
  tunnel2Img = loadImage("tunnels2.png");
  tunnelImg = loadImage("tunnels.png")
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  backgroundImg = loadImage("background.png")
}

function setup() {
  createCanvas(1200, 800);
  
  trex = createSprite(50,720,20,50);
  trex.addImage(birdImg)
  trex.scale = 0.15;
  ground = createSprite(200,720,2400,20);
  ground.visible = false;
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(600,400);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(600,480);
  restart.addImage(restartImg);
  
  gameOver.scale = 1;
  restart.scale = 1;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,730,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  background(backgroundImg);

  fill(0);
  textFont("Georgia");
  textSize(30);
  text("Lifetime: "+ life, 500,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space")) {
      trex.velocityY = -12;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        life = life-1;
    }

    if(cloudsGroup.isTouching(trex)){
      gameState = END;
      life = life-1;
  }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
       //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation

    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }

  if(life === 0){
    clear();
    obstaclesGroup = null;
    cloudGroup = null;
    trex = null;
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 80 === 0) {
    var cloud = createSprite(1200,30,50,50);
    cloud.y = Math.round(random(-10,20));
    cloud.setCollider("rectangle",0,0,cloud.width+60,cloud.height+460);
    cloud.addImage(tunnel2Img);
    cloud.velocityX = -(6 + 3*score/100);
    
     //assign lifetime to the variable
     cloud.lifetime = 800;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(1200,705,90,40);
    obstacle.addImage(tunnelImg);
    obstacle.setCollider("rectangle",0,0,obstacle.width-380,obstacle.height);
    obstacle.y = Math.round(random(600,800));
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    //assign scale and lifetime to the obstacle           
    obstacle.lifetime = 800;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  score = 0;
  
}