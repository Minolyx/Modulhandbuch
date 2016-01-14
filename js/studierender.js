var STUDAPP = {};

STUDAPP.Studiengang_cl = Class.create({
	initialize: function() {
		this.content_o = null;
		this.nav_o = new STUDAPP.Nav_cl();
		this.listView_o = new STUDAPP.ListView_cl();

		STUDAPP.es_o.subscribe_px(this, 'app');
	},
	notify_px: function (self_opl, message_spl, data_apl) {
      switch (message_spl) {
      case 'app':
        switch (data_apl[0]) {
        case 'init':
            STUDAPP.tm_o = new TELIB.TemplateManager_cl();
            break;
        case 'templates.loaded':
            // Liste im Content-Bereich anzeigen
            self_opl.setContent_p(self_opl.listView_o, data_apl[1]);
            break;
        case 'list':
            // Liste im Content-Bereich anzeigen
            self_opl.setContent_p(self_opl.listView_o, data_apl[1]);
            break;
        case 'back':
			// Detailformular wird verlassen, Liste im Content-Bereich anzeigen
			self_opl.setContent_p(self_opl.listView_o, data_apl[1]);
			break;
        default:
           console.warning('[Studiengang_cl] unbekannte app-Notification: '+data_apl[0]);
           break;
         }
         break;
      default:
         console.warning('[Studiengang_cl] unbekannte Notification: '+message_spl);
         break;
      }
   	}, setContent_p: function (newContent_opl, data_opl) {
      if (this.content_o != null) {
         if (this.content_o === newContent_opl) {
            // wird bereits angezeigt, keine Änderung
         } else {
            if (this.content_o.canClose_px()) {
               this.content_o.close_px();
               this.content_o = newContent_opl;
               this.content_o.render_px(data_opl);
            }
         }
      } else {
         this.content_o = newContent_opl;
         this.content_o.render_px(data_opl);
      }
   }

});

$(document).ready(function(){
// ----------------------------------------------
   // wird ausgeführt, wenn das Dokument vollständig geladen wurde
   STUDAPP.es_o  = new EventService_cl();
   STUDAPP.app_o = new STUDAPP.Studiengang_cl();

   STUDAPP.es_o.publish_px('app', ['init', null]);

});

// ----------------------------------------------
// Beispiel lit-8
// litlist.js
// ----------------------------------------------

