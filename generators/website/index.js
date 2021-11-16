"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to ${chalk.green("create the website")} generator!`)
    );

    const prompts = [
      {
        type: "input",
        name: "websiteid",
        message: "website ID",
        default: "example-website-id",
        validate: this.validateId.bind(this)
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    const websitePath = path.join("websites");
    this.fs.copyTpl(
      this.templatePath("**/*"),
      this.destinationPath(websitePath)
    );
  }

  install() {
    const npmdir = path.join(process.cwd(), "websites");
    process.chdir(npmdir);

    this.installDependencies({
      npm: true,
      bower: false,
      yarn: false
    });
  }

  validateNotEmpty(input) {
    return (input && Boolean(input.trim())) || "Cannot be left empty";
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
};
