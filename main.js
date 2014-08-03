$(function() {
  var table = $('#main');

  // format times
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

  // ALGORITHM OVERVIEW:
  // 1) find all sets of events which conflict with each other
  // 2) start with the largest set of 

var layOutDay = function(events) {

  $('#container').empty();


  // sort all events by start time
  events.sort(function(evt1, evt2) {
    return evt1.start - evt2.start;
  })
  console.log(JSON.stringify(events));
  for(var i = 0; i < events.length; i++) {
    events[i]['conflicts'] = [];
  }

  // 
  var timeSlots = [];
  for(var i = 0; i <= 720; i++) {
    timeSlots.push([]);
  }
  events.forEach(function(element, index, array) {
    for(var time = element.start; time <= element.end; time++) {
      timeSlots[time].push(index);
    }
  })


  var timeSlotsStringified = timeSlots.map(function(arr) { return JSON.stringify(arr); });
  var filteredTimeSlots = _.uniq(timeSlotsStringified);
  timeSlots = filteredTimeSlots.map(function(str) { return JSON.parse(str); });

  for(var i = 0; i < timeSlots.length; i++) {
    var set = timeSlots[i];
    for(var j = 0; j < set.length; j++) {
      var index = set[j];
      var conflicts = events[index]['conflicts'];
      conflicts.push.apply(conflicts, set);
      events[index]['conflicts'] = _.without(_.uniq(conflicts), index);
    }
  }

  timeSlots.sort(function(arr1, arr2) {
    return arr2.length - arr1.length;
  });

  while(timeSlots.length) {
    // find the largest set of conflicting events
    var lengths = timeSlots.map(function(arr) { return arr.length; });
    var maxLengthIndex = lengths.indexOf(Math.max.apply(Math, lengths));
    var conflictSet = timeSlots[maxLengthIndex];
    var setWidths = false;
    // TODO: clean this up!
    for (var i = 0; i < conflictSet.length; i++) {
      var index = conflictSet[i];
      var evt = events[index];
      var width = events[index]['width'];
      // console.log("width: " + width);
      var cols = _.range(width);
    }
    if(!width) {
      for (var i = 0; i < conflictSet.length; i++) {
        var index = conflictSet[i];
        events[index]['width'] = conflictSet.length;
        events[index]['col'] = i;
        console.log("Setting event " + index + " to column " + events[index]['col'] + " in i loop.");
      }
    }
    timeSlots.splice(maxLengthIndex, 1);

    var k = 0;
    var parents = conflictSet.slice(0, conflictSet.length);

    while(k < timeSlots.length) {
      var set = timeSlots[k];
      var intersection = _.intersection(set, parents);
      if(intersection.length) {
        var width = events[parents[0]]['width'];
        var initialCols = _.range(width);
        for(var i = 0; i < set.length; i++) {
          var index = set[i];
          var conflicts = events[index]['conflicts'];
          var parentsEvents = conflicts.map(function(i) { return events[i]; } );
          var occupiedCols = _.pluck(parentsEvents, 'col');
          occupiedCols = _.filter(occupiedCols, function(i) {
            if(i === 0) {
              return true;
            }
            return Boolean(i);
          })
          cols = _.difference(initialCols, occupiedCols);
          if(!events[index]['width']) {
            events[index]['width'] = width;
            events[index]['col'] = cols.shift();
            parents.push(index);
            k = 0;
            console.log("Setting event " + index + " to column " + events[index]['col'] + " in k loop.");
          }
        }
        // timeSlots.splice(k, 1);
      }
      k++;
    }

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
      'html': i
      // 'html': '<span class="item">Sample Item</span><br><span class="loc">Sample Location</span>'
    }).appendTo('#container');
  }
  console.log("meh")
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var generate = function(quantity) {
  var events = [];
  for(var i = 0; i < quantity; i++) {
    var start = getRandomInt(0, 700);
    var end = getRandomInt(start+20, Math.min(start+100, 720));
    events.push({start: start, end: end});
  }

  events.sort(function(evt1, evt2) {
  return evt1.start - evt2.start;
  })

  return events;
}