// ----------------------------------------------
STUDAPP.ListView_cl = Class.create({
// ----------------------------------------------
   initialize: function () {

      var that = this;
      // Basis-Markup der Tabelle anfordern
      $.get('/html/studiengang-liste.html', function (data_spl) {
         $("#idContentOuter").append(data_spl);
         $("#idListContent").hide();
         that.initHandler_p();
         that.initList_p();
      });

      // Registrierungen
      STUDAPP.es_o.subscribe_px(this, 'list');

   },
   notify_px: function (self_opl, message_spl, data_apl) {
      switch (message_spl) {
      case 'list':
         switch (data_apl[0]) {
         case 'refresh':
            // Liste aktualisieren
            self_opl.render_px(null);
            break;
         default:
            console.warning('[ListView_cl] unbekannte list-Notification: '+data_apl[0]);
            break;
         }
         break;
      default:
         console.warning('[ListView_cl] unbekannte Notification: '+message_spl);
         break;
      }
   },
   canClose_px: function () {
      return true;
   },
   close_px: function () {
      $("#idListContent").hide();
   },
   render_px: function (data_opl) {
      // Parameter data_opl wird hier nicht benötigt
      // Anforderung an den Server senden
      $.ajax({
         dataType: "json",
         url: '/studiengang',
         type: 'GET'
      })
      .done($.proxy(this.doRender_p, this))
      .fail(function(jqXHR_opl, textStatus_spl) {
         alert( "[Liste] Fehler bei Anforderung: " + textStatus_spl );
      });
   },
   doRender_p: function (data_opl) {
      // json-Daten bereits in js-Objekte umgesetzt
      var rows_s = STUDAPP.tm_o.execute_px('studiengang.tpl', data_opl);
      this.initList_p();

      $("#idList tr[class!='listheader']").remove();
      $("#idList").append(rows_s);
      $("#idListContent").show();
      console.log("[ListView_cl] doRender");

   },
   initList_p: function () {
      this.rowId_s = ""; // id der selektierten Zeile
      // Buttons teilweise deaktivieren, bis eine Zeile ausgewählt wurde
      this.disableButtons_p();
   },
   initHandler_p: function () {
      // Ereignisverarbeitung einrichten

      // Ereignisverarbeitung für die Tabelle einrichten
      // man beachte: für jquery muss man CSS-Selektoren angeben, also #idList statt einfach nur idList !
      $("#idList").on("click", "td", $.proxy(this.onClickList_p, this));

      // Ereignisverarbeitung für die Schalter einrichten
      // stärkere Einschränkung mit #idListContent notwendig, damit keine Verwechslung mit ButtonArea auf Form erfolgt
      $("#idListContent #idButtonArea").on("click", "button", $.proxy(this.onClickButtons_p, this));

   },
   onClickList_p: function (event_opl) {
      // hier werden nur click-Events auf td-Elemente geliefert
      if (this.rowId_s != "") {
         $("#"+this.rowId_s).removeClass("clSelected"); // Achtung: jetzt ist nur die Bezeichnung der CSS-Klasse gemeint!
      }
      this.rowId_s = $(event_opl.target).parent().attr('id');
      $("#"+this.rowId_s).addClass("clSelected");

      this.enableButtons_p();
   },
   onClickButtons_p: function (event_opl) {

      var action_s = $(event_opl.target).attr("data-action");
      switch (action_s) {
      case 'add':
         // weiterleiten
         STUDAPP.es_o.publish_px('app', [action_s, null]);
         break;
      case 'edit':
         if (this.rowId_s != "") {
            // Weiterleiten
            STUDAPP.es_o.publish_px('app', [action_s, this.rowId_s]);
         } else {
            alert("Wählen Sie bitte einen Eintrag in der Tabelle aus!");
         }
         break;
      case 'delete':
         if (this.rowId_s != "") {
            if (confirm("Soll der Datensatz gelöscht werden?")) {
               // Id der selektierten Tabellenzeile anhängen
               var path_s = "/studiengang/" + this.rowId_s; 
               $.ajax({
                  context: this,
                  dataType: "json",
                  url: path_s,
                  type: 'DELETE'
               })
               .done(function (data_opl) {
                  // Auswertung der Rückmeldung
                  // der umständliche Weg:
                  // - Liste neu darstellen, hier vereinfacht durch neue Anforderung
                  //LITAPP.es_o.publish_px('list', ['refresh', null]);
                  
                  // einfacher mit direktem Entfernen der Zeile aus der Tabelle
                  // (id des gelöschten Eintrags wird in der Antwort geliefert)
                  $('#'+data_opl['id']).remove();
                  this.initList_p();
               })
               .fail(function(jqXHR_opl, textStatus_spl) {
                  alert( "[Liste] Fehler bei Anforderung: " + textStatus_spl );
               });
            }
         } else {
            alert("Wählen Sie bitte einen Eintrag in der Tabelle aus!");
         }
         break;
      }
      // Weiterleitung und Standardbearbeitung unterbinden
      event_opl.stopPropagation();
      event_opl.preventDefault();

   },
   // stärkere Einschränkung mit #idListContent notwendig, damit nicht die Buttons auf dem
   // Formular ebenfalls geändert werden
   enableButtons_p: function () {
      $("#idListContent #idButtonArea button").each(function () {
         if ($(this).attr("data-action") != "add") {
            $(this).prop("disabled", false);
         }
      });
   },
   disableButtons_p: function () {
      $("#idListContent #idButtonArea button").each(function () {
         if ($(this).attr("data-action") != "add") {
            $(this).prop("disabled", true);
         }
      });
   }
});

STUDAPP.Nav_cl = Class.create({
// ----------------------------------------------
   initialize: function () {
      // zur Vereinfachung hier direkt den Inhalt des
      // Navigationsbereichs anzeigen und die Ereignisverarbeitung einrichten
      this.render_px();
      this.initHandler_p();
   },
   render_px: function (data_opl) {
      // Parameter data_opl wird hier nicht benötigt
      // feste Voragben berücksichtigen
      var markup_s = '<a href="#" data-action="list">Studiengänge</a> ' +
                     '<a href="#" data-action="add">blub</a>';
      $('#idNav').html(markup_s);
   },
   initHandler_p: function () {
      // Ereignisverarbeitung für die Schalter einrichten

      $("#idNav").on("click", "a", function (event_opl) {
         var action_s = $(event_opl.target).attr('data-action');
         // Weiterleitung! Das Nav-Objekt ist nicht für die Bearbeitung direkt verantwortlich
         STUDAPP.es_o.publish_px('app', [action_s, null]);

         // Weiterleitung und Standardbearbeitung unterbinden
         event_opl.stopPropagation();
         event_opl.preventDefault();
      });
   }
});

// EOF