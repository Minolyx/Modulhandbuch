var STUDAPP = STUDAPP || {};

STUDAPP.Menu = Class.create({
    initialize: function () {
        this.initHandler();
        STUDAPP.eventService.subscribe_px(this, 'menu');
    },

    notify_px: function (self, message, data) {
        if(message = "menu"){
            switch (data[0]) {
                case 'disableListButtons':
                    this.disableListButtons();
                    break;
                case 'enableListButtons':
                    this.enableListButtons();
                    break;
                case 'showFormButtons':
                    this.showFormButtons();
                    break;
                case 'hideButtons':
                    this.hideButtons();
                    break;
                case 'showListButtons':
                    this.showListButtons();
                    break;
                case 'setContext':
                    console.log("Switch context to "+data[1]);
                    this.context = data[1];
                    break;
            }
        }
    },
    initHandler: function () {
        $("#idButtonArea").on("click", "button", $.proxy(this.onClickButtons, this));
    },
    enableListButtons: function () {
        $("#idButtonArea button").each(function () {
            if ($(this).attr("data-action") != "add") {
                $(this).prop("disabled", false);
            }
        });
    },
    showFormButtons:function(){
        var markup = '<button data-action="list" class="clButton">Zurück</button><button data-action="save" class="clButton">Speichern</button>';
        $('#idButtonArea').html(markup);
    },
    showListButtons:function(){

        var markup ="";

        if(this.context=="studiengang")
            markup +='<button data-action="show" class="clButton">Anzeigen</button>' ;


       markup +=  '<button data-action="add" class="clButton">Erstellen</button>' +
            '<button data-action="edit" class="clButton">Bearbeiten</button>' +
            '<button data-action="delete" class="clButton">Löschen</button>'
        $('#idButtonArea').html(markup);
    },
    hideButtons:function(){
        $('#idButtonArea').html("");
    },
    disableListButtons: function () {
        $("#idButtonArea button").each(function () {
            if ($(this).attr("data-action") != "add") {
                $(this).prop("disabled", true);
            }
        });
    },
    onClickButtons: function (event) {
        var action = $(event.target).attr("data-action");
        STUDAPP.eventService.publish_px('app', [action,this.context]);
        event.stopPropagation();
        event.preventDefault();
    }
});
