const canvas = document.querySelector('#stage');
const canvasWrap = canvas.parentNode || canvas;
const context = canvas.getContext('2d');
const cursor = document.querySelector('.cursor-wrap .cursor');

const marqueeArray = [];

let resizeTimer;

const secInfo = [
	// sec-1
	{start: '0', end: () => '+=9999', pin: true, pinSpacing: false, scrub: 0.3, timeline: null, num: 0},
	// sec-2
	{start: '0', end: '100%', pin: true, pinSpacing: true, scrub: 0.3, timeline: null, num: 0},
	// sec-3
	{start: '0', end: '100%', pin: false, pinSpacing: false, scrub: 0.3, timeline: null, num: 0},
	// sec-4
	{start: '0', end: '100%', pin: false, pinSpacing: false, scrub: 0.3, timeline: null, num: 0},
	// sec-5
	{start: '0', end: '100%', pin: false, pinSpacing: false, scrub: 0.3, timeline: null, num: 0},
	// sec-6
	{start: '0', end: '100%', pin: false, pinSpacing: false, scrub: 0.3, timeline: null, num: 0},
];

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
document.querySelectorAll('.marquee-wrap').forEach(function(item, i) {
	marqueeArray[i] = marquee(item, {
		type: item.getAttribute('data-marquee').split(' ')[0],
		direction: item.getAttribute('data-marquee').split(' ')[1],
	});
});

/* gsap */
gsap.utils.toArray('.sec').forEach((item, i) => {
	secInfo[i].timeline = gsap.timeline({
		scrollTrigger: {
			trigger: item,
			start: secInfo[i].start,
			end: secInfo[i].end,
			pin: secInfo[i].pin,
			pinSpacing: secInfo[i].pinSpacing,
			scrub: secInfo[i].scrub,
			//markers: true,
			onEnter: () => secInfo[i].num ? null : setAnimation(i),
			onEnterBack: () => secInfo[i].num ? null : setAnimation(i),
			onUpdate : !secInfo[i].num ? null : ({progress, direction, vars, isActive}) => {
				if (ex !== Math.trunc(progress * 3)) {
					ex = Math.trunc(progress * 3);
					ex === secInfo[i].num ? null : setAnimation(i, ex);
				}
			}
		}
	});
});

secInfo[1].timeline.to('.sec-1 .rect', {duration: 1, scale: 3});
secInfo[1].timeline.to('.sec-2 .rect', {duration: 1, scale: 1.5}, '<');
secInfo[1].timeline.to('.sec-1 .title', {duration: 1, scale: 2.5}, '<');
secInfo[1].timeline.to('.sec-2 .text.b', {duration: 1, scale: 1.5}, '<');
secInfo[1].timeline.to('.sec-2 .text.a, .sec-2 .text.c, .sec-2 .deco', {duration: 0.1, opacity: 0}, '<');
secInfo[1].timeline.to('.sec-2 .rect', {duration: 1, yPercent: -65});
secInfo[1].timeline.to('.sec-1 .title g', {duration: 1, fill: '#c9e6f5'}, '<+0.3');

secInfo[2].timeline.fromTo('.sec-3 .tit-cate, .tit-text', {yPercent: 15}, {yPercent: -15});
secInfo[2].timeline.fromTo('.sec-3 .about-item', {yPercent: 15}, {yPercent: -15}, '<');

secInfo[3].timeline.fromTo('.tag-wrap div', {yPercent: 15}, {yPercent: -15});

gsap.from('.header', { 
	paused: true,
	duration: 0.5,
	yPercent: -100,
	scrollTrigger: {
		start: () => document.querySelector('.sec-3').offsetTop,
		end: () => document.body.offsetHeight,
		onUpdate: (self) => {
			self.direction === -1 ? self.animation.play() : self.animation.reverse();
		}
	}
}).progress(1);

/* add event */
window.addEventListener('mousemove', drawCursor);
window.addEventListener('resize', function() {
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(function() {
		background.resize();
	}, 0.5);
});
document.querySelector('.about-wrap .btn-about').addEventListener('click', cardOpen);
document.querySelector('.about-wrap .btn-close').addEventListener('click', cardClose);
document.querySelector('.top-wrap .btn-top').addEventListener('mouseenter', () => marqueeArray[2].play());
document.querySelector('.top-wrap .btn-top').addEventListener('mouseleave', () => marqueeArray[2].pause().progress(0));

document.querySelectorAll('.btn-wrap').forEach((item) => {
	const btn = item.querySelector('.btn');

	item.addEventListener('mouseenter', () => {
		btn.classList.add('active');
		gsap.to(cursor, {duration: 0.3, scale: 0});
		gsap.to(btn, {duration: 0.6, opacity: 1});
	});
	item.addEventListener('mousemove', (e) => {
		const offsetTop = item.getBoundingClientRect().top;
		gsap.to(btn, {duration: 0.3, x: e.clientX - btn.offsetLeft - item.offsetLeft, y: e.clientY - btn.offsetTop - offsetTop});
	});
	item.addEventListener('mouseleave', () => {
		btn.classList.remove('active');
		gsap.to(btn, {duration: 0.6, x: 0, y: 0, opacity: item.classList.contains('fade-out') ? 0 : 1});
		gsap.to(cursor, {duration: 0.3, scale: 1});
	});
});

/* function */
function setAnimation(i, a = 0) {
	switch (i) {
		case 0:
			break;
		case 1:
			background.play();
			marqueeArray[0].play();
			break;
		case 2:
			background.pause();
			marqueeArray[0].pause();
			marqueeArray[1].pause();
			break;
		case 3:
			marqueeArray[1].play();
			break;
		case 4:
			marqueeArray[1].pause();
			break;
		case 5:
			break;
		case 6:
			break;
	}
}

function drawCursor(e) {
	gsap.to(cursor, {duration: 0.3, x: (i, t) => e.clientX + t.offsetWidth / 2, y: (i, t) => e.clientY + t.offsetHeight / 2});
}

function cardOpen() {
	//gsap.to('.about-item', {duration: 0.6, rotateY: 180, xPercent: 100});
	document.querySelector('.sec-3 .about-wrap').classList.add('active');
	gsap.set('.btn-about', {opacity: 0, pointerEvents: 'none'});
}

function cardClose() {
	//gsap.to('.about-item', {duration: 0.6, rotateY: 0, xPercent: 0});
	document.querySelector('.sec-3 .about-wrap').classList.remove('active');
	gsap.set('.btn-about', {opacity: 1, pointerEvents: 'auto'});
}
