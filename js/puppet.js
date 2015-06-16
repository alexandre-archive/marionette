(function ($) {
	
	var marionetteDrawer;

	$.fn.start = function () {
 
		console.log('start');
		
		marionetteDrawer = new MarionetteDrawer();
		marionetteDrawer.init(this.context.getElementById('container'));
		marionetteDrawer.animate();

	}


	$.fn.addObject = function(id){
		marionetteDrawer.addCube(id);
		console.log('addObject: ' + id);
	}

	$.fn.moveObject = function(id, x, y, z){
		console.log('moveObject: ' + id + ' ' + x +','+ y + ',' +z );
		marionetteDrawer.moveObject(id, x, y, z);
	}


	$.fn.rotateObject = function(id, angle){
		console.log('rotateObject: ' + id + ' '+ angle);
		marionetteDrawer.rotateObject(id, angle);
	}



}(jQuery));	