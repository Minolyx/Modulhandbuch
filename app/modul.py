# coding: utf-8

import json
import cherrypy

from app import database

"""
d
Anforderung       GET          PUT          POST          DELETE
----------------------------------------------------------------
/                 Liste       Dokument     -             -
                  Modul       anlegen
                  liefern

/0                Dokument                 -             -
                  mit id=0
                  liefern
                  (Vorgabe-Werte)

/{id}             Dokument     -            Dokument      Dokument
                  mit {id}                  ändern        löschen
                  liefern

"""


class Request(object):
    exposed = True

    def __init__(self):
        self.db = database.Database()

    def GET(self, id = None,user = None):
        response = dict(data=None)

        if id == "0":
            response['data'] = self.db.getModulTemplate()
        else:
            if id is None:
                if not self.db.canEditStudiengang(user):
                    response['data'] = self.db.getAllowedModules(user)
                else:
                    response['data'] = self.db.getModul(id)
            else:
                if not self.db.canEditModul(user,id) and not self.db.canEditStudiengang(user):
                    cherrypy.response.status = 403
                    return ""
                else:
                    response['data'] = self.db.getModul(id)


        if response['data'] is None:
            cherrypy.response.status = 404

        return json.dumps(response)

    def PUT(self, id,bezeichnung,kurz,kreditpunkte,sws,beschreibung,user):
        if not self.db.canEditStudiengang(user):
            cherrypy.response.status = 403
            return ""
        response = dict(id=None)

        response['id'] = self.db.putModul(bezeichnung,kurz,kreditpunkte,sws,beschreibung)

        if response['id'] is None:
            cherrypy.response.status = 409

        return json.dumps(response)

    def DELETE(self,id,user):
        if not self.db.canEditStudiengang(user):
            cherrypy.response.status = 403
            return ""
        response = dict(id=None)
        response["id"] = self.db.deleteModul(id)
        if response["id"] is None:
            cherrypy.response.status = 404
        return json.dumps(response)

    def POST(self, id, bezeichnung,kurz,kreditpunkte,sws,beschreibung,user):
        response = dict(success=None)

        if not self.db.canEditModul(user,id) and not self.db.canEditStudiengang(user):
            cherrypy.response.status = 403
            return ""

        response['success'] = self.db.updateModul(id,bezeichnung,kurz,kreditpunkte,sws,beschreibung)
        if not response["success"]:
            cherrypy.response.status = 404

        return json.dumps(response)