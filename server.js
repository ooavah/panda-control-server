// Importing the required modules
//'use strict';
require('dotenv').config()

const rclnodejs = require('rclnodejs');
const WebSocketServer = require('ws');

let delta_twist_cmds;
let delta_joint_cmds;
let gripper_cmds;

const axisChange = require('./messageparser').axisChange


rclnodejs.init().then(() => {
    const node = rclnodejs.createNode('Petteri_node');
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
    gripper_cmds = new rclnodejs.ActionClient(node,'/turltesim/action/RotateAbsolute','/turtle1/rotate_asolute');
    //gripper_cmds.sendGoal('{theta: 1.57}')

    //Subscription for Joint twists for debug
    node.createSubscription('control_msgs/msg/JointJog', '/servo_server/delta_joint_cmds', (msg) => {
    console.log(`Received message: ${typeof msg}`, msg);
    });
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
    ws.send("Server: Hi!");
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



