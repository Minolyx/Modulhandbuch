@var rows = context['data'];@
@for var key in rows@
   <tr id='modul_#key#' data_id="#key#">
   @var row = rows[key];@
      <td>#row['bezeichnung']#</td><td>#row['kurz']#</td><td>#row['kreditpunkte']#</td><td>#row['sws']#</td><td>#row['beschreibung']#</td>'
   </tr>
@endfor@