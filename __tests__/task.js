'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-azure-devops-extension:task', () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, '../generators/task'))
      .withPrompts({ someAnswer: true });
  });

  it('creates files', () => {
    assert.file(['dummyfile.txt']);
  });
});
