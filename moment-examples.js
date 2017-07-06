var moment  = require('moment');
var now = moment();

now.subtract(1, 'year');
console.log(now.format());
console.log(now.format('X')); //Displays unix time stamp in secs
//console.log(now.format('x')); //Displays unix time stamp in millisecs

var timestamp = now.valueOf();
console.log(timestamp);
var timestampMoment = moment.utc(timestamp);

console.log(timestampMoment.local().format('h:mm a'));
//console.log(now.format('MMM Do h:mma YYYY')); //July 6th 2017, 3:30 pm
