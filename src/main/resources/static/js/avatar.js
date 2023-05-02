var canvas = document.getElementById('avatar');
var c = canvas.getContext('2d');

canvas.width = 150;
canvas.height = 150;

//create empty array
var images = [];
images.length = 51;

//push the images into array

for(var i = 0 ; i < images.length ; i++){
    images[i] = new Image();
    images[i].src = '/js/'+i.toString() + '.png';
}
var i = 0;
var t = false;

/*var s = setInterval(function(){
	if (t)
	i--;
	else i++;
	if (i == 0) {
        t=false;
    }
    if (i == 50){
        t=true;
        clearInterval(s);
    }
    c.drawImage(images[i],0,0,150,150);
},70)*/


function draw(speak) {
	var id = setInterval(function(){
	if (speak) {
		if (t)
		i--;
		else i++;
		if (i == 0) {
        	t=false;
    	}
   		if (i == 50){
     	   t=true;
   		}
   		c.drawImage(images[i],0,0,150,150);
   	}
   	else clearInterval(id);
   	
   
	},70)
}

 export {c, images};