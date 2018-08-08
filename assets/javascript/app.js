var config = {
    apiKey: "AIzaSyCqWn-EljD7PrCHV9NixxfJa6sp4mKyarI",
    authDomain: "trainstation-c6753.firebaseapp.com",
    databaseURL: "https://trainstation-c6753.firebaseio.com",
    projectId: "trainstation-c6753",
    storageBucket: "",
    messagingSenderId: "31964914163"
};
firebase.initializeApp(config);

var database = firebase.database();

var trainName;
var destination;
var firstTrain;
var frequency;
var newTableRow;
var nextArrival;
var minutesAway;

$("#submit").on("click", function (event) {

    event.preventDefault();

    trainName = $("#trainName").val().trim();
    destination = $("#destination").val().trim();
    firstTrain = $("#trainTime").val().trim();
    frequency = $("#frequency").val().trim();

    //push info to server
    database.ref().push({
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency

    });

});


database.ref().on("child_added", function(childSnapshot) {
      
    var firstTimeConverted = moment(childSnapshot.val().firstTrain, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    var tRemainder = diffTime % childSnapshot.val().frequency;
    console.log(tRemainder);
    
    var tMinutesTillTrain = childSnapshot.val().frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
  
    // full list of items to the well
      newTableRow = $("#trainInfo").append("<tr>");
      newTableRow.append("<td>" + childSnapshot.val().name + "</td>");
      newTableRow.append("<td>" + childSnapshot.val().destination + "</td>");
      newTableRow.append("<td>" + childSnapshot.val().frequency + "</td>");
      newTableRow.append("<td>" + (moment(nextTrain).format("hh:mm")) + "</td>");
      newTableRow.append("<td>" + tMinutesTillTrain + "</td>");
  
  });

  