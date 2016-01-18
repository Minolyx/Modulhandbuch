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

    def GET(self, id = None):
        response = dict(data=None)

        if id == "0":
            response['data'] = self.db.getModulTemplate()
        else:
            response['data'] = self.db.getModul(id)

        if response['data'] is None:
            cherrypy.response.status = 404

        return json.dumps(response)

    def PUT(self, id,bezeichnung,kurz,kreditpunkte,sws,beschreibung):
        response = dict(id=None)

        response['id'] = self.db.putModul(bezeichnung,kurz,kreditpunkte,sws,beschreibung)

        if response['id'] is None:
            cherrypy.response.status = 409

        return json.dumps(response)

    def DELETE(self,id):
        response = dict(id=None)
        response["id"] = self.db.deleteModul(id)
        if response["id"] is None:
            cherrypy.response.status = 404
        return json.dumps(response)

    def POST(self, id, bezeichnung,kurz,kreditpunkte,sws,beschreibung):
        response = dict(success=None)

        response['success'] = self.db.updateModul(id,bezeichnung,kurz,kreditpunkte,sws,beschreibung)
        if not response["success"]:
            cherrypy.response.status = 404

        return json.dumps(response)