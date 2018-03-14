'use strict';
const Generator = require('yeoman-generator');
const path = require('path');
const chalk = require('chalk');
const yosay = require('yosay');
const { snakeCase } = require('lodash');

const macroCase = text => snakeCase(text).toUpperCase();

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.dependencies = ['@zaibot/fsa'];
  }

  async prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the astonishing ${chalk.red('generator-fsa')} generator!`)
    );

    const prompts = [
      {
        name: 'name',
        message: 'Action Name',
        filter: macroCase
      },
      {
        name: 'folder',
        message: 'Actions Folder',
        default: './src/actions'
      }
    ];

    this.props = await this.prompt(prompts);
  }

  _pathIndex() {
    return this.destinationPath(path.join(this.props.folder, `index.tsx`));
  }
  async _readIndex() {
    if (await this.fs.exists(this._pathIndex())) {
      return this.fs.read(this._pathIndex());
    }
  }
  async _writeIndex(text) {
    return this.fs.write(this._pathIndex(), text);
  }
  async _appendIndex(text) {
    if (await this.fs.exists(this._pathIndex())) {
      return this.fs.append(this._pathIndex(), text);
    }
    return this.fs.write(this._pathIndex(), text);
  }

  async writing() {
    // Await mkdir(this.props.folder);
    const templateExport = name => `export * from './${name}';`;
    const templateExportRegex = name =>
      new RegExp(`\\bexport \\* from ['"]\\.\\/${name}['"];`);

    const name = this.props.name;
    const tsxIndex = (await this._readIndex()) || '';
    const containExport = tsxIndex.match(templateExportRegex(name));
    if (containExport) {
      // Identical
      await this._writeIndex(tsxIndex);
    } else {
      // Append export
      await this._appendIndex(templateExport(name));
    }

    await this.fs.copyTpl(
      this.templatePath(`Action.tsx`),
      this.destinationPath(path.join(this.props.folder, `${this.props.name}.tsx`)),
      { name }
    );
  }

  async install() {
    await this.npmInstall(this.dependencies);
  }
};
