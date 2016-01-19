var STUDAPP = STUDAPP || {};

STUDAPP.Login = Class.create({
    initialize: function () {
        var listView = this;
        $.get('/html/login.html', function (data) {
            $("#idContentOuter").append(data);
            $("#loginForm").hide();
            listView.initHandler();
        });
        STUDAPP.eventService.subscribe_px(this, 'app');
    },
    notify_px: function (self, message, data) {
        switch(data[0]) {
            case "login":
                this.login();
        }
    },
    close: function () {
        $("#loginForm").hide();
    },
    login: function () {

        var username =$("#loginForm #benutzername").val();
        var passwort = $("#loginForm #passwort").val();

        $.ajax({
            dataType: "json",
            url: '/login/',
            data: $("#loginForm").serialize(),
            type: 'PUT'
        })
        .done(function(data){
            STUDAPP.user = data["id"];
            STUDAPP.hasToLogin = false;
            STUDAPP.rolle = data["rolle"];

            STUDAPP.eventService.publish_px('app',["studiengangList"]);

        })
        .fail(function(jqXHR, textStatus) {
            alert( "Fehler beim Login: " + jqXHR.status +"("+jqXHR.statusText+")");
        });

    },
    canClose: function () {return true},
    render: function (data) {
        $("#loginForm").show();
    },
    initHandler: function () {
        $("#loginForm")

    }
});