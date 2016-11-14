function register(email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        $(".error").text(errorMessage);
        $(".error").css("visibility", "visible");
    });
}

function logIn(email, password) {
    var user = firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        $(".error").text(errorMessage);
        $(".error").css("visibility", "visible");

    });
    if (firebase.auth().currentUser) {
        window.location = "tasklist.html";
    } else {

    }
}

function toggleVisibility() {
    if ($("#addTaskDialog").css("visibility") == "hidden")
        $("#addTaskDialog").css("visibility", "visible");
    else
        $("#addTaskDialog").css("visibility", "hidden");
};

function getUser() {
    user = firebase.auth().currentUser;
    if (user) {
        clearInterval(intervalID);
        getTaskList();
    } else {
        console.log("waiting for login...");
    }
}

var intervalID = setInterval(getUser, 1000);

function getTaskList() {
    db.on('value', snap => {
        var cList = $('#taskList')
        cList.children().remove();
        $.each(snap.val().tasks, function(i) {
            var li = $('<li/>')
                .addClass('list__item list__item--material')
                .appendTo(cList);



            var divListMain = $('<div/>')
                .addClass('list__item__center list__item--material__center')
                .appendTo(li);
            var divListTitle = $('<div/>')
                .addClass('list__item__title list__item--material__title')
                .text(snap.val().tasks[i].name)
                .appendTo(divListMain);
            var divListDesc = $('<div/>')
                .addClass('list__item__subtitle list__item--material__subtitle')
                .text(snap.val().tasks[i].description)
                .appendTo(divListMain);

            var divRating = $('<div/>')
                .addClass('list__item__right list__item--material__right')
                .appendTo(li);

            var spanRating = $('<span/>')
                .css("font-size", "10pt")
                .css("padding", "0pt 5pt")
                .text(snap.val().tasks[i].likes - snap.val().tasks[i].dislikes)
                .appendTo(divRating);

            var img = $('<img/>')
                .attr("src", "img/like.png")
                .appendTo(divRating);


        });
    });
}

function addTaskOnClick() {
    writeNewTask($('#newTaskName').val(), $('#newTaskDesc').val());
    toggleVisibility();
    $('#newTaskName').val('');
    $('#newTaskDesc').val('');
}

function writeNewTask(name, desc) {
    // A post entry.
    var postData = {
        name: name,
        description: desc,
        likes: 0,
        dislikes: 0
    };

    var newTaskKey = firebase.database().ref().child('tasks').push().key;
    var updates = {};
    updates['/tasks/' + newTaskKey] = postData;
    return firebase.database().ref().update(updates);
}
