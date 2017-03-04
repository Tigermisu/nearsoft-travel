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
var categoryDenyCount = {
    "Concerts": 0,
    "Movies": 0,
    "Parties": 0,
    "Places": 0,
    "Entertainment": 0
}

var app = new Framework7({
    // Default title for modals
    modalTitle: 'What\'s Next',
    swipeBackPage: false,
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

$('.icon.btn img').click(function () {
    var lat = $(this).data('lat'),
        lng = $(this).data('lng');
    window.open("https://www.google.com/maps?q=loc:" + lat + "," + lng);
});

$('ul > .panel-close').click(function(){
    app.closePanel();
});

app.onPageInit('swiper', function (page) {
    prepareNextEvent();
});

app.onPageInit('myevents', function (page) {
    populateMyEvents();
});

app.onPageReinit('myevents', function(page) {
    populateMyEvents();
});

function populateMyEvents() {
    var $wrapper = $('#eventsContent');
    $wrapper.html('');
    if(savedEvents.length > 0) {
        for(var i = 0; i < savedEvents.length; i++) {
            var html = "<li>",
                event = data.features[savedEvents[i]];
            html += "<a href='https://www.google.com/maps?q=loc:" + event.location.lat + "," + event.location.lng + "' class='item-link item-content external'>"
            html +=  '<div class="item-media"><div class="event-list-photo" style="background-image: url(' + event.photo + ')"></div></div>'
            html += '<div class="item-inner">';
            html += '<div class="item-title-row">';
            html += '<div class="item-title">' + event.name + ' </div>';
            html += '<div class="item-after">'  + event.category +  '</div>';
            html += "</div>";
            html += '<div class="item-subtitle">'+ event.hour + ' @ ' + event.address +  '</div>';
            html += '<div class="item-text">' + event.description + '</div>';

            html += "</div>"
            html += "</a>";
            html += "</li>";
            $wrapper.append(html);
        }
    } else {
        $wrapper.html('<h4 style="text-align: center;">You have no events! Get Swipin\'</h4>')
    }
}

function swipeEvent(direction) {
    if (direction == "right") {
        var activeEventHash = ($('.event-data h2').text() + $('.event-data p').eq(0).text()).hashCode();
        savedEvents.push(getEventID(activeEventHash));
    } else {
        var deniedCategory = $('.event-data').data('category');
        categoryDenyCount[deniedCategory]++;
        console.log('registered deny for ' + deniedCategory);
    }
    spawnEmoji(direction == "right");
    $('.event-photo').addClass(direction);
    setTimeout(function () {
        prepareNextEvent();

    }, 305); // transition takes 300ms, but css and js are not perfectly in sync
}

var emojiTimeoutOne, emojiTimeoutTwo;

function spawnEmoji(isLike) {
    var $emoji = $('.event .emoji');
    clearTimeout(emojiTimeoutOne);
    clearTimeout(emojiTimeoutTwo);
    $emoji.removeClass('like').removeClass('dislike').removeClass('fade');
    if(isLike) $emoji.addClass('like');
    else $emoji.addClass('dislike');

    $emoji.css({
        top: (7  + 2 * (Math.random - 0.5)) + "%",
    });

    emojiTimeoutOne = setTimeout(function(){
        $emoji.addClass('fade');
        emojiTimeoutTwo = setTimeout(function(){
            $emoji.removeClass('like').removeClass('dislike').removeClass('fade');
        }, 505);
    }, 1005)
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
        if(eventQueue.length > 2) {
            var index = eventQueue.length - 2,
                swapCandidate = eventQueue[index],
                denyCount = categoryDenyCount[swapCandidate.category],
                pass = Math.pow(2, -denyCount) >= Math.random();

            if(!pass) {
                eventQueue.splice(index, 1);
                eventQueue.unshift(swapCandidate);
            }            
        }

        var photo = nextEvent.photo,
            $data = $('.event-data');
        $data.data('category', nextEvent.category);
        $data.find('h2').text(nextEvent.name);
        $data.find('p').eq(0).text(nextEvent.description);
        $data.find('p').eq(1).text(nextEvent.hour + " @ " + nextEvent.address);
        $data.find('.icon.category img').attr('src', icons[nextEvent.category]);
        $data.find('.icon.btn img').data('lat', nextEvent.location.lat).data('lng', nextEvent.location.lng);
        $('.event-photo').css('background-image', 'url(' + photo + ')');
        $('.event-photo').removeClass('left').removeClass('right');
        if (eventQueue.length - 1 >= 0) {
            var nextPhoto = eventQueue[eventQueue.length - 1].photo;
            $('.event-transition').css('background-image', 'url(' + nextPhoto + ')');
        } else {
            $('.event-transition').css('background-color', '#333').css('background-image', '')
                .html('<h4>There are no more events near you :(</h4>');
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

String.prototype.hashCode = function () {
    var hash = 0;
    if (this.length == 0) return hash;
    for (var i = 0; i < this.length; i++) {
        var character = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + character;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

function getEventID(activeEventHash) {
    for (var property in data.features) {
        if (data.features.hasOwnProperty(property)) {
            var hash = (data.features[property].name + data.features[property].description).hashCode();
            if (hash == activeEventHash) return property;
        }
    }
    return null;
}

// login handler
$$('#login').click(function () {
    var username = $$('input[name="email"]').val();
    var password = $$('input[name="password"]').val();
    var matched = false;
    // Handle username and password
    $$.each(data.users, function (i, v) {
        if (v.email == username && v.password == password) {
            mainView.router.load({pageName: 'swiper'});
            matched = true;
        }
    });
    if(!matched) 
            alert('User or password invalid.');
});

// register user handler
$$('#register').click(function () {

    var lengthusers = 0;

    $$.each(data.users, function (i, v) {
        lengthusers++;
    });

    var usernameNew = $$('input[name="email"]').val();
    var passwordNew = $$('input[name="passwordRegister"]').val();
    var passwordconfirm = $$('input[name="passwordConfirm"]').val();

    if (usernameNew.length != 0 && passwordNew.length != 0) {

        if (passwordNew == passwordconfirm) {
            data.users[lengthusers] = {email: usernameNew, password: passwordNew};
            var formData = app.formToData('#register-form');
            alert(JSON.stringify(formData));
            mainView.router.load({pageName: 'login'});
            app.alert("registered successfully, you can login now")
        }
        else {
            app.alert("passwords doesn't match");
        }

    }
    else {
        app.alert("fill all fields");
    }
});

// Size selector
$$('#sizeSelecter').on('click', function () {
    app.modal({
        title:  'Font Size',
        text: 'Select the size of the font',
        buttons: [
            {
                text: 'small',
                onClick: function() {

                }
            },
            {
                text: 'Medium',
                onClick: function() {

                }
            },
            {
                text: 'Big',
                onClick: function() {

                }
            },
        ]
    })
});

// Language selector
$$('#languageSelector').on('click', function () {
    app.modal({
        title:  'Select language',
        verticalButtons: true,
        buttons: [
            {
                text: 'Spanish',
                onClick: function() {
                }
            },
            {
                text: 'English',
                onClick: function() {
                }
            },
            {
                text: 'French',
                onClick: function() {
                }
            },
            {
                text: 'Chinese',
                onClick: function() {
                }
            },
        ]
    })
});

// Clear cache selector
$$('#cacheSelector').on('click', function () {
    app.modal({
        title:  'Clear cache',
        text: 'Are you sure?',
        buttons: [
            {
                text: 'Cancel',
                onClick: function() {

                }
            },
            {
                text: 'Ok',
                onClick: function() {

                }
            },
        ]
    })
});