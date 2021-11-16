'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const util = require("../util");
const path = require("path");

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to ${chalk.green('create the extension')} generator!`
      )
    );

    const prompts = [
      {
        type: "input",
        name: "id",
        message: "Extension ID",
        default: "my-extension-id",
        validate: util.validateId.bind(this)
      },
      {
        type: "input",
        name: "name",
        message: "Extension name",
        default: "My Extension Name",
        validate: util.validateNotEmpty.bind(this)
      },
      {
        type: "input",
        name: "description",
        message: "Extension description",
        default: "A short description of my extension",
        validate: util.validateNotEmpty.bind(this)
      },
      {
        type: "input",
        name: "publisher",
        message: "Extension publisher ID",
        validate: util.validateNotEmpty.bind(this)
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath("**/*"),
      this.destinationPath(this.props.id),
      this.props,
      undefined,
      { globOptions: { dot: true } }
    );

    this.fs.move(
      this.destinationPath(this.props.id, "_gitignore"),
      this.destinationPath(this.props.id, ".gitignore")
    );
  }

  install() {
    const npmdir = path.join(process.cwd(), this.props.id);
    process.chdir(npmdir);

    this.installDependencies({
      npm: true,
      bower: false,
      yarn: false
    });
  }
};
