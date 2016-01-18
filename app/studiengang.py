# coding: utf-8

import json
import cherrypy

from app import database

"""

Anforderung       GET          PUT          POST          DELETE
----------------------------------------------------------------
/                 Liste       Dokument     -             -
                  Studiengang anlegen
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
            response['data'] = self.db.getStudiengangTemplate()
        else:
            response['data'] = self.db.getStudiengang(id)

        if response['data'] is None:
            cherrypy.response.status = 404

        return json.dumps(response)

    def PUT(self, bezeichnung,kurz,semester):
        response = dict(id=None)

        response['id'] = self.db.putStudiengang(bezeichnung,kurz,semester)

        if response['id'] is None:
            cherrypy.response.status = 409

        return json.dumps(response)

    def DELETE(self,id):
        response = dict(success=False)
        response["success"] = self.db.deleteStudiengangFile(id)
        if not response["success"]:
            cherrypy.response.status = 404
        return json.dumps(response)

    def POST(self, id, bezeichnung,kurz,semester):
        response = dict(id=None)

        response['id'] = self.db.updateStudiengang(bezeichnung,kurz,semester)
        if response['id'] is None:
            cherrypy.response.status = 404

        return json.dumps(response)