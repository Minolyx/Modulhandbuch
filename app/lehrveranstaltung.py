# coding: utf-8

import json
import cherrypy

from app import database

"""

Anforderung       GET          PUT          POST          DELETE
----------------------------------------------------------------
/{studiengang-id}  Liste der    -            -             -
                   Lehrveranstaltungen im
                   Studiengang liefern

/{studiengang-id}/   -        Modul       Bezeichnung      Zuordnung
{modul-id}                    zuordnen    der Zuordnung    entfernen
                                          ändern

"""


class Request(object):
    exposed = True

    def __init__(self):
        self.db = database.Database()

    def GET(self, studiengang=None,user=None):

        response = dict(data=None)

        if studiengang is None:

            if not self.db.canEditModul(user) and not self.db.canEditStudiengang(user):
                cherrypy.response.status = 403
                return ""

            response['data'] = self.db.getLehrveranstaltung()
        else:
            response['data'] = self.db.getSemesterplan(studiengang)

        if response['data'] is None:
            cherrypy.response.status = 404

        return json.dumps(response)

    def PUT(self,studiengang,modul,semester,bezeichnung,user):
        if not self.db.canEditStudiengang(user):
            cherrypy.response.status = 403
            return ""
        response = dict(success=False)

        response["success"] = self.db.putLehrveranstaltung(studiengang,modul,semester,bezeichnung)

        if not response['success']:
            cherrypy.response.status = 409

        return json.dumps(response)

    def DELETE(self,studiengang,modul,user):
        if not self.db.canEditStudiengang(user):
            cherrypy.response.status = 403
            return ""
        response = dict(success=None)
        response["success"] = self.db.deleteLehrveranstaltung(studiengang,modul)
        if not response["success"]:
            cherrypy.response.status = 404
        return json.dumps(response)

    def POST(self, studiengang,modul,semester,bezeichnung,user):
        if not self.db.canEditStudiengang(user):
            cherrypy.response.status = 403
            return ""
        response = dict(success=None)

        response['success'] = self.db.updateLehrveranstaltung(studiengang,modul,semester,bezeichnung)
        if not response["success"]:
            cherrypy.response.status = 404

        return json.dumps(response)