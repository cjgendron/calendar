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

// takes a list of events, and displays them in the calendar
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

  // ALGORITHM OVERVIEW:
  // 1) find all sets of events which conflict with each other, by filling each time slot with the events that occupy it
  // 2) keep track of the all events which conflict with each individual event
  // 3) identify the largest set of conflicts, and set all their widths
  // 4) look through the other sets of conflicts, and set any event which conflicts with the events in the largest set to that same width (constraint #2)
  // 5) use the list of conflicts to ensure every event is in its own column (constraint #1)
  // 6) after looking through all events, back to #2

var layOutDay = function(events) {

  $('#container').empty();

  var timeSlots = [];
  for(var i = 0; i <= 720; i++) {
    timeSlots.push([]);
  }

  events.forEach(function(element, index, array) {
    element['conflicts'] = [];
    for(var time = element.start; time <= element.end; time++) {
      timeSlots[time].push(index);
    }
  })

  var timeSlotsStringified = timeSlots.map(function(arr) { return JSON.stringify(arr); });
  var filteredTimeSlots = _.uniq(timeSlotsStringified);
  timeSlots = filteredTimeSlots.map(function(str) { return JSON.parse(str); });
  timeSlots = _.filter(timeSlots, function(arr) { return arr.length; });

  for(var i = 0; i < timeSlots.length; i++) {
    var set = timeSlots[i];
    for(var j = 0; j < set.length; j++) {
      var index = set[j];
      var conflicts = events[index]['conflicts'];
      conflicts.push.apply(conflicts, set);
      events[index]['conflicts'] = _.without(_.uniq(conflicts), index);
    }
  }

  while(timeSlots.length) {

    // find the largest set of conflicting events
    var lengths = timeSlots.map(function(arr) { return arr.length; });
    var maxLengthIndex = lengths.indexOf(Math.max.apply(Math, lengths));
    var conflictSet = timeSlots[maxLengthIndex];

    var index = conflictSet[conflictSet.length - 1];
    var width = events[index]['width'];

    // set all their widths, if they haven't been set yet
    if(!width) {
      for (var i = 0; i < conflictSet.length; i++) {
        var index = conflictSet[i];
        events[index]['width'] = conflictSet.length;
        events[index]['col'] = i;
      }
    }

    // once it's been processed, eliminate it from the list
    timeSlots.splice(maxLengthIndex, 1);

    var k = 0;

    // tree is a list of all events which are conflicting with an event in this conflictSet, either directly or indirectly through other events
    var tree = conflictSet.slice(0, conflictSet.length);

    while(k < timeSlots.length) {
      var set = timeSlots[k];
      var intersection = _.intersection(set, tree);

      if(intersection.length) {
        var width = events[tree[0]]['width'];
        var cols = _.range(width);

        for(var i = 0; i < set.length; i++) {
          var index = set[i];

          if(!events[index]['width']) {
            var conflicts = events[index]['conflicts'];
            var parentsEvents = conflicts.map(function(i) { return events[i]; } );
            var occupiedCols = _.pluck(parentsEvents, 'col');

            occupiedCols = _.filter(occupiedCols, function(i) {
              if(i === 0) {
                return true;
              }
              return Boolean(i);
            })

            // make sure we assign this event a column that isn't already occupied by any of its conflicts
            unoccupiedCols = _.difference(cols, occupiedCols);

            events[index]['width'] = width;
            events[index]['col'] = unoccupiedCols.shift();

            // this event conflicts with other events in the tree, so add it
            tree.push(index);

            // since the tree has expanded, we need to go through all of the sets again
            k = 0;
          }

        }

      }
      k++;
    }

  } 

  HTMLify(events);

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





