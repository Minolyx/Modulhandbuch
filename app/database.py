# coding: utf-8

import json
from operator import itemgetter


class Database(object):

    modulFile = "./data/modul.json"
    studiengangFile = "./data/studiengang.json"
    benutzerFile = "./data/benutzer.json"

    def login(self,benutzername,passwort):
        data = Database.readFile(self.benutzerFile)
        for key in data:
            benutzer = data[key]
            if benutzer["benutzername"] == benutzername and benutzer["passwort"] == passwort:
                return benutzer["id"]
        return None

    def getModulTemplate(self,id=None,bezeichnung=None,kurz=None,kreditpunkte=None,sws=None,beschreibung=None,lehrveranstaltungen=None):

        id = 0 if id is None else int(id)
        bezeichnung = "" if bezeichnung is None else bezeichnung
        kurz = "" if kurz is None else kurz
        kreditpunkte = 0 if kreditpunkte is None else int(kreditpunkte)
        sws = 0 if sws is None else int(sws)
        beschreibung = "" if beschreibung is None else beschreibung
        lehrveranstaltungen = [] if lehrveranstaltungen is None else lehrveranstaltungen

        return {
            'id': id,
            'bezeichnung': bezeichnung,
            'kurz': kurz,
            'kreditpunkte': kreditpunkte,
            'sws': sws,
            'beschreibung': beschreibung,
            'lehrveranstaltungen' :lehrveranstaltungen
        }

    def getStudiengangTemplate(self,id=None,bezeichnung=None,kurz=None,semester=None):
        id = 0 if id is None else int(id)
        bezeichnung = "" if bezeichnung is None else bezeichnung
        kurz = "" if kurz is None else kurz
        semester = 0 if semester is None else int(semester)
        return {
            'id': id,
            'bezeichnung': bezeichnung,
            'kurz': kurz,
            'semester': semester
        }

    def updateModul(self,id,bezeichnung,kurz,kreditpunkte,sws,beschreibung):
        entry = self.getModulTemplate(id,bezeichnung,kurz,kreditpunkte,sws,beschreibung)
        modul = self.getModul(id)
        entry["lehrveranstaltungen"] = modul["lehrveranstaltungen"]
        return self.updateEntry(self.modulFile,id,entry)

    def updateStudiengang(self,id,bezeichnung,kurz,semester):
        entry = self.getStudiengangTemplate(id,bezeichnung,kurz,semester)
        return self.updateEntry(self.studiengangFile,id,entry)

    def updateLehrveranstaltung(self,studiengang,modul,bezeichnung):
        data = Database.readFile(self.studiengangFile)
        for entry in data:
            if entry == int(studiengang):
                for lehrveranstaltung in data[entry]["lehrveranstaltungen"]:
                    if lehrveranstaltung["id"] == int(modul):
                        lehrveranstaltung["bezeichnung"] = bezeichnung
                        Database.writeFile(self.studiengangFile,data)
                        return True
        return False


    def putModul(self,bezeichnung,kurz,kreditpunkte,sws,beschreibung):
        id = self.nextId(self.modulFile)

        entry = self.getModulTemplate(id,bezeichnung,kurz,kreditpunkte,sws,beschreibung)
        self.appendEntry(self.modulFile,entry)
        return id

    def putStudiengang(self,bezeichnung,kurz,semester):
        id = self.nextId(self.studiengangFile)

        entry = self.getStudiengangTemplate(id,bezeichnung,kurz,semester)
        self.appendEntry(self.studiengangFile,entry)
        return id

    def putLehrveranstaltung(self,studiengang,modul):
        modul = self.getModul(modul)
        data = Database.readFile(self.studiengangFile)
        for entry in data:
            if entry == int(studiengang):
                for lv in data[entry]["lehrveranstaltungen"]:
                    if(lv["id"] == modul["id"]):
                        return False
                md = {"bezeichnung":modul["bezeichnung"],"id":modul["id"]}
                data[entry]["lehrveranstaltungen"].append(md);
                Database.writeFile(self.studiengangFile,data)
                return True
        return False

    def getModul(self,id=None):
        return self.getEntry(self.modulFile,id)

    def getStudiengang(self,id=None):
        return self.getEntry(self.studiengangFile,id)

    def getLehrveranstaltung(self,studiengang):
        data = self.getStudiengang(studiengang)
        if data is None:
            return None

        for lehrveranstaltung in data['lehrveranstaltungen']:
            lehrveranstaltung["modul"] = self.getModul(lehrveranstaltung["id"])
        return data

    def deleteModul(self,id):
        data = Database.readFile(self.studiengangFile)
        for entry in data:
            for lehrveranstaltung in data[entry["id"]]["lehrveranstaltungen"]:
                if lehrveranstaltung["id"] == id:
                    return False

        return self.deleteEntry(self.modulFile,id)


    def deleteStudiengang(self,id):
        return self.deleteEntry(self.studiengangFile,id)

    def deleteLehrveranstaltung(self,studiengang,modul):
        data = Database.readFile(self.studiengangFile)
        lehrveranstaltungen = []
        result = False
        for entry in data:
            if entry == int(studiengang):
                for lehrveranstaltung in data[entry]["lehrveranstaltungen"]:
                    if lehrveranstaltung["id"] == int(modul):
                        result = True
                    else:
                        lehrveranstaltungen.append(lehrveranstaltung)

                data[entry]["lehrveranstaltungen"] = lehrveranstaltungen
                Database.writeFile(self.studiengangFile,data)
                return result

        return False

    @staticmethod
    def deleteEntry(file,id):
        data = Database.readFile(file)

        if data.get(int(id),None) is None:
            return False
        else:
            del(data[int(id)])
            Database.writeFile(file,data)
            return True

    @staticmethod
    def updateEntry(file,id,updatedEntry):
        data = Database.readFile(file)
        if data.get(int(id),None) is None:
            return False
        else:
            data[int(id)] = updatedEntry
            Database.writeFile(file,data)
            return True

    @staticmethod
    def appendEntry(file,entry):
        data = Database.readFile(file)
        data[entry["id"]]=entry
        Database.writeFile(file,data)

    @staticmethod
    def getEntry(file,id=None):
        if id is None:
            return Database.readFile(file)
        else:
            data = Database.readFile(file)
            return data.get(int(id),None)

    @staticmethod
    def nextId(file):
        data = Database.readFile(file)
        biggestIndex = 0
        for entry in data:
            if int(entry) > biggestIndex:
                biggestIndex = int(entry)
        return biggestIndex + 1;
    
    @staticmethod
    def writeFile(file,data):
        result = []
        for entry in data:
            result.append(data[entry])

        with open(file, 'w') as pathfile:
            json.dump(result, pathfile, indent=2)

    @staticmethod
    def readFile(file):
        result = {}
        with open(file, "r") as content:
            data = json.load(content)

        data = sorted(data, key=itemgetter('id'))

        for entry in data:
            result[int(entry["id"])] = entry
        return result;
# EOF
