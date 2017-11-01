new DroneDeploy({version: 1}).then(function(dronedeploy){
  console.log('DroneDeploy Api: ', dronedeploy);
});

// initialises the drone deploy api 
// adds an Event Listener to the button element
// the button invokes the pdfListener function
function droneApiReady(){
  return new Promise((resolve) => {
    window.dronedeploy.onload(() => {
       $(.button).addEventListener("click", func);
    });
  });
}

// test to see if the button works
function func() {
	$(#text).innerHTML = "Test Button";
}

// returns the currenty view plan using the function getCurrentlyViewed in Plan API.
function getCurrentPlan() {
	return window.dronedeploy.Plans.getCurrentlyViewed();
}

//takes a parameter of plan object which will be currently viewed plan in our case
//returns the tile data using the planId of the currently viewed plan, layerName as ortho and zoom level as 16.
function fetchTileDataFromPlan(plan) {
	return window.dronedeploy.Tiles.get({planId: plan.id, layerName: "ortho", zoom: 16})
}

//takes a parameter of plan object.
//returns annotations that plan has on it using the planId.
function getAnnotationsFromPlan(plan) {
	return window.dronedeploy.Annotations.get(plan.id);
}

