// Initialize Firebase
var config = {
    apiKey: "AIzaSyBQ3XSp6xllAtJpABRyAU1TQntVygJDv60",
    authDomain: "kimchikimchi-bootcamp-db1.firebaseapp.com",
    databaseURL: "https://kimchikimchi-bootcamp-db1.firebaseio.com",
    projectId: "kimchikimchi-bootcamp-db1",
    storageBucket: "kimchikimchi-bootcamp-db1.appspot.com",
    messagingSenderId: "930567075309"
};

firebase.initializeApp(config);
var database = firebase.database();

$("#addSchedule").on("click", function(event) {
    event.preventDefault();

    // Grabbed values from text boxes
    var trainName = $("#inputTrainName").val().trim();
    var destination = $("#inputDestination").val().trim();
    // Converting to epoch to ease calculation later on
    var firstTrainTime = moment( $("#inputFirstTrainTime").val().trim(), 'HH:mm' ).format("x");
        firstTrainTime = parseInt(firstTrainTime);
    var frequency = $("#inputFrequency").val().trim();
        frequency = parseInt(frequency);

    var trainSchedule = {
        trainName : trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,  // Stored in epoch
        frequency: frequency,            // Stored in mins
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    };

    console.log(trainSchedule);
    // Code for handling the push
    database.ref("trainSchedule").push(trainSchedule);
});


function getNextArrival(object) {
    var now = parseInt(moment().format("x"));
    var nextArrival = parseInt(object.firstTrainTime);

    while (now > nextArrival) {
        // Increment by how often the train runs.
        // Note nextArrival is in Epoch and frequency in mins.
        nextArrival += (object.frequency * 60 * 1000);
    }

    console.log(`Next Arrival Time in Epoch is ${nextArrival}`);
    return nextArrival;
    //return moment(nextArrival, 'x').format("h:mm A")
}

function getMinsAway(nextTime) {
    var minsAway = moment().to(moment(nextTime, 'x'), true);

    return minsAway;
}

database.ref("trainSchedule").orderByChild("firstTrainTime").on("child_added", function(childSnapshot) {
    var trainSchedule = childSnapshot.val();

    // Log everything that's coming out of snapshot
    console.log("=================================");
    console.log(trainSchedule);

    var nextArrival = getNextArrival(trainSchedule);

    var row = $("<tr>").append(
       $("<td>").text(trainSchedule.trainName),
       $("<td>").text(trainSchedule.destination),
       $("<td>").text(trainSchedule.frequency),
       $("<td>").text( moment(nextArrival, 'x').format("h:mm A") ),
       $("<td>").text(getMinsAway(nextArrival))
    );

    $("#trainSchedules").append(row);
  // Handle the errors
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});
