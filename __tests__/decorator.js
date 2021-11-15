'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-azure-devops-extension:decorator', () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, '../generators/decorator'))
      .withPrompts({ someAnswer: true });
  });

  it('creates files', () => {
    assert.file(['dummyfile.txt']);
  });
});
