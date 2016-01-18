@var rows = context['data'];@
@for var key in rows@
   <tr id='studiengang_#key#' data_id="#key#">
   @var row = rows[key];@
      <td>#row['bezeichnung']#</td><td>#row['kurz']#</td><td>#row['semester']#</td>'
   </tr>
@endfor@