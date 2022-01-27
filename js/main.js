const canvas = document.querySelector('#stage');
const canvasWrap = canvas.parentNode || canvas;
const context = canvas.getContext('2d');

const marqueeArray = [];

let resizeTimer;

const background = (function() {
	const rows = 6;
	const itemArray = [];
	let itemWidth = Math.min(canvas.width / 10, 150);

	let isAnimate = false;
	
	const init = function(){
		canvas.width = canvasWrap.offsetWidth;
		canvas.height = canvasWrap.offsetHeight;

		canvas.offCanvas = document.createElement('canvas');
		canvas.offContext = canvas.offCanvas.getContext('2d');
		canvas.offCanvas.width = 512;
		canvas.offCanvas.height = 512;

		setItem();
		resize();
	};

	const setItem = function() {
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

	const drawBoard = function (){
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

	const update = function() {
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

	const playAnimation = function() {
		isAnimate = true;
		update();
	};

	const pauseAnimation = function() {
		isAnimate = false;
	};

	const resize = function() {
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
				this.y = canvas.height / 4 * rows - itemWidth;
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

const marquee = function(el, option) {
	const target = el;
	const inner = el.querySelector('.marquee-item');
	const options = option;
	const timeline = gsap.timeline();

	inner.appendChild(inner.firstElementChild.cloneNode(true));

	if (options.type === 'horizontal') {
		target.classList.add('horizon');

		timeline.fromTo(inner, {x: (i, t) => options.direction === 'right' ? -t.firstElementChild.offsetWidth : 0}, {
			repeat: -1,
			ease: Linear.easeNone,
			duration: 30,
			x: (i, t) => options.direction === 'right' ? 0 : -t.firstElementChild.offsetWidth,
		});
	} else {
		target.style.height = `${inner.firstElementChild.offsetHeight}px`;

		timeline.fromTo(inner, {y: (i, t) => options.direction === 'down' ? -t.firstElementChild.offsetHeight : 0}, {
			repeat: -1,
			ease: Linear.easeNone,
			duration: 1,
			y: (i, t) => options.direction === 'down' ? 0 : -t.firstElementChild.offsetHeight,
		});
	}

	timeline.pause();

	return timeline;
}

/* init */
gsap.registerPlugin(ScrollTrigger);
background.init();
background.play();
document.querySelectorAll('.marquee-wrap').forEach(function(item, i) {
	marqueeArray[i] = marquee(item, {
		type: item.getAttribute('data-marquee').split(' ')[0],
		direction: item.getAttribute('data-marquee').split(' ')[1],
	});
});
marqueeArray[0].play();

/* add event */
window.addEventListener('resize', function() {
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(function() {
		background.resize();
	}, 0.5);
});