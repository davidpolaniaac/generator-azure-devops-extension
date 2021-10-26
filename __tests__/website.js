'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-azure-devops-extension:website', () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, '../generators/website'))
      .withPrompts({ someAnswer: true });
  });

  it('creates files', () => {
    assert.file(['dummyfile.txt']);
  });
});
