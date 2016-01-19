var STUDAPP = STUDAPP || {};

STUDAPP.Modulhandbuch = Class.create({
    initialize: function () {

        var listView = this;
        $.get('/html/modulhandbuch-liste.html', function (data) {
            $("#idContentOuter").append(data);
            $("#idModulhandbuch").hide();
            listView.initList();
            listView.initHandler();
        });
        STUDAPP.eventService.subscribe_px(this, 'app');
    },
    updateData: function(data){
        this.data = data;
    },
    notify_px: function (self, message, data) {
        switch(data[0]) {
            case "updateFormData":
                this.updateData(data[1]);
        }
    },
    close: function () {
        $("#idModulhandbuch").hide();
    },
    canClose: function () {return true},
    render: function (data) {
        $.ajax({
                dataType: "json",
                url: '/lehrveranstaltung/'+this.data["id"],
                data:{user:STUDAPP.user},
                type: 'GET'
            })
            .done($.proxy(this.doRender, this))
            .fail(function(jqXHR, textStatus) {
                alert( "[Liste] Fehler bei Anforderung: " + textStatus);
            });
    },
    doRender: function (data) {
        this.data = data;
        // json-Daten bereits in js-Objekte umgesetzt
        var rows = STUDAPP.templateManager.execute_px('modulhandbuch.tpl', data);
        this.initList();
        $("#idModulhandbuch .clContentArea").empty();
        $("#idModulhandbuch .clContentArea").append(rows);
        $("#idModulhandbuch").show();
    },

    initList: function () {
        this.rowId = ""; // id der selektierten Zeile
        // Buttons teilweise deaktivieren, bis eine Zeile ausgewählt wurde
        STUDAPP.eventService.publish_px('app', ["select", this.rowId]);
    },
    initHandler: function () {
        // Ereignisverarbeitung einrichten

        // Ereignisverarbeitung für die Tabelle einrichten
        // man beachte: für jquery muss man CSS-Selektoren angeben, also #idList statt einfach nur idList !
        $("#idModulhandbuch").on("click", "td", $.proxy(this.onClickList, this));

    },
    onClickList: function (event) {
        if (this.cssClass != "") {
            $(this.cssClass).removeClass("clSelected");
        }

        this.rowId = $(event.target).parent().attr('data_id');
        this.cssClass = "#modul_"+this.rowId;

        $(this.cssClass).addClass("clSelected");
    }
});