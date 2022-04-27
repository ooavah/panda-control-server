// Importing the required modules
require('dotenv').config()
var ROSLIB = require('roslib');
const WebSocketServer = require('ws');
const axisChange = require('./messageparser').axisChange
const jointChange = require('./messageparser').jointChange
var url = process.env.URL;
var exec = require('child_process').exec

// gripper homing
exec('./gripper.bash -h', function (error, stdOut, stdErr) {
  console.log(stdErr)
  console.log(stdOut)
});



//ROSLIB WS CLIENT STUFF
var ros = new ROSLIB.Ros({
    url : url
});

var controllerState = {}


ros.on('connection', function() {
console.log('Connected to roslib websocket server');
});

ros.on('error', function(error) {
console.log('Error connecting to roslib websocket server: ', error);
});

ros.on('close', function() {
console.log('Connection to roslib websocket server closed.');
});


//WS server stuff
const wss = new WebSocketServer.Server({ port: 8080 })
wss.on("connection", ws => {
    console.log("New client connected");
    ws.send("Server: Hi!");
    // sending message
    ws.on("message", data => {
        console.log(`Client has sent us: ${data}`);
        ws.send("Message received from front");
        //TODO - Handle message data here
        var command = JSON.parse(data);

        if(command.type === 'controller'){
          var twist = axisChange(command)
          delta_twist_cmds.publish(twist);
          controllerState = command
        }
        if(command.type === 'joint'){
          var joint = jointChange(command)
          delta_joint_cmds.publish(joint);
          controllerState = command
        }

        if(command.type === 'gripper'){
          
          if(command.gripper === 0){
            exec('./gripper.bash -g 1.00 0.03 100', function (error, stdOut, stdErr) {
              console.log(stdErr)
              console.log(stdOut)
            })
          }
          if(command.gripper === 1){
            exec('./gripper.bash -g 0.00 0.03 100', function (error, stdOut, stdErr) {
              console.log(stdErr)
              console.log(stdOut)
            })
          }
        }
        
    });
    // handling what to do when clients disconnects from server
    ws.on("close", () => {
        console.log("The client has disconnected");
        //TODO - Send stop message to topics
    });
    // handling client connection error
    ws.onerror = function () {
        console.log("Some Error occurred")
        //TODO - Send stop message to topics
    }
});



//ROS TOPIC STUFF

var delta_twist_cmds = new ROSLIB.Topic({
  ros : ros,
  name : '/servo_server/delta_twist_cmds',
  frame_id : 'panda_hand',
  messageType : 'geometry_msgs/msg/TwistStamped'
});

var delta_joint_cmds = new ROSLIB.Topic({
  ros : ros,
  name : '/servo_server/delta_joint_cmds',
  frame_id : 'panda_hand',
  messageType : 'control_msgs/msg/JointJog'
});


var joint_states = new ROSLIB.Topic({
  ros : ros,
  name: '/joint_states',
  throttle_rate : 60000, //Throttling rate high for debug
  messageType : 'sensor_msgs/msg/JointState'
})

var usb_cam = new ROSLIB.Topic({
  ros: ros,
  name: ''
})

joint_states.subscribe(function(message) {
  console.log(`Received message on ${joint_states.name}: ${JSON.stringify(message)}`);
  //TODO - convert message back to JSON and process
}); 
delta_twist_cmds.subscribe(function(message) {
  console.log(`Received message on ${delta_twist_cmds.name}: ${JSON.stringify(message)}`);
  //TODO - convert message back to JSON and process
}); 

joint_states.subscribe();
delta_twist_cmds.subscribe();


//while (true) {
//  var twist = axisChange(controllerState)
//  delta_twist_cmds.publish(twist);
//}