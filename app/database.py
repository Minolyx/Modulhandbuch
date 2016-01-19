# coding: utf-8

import json
from operator import itemgetter

class Database(object):

    modulFile = "./data/modul.json"
    studiengangFile = "./data/studiengang.json"
    benutzerFile = "./data/benutzer.json"

    def canEditModul(self,id ,modulId=None):
        data = Database.readFile(self.benutzerFile)
        for i in data:
            benutzer = data[i]
            if benutzer["id"] == int(id) and benutzer["rolle"] == "Verantwortlicher Modul":
                if modulId is not None:
                    for modul in benutzer["module"]:
                        if modul == int(modulId):
                            return True
                    return False
                return True
        return False

    def canEditStudiengang(self,id):
        data = Database.readFile(self.benutzerFile)
        for i in data:
            benutzer = data[i]
            if benutzer["id"] == int(id) and benutzer["rolle"] == "Verantwortlicher Studiengang":
                return True
        return False

    def login(self,benutzername,passwort):
        data = Database.readFile(self.benutzerFile)
        for i in data:
            benutzer = data[i]
            if benutzer["benutzername"] == benutzername and benutzer["passwort"] == passwort:
                return benutzer["id"]
        return None

    def getModulTemplate(self,id=None,bezeichnung=None,kurz=None,kreditpunkte=None,sws=None,beschreibung=None):

        id = 0 if id is None else int(id)
        bezeichnung = "" if bezeichnung is None else bezeichnung
        kurz = "" if kurz is None else kurz
        kreditpunkte = 0 if kreditpunkte is None else int(kreditpunkte)
        sws = 0 if sws is None else int(sws)
        beschreibung = "" if beschreibung is None else beschreibung

        return {
            'id': id,
            'bezeichnung': bezeichnung,
            'kurz': kurz,
            'kreditpunkte': kreditpunkte,
            'sws': sws,
            'beschreibung': beschreibung
        }

    def getStudiengangTemplate(self,id=None,bezeichnung=None,kurz=None,semester=None,lehrveranstaltungen=None):
        id = 0 if id is None else int(id)
        bezeichnung = "" if bezeichnung is None else bezeichnung
        kurz = "" if kurz is None else kurz
        semester = 0 if semester is None else int(semester)
        lehrveranstaltungen = [] if lehrveranstaltungen is None else lehrveranstaltungen
        return {
            'id': id,
            'bezeichnung': bezeichnung,
            'kurz': kurz,
            'semester': semester,
            'lehrveranstaltungen':lehrveranstaltungen
        }

    def updateModul(self,id,bezeichnung,kurz,kreditpunkte,sws,beschreibung):
        entry = self.getModulTemplate(id,bezeichnung,kurz,kreditpunkte,sws,beschreibung)
        return self.updateEntry(self.modulFile,id,entry)

    def updateStudiengang(self,id,bezeichnung,kurz,semester):
        entry = self.getStudiengangTemplate(id,bezeichnung,kurz,semester)
        modul = self.getStudiengang(id)
        entry["lehrveranstaltungen"] = modul["lehrveranstaltungen"]
        return self.updateEntry(self.studiengangFile,id,entry)

    def updateLehrveranstaltung(self,studiengang,modul,semester,bezeichnung):
        data = Database.readFile(self.studiengangFile)
        for entry in data:
            if entry == int(studiengang):
                for lehrveranstaltung in data[entry]["lehrveranstaltungen"]:
                    if lehrveranstaltung["id"] == int(modul):
                        lehrveranstaltung["bezeichnung"] = bezeichnung
                        lehrveranstaltung["semester"] = int(semester)
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

    def putLehrveranstaltung(self,studiengang,modul,semester,bezeichnung):
        modul = self.getModul(modul)
        data = Database.readFile(self.studiengangFile)
        for entry in data:
            if entry == int(studiengang):
                for lv in data[entry]["lehrveranstaltungen"]:
                    if(lv["id"] == modul["id"]):
                        return False
                md = {"semester":int(semester),"bezeichnung":bezeichnung,"id":int(modul["id"])}
                data[entry]["lehrveranstaltungen"].append(md);
                Database.writeFile(self.studiengangFile,data)
                return True
        return False

    def getModul(self,id=None):
        return self.getEntry(self.modulFile,id)

    def getStudiengang(self,id=None):
        return self.getEntry(self.studiengangFile,id)

    def getLehrveranstaltung(self):
        data = self.getStudiengang()
        if data is None:
            return None
        for studiengang in data:
            for lehrveranstaltung in data[studiengang]['lehrveranstaltungen']:
                lehrveranstaltung["modul"] = self.getModul(lehrveranstaltung["id"])
            data[studiengang]['lehrveranstaltungen'] = sorted(data[studiengang]['lehrveranstaltungen'] , key=itemgetter('bezeichnung'))#, reverse=True
        return data

    def getSemesterplan(self,studiengang):
        data = self.getStudiengang(studiengang)
        if data is None:
            return None

        kreditpunkte = 0;
        semester = {}

        for lehrveranstaltung in data['lehrveranstaltungen']:
            lehrveranstaltung["modul"] = self.getModul(lehrveranstaltung["id"])

            kreditpunkte = kreditpunkte + lehrveranstaltung["modul"]["kreditpunkte"]

            currentSemester = semester.get(lehrveranstaltung["semester"],None);
            if currentSemester is None:
                semester[lehrveranstaltung["semester"]] = {"kreditpunkte":lehrveranstaltung["modul"]["kreditpunkte"]}
            else:
                semester[lehrveranstaltung["semester"]]["kreditpunkte"] = (semester[lehrveranstaltung["semester"]]["kreditpunkte"]+lehrveranstaltung["modul"]["kreditpunkte"])

        for s in semester:
            semester[s]["lehrveranstaltungen"] = []
            for l in data["lehrveranstaltungen"]:
                if(l["semester"] == s):
                    semester[s]["lehrveranstaltungen"].append(l);
            semester[s]["lehrveranstaltungen"] = sorted(semester[s]["lehrveranstaltungen"] , key=itemgetter('bezeichnung'))
        data["anzahlSemester"] = data["semester"];
        data["semester"] = sorted(semester.items())
        data['kreditpunkte'] = kreditpunkte
        data['lehrveranstaltungen'] = sorted(data["lehrveranstaltungen"] , key=itemgetter('bezeichnung'))

        return data


    def deleteModul(self,id):
        data = Database.readFile(self.studiengangFile)
        for entry in data:
            for lehrveranstaltung in data[entry]["lehrveranstaltungen"]:
                if lehrveranstaltung["id"] == int(id):
                    return None

        if self.deleteEntry(self.modulFile,id) :
            return id
        return None


    def deleteStudiengang(self,id):
        if self.deleteEntry(self.studiengangFile,id):
            return id
        return None

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
