let backgroundImg;
let eggsImg, breadImg, juiceImg, milkImg, listImg, candyImg, yoohooImg, cheeseitImg, macImg, footImg, shoppingImg, basketImg, tortillaImg, baconImg, tomatoImg, lettuceImg;
let eggs, bread, juice, milk, cart, list, candy, yoohoo, cheeseit, mac, foot, shopping, tortilla, bacon, tomato, lettuce;
let showLoadingScreen = true;
let showRecipeScreen = false;
let gravityForce = 1; 
let sprites = [];
let totalCost = 0;
let beepSound;
let lastMessage = ""; 
let messageTimer = 0; 
const MESSAGE_DURATION = 3000; 

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
}

function setup() {
  createCanvas(2400, 1600);
  image(loadScreenImg, 0, 0, width, height);

  canvas.addEventListener("click", () => {
    if (showLoadingScreen) {
      showLoadingScreen = false;
      showRecipeScreen = true; 
      return;
    }
    if (showRecipeScreen) {
      showRecipeScreen = false; 
      initializeSprites();
    }
  });
}

function initializeSprites() {
  eggs = createSpriteObject(eggsImg, 200, 280, 2.75);
  bread = createSpriteObject(breadImg, 200, 1300, 3.50);
  juice = createSpriteObject(juiceImg, 200, 955, 4.25);
  milk = createSpriteObject(milkImg, 200, 610, 2.00);
  candy = createSpriteObject(candyImg, 490, 630, 1.95);
  yoohoo = createSpriteObject(yoohooImg, 690, 250, 1.00);
  cheeseit = createSpriteObject(cheeseitImg, 490, 260, 3.85);
  mac = createSpriteObject(macImg, 870, 250, 1.85);
  foot = createSpriteObject(footImg, 1090, 260, 2.35);
  tortilla = createSpriteObject(tortillaImg, 810, 600, 6.50);
  bacon = createSpriteObject(baconImg, 610, 1270, 10.00);
  tomato = createSpriteObject(tomatoImg, 900, 980, 3.00);
  lettuce = createSpriteObject(lettuceImg, 500, 980, 4.75);

  sprites = [eggs, bread, juice, milk, candy, yoohoo, cheeseit, mac, foot, tortilla, bacon, tomato, lettuce];
  list = listImg;
}

function createSpriteObject(img, x, y, value) {
  let sprite = new Sprite();
  sprite.img = img;
  sprite.position.set(x, y);
  sprite.drag = 10;
  sprite.value = value; 
  sprite.counted = false; 
  return sprite;
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

  clear();
  image(backgroundImg, 0, 0);
  image(list, 1300, 270, 700, 1000);
  image(shoppingImg, width - 460, 0, 400, height); 
  
  for (let sprite of sprites) {
    sprite.rotation = 0; 

    if (sprite.mouse.dragging()) {
      sprite.moveTowards(mouseX, mouseY, 1);
    }
    applyGravityAndCheckMessages(sprite);
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
    text(lastMessage, 640, 1500);
  }
}

function applyGravityAndCheckMessages(sprite) {
  let rectX = width - 460; 
  let rectWidth = 400; 
  let rectY = 0; 
  let rectHeight = height; 

  if (
    sprite.x > rectX &&
    sprite.x < rectX + rectWidth &&
    sprite.y > rectY &&
    sprite.y < rectHeight
  ) {
    displayMessages(sprite);

    if (!sprite.mouse.dragging()) {
      sprite.y += gravityForce;
      gravityForce = min(gravityForce + 90, 50); 
    }

    if (!sprite.counted) {
      totalCost += sprite.value;
      sprite.counted = true; 
      if (beepSound.isLoaded()) beepSound.play(); 
  } else {
    
    if (sprite.counted) {
      totalCost -= sprite.value;
      sprite.counted = false; 
    }
    gravityForce = 7;
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
  if (sprite === cheeseit) message = "what an economic snack";
  if (sprite === mac) message = "I love annies!";
  if (sprite === foot) message = "great choice";
  if (sprite === tortilla) message = "That's a little pricey for tortillas!";
  if (sprite === bacon) message = "You're never finishing all of that!";
  if (sprite === tomato) message = "Those are going to go bad before you use them.";
  if (sprite === lettuce) message = "Yea, you don't want to wash, cut, and prepare all that.";

  if (lastMessage !== message) {
    lastMessage = message;
    messageTimer = millis();
  }
}}
