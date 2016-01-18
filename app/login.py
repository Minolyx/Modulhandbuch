# coding: utf-8

import json
import cherrypy

from app import database

class Request(object):
    exposed = True

    def __init__(self):
        self.db = database.Database()

    def PUT(self, benutzername,passwort):
        response = dict(id=None)

        response['id'] = self.db.login(benutzername,passwort)

        if response['id'] is None:
            cherrypy.response.status = 401

        return json.dumps(response)