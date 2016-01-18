var STUDAPP = STUDAPP || {};

$(function(){
   STUDAPP.eventService  = new EventService_cl();
   STUDAPP.app = new STUDAPP.App();
   STUDAPP.eventService.publish_px('app', ['init', null]);
});

STUDAPP.App = Class.create({
	initialize: function() {
        this.content = null;
        this.navigation = new STUDAPP.Navigation();
        this.studiengangListe = new STUDAPP.StudiengangListe();
        this.studiengangForm = new STUDAPP.StudiengangForm();
        this.modulListe = new STUDAPP.ModulListe();
        this.modulForm = new STUDAPP.ModulForm();
        this.modulhandbuch = new STUDAPP.Modulhandbuch();
        this.semesterplan = new STUDAPP.Semesterplan();

        this.menu = new STUDAPP.Menu();
        STUDAPP.eventService.subscribe_px(this, 'app');
    },
   notify_px: function (self, message, data) {
      switch (message) {
      case 'app':
        switch (data[0]) {
            case 'init':
                STUDAPP.templateManager = new TELIB.TemplateManager_cl();
                break;
            case 'modulList':
                self.setContent(self.modulListe, data[1]);
                STUDAPP.eventService.publish_px('menu', ["setContext", "modul"]);
                STUDAPP.eventService.publish_px('menu', ["showListButtons"]);
                STUDAPP.eventService.publish_px('menu', ["disableListButtons"]);
                break;
            case 'templates.loaded':
            case 'studiengangList':
                self.setContent(self.studiengangListe, data[1]);
                STUDAPP.eventService.publish_px('menu', ["setContext", "studiengang"]);
                STUDAPP.eventService.publish_px('menu', ["showListButtons"]);
                STUDAPP.eventService.publish_px('menu', ["disableListButtons"]);
                break;
            case 'modulhandbuch':
                self.setContent(self.modulhandbuch, data[1]);
                STUDAPP.eventService.publish_px('menu', ["setContext", "modulhandbuch"]);
                STUDAPP.eventService.publish_px('menu', ["hideButtons"]);
                break;
            case 'semesterplan':
                self.setContent(self.semesterplan, data[1]);
                STUDAPP.eventService.publish_px('menu', ["setContext", "semesterplan"]);
                STUDAPP.eventService.publish_px('menu', ["hideButtons"]);
                break;
            case 'list':
                if(data[1] == "studiengang")
                    self.setContent(self.studiengangListe, false);
                if(data[1] == "modul")
                    self.setContent(self.modulListe, false);
                STUDAPP.eventService.publish_px('menu', ["showListButtons"]);
                STUDAPP.eventService.publish_px('menu', ["disableListButtons"]);
                break;
            case 'add':
                if(data[1] == "studiengang")
                    self.setContent(self.studiengangForm, false);
                if(data[1] == "modul")
                    self.setContent(self.modulForm, false);

                STUDAPP.eventService.publish_px('menu', ["showFormButtons"]);
                break;
            case 'edit':
                if(data[1] == "studiengang")
                    self.setContent(self.studiengangForm, true);
                if(data[1] == "modul")
                    self.setContent(self.modulForm, true);

                STUDAPP.eventService.publish_px('menu', ["showFormButtons"]);

                break;
        }
         break;
      }
   	}, setContent: function (newContent, data) {
      if (this.content != null) {
         if (this.content === newContent) {
            // wird bereits angezeigt, keine Änderung
         } else {
            if (this.content.canClose()) {
               this.content.close();
               this.content = newContent;
               this.content.render(data);
            }
         }
      } else {
         this.content = newContent;
         this.content.render(data);
      }
   }
});
