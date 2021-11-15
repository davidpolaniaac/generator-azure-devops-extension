'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
module.exports = class extends Generator {
  prompting() {
    this.log(
      yosay(
        `Welcome to ${chalk.green('create the task')} generator!`
      )
    );

    const prompts = [
      {
        type: "input",
        name: "taskid",
        message: "task ID",
        default: "example-task-id",
        validate: this.validateId.bind(this)
      },
      {
        type: "input",
        name: "taskfriendlyname",
        message: "friendly Name",
        default: "Example task",
        validate: this.validateName.bind(this)
      },
      {
        type: "input",
        name: "taskdescription",
        message: "task Description",
        default: "Example tasks for greetings",
        validate: this.validateName.bind(this)
      },
      {
        type: "input",
        name: "taskauthor",
        message: "taskauthor",
        default: "unknown author",
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

    let taskJson = this.fs.readJSON(this.destinationPath('vss-extension.json'), {});
    const file = {
      path: taskPath
    };
    const contribution = {
      id: this.props.taskid,
      type: "ms.vss-distributed-task.task",
      targets: [
        "ms.vss-distributed-task.tasks"
      ],
      properties: {
        name: taskPath
      }
    }

    if (taskJson.files) {
      taskJson.files.push(file);
    } else {
      taskJson.files = [file]
    }

    if (taskJson.contributions) {
      taskJson.contributions.push(contribution);
    } else {
      taskJson.contributions = [contribution]
    }

    this.fs.writeJSON(this.destinationPath('vss-extension.json'), taskJson);
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

  validateId(input) {
    const notEmpty = this.validateNotEmpty(input);
    const pattern = /^[a-z]+(?:-[a-z]+)*$/;
    if (typeof notEmpty === "string") {
      return notEmpty;
    }

    return (input && input.indexOf(" ") < 0 && pattern.test(input)) || "No spaces allowed, only [a-z]+(?:-[a-z]+)*$";
  }

  validateName(input) {
    const notEmpty = this.validateNotEmpty(input);
    const pattern = /^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/;

    if (typeof notEmpty === "string") {
      return notEmpty;
    }

    return (input && pattern.test(input)) || "No spaces allowed, only /^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$";
  }

  validateNotEmpty(input) {
    return (input && !!input.trim()) || "Cannot be left empty";
  }
};
