var $$ = Dom7;

var app = new Framework7({
    // Default title for modals
    modalTitle: 'What\'s Next',
});   

var mainView = app.addView('.view-main', {
    domCache: true //enable inline pages
});

// login handler
$$('.list-button').click(function() {
    var username = $$('input[name="username"]').val();
        var password = $$('input[name="password"]').val();
        // Handle username and password
    $$.each(data.users, function(i, v) {
        if ( v.email == username && v.password == password)  {
            mainView.router.load({pageName: 'about'});
            alert("a");
        }
    });
});


