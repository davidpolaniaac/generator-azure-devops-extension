import * as tl from 'azure-pipelines-task-lib/task';

export async function run(): Promise<void> {
  try {
    const inputString: string | undefined = tl.getInput('samplestring', true);
    console.log(`Hello ${inputString}`);
  } catch (error: any) {
    tl.setResult(tl.TaskResult.Failed, error.message);
  }
}

run();
