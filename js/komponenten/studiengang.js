var STUDAPP = STUDAPP || {};

STUDAPP.StudiengangListe = Class.create({
    initialize: function () {

        var listView = this;
        // Basis-Markup der Tabelle anfordern
        $.get('/html/studiengang-liste.html', function (data) {
            $("#idContentOuter").append(data);
            $("#idListContent").hide();
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
                    if(data[1] != "studiengang") return;
                    if (confirm("Soll der Datensatz gelöscht werden?")) {
                        var path = "/studiengang/" + this.rowId;
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
                                alert( "[Liste] Fehler bei Anforderung: " + textStatus);
                            });
                    }
            }
        }
        if(message = "studiengangList") {
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
        $("#idListContent").hide();
    },
    render: function (data) {
        $.ajax({
                dataType: "json",
                url: '/lehrveranstaltung/',
                type: 'GET',
            data:{user:STUDAPP.user}
            })
            .done($.proxy(this.doRender, this))
            .fail(function(jqXHR, textStatus) {
                alert( "[Liste] Fehler bei Anforderung: " + textStatus);
            });
    },
    doRender: function (data) {
        this.data = data;
        // json-Daten bereits in js-Objekte umgesetzt
        var rows = STUDAPP.templateManager.execute_px('studiengang.tpl', data);
        this.initList();
        $("#idList tr[class!='listheader']").remove();
        $("#idList").append(rows);
        $("#idListContent").show();

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
        $("#idList").on("click", "td", $.proxy(this.onClickList, this));

    },
    onClickList: function (event) {
        if (this.cssClass != "") {
            $(this.cssClass).removeClass("clSelected");
        }

        this.rowId = $(event.target).parent().attr('data_id');
        this.cssClass = "#studiengang_"+this.rowId;

        $(this.cssClass).addClass("clSelected");

        STUDAPP.eventService.publish_px('menu', ["enableListButtons"]);
        STUDAPP.eventService.publish_px('app', ["updateFormData",this.data["data"][this.rowId]]);
    }
});

