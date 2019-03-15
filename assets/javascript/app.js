
let config = {
    apiKey: "AIzaSyCzF8B7srKksB1Ecw5xuZgPwOI7g7HjSTk",
    authDomain: "rps-multiplayer-81ea3.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-81ea3.firebaseio.com",
    projectId: "rps-multiplayer-81ea3",
    storageBucket: "rps-multiplayer-81ea3.appspot.com",
    messagingSenderId: "960901587755"
};
firebase.initializeApp(config);

let database = firebase.database();

let playerNumber = 0; // limits the number of players to 2

let player = {
    name: "",
    choice: "", // this will be the play user decides to make
    win: 0, 
    loss: 0,
    tie: 0,
    message: "" // this will be the most recent message player enters in and send to the chatBox
};

// this is where the other players info will be stored
let opponent = {
    name: "",
    choice: "", // this will be the play other player decides to make
    win: 0, 
    loss: 0,
    tie: 0,
    message: "" // this will be the most recent message other player enters in and send to the chatBox
}

// when page loads, automatically create a new user for Firebaseu
// when two players have entered in the website prevent further creation of other users
$(document).ready(function() {
    if (playerNumber !== 2) {
        console.log("page loads assign first user");
        // assign the user to be a anonymous user on page load
        firebase.auth().signInAnonymously().catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
        });

        // add players onto firebase to track how many players present and keep track of wins and losses of each player
        // only allow two players to be members and participate in game
        firebase.auth().onAuthStateChanged(function(user) {
            // console.log(user);
            if (user) {
                uid = user.uid;
                console.log(uid);
                playerNumber++;
                console.log(playerNumber);
                player.name = "player_"+ (playerNumber);
                database.ref(uid).set({
                    name: "player_"+ (playerNumber),
                    choice: "",
                    win: 0, 
                    loss: 0,
                    tie: 0,
                    message: "" 
                });
            // ...
            }
        });
    } else {
        console.log("Sorry room is full, please wait patiently");
    }

    // comparing player choices when both players have chose whaat they want to play
    $(".choice").on("click", function(event) {
        
        // update player choice when they click the button
        player.choice = this.id;
        console.log(player.choice);
        // checks if both players have chosen
        let choice = player.choice;
        console.log(choice);

        if (opponent.choice !== "" && player.choice !== "") {
            if (choice === "rock") {
                if (opponent.choice === "rock") {
                    player.tie++;
                } else if (opponent.choice === "paper") {
                    player.loss++;
                } else if (opponent.choice === "scissors") {
                    player.win++;
                }
            } else if (choice === "paper") {
                if (opponent.choice === "rock") {
                    player.win++;
                } else if (opponent.choice === "paper") {
                    player.tie++;
                } else if (opponent.choice === "scissors") {
                    player.loss++;
                }
            } else if (choice === "scissors") {
                if (opponent.choice === "rock") {
                    player.loss++;
                } else if (opponent.choice === "paper") {
                    player.win++;
                } else if (opponent.choice === "scissors") {
                    player.tie++;
                }
            }
        }

        // reset both player choices back to ""

    });
});






// when there is change in database
database.ref().on("value", function() {
    // pull each players data and update the player and opponent object
});

// removes the player from game and remove the user data from database
// allows the game to have other people join
$("#sign-out").on("click", function() {
    // decrease player number since max is 2
    playerNumber--;
    let user = firebase.auth().currentUser;
    // console.log(firebase.auth().currentUser);
    // delete the current anonymous user
    user.delete().then(function() {
        // User deleted.
        console.log("user deleted");
        $("#chatBox").val("");
    }).catch(function(error) {
    // An error happened.
    });

    // clear user's info using user id in database
});

// allows the players to interact with each other by message
$("#chatSubmit").on("click", function() {
    console.log("in chat submit", $("#chatInput").val());
    // grabs the message from chatInput text area and set that as message of the current user
    player.message = $("#chatInput").val();
    // update the most recent message to firebase database
    database.ref(uid+"/message").set(player.message);
    // show the message to the other player in chatBox
    $("#chatBox").append("<p>"+player.name+": "+player.message+"</p>");
    
    // clear the input screen of the current user
    $("#chatInput").val("");
});




// when there are two players present, prevent other users to enter the game

// player 1 chooses what to play

// player 2 chooses what to play

// compares what players chose and log the choices and display result in #log

// chatBox function