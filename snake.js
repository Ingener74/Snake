'use strict';

let screenWidth = 640;
let screenHeight = 480;
let l = 10;

let maxWidth = screenWidth/l - 1;
let maxHeight = screenHeight/l - 1;

let w = 87;
let a = 65;
let s = 83;
let d = 68;

function circle(x, dx, x0, xmax) {
	x += dx;
	if (x < x0) x = xmax;
	if (x > xmax) x = x0;
	return x;
}

function Direction(dir) {
	this.x = 0;
	this.y = 0;
	if      (dir == Direction.UP)    this.y = -1;
	else if (dir == Direction.LEFT)  this.x = -1;
	else if (dir == Direction.DOWN)  this.y =  1;
	else if (dir == Direction.RIGHT) this.x =  1;
}
Direction.UP = 0;
Direction.LEFT = 1;
Direction.DOWN = 2;
Direction.RIGHT = 3;

let dirs = new Map([
	[w, Direction.UP    ],
	[a, Direction.LEFT  ],
	[s, Direction.DOWN  ],
	[d, Direction.RIGHT ]
]);

function Food(x, y) {
	this.x = x;
	this.y = y;
	
	this.draw = function(context) {
		context.fillStyle = "#FF0000"
		context.fillRect(this.x * l, this.y * l, l, l)
	};
	
	return this;
}

function Snake(x, y, dir) {
	function SnakePart(x, y) {
		this.x = x;
		this.y = y;
		this.fresh = false;
		
		// this.move = function(dx, dy) {
		// 	this.x = circle(this.x, dx, 0, maxWidth);
		// 	this.y = circle(this.y, dy, 0, maxHeight);
		// };
		
		this.draw = function(context) {
			context.fillRect(this.x * l, this.y * l, l, l)
			context.strokeRect(this.x * l, this.y * l, l, l)
		};
		
		return this;
	}
	this.snake = new Array();
	this.snake.push(new SnakePart(x, y));
	this.dir = new Direction(dir);

	this.draw = function(context) {		
		context.fillStyle = "#0CA81E";
		context.strokeStyle = "#FFFFFF";
		for (var i = 0; i < this.snake.length; i++)
			this.snake[i].draw(context);
	};

	this.move = function(dir) {
		this.dir = new Direction(dir);
	};
	
	this.step = function() {
		var newSnake = new Array();
		newSnake.push(new SnakePart(circle(this.snake[0].x, this.dir.x, 0, maxWidth), circle(this.snake[0].y, this.dir.y, 0, maxHeight)));
		for (var i = 0; i < this.snake.length - 1; i++) {
			newSnake.push(this.snake[i]);
		}	
		this.snake = newSnake;
		for (var i = 0; i < this.snake.length; i++) {
			this.snake[i].fresh = false;
		}
	};
	
	this.eatFood = function(food) {
		if (food.x == this.snake[0].x && food.y == this.snake[0].y) {
			var tail = new SnakePart(food.x, food.y)
			tail.fresh = true;
			this.snake.push(tail);
			return true;
		}
		return false;
	};
	
	this.eatMySelf = function() {
		if (this.snake.length > 1) {
			for (var i = 1; i < this.snake.length; i++) {
				if (this.snake[0].x == this.snake[i].x && this.snake[0].y == this.snake[i].y && !this.snake[i].fresh) {
					return true;
				}
			}
		}
		return false;
	};
	
	return this;
}

function randomX() { return Math.floor(Math.random() * maxWidth); }
function randomY() { return Math.floor(Math.random() * maxHeight); }
function randomDir() { return Math.floor(Math.random() * 4); }

var food = new Food(randomX(), randomY());

var snake = new Snake(randomX(), randomY(), randomDir());

var context = document.getElementById('canvas').getContext('2d');

function draw (ctx) {
	ctx.fillStyle = '#000000';
	ctx.fillRect(0, 0, screenWidth, screenHeight);

	food.draw(ctx);
	snake.draw(ctx);
}

document.addEventListener("keydown", function (event) {
	if (dirs.has(event.keyCode)) 
		snake.move(dirs.get(event.keyCode));
	draw(context);
}, false);

setInterval(function() {
	snake.step();
	draw(context);
	if (snake.eatFood(food)) {
		food = new Food(randomX(), randomY());
	}
	if (snake.eatMySelf()) {
		console.log("Your eat yourself, game was restarted");
		food = new Food(randomX(), randomY());
		snake = new Snake(randomX(), randomY(), randomDir());
	}
}, 200);

draw(context);
