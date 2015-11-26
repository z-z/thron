$(function(){

	for(var i in types){
		(function(i){
			$type = $('<img src="'+types[i].i+'" id="'+types[i].n+'" alt="" title="'+types[i].d+'" />').click(function(){ 

				$('.pen img').removeClass();
				$(this).addClass('active');

				game.setPen(types[i]);

			});
			$('.pen').append($type);
		})(i);
	}

	game.init(canvas);
});

var game = {
	
	cnv: null,
	ctx: null,
	cxcount: 50,  // horizontal lines count
	cycount: 50,
	cw: 0,
	ch: 0,
	xstep: 0,
	ystep: 0,
	pen: null,
	objects: [],

	pencoord: null, // координаты мышки, отсюда будет идти отрисовка

	mousemove: function(e){

		var cx = e.offsetX-e.offsetX%this.xstep;
		if(e.offsetX%this.xstep > this.xstep/2) cx += this.xstep;

		var cy = e.offsetY-e.offsetY%this.ystep;
		if(e.offsetY%this.ystep > this.ystep/2) cy += this.ystep;


		if(this.pen){
			this.pencoord = [cx, cy];
		}
		this.render();
	},

	click: function(e){
		if(this.pen != null) this.installBuilding(e);
		else this.selectInstalledBuilding(e);
	},

	selectInstalledBuilding: function(e){
		
		//this.cnv.addEventListener('click', this.installBuilding.bind(this));
		// если мы попали кликом в уже установленное здание,
		// то делаем его "мышкой" (this.pen),
		// затем исключаем его из списка установленных зданий (this.objects),
		//
		// начинаем слушать при клике функцию installBuilding
		// перерисовываем поле (this.render())
		//
		//
		// определять, попали ли мы по зданию, будем по координатам клика,
		// сравнивая их с координатами "центра" всех установленных зданий (this.objects)
	},

	installBuilding: function(e){
		// эта функция устанавливает новое здание на поле
		//
		// сначала проверяем, не пересекается ли поле здания с полями других установленных зданий
		// если все хорошо, устанавливаем это здание на поле
		// освобождаем "мышку" (this.pen = null)
		//перерисовываем поле  (this.render())

		var r1 = this.getPenCoords();
		r1.n = this.pen.n;
		r1.i = this.pen.i;

		for(var i in this.objects){

			var r2 = this.objects[i];

			if(this.intersect(r1, r2)) return;
		}

		this.objects.push(r1);
		this.render();
	},


	intersect: function(a, b){
		var ax1 = a.rx,
			ay1 = a.ry,
			ax2 = a.rx+a.w,
			ay2 = a.ry+a.h,

			bx1 = b.rx,
			by1 = b.ry,
			bx2 = b.rx+b.w,
			by2 = b.ry+b.h;

		var i1 = bx1 > ax1 && bx1 < ax2;
		var i2 = bx2 > ax1 && bx2 < ax2;

		var i3 = by1 > ay1 && by1 < ay2;
		var i4 = by2 > ay1 && by2 < ay2;

		var i5 = (bx1 == ax1 || bx1 == ax2) && (i3 || i4);
		var i6 = (bx2 == ax1 || bx2 == ax2) && (i3 || i4);
		var i7 = (by1 == ay1 || by1 == ay2) && (i1 || i2);
		var i8 = (by2 == ay1 || by2 == ay2) && (i1 || i2);

		var i9 = ((bx1 == ax1) && (by1 == ay1));

		var i10 = i5 || i6 || i7 || i8 || i9;

		var resp = (i1 && i3) || (i2 && i4) || (i1 && i4) || (i2 && i3) || i10;

		

		return resp;
	},

	
	init: function(cnv){
		this.cnv = cnv;
		this.ctx = cnv.getContext('2d');
		this.cw = cnv.width;
		this.ch = cnv.height;
		this.xstep = this.cw / this.cxcount;
		this.ystep = this.ch / this.cycount;

		this.cnv.addEventListener('mousemove', this.mousemove.bind(this));
		this.cnv.addEventListener('mouseout', function(){ this.pencoord = null; this.render(); }.bind(this));

		this.cnv.addEventListener('click', this.click.bind(this));		

		this.render();
	},
	
	render: function(){
		// красим фон
		this.ctx.fillStyle = 'green';
		this.ctx.fillRect(0, 0, this.cw, this.ch);

		// рисуем сетку
		this.showGrid();

		this.drawObjects();


		// показываем "мышку"
		if(this.pencoord) this.drawPen();
	},

	drawObjects: function(){
		for(var i in this.objects){
			this.ctx.beginPath();
			var pc = this.objects[i];

			// сначала рисуем радиус
			this.ctx.fillStyle = 'rgba(102, 204, 0, 0.3)';
			this.ctx.strokeStyle = 'rgba(102, 204, 0, 0.7)';
			this.ctx.lineWidth = 3;
			this.ctx.arc(pc.cx, pc.cy, pc.r, 0, 2*Math.PI);
			this.ctx.fill();
			this.ctx.stroke();
			this.ctx.closePath();
		}

		for(var i in this.objects){
			this.ctx.beginPath();
			var pc = this.objects[i];

			// рисуем занимаемый квадрат
			this.ctx.fillStyle = 'rgba(204, 0, 0, 0.5)';
			this.ctx.fillRect(pc.rx, pc.ry, pc.w, pc.h);

			// рисуем картинку
			this.ctx.drawImage(pc.i || this.pen.i, pc.rx, pc.ry, pc.w, pc.h);
			this.ctx.closePath();
		}
	},

	getPenCoords: function(){
		var cx = this.pencoord[0]-this.xstep,
			cy = this.pencoord[1]+this.ystep,
			rx = cx-(this.pen.w-2)*this.xstep,
			ry = cy-2*this.ystep,
			r = this.pen.r*this.xstep,
			w = this.pen.w*this.xstep,
			h = this.pen.h*this.ystep;

		if(rx < 0) cx += Math.abs(rx);
		if(rx+w > this.cw) {
			rx = this.cw-w;
			cx = rx + 2*this.xstep;
		}
		if(ry < 0) cy += Math.abs(ry);
		if(ry+h > this.ch) {
			ry = this.ch-h;
			cy = ry + 2*this.ystep;
		}

		rx = cx-(this.pen.w-2)*this.xstep;
		ry = cy-2*this.ystep;
		

		return {
			cx: cx,
			cy: cy,
			rx: rx,
			ry: ry,
			r: r,
			w: w,
			h: h
		};

	},

	setPen: function(type){

		this.pen = type;

		if(type.i.toString() != '[object HTMLImageElement]') {
			var img = new Image();
			img.src = type.i;
			img.onload = function(){
				this.pen.i = img;
			}.bind(this);
		}

	},

	drawPen: function(){
		this.ctx.beginPath();

		var pc = this.getPenCoords();

		// сначала рисуем радиус
		this.ctx.fillStyle = 'rgba(102, 204, 0, 0.5)';
		this.ctx.arc(pc.cx, pc.cy, pc.r, 0, 2*Math.PI);
		this.ctx.fill();

		// рисуем занимаемый квадрат
		this.ctx.fillStyle = 'rgba(204, 0, 0, 0.5)';
		this.ctx.fillRect(pc.rx, pc.ry, pc.w, pc.h);

		// рисуем картинку
		this.ctx.drawImage(pc.i || this.pen.i, pc.rx, pc.ry, pc.w, pc.h);

		this.ctx.closePath();
	},

	showGrid: function(){
		this.ctx.beginPath();
		this.ctx.strokeStyle = 'rgba(50, 205, 50, 0.5)';
		this.ctx.lineWidth = 1;
		for(var i = this.xstep; i < this.cw; i += this.xstep) {
			this.ctx.moveTo(0, i);
			this.ctx.lineTo(this.cw, i);
		}
		for(i = this.ystep; i < this.ch; i += this.ystep) {
			this.ctx.moveTo(i, 0);
			this.ctx.lineTo(i, this.ch);
		}
		this.ctx.stroke();
		this.ctx.closePath();
	},
};
