var STUDAPP = STUDAPP || {};

STUDAPP.Semesterplan = Class.create({
    initialize: function () {

        var listView = this;
        $.get('/html/semesterplan-liste.html', function (data) {
            $("#idContentOuter").append(data);
            $("#idSemesterplan").hide();
            listView.initList();
            listView.initHandler();
        });
    },
    close: function () {
        $("#idSemesterplan").hide();
    },
    canClose: function () {return true},
    render: function (data) {
        $.ajax({
                dataType: "json",
                url: '/lehrveranstaltung/1',
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
        var rows = STUDAPP.templateManager.execute_px('semesterplan.tpl', data);
        this.initList();
        $("#idSemesterplan tr[class!='listheader']").remove();
        $("#idSemesterplanList").append(rows);
        $("#idSemesterplan").show();
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
        $("#idSemesterplan").on("click", "td", $.proxy(this.onClickList, this));

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