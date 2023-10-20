'use strict';

import { validateId, validateNotEmpty } from "../util.js";

import Generator from 'yeoman-generator';
import chalk from 'chalk';
import { join } from "path";
import yosay from 'yosay';

export default class extends Generator {
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
        validate: validateId.bind(this)
      },
      {
        type: "input",
        name: "name",
        message: "Extension name",
        default: "My Extension Name",
        validate: validateNotEmpty.bind(this)
      },
      {
        type: "input",
        name: "description",
        message: "Extension description",
        default: "A short description of my extension",
        validate: validateNotEmpty.bind(this)
      },
      {
        type: "input",
        name: "publisher",
        message: "Extension publisher ID",
        validate: validateNotEmpty.bind(this)
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
    const directory = join(process.cwd(), this.props.id);
    this.spawnSync("npm", ["install"], { cwd: directory, stdio: "inherit" })
  }

  end() {
    this.log(
      yosay(
        `The extension has been created. Please navigate to the directory\n${chalk.green("cd " + this.props.id)}`
      )
    );
  }
};
