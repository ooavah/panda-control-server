// Importing the required modules
require('dotenv').config()
var ROSLIB = require('roslib');
const WebSocketServer = require('ws');
var url = process.env.URL;

const axisChange = require('./messageparser').axisChange

//WS CLIENT STUFF
var ros = new ROSLIB.Ros({
    // petteri ip ja portti 9090
    url : url
});


ros.on('connection', function() {
console.log('Connected to websocket server');
});

ros.on('error', function(error) {
console.log('Error connecting to websocket server: ', error);
});

ros.on('close', function() {
console.log('Connection to websocket server closed.');
});


//Server stuff
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

        if(command.type === 'axisChange'){
          var twist = axisChange(command)
          delta_twist_cmds.publish(twist);
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

var joint_states = new ROSLIB.Topic({
  ros : ros,
  name: '/joint_states',
  throttle_rate : 60000, //Throttling rate high for debug
  messageType : 'sensor_msgs/msg/JointState'
})

/* var grasp_server = new ROSLIB.ActionClient({
  ros : ros,
  serverName: '/panda_gripper/homing/_action',
  actionName: '/panda_gripper/homing',
})

var grasp = new ROSLIB.Goal({
  actionClient: grasp_server,
  goalMessage: {}
})
grasp.on('feedback', function(feedback) {
  console.log('Feedback: ' + feedback.sequence);
});
grasp.send()
  // Then we add a callback to be called every time a message is published on this topic. */

joint_states.subscribe(function(message) {
  console.log(`Received message on ${joint_states.name}: ${JSON.stringify(message)}`);
  //TODO - convert message back to JSON and process
}); 
delta_twist_cmds.subscribe(function(message) {
  console.log(`Received message on ${delta_twist_cmds.name}: ${JSON.stringify(message)}`);
  //TODO - convert message back to JSON and process
}); 
/* var now = Date.now();
console.log(now)
var twist = new ROSLIB.Message({
header:{
  stamp: {
    sec: 1648813102 + 1000 ,
    nanosec: 00 },
  frame_id: "panda_hand"
},
twist: {
  linear : {
  x : 0.0,
  y : -0.0,
  z : 0.0
},
angular : {
  x : -0.0,
  y : 0.0,
  z : -0.0
}
}
}); */

joint_states.subscribe();
delta_twist_cmds.subscribe();

//delta_twist_cmds.publish(twist);