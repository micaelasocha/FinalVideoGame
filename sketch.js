let backgroundImg;
let eggsImg, breadImg, juiceImg, milkImg, candyImg, yoohooImg, cheeseitImg, macImg, footImg, shoppingImg, basketImg, tortillaImg, baconImg, tomatoImg, lettuceImg;
let eggs, bread, juice, milk, candy, yoohoo, cheeseit, mac, foot, tortilla, bacon, tomato, lettuce;
let showLoadingScreen = true;
let showRecipeScreen = false;
let gravityForce = 7;
let sprites = [];
let totalCost = 0;
let beepSound, crunchSound;
let lastMessage = "";
let messageTimer = 0;
const MESSAGE_DURATION = 3000;
let loseImages = [];
let loseImageIndex = 0;
let showLoseImageFlag = false;

let buttonX, buttonY, buttonWidth, buttonHeight; 

function preload() {
  loadScreenImg = loadImage("assets/supermarket.png");
  recipeScreenImg = loadImage("assets/recipe.png");
  eggsImg = loadImage("assets/eggs.png");
  breadImg = loadImage("assets/bread.png");
  juiceImg = loadImage("assets/juice.png");
  milkImg = loadImage("assets/milk.png");
  candyImg = loadImage("assets/candy.png");
  yoohooImg = loadImage("assets/yoohoo.png");
  cheeseitImg = loadImage("assets/cheeseit.png");
  macImg = loadImage("assets/mac.png");
  footImg = loadImage("assets/foot.png");
  tortillaImg = loadImage("assets/tortilla.png");
  baconImg = loadImage("assets/bacon.png");
  tomatoImg = loadImage("assets/tomato.png");
  lettuceImg = loadImage("assets/lettuce.png");
  listImg = loadImage("assets/list.png");
  backgroundImg = loadImage("assets/shelves.png");
  shoppingImg = loadImage("assets/shopping.png");
  basketImg = loadImage("assets/basket.png");
  beepSound = loadSound("assets/beep.mp3");
  crunchSound = loadSound("assets/crunch.mp3");


  for (let i = 1; i <= 25; i++) {
    loseImages.push(loadImage(`assets/lose${i}.png`));
  }
}

function setup() {
  createCanvas(2400, 1600);
  image(loadScreenImg, 0, 0, width, height);


  buttonX = 1495;
  buttonY = 1355;
  buttonWidth = 400;
  buttonHeight = 70;
}

function mousePressed() {
  if (showLoseImageFlag) {
    if (loseImageIndex < loseImages.length - 1) {
      loseImageIndex++;
      if (crunchSound.isLoaded()) {
    
        let crunchInstance = crunchSound.play();
      }
    }
    return;
  }

  if (showLoadingScreen) {
    showLoadingScreen = false;
    showRecipeScreen = true;
    image(recipeScreenImg, 0, 0, width, height);
  } else if (showRecipeScreen) {
    showRecipeScreen = false;
    initializeSprites();
  } else if (
    mouseX >= buttonX &&
    mouseX <= buttonX + buttonWidth &&
    mouseY >= buttonY &&
    mouseY <= buttonY + buttonHeight
  ) {
    showLoseImage();
  }
}

function initializeSprites() {
  eggs = createSpriteObject(eggsImg, 200, 280, 2.75);
  bread = createSpriteObject(breadImg, 200, 1300, 3.5);
  juice = createSpriteObject(juiceImg, 200, 955, 4.25);
  milk = createSpriteObject(milkImg, 200, 610, 2.0);
  candy = createSpriteObject(candyImg, 490, 630, 1.95);
  yoohoo = createSpriteObject(yoohooImg, 690, 250, 1.0);
  cheeseit = createSpriteObject(cheeseitImg, 490, 260, 3.85);
  mac = createSpriteObject(macImg, 870, 250, 1.85);
  foot = createSpriteObject(footImg, 1090, 260, 2.35);
  tortilla = createSpriteObject(tortillaImg, 810, 600, 6.5);
  bacon = createSpriteObject(baconImg, 610, 1270, 10.0);
  tomato = createSpriteObject(tomatoImg, 900, 980, 3.0);
  lettuce = createSpriteObject(lettuceImg, 500, 980, 4.75);

  sprites = [eggs, bread, juice, milk, candy, yoohoo, cheeseit, mac, foot, tortilla, bacon, tomato, lettuce];

  for (let sprite of sprites) {
    sprite.originalX = sprite.position.x;
    sprite.originalY = sprite.position.y;
  }
}

