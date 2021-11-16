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
      yosay(`Welcome to ${chalk.green("create the website")} generator!`)
    );

    const prompts = [
      {
        type: "input",
        name: "websiteid",
        message: "website ID",
        default: "example-website-id",
        validate: util.validateId.bind(this)
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    const webPath = "websites";
    let destination = path.join(webPath, 'src/Common.scss');
    if (!this.fs.exists(this.destinationPath(destination))) {
      this.fs.copyTpl(
        this.templatePath('src/Common.scss'),
        this.destinationPath(destination),
      );
    }
    destination = path.join(webPath, 'src/Common.tsx');
    if (!this.fs.exists(this.destinationPath(destination))) {
      this.fs.copyTpl(
        this.templatePath('src/Common.tsx'),
        this.destinationPath(destination),
      );
    }
    destination = path.join(webPath, 'jest.config.js');
    if (!this.fs.exists(this.destinationPath(destination))) {
      this.fs.copyTpl(
        this.templatePath('jest.config.js'),
        this.destinationPath(destination),
      );
    }
    destination = path.join(webPath, 'package.json');
    if (!this.fs.exists(this.destinationPath(destination))) {
      this.fs.copyTpl(
        this.templatePath('package.json'),
        this.destinationPath(destination),
      );
    }
    destination = path.join(webPath, 'tsconfig.json');
    if (!this.fs.exists(this.destinationPath(destination))) {
      this.fs.copyTpl(
        this.templatePath('tsconfig.json'),
        this.destinationPath(destination),
      );
    }
    destination = path.join(webPath, 'tsconfig.test.json');
    if (!this.fs.exists(this.destinationPath(destination))) {
      this.fs.copyTpl(
        this.templatePath('tsconfig.test.json'),
        this.destinationPath(destination),
      );
    }
    destination = path.join(webPath, 'webpack.config.js');
    if (!this.fs.exists(this.destinationPath(destination))) {
      this.fs.copyTpl(
        this.templatePath('webpack.config.js'),
        this.destinationPath(destination),
      );
    }

    destination = path.join(webPath, `src/${this.props.websiteid}`, `${this.props.websiteid}.html`);
    if (!this.fs.exists(this.destinationPath(destination))) {
      this.fs.copyTpl(
        this.templatePath('src/Sample/Sample.html'),
        this.destinationPath(destination),
      );
    }

    destination = path.join(webPath, `src/${this.props.websiteid}`, `${this.props.websiteid}.scss`);
    if (!this.fs.exists(this.destinationPath(destination))) {
      this.fs.copyTpl(
        this.templatePath('src/Sample/Sample.scss'),
        this.destinationPath(destination),
      );
    }

    destination = path.join(webPath, `src/${this.props.websiteid}`, `${this.props.websiteid}.tsx`);
    if (!this.fs.exists(this.destinationPath(destination))) {
      this.fs.copyTpl(
        this.templatePath('src/Sample/Sample.tsx'),
        this.destinationPath(destination),
      );
    }

    let webJson = this.fs.readJSON(
      this.destinationPath("vss-extension.json"),
      {}
    );
    const pathContibution = path.join(webPath, 'dist')
    const file = {
        path: pathContibution,
        addressable: true
    };

    if (webJson.files && !webJson.files.some(x => x.path === pathContibution)) {
      webJson.files.push(file);
    } else {
      webJson.files = [file];
    }

    const pathContibutionHtml = path.join(pathContibution, `${this.props.websiteid}`, `${this.props.websiteid}.html`);
    const contribution =  {
      id: this.props.websiteid,
      type: "ms.vss-web.hub",
      targets: [
          "ms.vss-code-web.code-hub-group"
      ],
      properties: {
          name: "My Hub",
          uri: pathContibutionHtml
      }
  };

    if (webJson.contributions) {
      webJson.contributions.push(contribution);
    } else {
      webJson.contributions = [contribution];
    }

    this.fs.writeJSON(this.destinationPath("vss-extension.json"), webJson);

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
};
