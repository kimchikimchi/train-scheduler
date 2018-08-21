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
    var frequency = $("#inputFrequency").val().trim();

    var trainSchedule = {
        trainName : trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    };

    console.log(trainSchedule);
    // Code for handling the push
    database.ref("trainSchedule").push(trainSchedule);
});


database.ref("trainSchedule").on("child_added", function(childSnapshot) {
    var trainSchedule = childSnapshot.val();

    // Log everything that's coming out of snapshot
    console.log("=================================");
    console.log(trainSchedule);

    var row = $("<tr>").append(
       $("<td>").text(trainSchedule.trainName),
       $("<td>").text(trainSchedule.destination),
       $("<td>").text(trainSchedule.frequency),
       $("<td>").text("TBD"),
       $("<td>").text("TBD")
    );

    $("#trainSchedules").append(row);
  // Handle the errors
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});
