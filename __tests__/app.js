'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-fsa:app', () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .withPrompts({ name: 'NAME_OF_THE_ACTION', folder: 'myactions' });
  });

  it('generates an index file', () => {
    assert.file(`myactions/index.tsx`);
  });

  it('generates an action file', () => {
    assert.file(`myactions/NAME_OF_THE_ACTION.tsx`);
  });

  it('generates a factory statement', () => {
    assert.fileContent(
      `myactions/NAME_OF_THE_ACTION.tsx`,
      /export const NAME_OF_THE_ACTION = Factory/
    );
  });

  it('generates an export statement', () => {
    assert.fileContent('myactions/index.tsx', `export * from './NAME_OF_THE_ACTION';`);
  });
});
