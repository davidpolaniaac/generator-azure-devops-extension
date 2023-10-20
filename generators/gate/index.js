"use strict";

import { validateId, validateName } from "../util.js";

import Generator from "yeoman-generator";
import chalk from "chalk";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import yosay from "yosay";

export default class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(`Welcome to ${chalk.green("create the gate")} generator!`));

    const prompts = [
      {
        type: "input",
        name: "gateid",
        message: "gate ID",
        default: "example-gate-id",
        validate: validateId.bind(this)
      },
      {
        type: "input",
        name: "gatefriendlyname",
        message: "friendly Name",
        default: "Example gate",
        validate: validateName.bind(this)
      },
      {
        type: "input",
        name: "gatedescription",
        message: "gate Description",
        default: "Example gate for greetings",
        validate: validateName.bind(this)
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
    const gatePath = join("gates", this.props.gateid);
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
};
