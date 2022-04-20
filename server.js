// Importing the required modules
//'use strict';
require('dotenv').config()

const rclnodejs = require('rclnodejs');
const WebSocketServer = require('ws');

let delta_twist_cmds;

const axisChange = require('./messageparser').axisChange


rclnodejs.init().then(() => {
    const node = rclnodejs.createNode('Oskarin_node');
    delta_twist_cmds = node.createPublisher(
      'geometry_msgs/msg/Twist',
      '/turtle1/cmd_vel'
    );
    rclnodejs.spin(node);
    console.log("Publisher created.")
    /*
    let count = 0;
     setInterval(function () {
      delta_twist_cmds.publish({linear: {x: 2.0, y: 0.0, z: 0.0}, angular: {x: 0.0, y: 0.0, z: 1.8}});
      console.log(`Publish ${++count} messages.`);
    }, 1000); */

    
  })
  .catch((e) => {
    console.log(e);
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
          console.log(twist);
          delta_twist_cmds.publish(twist);
          controllerState = command
        }

        if(command.type === 'gripper'){
          
          if(command.gripper === 0){
          }
          if(command.gripper === 1){
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



