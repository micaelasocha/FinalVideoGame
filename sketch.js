let backgroundImg;
let eggsImg, breadImg, juiceImg, milkImg, listImg, candyImg, yoohooImg, cheeseitImg, macImg, footImg, shoppingImg, basketImg, tortillaImg, baconImg, tomatoImg, lettuceImg;
let eggs, bread, juice, milk, candy, yoohoo, cheeseit, mac, foot, tortilla, bacon, tomato, lettuce;
let showLoadingScreen = true;
let showRecipeScreen = false;
let gravityForce = 7;
let sprites = [];
let totalCost = 0;
let beepSound;
let lastMessage = "";
let messageTimer = 0;
const MESSAGE_DURATION = 3000;
let newImage, loseImage;  // Declare the lose image
let showNewImageFlag = false;
let showLoseImageFlag = false;  // Flag to control the lose image display

let buttonX, buttonY, buttonWidth, buttonHeight;  // For the clickable rectangle

let loseScreenIndex = 1;  // Variable to track the current lose screen
let totalLoseScreens = 25;  // Total number of lose screens

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
  newImage = loadImage("assets/newImage.png");  // Load the new image
}

function setup() {
  createCanvas(2400, 1600);
  image(loadScreenImg, 0, 0, width, height);

  // Initialize button position and size
  buttonX = 1495;
  buttonY = 1355;
  buttonWidth = 400;
  buttonHeight = 70;
}

function mousePressed() {
  if (showLoseImageFlag) {
    // Prevent further actions if the lose image is shown
    return;
  }

  if (showLoadingScreen) {
    showLoadingScreen = false;
    showRecipeScreen = true;
    image(recipeScreenImg, 0, 0, width, height);  // Show the recipe screen immediately after loading
  } else if (showRecipeScreen) {
    showRecipeScreen = false;
    initializeSprites(); // Initialize sprites once the recipe screen is done
  } else {
    // Check if the click is within the bounds of the checkout button
    if (
      mouseX > buttonX &&
      mouseX < buttonX + buttonWidth &&
      mouseY > buttonY &&
      mouseY < buttonY + buttonHeight
    ) {
      // Show lose image when the checkout button is clicked
      showLoseImage();  // Call the function to show the lose image
    }
  }
}


// Function to show the current lose image based on the loseScreenIndex
function showLoseImage() {
  showLoseImageFlag = true;  // Set the flag to show the lose image

  // Dynamically load the lose image based on the current index
  let loseImagePath = `assets/lose${loseScreenIndex}.png`;  // Construct the path for the current lose image
  loseImage = loadImage(loseImagePath, () => {
    // Image loaded successfully
    console.log(`Loaded ${loseImagePath}`);
  }, () => {
    // Error loading image (if the image does not exist)
    console.log(`Failed to load ${loseImagePath}`);
  });

  // Increment the lose screen index, and reset it if it exceeds the total number of screens
  loseScreenIndex++;
  if (loseScreenIndex > totalLoseScreens) {
    loseScreenIndex = 1;  // Reset to the first lose screen
  }
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

  // Store the original positions
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

  // Store the initial position
  sprite.originalX = x;
  sprite.originalY = y;

  return sprite;
}

function resetSprites() {
  for (let sprite of sprites) {
    sprite.position.set(sprite.originalX, sprite.originalY); // Reset position
    sprite.counted = false; // Reset the counted state
  }
  totalCost = 0; // Reset the total cost
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
  image(backgroundImg, 0, 0);  // Draw the background
  image(shoppingImg, width - 460, 0, 400, height);  // Draw the shopping image

  // Draw the sprites after the background
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

  // Draw the clickable rectangle below the total cost
  fill('white');
  rect(buttonX, buttonY, buttonWidth, buttonHeight);

  fill(0);
  textSize(50);
  textAlign(CENTER, CENTER);
  text("Check Out", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);

  // Check if total exceeds 20.00
  if (totalCost > 20.00) {
    resetSprites();
  }

  // Draw the lose image on top of everything else
  if (showLoseImageFlag) {
    image(loseImage, 0, 0, width, height);  // Draw the lose image on top
  }
}

function applyGravityAndCheckCart(sprite) {
  const rectX = width - 460;
  const rectWidth = 400;
  const rectY = 0;
  const rectHeight = height;
  const platformY = rectHeight - 100; 

  // Check if the sprite is inside the cart area
  if (
    sprite.x > rectX &&
    sprite.x < rectX + rectWidth &&
    sprite.y > rectY &&
    sprite.y < rectHeight
  ) {
    displayMessages(sprite);

    // Apply gravity when not being dragged
    if (!sprite.mouse.dragging()) {
      sprite.y += gravityForce;

      // Stop sprite at the platform
      if (sprite.y > platformY) {
        sprite.y = platformY;
        gravityForce = 3;
      } else {
        gravityForce = min(gravityForce + 5, 90);
      }
    }

    // Increase the totalCost if the item hasn't been counted yet
    if (!sprite.counted) {
      totalCost += sprite.value;
      sprite.counted = true;
      if (beepSound.isLoaded()) beepSound.play();
    }
  } else {
    // Decrease the totalCost if the item was previously counted and is now removed
    if (sprite.counted) {
      totalCost -= sprite.value;
      sprite.counted = false;
    }
    gravityForce = 5; // Reset gravity force
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
