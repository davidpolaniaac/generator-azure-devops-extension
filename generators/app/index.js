'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to ${chalk.red('create the extension')}!`
      )
    );

    const prompts = [
      {
        type: "input",
        name: "id",
        message: "Extension ID",
        default: "my-extension-id",
        validate: this.validateId.bind(this)
      },
      {
        type: "input",
        name: "name",
        message: "Extension name",
        default: "My Extension Name",
        validate: this.validateNotEmpty.bind(this)
      },
      {
        type: "input",
        name: "description",
        message: "Extension description",
        default: "A short description of my extension",
        validate: this.validateNotEmpty.bind(this)
      },
      {
        type: "input",
        name: "publisher",
        message: "Extension publisher ID",
        validate: this.validateNotEmpty.bind(this)
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
    //this.installDependencies();
  }

  validateId(input) {
    const notEmpty = this.validateNotEmpty(input);

    if (typeof notEmpty === "string") {
      return notEmpty;
    }

    return (input && input.indexOf(" ") < 0) || "No spaces allowed";
  }

  validateNotEmpty(input) {
    return (input && !!input.trim()) || "Cannot be left empty";
  }
};