STUDAPP.StudiengangForm = Class.create({
// ----------------------------------------------
    initialize: function () {
        // Basis-Markup des Formulars anfordern
        var that = this;
        $.get('/html/studiengang-form.html', function (data) {
            $("#idContentOuter").append(data);
            $("#idForm").hide();

            that.storeFormContent();

        });
        STUDAPP.eventService.subscribe_px(this, 'app');
    },
    updateData: function(data){
        this.data = data;
    },
    notify_px: function (self, message, data) {
        switch(data[0]){
            case "updateFormData":
                this.updateData(data[1]);
            case "save":
                // Formularinhalt prüfen
                if (this.isModified()) {
                    if (this.checkContent()) {
                        // kein klassisches submit, es wird auch keine neue Anzeige vorgenommen
                        var path = '/studiengang/';
                        var data = $("#idForm").serialize()+"&user="+STUDAPP.user;
                        var type = 'POST';
                        var id = $('#idForm #id').val();
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
                                $('#idForm #id').val(data['id']);
                                // aktuellen Formularinhalt speichern
                                // (das Formular wird ja nicht mehr neu geladen!)
                                this.storeFormContent();
                                alert("Speichern ausgeführt!");
                            })
                            .fail(function(jqXHR, textStatus) {
                                alert( "Fehler bei Anforderung: " + textStatus );
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
        $("#idForm").hide();
    },
    render: function (data) {
        var path;
        if (this.data != undefined && this.data["id"] != undefined && data) {
            path = '/studiengang/' + this.data["id"]+"/";
        } else {
            path = '/studiengang/0/';
        }
        $.ajax({
                dataType: "json",
                url: path,
                type: 'GET',
                data:{user:STUDAPP.user}
            })
            .done($.proxy(this.doRender, this))
            .fail(function(jqXHR, textStatus) {
                alert( "[Form] Fehler bei Anforderung: " + textStatus);
            });
    },
    doRender: function (data) {
        // in das Formular übertragen
        var data = data["data"];
        $('#idForm #id').val(data['id']);
        $('#idForm #bezeichnung').val(data['bezeichnung'])
        $('#idForm #semester').val(data['semester']);
        $('#idForm #kurz').val(data['kurz']);
        if(data['id'] != 0){
            this.renderAssignment(data['id']);
            $("#lehrveranstaltungZuordnung").show();
        }else{
            $("#lehrveranstaltungZuordnung").hide();
        }
        this.storeFormContent();

        $("#moduleListe").change(function() {
            $("#editPanel > div").show();
            $("#editPanel .bezeichnung").val($(this).find(":selected").attr("data_bezeichnung"));
            $("#editPanel .id").val($(this).find(":selected").attr("data_id"));
            $("#editPanel .semester").val("");

            $("#editPanel .add").show();
            $("#editPanel .save").hide();
            $("#editPanel .remove").hide();
        });

        $("#lehrveranstaltungenListe").change(function() {
            $("#editPanel > div").show();
            $("#editPanel .bezeichnung").val($(this).find(":selected").attr("data_bezeichnung"));
            $("#editPanel .id").val($(this).find(":selected").attr("data_id"));
            $("#editPanel .semester").val($(this).find(":selected").attr("data_semester"));

            $("#editPanel .add").hide();
            $("#editPanel .save").show();
            $("#editPanel .remove").show();
        });


        var that = this;
        $("#editPanel .add").click(function(){

            var studiengang = data['id'];
            var modul = $("#editPanel .id").val();


            var bezeichnung = $("#editPanel .bezeichnung").val();
            var semester = $("#editPanel .semester").val();

            if(bezeichnung == "" || !that.isNumeric(semester)){
                alert("Bitte prüfen Sie die Eingaben in den Formularfeldern!");
            }

            $.ajax({
                dataType: "json",
                url: '/lehrveranstaltung/'+studiengang+'/'+modul,
                type: 'PUT',
                data:{"bezeichnung":bezeichnung,"semester":semester,user:STUDAPP.user}
            }).done(function(data){
                if(data["success"]){
                    that.renderAssignment(studiengang);
                }
            });
        });

        $("#editPanel .remove").click(function(){

            var studiengang = data['id'];
            var modul = $("#editPanel .id").val();

            $.ajax({
                dataType: "json",
                url: '/lehrveranstaltung/'+studiengang+'/'+modul+"/?user="+STUDAPP.user,
                type: 'DELETE'
            }).done(function(data){
                if(data["success"]){
                    that.renderAssignment(studiengang);
                }
            });
        });

        $("#editPanel .save").click(function(){

            var studiengang = data['id'];
            var modul = $("#editPanel .id").val();


            var bezeichnung = $("#editPanel .bezeichnung").val();
            var semester = $("#editPanel .semester").val();

            if(bezeichnung == "" || !that.isNumeric(semester)){
                alert("Bitte prüfen Sie die Eingaben in den Formularfeldern!");
            }

            $.ajax({
                dataType: "json",
                url: '/lehrveranstaltung/'+studiengang+'/'+modul,
                type: 'POST',data:{"bezeichnung":bezeichnung,"semester":semester,user:STUDAPP.user}
            }).done(function(data){
                if(data["success"]){
                    that.renderAssignment(studiengang);
                }
            });
        });


        $("#idForm").show();
    },
    renderAssignment: function (studiengang) {
        $("#editPanel > div").hide();
        $("#editPanel .bezeichnung").val("");
        $("#editPanel .id").val("");
        $("#editPanel .semester").val("");


        $.ajax({
            dataType: "json",
            url: '/lehrveranstaltung/'+studiengang+"/",
            data:{user:STUDAPP.user},
            type: 'GET'
        }).done(function(data){
            var rows = STUDAPP.templateManager.execute_px('lehrveranstaltungList.tpl', data);
            $("#lehrveranstaltungenListe").empty();
            $("#lehrveranstaltungenListe").append(rows);


            $.ajax({
                dataType: "json",
                url: '/modul/',
                data:{user:STUDAPP.user},
                type: 'GET'
            }).done(function(data){
                var rows = STUDAPP.templateManager.execute_px('modulList.tpl', data);
                $("#moduleListe").empty();
                $("#moduleListe").append(rows);

                $("#moduleListe option").each(function(i,item){
                    var id = $(item).attr("data_id");
                    if($('#lehrveranstaltungenListe option[data_id="'+id+'"]').length != 0){
                        $(item).remove();
                    }
                })
            });


        });


    },
    isModified: function () {
        // Prüfen, ob Formularinhalt verändert wurde
        var mod = this.FormContentOrg != $("#idForm").serialize();
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
        return this.isNumeric($("#semester").val());
    },
    storeFormContent: function () {
        this.FormContentOrg = $("#idForm").serialize();
    }
});