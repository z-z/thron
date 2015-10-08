window.onload = function () {
	game.init(canvas);
};

var game = {
	
	
	ctx: null,
	cs: 10,
	cxcount: 50,
	cycount: 50,
	cw: 0,
	ch: 0,
	
	
	init: function(cnv){
		this.ctx = cnv.getContext('2d');
		this.cw = cnv.width;
		this.ch = cnv.height;
		this.render();
	},
	
	render: function(){
		this.ctx.beginPath();
		this.ctx.fillStyle = 'green';
		this.ctx.fillRect(0, 0, this.cw, this.ch);
		this.ctx.fillStyle = 'red';
		this.ctx.arc(100, 100, 10, 0, 2*Math.PI);
		this.ctx.fill();
		this.ctx.closePath();
	},
};
