//This data could come from a CMS/editor/any nicer UI for editing game events
var scenarios = [
   {
      //No Treatment Options Chosen
      "required": [],
      "bypass": ["OneTreatment"],
      "text": "Choose the Correct Order of Treatment Options!"
   },
   {
      //Just one treatment option: the gauze
      "required": ["Gauze"],
      "bypass": ["TwoTreatments"],
      "text": "Ahh yes, the gauze!"
   },
   {
      //Any one Treatment that is not gauze
      "required": ["OneTreatment"],
      "bypass": ["TwoTreatments"],
      "text": "Are you sure this is a good start?",
   },
   {
      //Any two but no gauze
      "required": ["TwoTreatments"],
      "bypass": ["Gauze", "ThreeTreatments"],
      "text": "We need gauze first!",
   },
   {
      //First choice is gauze, then elevation.
      "required": ["Gauze", "Elevate"],
      "bypass": ["ThreeTreatments"],
      "text": "So glad we have the gauze and you've elevated.",
   },
  {
      //First choice is gauze, then elevation, then alcohol
      "required": ["Gauze", "Elevate", "Alcohol"],
      "bypass": ["FourTreatments"],
      "text": "Time to disinfect and clean.",
   },
   {
      //All four!
      "required": ["FourTreatments"],
      "bypass": [],
      "text": "All treatments chosen!",
   },  
]

var computedStoryPoints = {
   "requires": [ "Gauze", "Elevate", "Alcohol", "Bandaid" ],
   "quantities": [
      [1, "OneTreatment"],
      [2, "TwoTreatments"],
      [3, "ThreeTreatments"],
      [4, "FourTreatments"]
   ]
}

//Functionality for click binding to add/remove story points
var treats = document.querySelectorAll(".treatmentOptions");
treats.forEach(treatmentOptions => {
   treatmentOptions.addEventListener("click", () => {
      treatmentOptions.classList.toggle("rescued");
      toggleStoryPoint( treatmentOptions.getAttribute("story-point") )
      refreshScenario();
   })
});


//---------------------- Story Points ---------------------------

//Story point state mechanism
var storyPoints = {};

function toggleStoryPoint(incomingStoryPoint) {
   //Remove if we had it
   if (storyPoints[incomingStoryPoint]) {
      delete storyPoints[incomingStoryPoint]
   } else {
      //Otherwise, add it
      storyPoints[incomingStoryPoint] = true;
   }
}

function getAllKnownStoryPoints() { 
   
   //Figure out the computed story points we also own
   var acquiredCount = computedStoryPoints.requires.filter(sp => {
      return storyPoints[sp]
   }).length; //EX: 3
   
   var computed = {};
   computedStoryPoints.quantities.forEach(q => {
      if (acquiredCount >= q[0]) {
         computed[q[1]] = true;
      }
   })
   
   //Combine with all known story points
   return {
      ...storyPoints,
      ...computed
   }
}

//Update the view
function refreshScenario() {
   var known = getAllKnownStoryPoints();
   var scenario = scenarios.find(s => {
   
      //Validate that we don't have any bypassers
      for (var i=0; i<=s.bypass.length; i++) {
         if ( known[s.bypass[i]] ) {
            return false;
         }
      }
      
      //Validate that we have all of them
      return s.required.every(entry => known[entry])
   })
   
   document.querySelector(".js-text").textContent = scenario.text;
}