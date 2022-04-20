#!/bin/bash
# This is a comment!
source ~/franka_ros2_ws/install/setup.bash
echo $@

#if vipu on -h, then
if [[ $1 == "-h" ]]
then
    ros2 action send_goal /panda_gripper/homing franka_msgs/action/Homing {}
fi

#if vipu on -g ja sillä on parametrit <width> <speed> <force>, then
if [[ $1 == "-g" ]] && [[ "$#" == 4 ]]
then
    ros2 action send_goal -f /panda_gripper/grasp franka_msgs/action/Grasp "{width: $2, speed: $3, force: $4, epsilon: {inner: 1, outer: 1}}"
fi
