"use strict";

import { validateId, validateName } from "../util.js";

import Generator from "yeoman-generator";
import chalk from "chalk";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import yosay from "yosay";

export default class extends Generator {
  prompting() {
    this.log(yosay(`Welcome to ${chalk.green("create the task")} generator!`));

    const prompts = [
      {
        type: "input",
        name: "taskid",
        message: "task ID",
        default: "example-task-id",
        validate: validateId.bind(this)
      },
      {
        type: "input",
        name: "taskfriendlyname",
        message: "friendly Name",
        default: "Example task",
        validate: validateName.bind(this)
      },
      {
        type: "input",
        name: "taskdescription",
        message: "task Description",
        default: "Example tasks for greetings",
        validate: validateName.bind(this)
      },
      {
        type: "input",
        name: "taskauthor",
        message: "task author",
        default: "unknown author"
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  writing() {
    const taskPath = join("tasks", this.props.taskid);
    this.fs.copyTpl(
      this.templatePath("**/*"),
      this.destinationPath(taskPath),
      { ...this.props, uuid: uuidv4() },
      undefined,
      { globOptions: { dot: true } }
    );

    let taskJson = this.fs.readJSON(
      this.destinationPath("vss-extension.json"),
      {}
    );
    const taskContibutionPath = join(taskPath, "dist");
    const file = {
      path: taskContibutionPath
    };
    const contribution = {
      id: this.props.taskid,
      type: "ms.vss-distributed-task.task",
      targets: ["ms.vss-distributed-task.tasks"],
      properties: {
        name: taskContibutionPath
      }
    };

    if (taskJson.files) {
      taskJson.files.push(file);
    } else {
      taskJson.files = [file];
    }

    if (taskJson.contributions) {
      taskJson.contributions.push(contribution);
    } else {
      taskJson.contributions = [contribution];
    }

    this.fs.writeJSON(this.destinationPath("vss-extension.json"), taskJson);
  }

  install() {
    const directory = join(process.cwd(), "tasks", this.props.taskid);
    this.spawnSync("npm", ["install"], { cwd: directory, stdio: "inherit" })
  }
};
