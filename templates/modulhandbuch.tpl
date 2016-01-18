@var rows = context['data'];@
@for var key in rows@
   <tr id='modulhandbuch_#key#' data_id="#key#">
   @var row = rows[key];@
      <td>#row['bezeichnung']#</td><td>#row['kurz']#</td><td>#row['semester']#</td><td>
<ul>
         @for var lehrveranstaltung in row['lehrveranstaltungen']@
            <li>[ #row['lehrveranstaltungen'][lehrveranstaltung]["modul"]["kurz"]# ] - #row['lehrveranstaltungen'][lehrveranstaltung]["bezeichnung"]#</li>
         @endfor@
</ul>
      </td>'
   </tr>
@endfor@