# coding: utf-8

import json
from operator import itemgetter


class Database(object):

    modulFile = "./data/modul.json"
    lehrveranstaltungFile = "./data/lehrveranstaltung.json"
    studiengangFile = "./data/studiengang.json"


    def getModulTemplate(self,id=None,bezeichnung=None,kurz=None,kreditpunkte=None,sws=None,beschreibung=None):

        id = 0 if id is None else id
        bezeichnung = "" if bezeichnung is None else bezeichnung
        kurz = "" if kurz is None else kurz
        kreditpunkte = 0 if kreditpunkte is None else kreditpunkte
        sws = 0 if sws is None else sws
        beschreibung = "" if beschreibung is None else beschreibung

        return {
            'id': id,
            'bezeichnung': bezeichnung,
            'kurz': kurz,
            'kreditpunkte': kreditpunkte,
            'sws': sws,
            'beschreibung': beschreibung
        }

    def getLehrveranstaltungTemplate(self,id,modul=None,studiengang=None,semester=None,typ=None,datum=None,uhrzeit=None,raum=None):

        id = 0 if id is None else id
        modul = 0 if modul is None else modul
        studiengang = 0 if studiengang is None else studiengang
        semester = 0 if semester is None else semester
        typ = "" if typ is None else typ
        datum = "" if datum is None else datum
        uhrzeit = "" if uhrzeit is None else uhrzeit
        raum = "" if raum is None else raum

        return {
            'id': id,
            'modul': modul,
            'studiengang': studiengang,
            'semester': semester,
            'typ': typ,
            'datum': datum,
            'uhrzeit': uhrzeit,
            'raum': raum
        }

    def getStudiengangTemplate(self,id=None,bezeichnung=None,kurz=None,semester=None):
        id = 0 if id is None else id
        bezeichnung = "" if bezeichnung is None else bezeichnung
        kurz = "" if kurz is None else kurz
        semester = 0 if semester is None else semester
        return {
            'id': id,
            'bezeichnung': bezeichnung,
            'kurz': kurz,
            'semester': semester
        }

    def updateModul(self,id,bezeichnung,kurz,kreditpunkte,sws,beschreibung):
        entry = self.getModulTemplate(id,bezeichnung,kurz,kreditpunkte,sws,beschreibung)
        self.updateEntry(self.modulFile,id,entry)

    def updateLehrveranstaltung(self,id,modul,studiengang,semester,typ,datum,uhrzeit,raum):
        entry = self.getLehrveranstaltung(id,modul,studiengang,semester,typ,datum,uhrzeit,raum)
        self.updateEntry(self.lehrveranstaltungFile,id,entry)

    def updateStudiengang(self,id,bezeichnung,kurz,semester):
        entry = self.getStudiengang(id,id,bezeichnung,kurz,semester)
        self.updateEntry(self.studiengangFile,id,entry)

    def putModul(self,bezeichnung,kurz,kreditpunkte,sws,beschreibung):
        id = self.nextId(self.modulFile)

        entry = self.getModulTemplate(id,bezeichnung,kurz,kreditpunkte,sws,beschreibung)
        self.appendEntry(self.modulFile,entry)
        return id

    def putLehrveranstaltung(self,modul,studiengang,semester,typ,datum,uhrzeit,raum):
        id = self.nextId(self.lehrveranstaltungFile)

        entry = self.getLehrveranstaltungTemplate(id,modul,studiengang,semester,typ,datum,uhrzeit,raum)
        self.appendEntry(self.lehrveranstaltungFile,entry)
        return id

    def putStudiengang(self,bezeichnung,kurz,semester):
        id = self.nextId(self.studiengangFile)

        entry = self.getStudiengangTemplate(id,bezeichnung,kurz,semester)
        self.appendEntry(self.studiengangFile,entry)
        return id

    def getModul(self,id=None):
        return self.getEntry(self.modulFile,id)

    def getLehrveranstaltung(self,id=None):
        return self.getEntry(self.lehrveranstaltungFile,id)

    def getStudiengang(self,id=None):
        return self.getEntry(self.studiengangFile,id)

    def deleteModul(self,id):
        self.deleteEntry(self.modulFile,id)

    def deleteLehrveranstaltung(self,id):
        self.deleteEntry(self.lehrveranstaltungFile,id)

    def deleteStudiengangFile(self,id):
        self.deleteEntry(self.studiengangFile,id)

    @staticmethod
    def deleteEntry(file,id):
        data = Database.readFile(file)
        newData = {}
        result = False
        for entry in data:
            if entry.id != id:
                newData.append(entry)
            else:
                result = True
        Database.writeFile(file,newData)

        return result

    @staticmethod
    def updateEntry(file,id,updatedEntry):
        data = Database.readFile(file)
        data[id] = updatedEntry
        Database.writeFile(file,data)

    @staticmethod
    def appendEntry(file,data):
        with open(file, 'r') as pathfile:
            content = json.load(pathfile)
        content.append(data)

        Database.writeFile(file,content)

    @staticmethod
    def getEntry(file,id=None):
        if id is None:
            return Database.readFile(file)
        else:
            data = Database.readFile(file)
            return data.get(id,None)

    @staticmethod
    def nextId(file):
        data = Database.readFile(file)
        return data[len(data)-1].id + 1;
    
    @staticmethod
    def writeFile(file,data):
        with open(file, 'w') as pathfile:
            json.dumps(data, pathfile)

    @staticmethod
    def readFile(file):
        result = {}
        with open(file, "r") as content:
            data = json.load(content)

        data = sorted(data, key=itemgetter('id'))

        for entry in data:
            id = entry["id"]
            result[id] = entry
        return result;
# EOF
