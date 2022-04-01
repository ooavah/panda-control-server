var ROSLIB = require('roslib');

const axisChange = (command) => {
    console.log(command)

    if (command.type !== 'axisChange') {
        return
    }

    var twist = new ROSLIB.Message({
        header:{
          stamp: {
              // TÄÄ PITÄÄ VAIHTAA SIT NYKYISYYTEEN TAI JOTAIN :D
            sec: 1648818936 + 4000,
            nanosec: 00 },
          frame_id: "panda_hand"
        },
        twist: {
          linear : {
          x : command.id === 'X' ? command.value : 0.0,
          y : command.id === 'Y' ? command.value : 0.0,
          z : command.id === 'Z' ? command.value : 0.0
        },
        angular : {
          x : -0.0,
          y : 0.0,
          z : -0.0
        }
        }
        });
    return twist
}

const Grasp = (command) => {


    var grasp = new ROSLIB.Goal({
        width: command.value, 
        speed: 0.03, 
        force: 50
    })
    return grasp
}



module.exports = { axisChange}