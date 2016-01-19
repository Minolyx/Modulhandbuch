# coding: utf-8

import json
import cherrypy

from app import database

"""
d
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

    def GET(self, id = None,user=None):
        response = dict(data=None)

        if id == "0":
            response['data'] = self.db.getStudiengangTemplate()
        else:
            response['data'] = self.db.getStudiengang(id)

        if response['data'] is None:
            cherrypy.response.status = 404

        return json.dumps(response)

    def PUT(self, id,bezeichnung,kurz,semester,user):
        if not self.db.canEditStudiengang(user):
            cherrypy.response.status = 403
            return ""

        response = dict(id=None)

        response['id'] = self.db.putStudiengang(bezeichnung,kurz,semester)

        if response['id'] is None:
            cherrypy.response.status = 409

        return json.dumps(response)

    def DELETE(self,id,user):
        if not self.db.canEditStudiengang(user):
            cherrypy.response.status = 403
            return ""
        response = dict(id=None)
        response["id"] = self.db.deleteStudiengang(id)
        if response["id"] is None:
            cherrypy.response.status = 404
        return json.dumps(response)

    def POST(self, id, bezeichnung,kurz,semester,user):
        if not self.db.canEditStudiengang(user):
            cherrypy.response.status = 403
            return ""

        response = dict(success=None)
        response['success'] = self.db.updateStudiengang(id,bezeichnung,kurz,semester)
        if not response["success"]:
            cherrypy.response.status = 404

        return json.dumps(response)