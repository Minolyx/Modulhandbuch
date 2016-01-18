#Modulhandbuch

##Autor (Gruppe E)
* Sven (975524)

Letzte Änderung: 17.01.2016

##1. Einleitung
- allgemeine Beschreibung Ihrer Lösung


##2.Implementierung des Servers
### 2.1 Rest-Interface
- beschreiben Sie alle Anforderungen an den Server, die dem Architekturprinzip REST entsprechen      
   
	- *Addressierbarkeit*: Jeder Ressource wird eine eindeutige URI zugewiesen.
	- *Zustandslosigkeit*: Kommunikation erfolgt zustandslos, d.h. es gibt keine Benutzersitzungen. Alle notwendigen Informationen werden neu mitgeschickt.
	- *Einheitliche Schnittstellen*: Der Zugriff auf Ressourcen erfolgt über einen einheitlichen Satz von Standardmethoden (hier: Standard-HTTP-Methoden).

### 2.2 Module
- geben Sie alle Python-Module an
	- beschreiben Sie die Aufgabe des Moduls
- geben Sie für jedes Python-Modul an, welche Klassen es enthält
	- beschreiben Sie die Aufgabe der jeweiligen Klasse
- geben Sie für jede Klasse die öffentlichen Methoden an
	- beschreiben Sie die Aufgabe der jeweiligen Methode
- beschreiben Sie das Zusammenwirken der Module

#### database.py
Bearbeitet alle Anfragen der HTTP-Methoden.   
Enthaltene Klasse: *Database*    

Methoden:   

*login*    
Überprüft ob es den Benutzer gibt und das Passwort stimmt.
Liefert gegebenenfalls die ID des Benutzers zurück.

*getModulTemplate/getStudiengangTemplate*    
liefert das jeweilige Template gefüllt mit den übergebenen Parametern.   

*updateModul/updateLehrveranstaltung/updateStudiengang*   
erstellt einen Eintrag mithilfe der jeweiligen get<...>Template Methode und übergibt diesen an die Methode updateEntry.   

*putModul/putLehrveranstaltung/putStudiengang*    
erstellt einen Eintrag mithilfe der jeweiligen get<...>Template Methode und übergibt diesen an die Methode appendEntry.   

*getModul/getLehrveranstaltung/getStudiengang*   
übergibt ID des gesuchten Eintrags und den Pfad der entsprechenden .json an getEntry und liefert den Rückgabewert    

*getSemesterPlan*    
stellt alle zur Erstellung des Semesterplans eines Studiengangs benötigten Informationen geordnet und -sofern nötig- sortiert zusammen.    

*deleteModul/deleteLehrveranstaltung/deleteStudiengang*    
übergibt ID des gesuchten Eintrags und den Pfad der entsprechenden .json an deleteEntry und liefert den Rückgabewert   

*getEntry*  
liefert den Eintrag mit der entsprechenden ID bzw alle Einträge wenn ID = 0   
*deleteEntry*   
löscht den Eintrag mit der entsprechenden ID  

*appendEntry*   
fügt der übergebenen .json den Eintrag hinzu   

*updateEntry*    
aktualisiert einen Eintrag mit der entsprechendend ID in der übergebenen .json   

*nextId*    
liefert die nächste ID in der übergebenen .json    

*writeFile*       
schreibt übergebene Daten in die übergebene .json   

*readFile*    
liest alle Einträge aus der übergebenen .json

####  studiengang.py
API /studiengang    
Enthaltene Klasse: *Request*    

Methoden:     

*GET*    
liefert entsprechende Liste, Dokument oder Formular     

*PUT*    
legt einen neuen Studiengang an und liefert ID des angelegten Studiengangs   

*POST*    
bearbeitet einen Studiengang und liefert Bestätigung     

*DELETE*    
löscht einen Studiengang und liefert Bestätigung 


#### modul.py  
API /modul    
Enthaltene Klasse: *Request*    

Methoden:     

*GET*   
liefert entsprechende Liste, Dokument oder Formular     

*PUT*    
legt ein neues Modul an und liefert ID des angelegten Moduls   

*POST*    
bearbeitet ein Modul und liefert Bestätigung     

*DELETE*    
löscht ein Modul und liefert Bestätigung 



#### lehrveranstaltung.py
API /lehrveranstaltung    
Enthaltene Klasse: *Request*    

Methoden:     

*GET*    
liefert Liste der Lehrveranstaltungen im Studiengang         

*PUT*    
ordnet die Lehrveranstaltung einem Modul zu      

*POST*    
ändert die Bezeichnung der Zuordnung (bzw Lehrveranstaltung)     

*DELETE*    
entfernt die Zuordnungen der Lehrveranstaltung    



#### template.py
API /template      
Enthaltene Klasse: *Request*    

Methoden:    

*GET*     
liefert alle vorhandenen Templates    


#### login.py
API /login   
Enthaltene Klasse: *Request*

Methoden:    

*PUT*   
liefert ID des aktuellen Benutzers   


### 2.3 Datenhaltung
Alle Daten werden in .json-Dateien in /data/ abgelegt.     
Alle Studiengänge werden in der *studiengang.json* abgelegt.    
Alle Module werden in der *modul.json* abgelegt.    
Lehrveranstaltungen werden in der *studiengang.json* unter den Studiengängen     
denen sie zugeordnet wurden eingetragen.   
Alle Bentuzer werden in der *benutzer.json* abgelegt.

##3. Implementierung des Clients

### 3.1 Klassen
- geben Sie alle Klassen an
- beschreiben Sie deren Aufgaben
- beschreiben Sie das Zusammenwirken der Instanzen der Klassen

#### *STUDAPP.App*


#### *STUDAPP.Menu*


#### *STUDAPP.ModulListe*


#### *STUDAPP.ModulForm*


#### *STUDAPP.Modulhandbuch*


#### *STUDAPP.Navigation*


#### *STUDAPP.Semesterplan*


#### *STUDAPP.StudiengangListe*



### 3.2 Eventservice
- beschreiben Sie den Einsatz des Eventservice      

### 3.3 Templateverarbeitung
- beschreiben Sie die verwendeten Templates   

#### *lehrveranstaltungList.tpl*
Liste aller Lehrveranstaltungen.        

#### *modul.tpl*  
Liste der aller Module.    

#### *modulhandbuch.tpl*
Ausgabe des Modulhandbuchs eines Studiengangs.      

#### *modulList.tpl*
Listen für die Zuordnong bei der Bearbeitung eines Studiengangs.    

#### *semesterplan.tpl*
Ausgabe des Semesterplans eines Studiengangs.      

#### *studiengang.tpl*
Liste aller Studiengänge.   


## 4. Prüfung Markup und Stilregeln
- beschreiben Sie die Überprüfung des generierten Markups und der CSS-Stilregeln mit den W3C-Validatordiensten

Zur Überprüfung des generierten Markups wurde der Quelltext in das Eingabefeld auf http://validator.w3.org/#validate_by_input hineinkopiert.

Zur Überprüfung der CSS-Stilregeln wurde der Inhalt der custom.css in das Eingabefeld auf http://jigsaw.w3.org/css-validator/#validate_by_input hinkopiert.
