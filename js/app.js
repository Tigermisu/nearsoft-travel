var $$ = Dom7;
var eventQueue = null;
var icons = {
    "Concerts": "img/concert.png",
    "Movies": "img/movie.png",
    "Parties": "img/party.png",
    "Places": "img/places.png",
    "Entertainment": "img/theatre.png"
}
var savedEvents = [];

var app = new Framework7({
    // Default title for modals
    modalTitle: 'What\'s Next',
});

var mainView = app.addView('.view-main', {
    domCache: true //enable inline pages
});

jQuery.event.special.swipe.settings.threshold = 0.2;

$('.event-photo').on('swipeleft', function () {
    swipeEvent("left");
});

$('.event-photo').on('swiperight', function () {
    swipeEvent("right")
});

$('.icon.btn img').click(function(){
    var lat = $(this).data('lat'),
        lng = $(this).data('lng');
    window.open("https://www.google.com/maps?q=loc:" + lat +"," + lng);
});

app.onPageInit('swiper', function (page) {
    prepareNextEvent();
});

function swipeEvent(direction) {
    if(direction == "right") {
        var activeEventHash = ($('.event-data h2').text() + $('.event-data p').eq(0).text()).hashCode();
        savedEvents.push(getEventID(activeEventHash));
    }
    $('.event-photo').addClass(direction);
    setTimeout(function () {
        prepareNextEvent();

    }, 305); // transition takes 300ms, but css and js are not perfectly in sync
}

function prepareNextEvent() {
    if (eventQueue == null) {
        var array = $.map(data.features, function (v, i) {
            return [v];
        });
        eventQueue = shuffle(array);
    }
    var nextEvent = eventQueue.pop();
    if (typeof (nextEvent) != "undefined") {
        var photo = nextEvent.photo,
            $data = $('.event-data');
        $data.find('h2').text(nextEvent.name);
        $data.find('p').eq(0).text(nextEvent.description);
        $data.find('p').eq(1).text(nextEvent.hour + " @ " + nextEvent.address);
        $data.find('.icon.category img').attr('src', icons[nextEvent.category]);
        //https://www.google.com/maps?q=loc:36.26577,-92.54324
        $data.find('.icon.btn img').data('lat', nextEvent.location.lat).data('lng', nextEvent.location.lng);
        $('.event-photo').css('background-image', 'url(' + photo + ')');
        $('.event-photo').removeClass('left').removeClass('right');
        if (eventQueue.length - 1 >= 0) {
            var nextPhoto = eventQueue[eventQueue.length - 1].photo;
            $('.event-transition').css('background-image', 'url(' + nextPhoto + ')');
        } else {
            $('.event-transition').css('background-color', '#333').css('background-image', '')
                .html('<h4>No hay más eventos que mostrar :(</h4>');
        }
    } else {
        $('.event-data').html('');
    }

}

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
    return a;
}

String.prototype.hashCode = function(){
    var hash = 0;
    if (this.length == 0) return hash;
    for (var i = 0; i < this.length; i++) {
        var character = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+character;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

function getEventID(activeEventHash) {
    for (var property in data.features) {
        if (data.features.hasOwnProperty(property)) {
            var hash = (data.features[property].name + data.features[property].description).hashCode();
            if(hash == activeEventHash) return property;
        }
    }
    return null;
}

// login handler
$$('#login').click(function () {
    var username = $$('input[name="username"]').val();
    var password = $$('input[name="password"]').val();
    // Handle username and password
    $$.each(data.users, function (i, v) {
        if (v.email == username && v.password == password) {
            mainView.router.load({pageName: 'swiper'});
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

