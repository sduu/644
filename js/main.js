(() => {
	/* init */
	initCanvas();

	/* function */
	function initCanvas() {
		const canvas = document.querySelector('#stage');
		const canvasWrap = canvas.parentNode || canvas;
		const context = canvas.getContext('2d');

		canvas.width = canvasWrap.offsetWidth;
		canvas.height = canvasWrap.offsetHeight;

		canvas.offCanvas = document.createElement('canvas');
		canvas.offContext = canvas.offCanvas.getContext('2d');
		canvas.offCanvas.width = 512;
		canvas.offCanvas.height = 512;

		const rows = 6;
		const cakeArray = [];

		let resizeTimer;
		let cakeWidth = Math.min(canvas.width / 10, 150);

		class Cake {
			constructor(x, y, rows) {
				this.rows = rows;
				this.x = x;
				this.y = canvas.height / 4 * y;
				this.draw();
			}

			draw() {
				if (this.y < -cakeWidth) {
					this.y = canvas.height / 4 * rows - cakeWidth;
				}
				if (this.rows === 'odd') {
					context.drawImage(canvas.offCanvas, canvas.width / 5 * this.x + (canvas.width / 10 - cakeWidth / 2), this.y, cakeWidth, cakeWidth);
				} else {
					context.drawImage(canvas.offCanvas, canvas.width / 5 * this.x + canvas.width / 5 + (canvas.width / 10 - cakeWidth / 2), this.y, cakeWidth, cakeWidth);
				}
			}
		}

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
						cakeArray.push(new Cake(x, y, 'odd'));
					}
				} else {
					for (let j = 0; j < 2; j++) {
						x = j * 2;
						y = (i - 1);
						cakeArray.push(new Cake(x, y, 'even'));
					}
				}
			}
			update();
		});

		window.addEventListener('resize', function() {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(function() {
				resize();
			}, 0.5);
		});

		function drawBoard(){
			for (var x = 0; x <= canvas.width; x += canvas.width / 5) {
				context.moveTo(0.5 + x, 0);
				context.lineTo(0.5 + x, canvas.height);
			}
			for (var x = 0; x <= canvas.height; x += canvas.height / 4) {
				context.moveTo(0, 0.5 + x);
				context.lineTo(canvas.width, 0.5 + x);
			}
			context.strokeStyle = "black";
			context.stroke();
		}

		function update() {
			context.clearRect(0, 0, canvas.width, canvas.height);
			drawBoard();
			let cake;
			for (let i = 0; i < cakeArray.length; i++) {
				cake = cakeArray[i];
				cake.y -= 0.5;
				cake.draw();
			}

			requestAnimationFrame(update);
		}

		function resize() {
			canvas.width = canvasWrap.offsetWidth;
			canvas.height = canvasWrap.offsetHeight;
			cakeWidth = Math.min(canvas.width / 10, 150);
		}
	}
})();