$(function() {
  var table = $('#main');
  // console.log(table);

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
      $('tr').append('<td rowspan="25"><div id="container"></div></td>');
    }
  }
})


var layOutDay = function(events) {

  $('#container').empty();

  events.sort(function(evt1, evt2) {
    return evt1.start - evt2.start;
  })

  // use so we can do Math.max.apply later
  var timeSlots = [];
  for(var i = 0; i <= 720; i++) {
    timeSlots.push([]);
  }

  events.forEach(function(element, index, array) {
    // console.log(index, element);
    for(var time = element.start; time <= element.end; time++) {
      timeSlots[time].push(index);
      // if (timeSlots[time]) {
      //   timeSlots[time].push(index);
      // } else {
      //   timeSlots[time] = [index]
      // }
    }
  })

  var timeSlotsStringified = timeSlots.map(function(arr) { return JSON.stringify(arr); });
  var filteredTimeSlots = _.uniq(timeSlotsStringified);
  timeSlots = filteredTimeSlots.map(function(str) { return JSON.parse(str); });
  if(timeSlots[0].length === 0) {
    timeSlots.splice(0, 1);
  }

  while(timeSlots.length) {
    // find the largest set of conflicting events
    var lengths = timeSlots.map(function(arr) { return arr.length; });
    var maxLengthIndex = lengths.indexOf(Math.max.apply(Math, lengths));
    var conflictSet = timeSlots[maxLengthIndex];
    var setWidths = false;
    // TODO: clean this up!
    for (i in conflictSet) {
      var index = conflictSet[i];
      var width = events[index]['width'];
      var cols = _.range(width);
      // console.log(cols);
      if(width) {
        cols = _.without(cols, events[index]['col']);
        setWidths = true;
        for(j in conflictSet) {
          var index = conflictSet[j];
          events[index]['width'] = width;
          events[index]['col'] = cols.pop();
        }
        break;
      }
    }
    if(!setWidths) {
      for (i in conflictSet) {
        var index = conflictSet[i];
        events[index]['width'] = conflictSet.length;
        events[index]['col'] = i;
      }
    }
    timeSlots.splice(maxLengthIndex, 1);
    // console.log(JSON.stringify(events));
  } 

  HTMLify(events);

}


var HTMLify = function(events) {
  for(var i = 0; i < events.length; i++) {
    var evt = events[i];
    $('<div></div>', {
      'class': 'event',
      'css': {
        'top': evt['start'] + 'px',
        'left': (evt['col'] * 600/evt['width'] + 10).toString() + 'px',
        'width': (600/evt['width']).toString() + 'px',
        'height': (evt['end'] - evt['start']).toString() + 'px',
      },
      'html': '<span class="item">Sample Item</span><br><span class="loc">Sample Location</span>'
    }).appendTo('#container');
  }
}






