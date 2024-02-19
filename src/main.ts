import * as core from '@actions/core'
import PortainerApiInstance from './portainer-api'
import { getParameters } from './parameters'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    await new PortainerApiInstance(getParameters()).updateStackFromFile()
    core.info('Done!')
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
