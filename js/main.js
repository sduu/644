const canvas = document.querySelector('#stage');
const canvasWrap = canvas.parentNode || canvas;
const context = canvas.getContext('2d');

let resizeTimer;

const background = (function() {
	const rows = 6;
	const itemArray = [];
	let itemWidth = Math.min(canvas.width / 10, 150);

	let isAnimate = false;
	
	var init = function(){
		canvas.width = canvasWrap.offsetWidth;
		canvas.height = canvasWrap.offsetHeight;

		canvas.offCanvas = document.createElement('canvas');
		canvas.offContext = canvas.offCanvas.getContext('2d');
		canvas.offCanvas.width = 512;
		canvas.offCanvas.height = 512;

		setItem();
		resize();
	};

	var setItem = function() {
		const imgElem = new Image();
		imgElem.src = './images/img-birthday-cake.png';
		imgElem.addEventListener('load', () => {
			canvas.offContext.drawImage(imgElem, 0, 0);
		
			let x, y;
			for (let i = 1; i <= rows; i++) {
				if (i % 2 != 0) {
					for (let j = 0; j < 3; j++) {
						x = j * 2;
						y = (i - 1);
						itemArray.push(new Item(x, y, 'odd'));
					}
				} else {
					for (let j = 0; j < 2; j++) {
						x = j * 2;
						y = (i - 1);
						itemArray.push(new Item(x, y, 'even'));
					}
				}
			}
		});
	};

	var drawBoard = function (){
		for (let x = 0; x <= canvas.width; x += canvas.width / 5) {
			context.moveTo(0.5 + x, 0);
			context.lineTo(0.5 + x, canvas.height);
		}
		for (let x = 0; x <= canvas.height; x += canvas.height / 4) {
			context.moveTo(0, 0.5 + x);
			context.lineTo(canvas.width, 0.5 + x);
		}
		context.strokeStyle = "black";
		context.stroke();
	};

	var update = function() {
		if (!isAnimate) {
			return false;
		}

		context.clearRect(0, 0, canvas.width, canvas.height);
		//drawBoard();
		let item;
		for (let i = 0; i < itemArray.length; i++) {
			item = itemArray[i];
			item.y -= 0.5;
			item.draw();
		}

		requestAnimationFrame(update);
	};

	var playAnimation = function() {
		isAnimate = true;
		update();
	};

	var pauseAnimation = function() {
		isAnimate = false;
	};

	var resize = function() {
		canvas.width = canvasWrap.offsetWidth;
		canvas.height = canvasWrap.offsetHeight;
		itemWidth = Math.min(canvas.width / 10, 150);
	};

	class Item {
		constructor(x, y, line) {
			this.line = line;
			this.x = x;
			this.y = canvas.height / 4 * y;
			this.draw();
		}

		draw() {
			if (this.y < -itemWidth) {
				this.y = canvas.height / 4 * line - itemWidth;
			}
			if (this.line === 'odd') {
				context.drawImage(canvas.offCanvas, canvas.width / 5 * this.x + (canvas.width / 10 - itemWidth / 2), this.y, itemWidth, itemWidth);
			} else {
				context.drawImage(canvas.offCanvas, canvas.width / 5 * this.x + canvas.width / 5 + (canvas.width / 10 - itemWidth / 2), this.y, itemWidth, itemWidth);
			}
		}
	};

	return {
		init: init,
		resize: resize,
		play: playAnimation,
		pause: pauseAnimation
	};
})();

/* init */
background.init();
background.play();

/* add event */
window.addEventListener('resize', function() {
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(function() {
		background.resize();
	}, 0.5);
});