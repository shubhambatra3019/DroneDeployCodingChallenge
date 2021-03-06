new DroneDeploy({version: 1}).then(function(dronedeploy){
  console.log('DroneDeploy Api: ', dronedeploy);
});

// initialises the drone deploy api 
// adds an Event Listener to the button element
// the button invokes the pdfListener function
function droneApiReady(){
  return new Promise((resolve) => {
    window.dronedeploy.onload(() => {
       $(.button).addEventListener("click", generatePDFMain);
    });
  });
}

// test to see if the button works
/*function func() {
	$(#text).innerHTML = "Test Button";
}
*/

// returns the currenty view plan using the function getCurrentlyViewed in Plan API.
function getCurrentPlan() {
	return window.dronedeploy.Plans.getCurrentlyViewed();
}

//takes a parameter of plan object which will be currently viewed plan in our case
//returns the tile data using the planId of the currently viewed plan, layerName as ortho and zoom level as 16.
function fetchTileDataFromPlan(plan) {
	return window.dronedeploy.Tiles.get({planId: plan.id, layerName: "ortho", zoom: 16});
}

//takes a parameter of plan object.
//returns annotations that plan has on it using the planId.
function getAnnotationsFromPlan(plan) {
	return window.dronedeploy.Annotations.get(plan.id);
}

//sends the data to server to create a map for PDF
function sendDataToServer(geometry, tileResponse, annotations) {
  //data that is being sent to the server
  var data = {
    tiles: tileResponse.tiles,
    planGeo: geometry,
    zoom_level: 16,
    annotations: annotations
  };

  //sends the data to server using the HTTP POST method.
  //return a response object
  return fetch("https://dronedeploy-pdf-generator.herokuapp.com/", {
      
      method: "POST";
      body: JSON.stringify(data)
  
  });

}

//takes the response object returned by the server as parameter
//returns a blob to make it readable in file reader
function getResponseBlob(response) {
  return response.blob();
}

//reads the data from the blob object using File Reader
//returns the result of binary data
function readBlob(responseBlob) {
  
  return new Promise((resolve) => {

    var fileReader = new FileReader();
    fileReader.onloadend = () => resolve(fileReader);
    fileReader.readAsBinaryString(responseBlob);

  });
} 

//makes an object with the data and positions the map on the PDF canvas and saves the file.
function generatePDFOfMap(plan, reader) {

  response = JSON.parse(reader.result);
  width = response.new_width/10;
  left_margin = (180-width)/2 + 15;
  height = response.new_height/10;

  var document = new jsPDF("p");
  document.text(plan.name, left_margin, 30);
  document.addImage(response.image, "JPEG", left_margin, 40, width, height);
  document.save(plan.name + ".pdf");

}

//calls all the functions that get the data, send it to server and use the response to convert it into a pdf.
function generatePDFMain() {

  getCurrentPlan()
    .then(plan => fetchTileDataFromPlan(plan)
    .then(tileResponse => getAnnotationsFromPlan(plan)
    .then(annotations => sendDataToServer(plan.geometry, tileResponse, annotations)
    .then(response => getResponseBlob(response)
    .then(responseBlob => readBlob(responseBlob)
    .then(fileReader => generatePDFOfMap(plan, fileReader)
  ))))))

}

droneApiReady();
