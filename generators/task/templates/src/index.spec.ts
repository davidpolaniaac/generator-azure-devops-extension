import * as tl from 'azure-pipelines-task-lib/task';

import { run } from './index';

jest.mock('azure-pipelines-task-lib/task');

describe('run method validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('when a string is entered then it is displayed in console', async () => {
    //Arrange
    const getInputMock = jest.spyOn(tl, 'getInput').mockReturnValue('world');
    //Act
    await run();
    //Assert
    expect(getInputMock).toHaveBeenCalled();
  });

  test('when the method fails then the task fails', async () => {
    //Arrange

    const getInputMock = jest.spyOn(tl, 'getInput').mockImplementation(() => {
      throw new Error('exception');
    });
    const setResultMock = jest.spyOn(tl, 'setResult').mockImplementation();
    //Act
    await run();
    //Assert
    expect(getInputMock).toHaveBeenCalled();
    expect(setResultMock).toHaveBeenCalled();
  });
});
