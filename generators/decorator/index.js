"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");
const util = require("../util");

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to ${chalk.green("create the decorator")} generator!`)
    );

    const prompts = [
      {
        type: "input",
        name: "decoratorid",
        message: "decorator ID",
        default: "example-decorator",
        validate: util.validateId.bind(this)
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    const decoratorPath = path.join(
      "decorators",
      `${this.props.decoratorid}.yml`
    );

    this.fs.copy(
      this.templatePath("decorator.yml"),
      this.destinationPath(decoratorPath)
    );

    let decoratorJson = this.fs.readJSON(
      this.destinationPath("vss-extension.json"),
      {}
    );
    const file = {
      path: decoratorPath,
      addressable: true,
      contentType: "text/plain"
    };
    const contribution = {
      id: this.props.decoratorid,
      type: "ms.azure-pipelines.pipeline-decorator",
      targets: ["ms.azure-pipelines-agent-job.post-job-tasks"],
      properties: {
        template: decoratorPath
      }
    };

    if (decoratorJson.files) {
      decoratorJson.files.push(file);
    } else {
      decoratorJson.files = [file];
    }

    if (decoratorJson.contributions) {
      decoratorJson.contributions.push(contribution);
    } else {
      decoratorJson.contributions = [contribution];
    }

    this.fs.writeJSON(
      this.destinationPath("vss-extension.json"),
      decoratorJson
    );
  }
};
