let backgroundImage;
let items = [];
let shoppingCart;
let selectedItem = null;

function preload() {
  // Load the background image for the grocery shelves
  backgroundImage = loadImage("assets/shelvesdrawn.png",
    () => console.log("Background loaded"),
    () => console.error("Background failed to load"));

  // Load each item image and add to sprites
  items.push(createSprite(150, 100, 50, 50));
  items.push(createSprite(300, 100, 50, 50));
  items.push(createSprite(450, 100, 50, 50));
  
  // Load the item images
  items[0].addImage(loadImage("assets/bread.png",
    () => console.log("Bread loaded"),
    () => console.error("Bread failed to load")));
  
  items[1].addImage(loadImage("assets/eggs.png",
    () => console.log("Eggs loaded"),
    () => console.error("Eggs failed to load")));
  
  items[2].addImage(loadImage("assets/juice.png",
    () => console.log("Juice loaded"),
    () => console.error("Juice failed to load")));
}

function setup() {
  createCanvas(800, 600);

  // Define the shopping cart area at the bottom
  shoppingCart = createSprite(width / 2, height - 50, width, 100);
  shoppingCart.shapeColor = color(200, 200, 200, 150);  // Light gray with transparency

  // Log the positions of items to ensure they are created
  console.log("Items created at positions:");
  items.forEach((item, index) => {
    console.log(`Item ${index + 1} at x: ${item.position.x}, y: ${item.position.y}`);
  });
}

function draw() {
  background(220);

  // Draw the background image for the grocery shelves
  if (backgroundImage) {
    image(backgroundImage, 0, 0, width, height);
  }

  // Handle dragging of items
  items.forEach(item => {
    if (selectedItem === item) {
      item.position.x = mouseX;
      item.position.y = mouseY;
    }
    // Check if items are being rendered
    if (item) {
      console.log(`Drawing item at x: ${item.position.x}, y: ${item.position.y}`);
    }
  });

  drawSprites();  // Draw all sprites, including items and shopping cart
}

function mousePressed() {
  items.forEach(item => {
    if (item.mouseIsOver()) {
      selectedItem = item;  // Select item to drag
      console.log(`Selected item at x: ${item.position.x}, y: ${item.position.y}`);
    }
  });
}

function mouseReleased() {
  if (selectedItem && selectedItem.overlap(shoppingCart)) {
    // Position item in the shopping cart
    selectedItem.position.y = shoppingCart.position.y - 25;
  }
  selectedItem = null;  // Release the item
}
