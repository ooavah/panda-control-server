
const axisChange = (command) => {
    console.log(command)

    if (command.type !== 'controller') {
        return
    }
    var twist = ({
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
        });
    return twist
}




module.exports = { axisChange}