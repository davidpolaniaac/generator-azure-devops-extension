"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(`Welcome to ${chalk.green("create the gate")} generator!`));

    const prompts = [
      {
        type: "input",
        name: "gateid",
        message: "gate ID",
        default: "example-gate-id",
        validate: this.validateId.bind(this)
      },
      {
        type: "input",
        name: "gatefriendlyname",
        message: "friendly Name",
        default: "Example gate",
        validate: this.validateName.bind(this)
      },
      {
        type: "input",
        name: "gatedescription",
        message: "gate Description",
        default: "Example gate for greetings",
        validate: this.validateName.bind(this)
      },
      {
        type: "input",
        name: "gateauthor",
        message: "gate author",
        default: "unknown author"
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    const gatePath = path.join("gates", this.props.gateid);
    this.fs.copyTpl(
      this.templatePath("**/*"),
      this.destinationPath(gatePath),
      { ...this.props, uuid: uuidv4() },
      undefined,
      { globOptions: { dot: true } }
    );

    let gateJson = this.fs.readJSON(
      this.destinationPath("vss-extension.json"),
      {}
    );
    const file = {
      path: gatePath
    };
    const contribution = {
      id: this.props.gateid,
      type: "ms.vss-distributed-task.task",
      targets: ["ms.vss-distributed-task.tasks"],
      properties: {
        name: gatePath
      }
    };

    if (gateJson.files) {
      gateJson.files.push(file);
    } else {
      gateJson.files = [file];
    }

    if (gateJson.contributions) {
      gateJson.contributions.push(contribution);
    } else {
      gateJson.contributions = [contribution];
    }

    this.fs.writeJSON(this.destinationPath("vss-extension.json"), gateJson);
  }

  validateId(input) {
    const notEmpty = this.validateNotEmpty(input);
    const pattern = /^[a-z]+(?:-[a-z]+)*$/;
    if (typeof notEmpty === "string") {
      return notEmpty;
    }

    return (
      (input && input.indexOf(" ") < 0 && pattern.test(input)) ||
      "No spaces allowed, only [a-z]+(?:-[a-z]+)*$"
    );
  }

  validateName(input) {
    const notEmpty = this.validateNotEmpty(input);
    const pattern = /^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/;

    if (typeof notEmpty === "string") {
      return notEmpty;
    }

    return (
      (input && pattern.test(input)) ||
      "No spaces allowed, only /^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$"
    );
  }

  validateNotEmpty(input) {
    return (input && Boolean(input.trim())) || "Cannot be left empty";
  }
};
