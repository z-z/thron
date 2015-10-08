window.onload = function () {
	game.init(canvas);
};

var game = {
	
	
	ctx: null,
	cxcount: 50,  // horizontal lines count
	cycount: 50,
	cw: 0,
	ch: 0,
	xstep: 0,
	ystep: 0,
	
	
	init: function(cnv){
		this.ctx = cnv.getContext('2d');
		this.cw = cnv.width;
		this.ch = cnv.height;
		this.xstep = this.cw / this.cxcount;
		this.ystep = this.ch / this.cycount;
		this.render();
	},
	
	render: function(){
		this.ctx.fillStyle = 'green';
		this.ctx.fillRect(0, 0, this.cw, this.ch);
		this.showGrid();
	},

	showGrid: function(){
		this.ctx.beginPath();
		this.ctx.strokeStyle = '#32cd32';
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
