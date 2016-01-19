@var rows = context['data'];@
@for var key in rows@
@var row = rows[key];@
   <option id='mod_#key#' data_id="#key#" data_bezeichnung="#row['bezeichnung']#">
      #row['benutzername']#
   </option>
@endfor@