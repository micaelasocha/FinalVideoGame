let backgroundImg;
let eggsImg, breadImg, juiceImg, milkImg, listImg;
let eggs, bread, juice, milk, list;

function preload() {
  eggsImg = loadImage("assets/eggs.png");
  breadImg = loadImage("assets/bread.png");
  juiceImg = loadImage("assets/juice.png");
  milkImg = loadImage("assets/milk.png");
  listImg = loadImage("assets/list.png");
  backgroundImg = loadImage("assets/shelves.png");
}

function setup() {
  createCanvas(4000, 2000);

  eggs = new Sprite();
  eggs.img = eggsImg;
  eggs.position.set(200, 280); 
  eggs.drag = 10; 

  bread = new Sprite();
  bread.img = breadImg;
  bread.position.set(200, 1200); 
  bread.drag = 10; 

  juice = new Sprite();
  juice.img = juiceImg;
  juice.position.set(200, 900); 
  juice.drag = 10; 

  milk = new Sprite();
  milk.img = milkImg;
  milk.position.set(200, 580); 
  milk.drag = 10; 

  list = new Sprite();
  list.img = listImg;
  list.position.set(200, 580);

  
}

function draw() {
  clear();
  image(backgroundImg, 0, 0);


  if (eggs.mouse.dragging()) {
    eggs.moveTowards(mouseX, mouseY, 1);
  }
  
  if (bread.mouse.dragging()) {
    bread.moveTowards(mouseX, mouseY, 1);
  }
  
  if (juice.mouse.dragging()) {
    juice.moveTowards(mouseX, mouseY, 1);
  }

  if (milk.mouse.dragging()) {
    milk.moveTowards(mouseX, mouseY, 1);
  }
}
