// Importing the required modules
//'use strict';

const Gripper = require('./gripper.js')
require('dotenv').config()
// Video_asiat
const cv = require('opencv4nodejs-prebuilt'); 
const path = require('path'); 
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const rclnodejs = require('rclnodejs');
const WebSocketServer = require('ws');



let delta_twist_cmds;
let delta_joint_cmds;
let homingClient;
let graspClient;

const axisChange = require('./messageparser').axisChange

//Video_asioita
const FPS=20;
cv.get
const wCap = new cv.VideoCapture(0);
wCap.set(cv.CAP_PROP_FRAME_WIDTH, 800);
wCap.set(cv.CAP_PROP_FRAME_HEIGHT, 640);

var frame = wCap.read();
setInterval(() => {
  frame = wCap.read(); 
}, 30);


setInterval(() => {
  const image  = cv.imencode('.jpg', frame).toString('base64');
  io.emit('image', image);
}, 1000/FPS);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

//Video_server
server.listen(8081)


rclnodejs.init().then(() => {
    const node = rclnodejs.createNode('Petteri_node');
    const node_gripper = rclnodejs.createNode('Petteri_gripper_node');

    //Global twist publisher
    delta_twist_cmds = node.createPublisher(
      'geometry_msgs/msg/TwistStamped',
      '/servo_server/delta_twist_cmds'
    );
    //Joint twist publisher
    delta_joint_cmds = node.createPublisher(
      'control_msgs/msg/JointJog',
      '/servo_server/delta_joint_cmds'
    );
    //Gripper action client
    homingClient = new Gripper(node_gripper, 'homing')
    
    graspClient = new Gripper(node_gripper, 'grasp')

    //Subscription for Joint twists for debug
    //node.createSubscription('sensor_msgs/msg/Image', '/image_raw', (msg) => {
    //console.log(`Received message: ${typeof msg}`, msg);
    //console.log(cameraData);
    //});
    rclnodejs.spin(node);
    console.log("Publishers and subscriptions created.")
    
  })
  .catch((e) => {
    console.log(e);
  });



//WS server stuff
const wss = new WebSocketServer.Server({ port: 8080 })
wss.on("connection", ws => {
    console.log("New client connected");
    ws.send(JSON.stringify("Server: Hi!"));
    // sending message
    ws.on("message", data => {
        console.log(`Client has sent us: ${data}`);
        ws.send("Message received from front");
        //TODO - Handle message data here
        var command = JSON.parse(data);

        if(command.type === 'controller'){
          var twist = axisChange(command)
          //console.log(twist);
          delta_twist_cmds.publish(twist);
          controllerState = command
        }
        if(command.type === 'joint'){
          var jointCommand = axisChange(command)
          console.log(jointCommand);
          delta_joint_cmds.publish(jointCommand);
          controllerState = command
        }

        if(command.type === 'gripper'){
          
          if(command.gripper === 0){
            graspClient.grasp(0)
            console.log("Gripper close");
          }
          if(command.gripper === 1){
            graspClient.grasp(1)
            console.log("Gripper open");
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
