@var rows = context['data']['lehrveranstaltungen'];@
@for var key in rows@
@var row = rows[key];@
<option id='mod_#row['id']#' data_id="#row['id']#" data_semester="#row['semester']#" data_bezeichnung="#row['bezeichnung']#">
   [#row['modul']['kurz']#] #row['bezeichnung']#
</option>

@endfor@