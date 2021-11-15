'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-azure-devops-extension:gate', () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, '../generators/gate'))
      .withPrompts({ someAnswer: true });
  });

  it('creates files', () => {
    assert.file(['dummyfile.txt']);
  });
});
