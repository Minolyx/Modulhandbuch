<!-- Template -->
<!-- hier zunächst die einfache Variante -->

@var rows_o = context['data'];@
@for var key_s in rows_o@
   <tr id='#key_s#'>
   @var row_o = rows_o[key_s];@
      <td>Name: #row_o['studiengang']#</td><td>#row_o['kurzBezeichnung']#</td><td>#row_o['semesterAnzahl']#</td>'
   </tr>
@endfor@

<!-- EOF -->