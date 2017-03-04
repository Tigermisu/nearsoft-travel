var $$ = Dom7;

var app = new Framework7({
    // Default title for modals
    modalTitle: 'What\'s Next',
});

var mainView = app.addView('.view-main', {
    domCache: true //enable inline pages
});

// login handler
$$('#login').click(function () {
    var username = $$('input[name="username"]').val();
    var password = $$('input[name="password"]').val();
    // Handle username and password
    $$.each(data.users, function (i, v) {
        if (v.email == username && v.password == password) {
            mainView.router.load({pageName: 'about'});
            alert("a");
        }
    });
});

// register user handler
$$('#register').click(function () {

    var lengthusers = 0;

    $$.each(data.users, function (i, v) {
        lengthusers++;
        console.log("a");
    });

    console.log(lengthusers);

    var usernameNew = $$('input[name="username"]').val();
    var passwordNew = $$('input[name="password"]').val();

    data.users[lengthusers] = {email: usernameNew, password: passwordNew};

});

