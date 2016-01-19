# coding: utf-8

import json
import cherrypy

from app import database

class Request(object):
    exposed = True

    def __init__(self):
        self.db = database.Database()


    def GET(self,modul = None,user = None):
        response = dict(data=None)

        if not self.db.canEditModul(user,modul) and not self.db.canEditStudiengang(user):
            cherrypy.response.status = 403
            return ""

        if modul is None:
            response["data"] = self.db.getUser()
        else:
            response["data"]=self.db.getAssignedUser(modul)

        if response['data'] is None:
            cherrypy.response.status = 401

        return json.dumps(response)

    def PUT(self,modul,benutzer,user):
        if not self.db.canEditModul(user,modul) and not self.db.canEditStudiengang(user):
            cherrypy.response.status = 403
            return ""

        response = dict(sucess=False)
        response["success"] = self.db.assignUser(benutzer,modul)
        if not response["success"]:
            cherrypy.response.status = 401
        return json.dumps(response)

    def DELETE(self,modul,benutzer,user):
        if not self.db.canEditModul(user,modul) and not self.db.canEditStudiengang(user):
            cherrypy.response.status = 403
            return ""
        response = dict(sucess=False)
        response["success"] = self.db.unassignUser(benutzer,modul)
        if not response["success"]:
            cherrypy.response.status = 401
        return json.dumps(response)
