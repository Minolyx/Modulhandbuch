@var rows = context['data']['semester'];@
@var studiengang = context['data']@
@for var key in rows@
   <tr id='modulhandbuch_#key#' data_id="#key#">
   @var row = rows[key];@
      <td>
      	#row[0]#
      </td>

      <td>
      	@for var lehrveranstaltung in row[1]['lehrveranstaltungen']@
      	<li>
	      	#row[1]['lehrveranstaltungen'][lehrveranstaltung]['bezeichnung']#
	    </li>
      	@endfor@
      </td>

      <td>
      	@for var lehrveranstaltung in row[1]['lehrveranstaltungen']@
      	<li>
	      	#row[1]['lehrveranstaltungen'][lehrveranstaltung]['modul']['sws']#
	    </li>
      	@endfor@
      </td>

      <td>
        @for var lehrveranstaltung in row[1]['lehrveranstaltungen']@
      	<li>
	      	#row[1]['lehrveranstaltungen'][lehrveranstaltung]['modul']['beschreibung']#
	    </li>
      	@endfor@
      </td>

      <td>
      	@for var lehrveranstaltung in row[1]['lehrveranstaltungen']@
      	<li>
	      	#row[1]['lehrveranstaltungen'][lehrveranstaltung]['modul']['kreditpunkte']#
	    </li>
      	@endfor@
      </td>

      <td>
      	#row[1]['kreditpunkte']#
      </td>
   </tr>
@endfor@


<tr id='modulhandbuch_#key#' data_id="#key#">
	<td>Gesamt</td>
	<td>Kreditpunkte</td>
	<td>pro</td>
	<td>Studiengang</td>
	<td>:</td>
     <td>#studiengang['kreditpunkte']#</td>
</tr>