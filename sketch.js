var drawing = [];

var database;

var currentPath = [];

var isDrawing = false;

function setup(){

 canvas = createCanvas(500, 500);
 canvas.mousePressed(startPath);
 canvas.parent('canvascontainer');
 canvas.mouseReleased(endPath);
 var saveButton = select('#saveButton');
 saveButton.mousePressed(saveDrawing);
 var clearButton = select('#clearButton');
 clearButton.mousePressed(clearDrawing);
 database = firebase.database();

  var parameters = getURLParams();
  console.log(parameters);

  if (parameters.id) {
    console.log(parameters.id);
    showDrawing(parameters.id);
  }

  var ref = database.ref('drawings');
  ref.on('value', gotData, errData);

}

function startPath(){
	isDrawing = true;
	currentPath = [];
    drawing.push(currentPath);
}

function endPath(){
 isDrawing = false;
}

function draw(){
 background(20);
	 if(isDrawing){

	var pointer = {
		x: mouseX,
		y: mouseY
	}
  currentPath.push(pointer);

 }
  stroke(255);
  strokeWeight(8);
  noFill();
  for (var i = 0; i < drawing.length; i++) {
    var path = drawing[i];
    beginShape();
    for (var j = 0; j < path.length; j++) {
      vertex(path[j].x, path[j].y);
    }
    endShape();
  }
 
  }

  function saveDrawing(){
  	var ref = database.ref('drawings');
  	var data = {
  		name: "Anay",
  		drawing: drawing
  	}
  	var result = ref.push(data, dataSent);
  	console.log(result.key) 
    
   function dataSent(status){
   	console.log(status)
   }
  }

  function gotData(data){

    // clearing the drawing
  var elements = selectAll('.listing');
  for (var i = 0; i < elements.length; i++) {
    elements[i].remove();
  }


  	var drawings = data.val();
  	var keys = Object.keys(drawings);
  	for (var i = 0; i < keys.length; i++) {
  		var key = keys[i]
  		//console.log(key)
    	var li = createElement('li', '');
    	li.class('listing');
    	var ahref = createA('#', key);
    	ahref.mousePressed(showDrawing);
    	ahref.parent(li);

        var perma = createA('?id='+ key, 'permalink');
         perma.parent(li);
         perma.style('padding','4px')

        li.parent('drawinglist');
  	}
  }

  function errData(err){
  	console.log(err)
  }

  function showDrawing(key){
  if (key instanceof MouseEvent) {
    key = this.html();
  }
  	
  	//console.log(this.html())
  	var ref = database.ref('drawings/' + key);
  	ref.once("value", oneDrawing, errData);

  	function oneDrawing(data){
  		var DBdrawing = data.val();
  		console.log(DBdrawing);
  		drawing = DBdrawing.drawing
  	}
  }

  function clearDrawing(){
  	drawing = [];
  }