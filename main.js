$(function() {
  // var table = $('#main');
  // // console.log(table);

  // for (var i = 0; i < 25; i++) {
  //   var isHalfHour = i % 2;
  //   var hour = Math.floor(i / 2) + 9;
  //   hour = hour === 12 ? 12 : hour % 12;
  //   var isAfternoon = i > 5;
  //   var minutes = isHalfHour ? '30' : '00';
  //   var meridiem = isAfternoon ? 'PM' : 'AM';
  //   var content = hour.toString() + ':' + minutes + ' <span>' + meridiem + '</span>';
  //   var html = '<tr><td class="time">' + content + '</td></tr>';
  //   table.append(html);
  //   if(i === 0) {
  //     $('tr').append('<td rowspan="25"><div id="container"></div></td>');
  //   }
  // }
})


var layOutDay = function(events) {

  events.sort(function(evt1, evt2) {
    return evt1.start - evt2.start;
  })

  // use so we can do Math.max.apply later
  var timeSlots = [];
  for(var i = 0; i <= 720; i++) {
    timeSlots.push([]);
  }

  events.forEach(function(element, index, array) {
    console.log(index, element);
    for(var time = element.start; time <= element.end; time++) {
      timeSlots[time].push(index);
      // if (timeSlots[time]) {
      //   timeSlots[time].push(index);
      // } else {
      //   timeSlots[time] = [index]
      // }
    }
  })

  // find the largest set of conflicting events
  var timeSlotsFilterable = timeSlots.map(function(arr) { return JSON.stringify(arr); });
  var filteredTimeSlots = _.uniq(timeSlotsFilterable);
  console.log(filteredTimeSlots);
  timeSlots = filteredTimeSlots.map(function(str) { return JSON.parse(str); })
  console.log(timeSlots);
  var lengths = timeSlots.map(function(arr) { return arr.length; });
  var maxLengthIndex = lengths.indexOf(Math.max.apply(Math, lengths));
  var conflictSet = timeSlots[maxLengthIndex];
  console.log(conflictSet)
  var setWidths = false;
  // TODO: clean this up!
  for (i in conflictSet) {
    var index = conflictSet[i];
    var width = events[index]['width'];
    if(width) {
      alert("oops");
      setWidths = true;
      for(j in conflictSet) {
        events[j]['width'] = width;
      }
    }
  }
  if(!setWidths) {
    for (i in conflictSet) {
      var index = conflictSet[i];
      events[index]['width'] = 600/conflictSet.length;
    }
  }


}