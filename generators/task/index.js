"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const util = require("../util");

module.exports = class extends Generator {
  prompting() {
    this.log(yosay(`Welcome to ${chalk.green("create the task")} generator!`));

    const prompts = [
      {
        type: "input",
        name: "taskid",
        message: "task ID",
        default: "example-task-id",
        validate: util.validateId.bind(this)
      },
      {
        type: "input",
        name: "taskfriendlyname",
        message: "friendly Name",
        default: "Example task",
        validate: util.validateName.bind(this)
      },
      {
        type: "input",
        name: "taskdescription",
        message: "task Description",
        default: "Example tasks for greetings",
        validate: util.validateName.bind(this)
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
    const taskPath = path.join("tasks", this.props.taskid);
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
    const taskContibutionPath = path.join(taskPath, "dist");
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
    const npmdir = path.join(process.cwd(), "tasks", this.props.taskid);
    process.chdir(npmdir);

    this.installDependencies({
      npm: true,
      bower: false,
      yarn: false
    });
  }
};
