var STUDAPP = STUDAPP || {};

STUDAPP.ModulListe = Class.create({
    initialize: function () {

        var listView = this;
        // Basis-Markup der Tabelle anfordern
        $.get('/html/modul-liste.html', function (data) {
            $("#idContentOuter").append(data);
            $("#idModulContent").hide();
            listView.initList();
            listView.initHandler();
        });

        STUDAPP.eventService.subscribe_px(this, 'list');
        STUDAPP.eventService.subscribe_px(this, 'app');
    },
    notify_px: function (self, message, data) {
        if(message = "app"){
            switch(data[0]){
                case 'delete':
                    if(data[1] != "modul") return;
                    if (confirm("Soll der Datensatz gelöscht werden?")) {
                        var path = "/modul/" + this.rowId+"?user="+STUDAPP.user;
                        $.ajax({
                                context: this,
                                dataType: "json",
                                url: path,
                                type: 'DELETE'
                            })
                            .done(function (data) {
                                $(this.cssClass).remove();
                                alert( "Datensatz wurde gelöscht!");
                                this.initList();
                            })
                            .fail(function(jqXHR, textStatus) {
                                alert( "Fehler bei der Anforderung: " + jqXHR.status +"("+jqXHR.statusText+")");
                            });
                    }
            }
        }
        if(message = "modulList") {
            switch (data[0]) {
                case 'refresh':
                    self.render(null);
                    break;
            }
        }
    },
    canClose: function () {
        return true;
    },
    close: function () {
        $("#idModulContent").hide();
    },
    render: function (data) {
        $.ajax({
                dataType: "json",
                url: '/modul/',
            data:{"user":STUDAPP.user},
                type: 'GET'
            })
            .done($.proxy(this.doRender, this))
            .fail(function(jqXHR, textStatus) {
                alert( "Fehler bei der Anforderung: " + jqXHR.status +"("+jqXHR.statusText+")");
            });
    },
    doRender: function (data) {
        this.data = data;
        // json-Daten bereits in js-Objekte umgesetzt
        var rows = STUDAPP.templateManager.execute_px('modul.tpl', data);
        this.initList();
        $("#idModulList tr[class!='listheader']").remove();
        $("#idModulList").append(rows);
        $("#idModulContent").show();
        console.log("[ModulListe] doRender");
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
        $("#idModulList").on("click", "td", $.proxy(this.onClickList, this));

    },
    onClickList: function (event) {
        if (this.cssClass != "") {
            $(this.cssClass).removeClass("clSelected");
        }

        this.rowId = $(event.target).parent().attr('data_id');
        this.cssClass = "#modul_"+this.rowId;

        $(this.cssClass).addClass("clSelected");

        STUDAPP.eventService.publish_px('menu', ["enableListButtons"]);
        STUDAPP.eventService.publish_px('app', ["updateModulFormData",this.data["data"][this.rowId]]);
    }
});

STUDAPP.ModulForm = Class.create({
// ----------------------------------------------
    initialize: function () {
        // Basis-Markup des Formulars anfordern
        var that = this;
        $.get('/html/modul-form.html', function (data) {
            $("#idContentOuter").append(data);
            $("#idModulForm").hide();

            that.storeFormContent();

        });
        STUDAPP.eventService.subscribe_px(this, 'app');
    },
    updateData: function(data){
        this.data = data;
    },
    notify_px: function (self, message, data) {
        switch(data[0]){
            case "updateModulFormData":
                this.updateData(data[1]);
            case "save":
                // Formularinhalt prüfen
                if (this.isModified()) {
                    if (this.checkContent()) {
                        // kein klassisches submit, es wird auch keine neue Anzeige vorgenommen
                        var path = '/modul';
                        var data = $("#idModulForm").serialize()+"&user="+STUDAPP.user;
                        var type = 'POST';
                        var id = $('#idModulForm #id').val();
                        if (id == 0) {
                            type = 'PUT';
                        }
                        //var that = this;
                        $.ajax({
                                context: this,
                                dataType: "json",
                                data: data,
                                url: path,
                                type: type
                            })
                            .done(function (data) {
                                // Umwandlung der JSON-Daten vom Server bereits erfolgt
                                $('#idModulForm #id').val(data['id']);
                                // aktuellen Formularinhalt speichern
                                // (das Formular wird ja nicht mehr neu geladen!)
                                this.storeFormContent();
                                alert("Speichern ausgeführt!");
                            })
                            .fail(function(jqXHR, textStatus) {
                                alert( "Fehler bei der Anforderung: " + jqXHR.status +"("+jqXHR.statusText+")");
                            });

                    } else {
                        alert("Bitte prüfen Sie die Eingaben in den Formularfeldern!")
                    }
                }
                break;
        }
    },
    canClose: function () {
        // Prüfen, ob Formularinhalt verändert wurde
        var mod = this.isModified();
        if (mod) {
            if (confirm("Es gibt nicht gespeicherte Änderungen - verwerfen?")) {
                mod = false;
            }
            STUDAPP.eventService.publish_px('menu', ["showFormButtons"]);
        }
        return !mod;
    },
    close: function () {
        $("#idModulForm").hide();
    },
    render: function (data) {
        var path;
        if (this.data != undefined && this.data["id"] != undefined && data) {
            path = '/modul/' + this.data["id"]+"/";
        } else {
            path = '/modul/0/';
        }
        $.ajax({
                dataType: "json",
                url: path,
                data:{"user":STUDAPP.user},
                type: 'GET'
            })
            .done($.proxy(this.doRender, this))
            .fail(function(jqXHR, textStatus) {
                alert( "Fehler bei der Anforderung: " + jqXHR.status +"("+jqXHR.statusText+")");
            });
    },
    doRender: function (data) {
        // in das Formular übertragen
        var data = data["data"];
        $('#idModulForm #id').val(data['id']);
        $('#idModulForm #bezeichnung').val(data['bezeichnung'])
        $('#idModulForm #kurz').val(data['kurz']);
        $('#idModulForm #kreditpunkte').val(data['kreditpunkte']);
        $('#idModulForm #sws').val(data['sws']);
        $('#idModulForm #beschreibung').val(data['beschreibung']);

        this.storeFormContent();

        $("#idModulForm").show();
    },
    isModified: function () {
        // Prüfen, ob Formularinhalt verändert wurde
        var mod = this.FormContentOrg != $("#idModulForm").serialize();
        return mod;
    },
    isNumeric: function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    },
    checkContent: function () {
        // hier nur zur Demonstration Prüfung des Typs gegen eine Werteliste
        // (das realisiert man besser mit einer Liste)
        //var status = true;
        //var typ = $("#typ").val();
        //if ((typ != "Typ1") && (typ != "Typ2")) {
        //   status = false;
        //}
        return this.isNumeric($("#idModulForm #kreditpunkte").val()) && this.isNumeric($("#idModulForm #sws").val());
    },
    storeFormContent: function () {
        this.FormContentOrg = $("#idModulForm").serialize();
    }
});