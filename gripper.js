// Copyright (c) 2018 Intel Corporation. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const rclnodejs = require('rclnodejs');
const Homing = rclnodejs.require('franka_msgs/action/Homing');
const Grasp = rclnodejs.require('franka_msgs/action/Grasp');
const GoalStatus = rclnodejs.require('action_msgs/msg/GoalStatus');

class Gripper {
  constructor(node, type) {
    this._node = node;

    if(type === 'homing'){
      this._actionClient = new rclnodejs.ActionClient(
        node,
        'franka_msgs/action/Homing',
        '/panda_gripper/homing'
      );
      this.homing()
      console.log('Action client created')
    }
    if(type === 'grasp'){
      this._actionClient = new rclnodejs.ActionClient(
        node,
        'franka_msgs/action/Grasp',
        '/panda_gripper/grasp'
      );
      console.log('Action client created')
    }
  }

  async homing() {
    const goal = new Homing.Goal();
    this.sendGoal(goal)
  }

  async grasp(width){
    const goal = new Grasp.Goal();
    goal.width = width
    goal.speed = 0.03
    goal.force = 50
    goal.epsilon.inner = 1
    goal.epsilon.outer = 1

    this.sendGoal(goal)
  }

  async sendGoal(goal) {
    this._node.getLogger().info('Waiting for action server...');
    await this._actionClient.waitForServer();
    this._node.getLogger().info('Sending goal request...');
    const goalHandle = await this._actionClient.sendGoal(goal, (feedback) =>
      this.feedbackCallback(feedback)
    );
    if (!goalHandle.isAccepted()) {
      this._node.getLogger().info('Goal rejected');
      return;
    }
    this._node.getLogger().info('Goal accepted');
    const result = await goalHandle.getResult();
    if (goalHandle.isSucceeded()) {
      this._node
        .getLogger()
        .info(`Goal suceeded with result: ${result.sequence}`);
    } else {
      this._node.getLogger().info(`Goal failed with status: ${status}`);
    }
    rclnodejs.shutdown();
  }
  feedbackCallback(feedback) {
    this._node.getLogger().info(`Received feedback: ${feedback.sequence}`);
  }
}

module.exports = Gripper