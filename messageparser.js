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
          x : command.linearX,
          y : command.linearY,
          z : command.linearZ
        },
        angular : {
          x : command.angularX,
          y : command.angularY,
          z : command.angularZ
        }
        }
        });
    return twist
}




module.exports = { axisChange}