
const axisChange = (command) => {

    if (command.type === 'controller') {
    var now = Date.now()
    var twist = ({
      header:{
          stamp: {
            sec: Math.ceil(now / 1000) + 1,
            nanosec: 010000000 },
          frame_id: "panda_hand"
        },
        twist: {
          linear : {
          x : command.linearX *0.6,
          y : command.linearY *0.6,
          z : command.linearZ *0.6
        },
        angular : {
          x : command.angularX,
          y : command.angularY,
          z : command.angularZ
        }
        }});
    return twist
}
    else if (command.type === 'joint') {
    var now = Date.now()
    var joint = ({
      header:{
          stamp: {
            sec: Math.ceil(now / 1000) + 1,
            nanosec: 010000000 },
          frame_id: "panda_link0"
          },
          joint_names: [command.name],
          velocities: [command.value],
          duration: 0
        });
    return joint

        }}


module.exports = { axisChange}