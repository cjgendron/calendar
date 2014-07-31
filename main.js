$(function() {
  var table = $('#main');
  console.log(table);

  for (var i = 0; i < 25; i++) {
    var isHalfHour = i % 2;
    var hour = Math.floor(i / 2) + 9;
    hour = hour === 12 ? 12 : hour % 12;
    var isAfternoon = i > 5;
    var minutes = isHalfHour ? '30' : '00';
    var meridiem = isAfternoon ? 'PM' : 'AM';
    var content = hour.toString() + ':' + minutes + ' <span>' + meridiem + '</span>';
    var html = '<tr><td class="time">' + content + '</td></tr>';
    table.append(html);
    if(i === 0) {
      $('tr').append('<td rowspan="25"><div id="container"></div></td>')
    }
  }
})