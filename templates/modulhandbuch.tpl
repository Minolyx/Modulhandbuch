@var row = context['data']; @
<div style="margin:15px;">
<div>Bezeichnung: <b>[#row['kurz']#] #row['bezeichnung']#</b></div>

    <div>Anzahl der Semester: <b>#row['anzahlSemester']#</b></div>
    <div>Kreditpunkte: <b>#row['anzahlSemester']#</b></div>
    <br/><br/>
<div>
Lehrveranstaltungen:
        <ul>
                 @for var lehrveranstaltung in row['lehrveranstaltungen']@
                @var lv = row['lehrveranstaltungen'][lehrveranstaltung]@
                    <li>
                        <div>Bezeichnung: <b>[#lv["modul"]["kurz"]#] - #lv["bezeichnung"]#</b></div>
                        <div>Semester: <b>#lv["semester"]#</b></div>
                        <div>Beschreibung: <b>#lv["modul"]["beschreibung"]#</b></div>
                        <div>Kreditpunkte: <b>#lv["modul"]["kreditpunkte"]#</b></div>
                        <div>SWS: <b>#lv["modul"]["sws"]#</b></div>
                    </li>
                 @endfor@
        </ul>
</div>
</div>