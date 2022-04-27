var ROSLIB = require('roslib');

const axisChange = (command) => {
    console.log(command)

    if (command.type !== 'controller') {
        return
    }
    var now = Date.now()
    var twist = new ROSLIB.Message({
        header:{
          stamp: {
            sec: Math.ceil(now / 1000) + 1,
            nanosec: 010000000 },
          frame_id: "panda_hand"
        },
        twist: {
          linear : {
          x : command.linearX *0.5,
          y : command.linearY *0.5,
          z : command.linearZ *0.5
        },
        angular : {
          x : command.angularX *0.9,
          y : command.angularY *0.9,
          z : command.angularZ *0.9
        }
        }
        });
    return twist
}

const jointChange = (command) => {
  var now = Date.now()
  var joint = new ROSLIB.Message({
    header: {
      stamp: {
        sec: Math.ceil(now / 1000) + 1,
        nanosec: 010000000} ,
      frame_id: 'panda_link0'
    },
    joint_names: ['panda_joint1'],
    displacements: [],
    velocities: [command.joint0],
      duration: 0.0
  })
  return joint
}




module.exports = {axisChange, jointChange}