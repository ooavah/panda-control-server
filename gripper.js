/* var ROSLIB = require('roslib');

var ros = new ROSLIB.Ros({
    // petteri ip ja portti 9090
    url : 'ws://localhost:9090'
});

var graspClient = new ROSLIB.ActionClient({
  ros : ros,
  serverName : '/panda_gripper',
  actionName : '/panda_gripper/grasp'
});

var turtleClient = new ROSLIB.ActionClient({
    ros : ros,
    serverName : '/turtlesim',
    actionName : 'turtle1/rotate_absolute'
  });



var goal = new ROSLIB.Goal({
    actionClient: graspClient,
    goalMessage: {width: 0.057, speed: 0.03, force: 50}
})

goal.on('feedback', function(feedback) {
  console.log('Feedback: ' + feedback.sequence);
})
goal.on('result', function(result) {
  console.log('Final Result: ' + result.sequence);
})
ros.on('connection', function() {
  console.log('Connected to websocket server.');
})
ros.on('error', function(error) {
  console.log('Error connecting to websocket server: ', error);
})
ros.on('close', function() {
  console.log('Connection to websocket server closed.');
})
goal.send(); */

var exec = require('child_process').exec

exec('ls', function (error, stdOut, stdErr) {
  console.log(stdOut)
});