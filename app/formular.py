# coding: utf-8

import json
import cherrypy

from app import database, template

"""

Anforderung       GET          PUT          POST          DELETE
----------------------------------------------------------------
/                 Liste       -            -             -
                  Studiengang
                  liefern

/0                Dokument     Dokument     -             -
                  mit id=0     anlegen      
                  liefern
                  (Vorgabe-Werte)

/{id}             Dokument     -            Dokument      Dokument
                  mit {id}                  ändern        löschen
                  liefern

id > 0 ! 

"""


class Request(object):
    exposed = True

    def __init__(self):
        self.db_o = database.Database_cl()

    def GET(self, id = None):
        retVal_o = {
            'data': None
        }
        if id is None:
            # Anforderung der Liste
            retVal_o['data'] = self.getList_p()
        else:
            # Anforderung eines Dokuments
            retVal_o['data'] = self.getForm_p(id)

        if retVal_o['data'] is None:
            cherrypy.response.status = 404

        return json.dumps(retVal_o)

    def PUT(self, **data_opl):
        retVal_o = {
            'id': None
        }
        # data_opl: Dictionary mit den gelieferten key-value-Paaren
        # hier müsste man prüfen, ob die Daten korrekt vorliegen!

        data_o = {
            'studiengang': data_opl["studiengang_s"],
            'kurzBezeichnung': data_opl["kurzBezeichnung_s"],
            'semesterAnzahl': data_opl["semesterAnzahl_s"]
        }
        # Create-Operation
        id_s = self.db_o.create_px(data_o)
        retVal_o['id'] = id_s
        if id_s is None:
            cherrypy.response.status = 409

        return json.dumps(retVal_o)

    def POST(self, id, **data_opl):
        retVal_o = {
            'id': None
        }

        id_s = data_opl["id_s"]
        data_o = {
            'studiengang': data_opl["studiengang_s"],
            'kurzBezeichnung': data_opl["kurzBezeichnung_s"],
            'semesterAnzahl': data_opl["semesterAnzahl_s"]
        }
        retVal_o['id_s'] = id_s
        if self.db_o.update_px(id_s, data_o):
            pass
        else:
            cherrypy.response.status = 404
        return json.dumps(retVal_o)

    def DELETE(self, id):
        # Studiengang mit der Id :studiengang-id löschen
        # fehlt: Bestehende Lehrveranstaltungen und deren Zuordnung zu Modulen
        # werden entfernt
        retVal_o = {
            'id': id
        }

        if self.db_o.delete_px(id):
            pass
        else:
            cherrypy.response.status = 404

        return json.dumps(retVal_o)

    def getList_p(self):
        data_o = self.db_o.read_px()
        return data_o

    def getForm_p(self, id_spl):
        data_o = self.db_o.read_px(id_spl)
        if data_o != None:
            return self.view_o.createForm_px(id_spl, data_o)
        else:
            return None