function createSpriteObject(img, x, y, value) {
  let sprite = new Sprite();
  sprite.img = img;
  sprite.position.set(x, y);
  sprite.drag = 10;
  sprite.value = value;
  sprite.counted = false;
  sprite.originalX = x;
  sprite.originalY = y;
  return sprite;
}

function resetSprites() {
  for (let sprite of sprites) {
    sprite.position.set(sprite.originalX, sprite.originalY);
    sprite.counted = false;
  }
  totalCost = 0;
}

function draw() {
  if (showLoadingScreen) {
    image(loadScreenImg, 0, 0, width, height);
    return;
  }

  if (showRecipeScreen) {
    image(recipeScreenImg, 0, 0, width, height);
    return;
  }

  if (showLoseImageFlag) {
    image(loseImages[loseImageIndex], 0, 0, width, height);
    if (loseImageIndex === 0) {
      fill('black'); 
      textSize(100);
      textAlign(CENTER, CENTER);
      text("CLICK", width / 2, height / 2 + 500); 
    }
    return;
  }

  clear();
  image(backgroundImg, 0, 0);
  image(shoppingImg, width - 460, 0, 400, height);

  for (let sprite of sprites) {
    sprite.rotation = 0;
    if (sprite.mouse.dragging()) {
      sprite.moveTowards(mouseX, mouseY, 1);
    }
    applyGravityAndCheckCart(sprite);
    sprite.draw();
  }

  image(basketImg, width - 460, 0, 400, height);

  fill("white");
  textSize(40);
  textAlign(CENTER, TOP);
  text(`Total: $${totalCost.toFixed(2)}`, width - 260, 20);

  if (millis() - messageTimer < MESSAGE_DURATION && lastMessage !== "") {
    fill("white");
    textSize(50);
    textAlign(CENTER, TOP);
    text(lastMessage, width / 2, height - 150);
  }

  fill("white");
  rect(buttonX, buttonY, buttonWidth, buttonHeight);
  fill(0);
  textSize(50);
  textAlign(CENTER, CENTER);
  text("Check Out", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);

  if (totalCost > 20.0) {
    resetSprites();
  }
}

function applyGravityAndCheckCart(sprite) {
  const rectX = width - 460;
  const rectWidth = 400;
  const rectY = 100;
  const rectHeight = height;
  const platformY = rectHeight -110;

  if (
    sprite.x > rectX &&
    sprite.x < rectX + rectWidth &&
    sprite.y > rectY &&
    sprite.y < rectHeight
  ) {
    displayMessages(sprite);

    if (!sprite.mouse.dragging()) {
      sprite.y += gravityForce;

      if (sprite.y > platformY) {
        sprite.y = platformY;
        gravityForce = 3;
      } else {
        gravityForce = min(gravityForce + 5, 90);
      }
    }

    if (!sprite.counted) {
      totalCost += sprite.value;
      sprite.counted = true;
      if (beepSound.isLoaded()) beepSound.play();
    }
  } else {
    if (sprite.counted) {
      totalCost -= sprite.value;
      sprite.counted = false;
    }
    gravityForce = 5;
  }
}

function displayMessages(sprite) {
  let message = "";

  if (sprite === eggs) message = "Those are going to go bad!";
  if (sprite === milk) message = "You won't drink all that!";
  if (sprite === juice) message = "That's a waste of money!";
  if (sprite === bread) message = "That is going to get moldy!";
  if (sprite === candy) message = "A sweet treat...? :)";
  if (sprite === yoohoo) message = "ooo that looks good";
  if (sprite === cheeseit) message = "What an economic snack!";
  if (sprite === mac) message = "I love Annie's!";
  if (sprite === foot) message = "Great choice!";
  if (sprite === tortilla) message = "That's a little pricey for tortillas!";
  if (sprite === bacon) message = "You're never finishing all of that!";
  if (sprite === tomato) message = "Those are going to go bad before you use them.";
  if (sprite === lettuce) message = "You don't want to wash and prepare all that.";

  if (lastMessage !== message) {
    lastMessage = message;
    messageTimer = millis();
  }
}

function showLoseImage() {
  showLoseImageFlag = true;
  loseImageIndex = 0; 


  for (let sprite of sprites) {
    sprite.visible = false;
  }
}

