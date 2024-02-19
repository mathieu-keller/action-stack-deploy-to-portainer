import * as core from '@actions/core'
import { run } from '../src/main'
import PortainerApiInstance from '../src/portainer-api'

jest.mock('@actions/core')
jest.mock('../src/portainer-api')

describe('run', () => {
  const mockGetInput = jest.spyOn(core, 'getInput')
  const mockSetFailed = jest.spyOn(core, 'setFailed')
  const mockUpdateStackFromFile = jest.fn()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parameters: any = {
    portainerHost: 'mock host',
    portainerApiKey: 'mock api key',
    portainerStackName: 'mock stack name',
    portainerFilePath: 'mock file path',
    portainerEnvVars: 'mock env vars'
  }

  beforeEach(() => {
    jest.clearAllMocks()

    mockGetInput.mockImplementation(name => parameters[name])
    ;(PortainerApiInstance as jest.Mock).mockImplementation(() => ({
      updateStackFromFile: mockUpdateStackFromFile
    }))
  })

  it('should get parameters, get stack list, delete stack, and post standalone stack', async () => {
    await run()

    expect(mockGetInput).toHaveBeenCalledTimes(5)
    expect(PortainerApiInstance).toHaveBeenCalledWith(parameters)
    expect(mockUpdateStackFromFile).toHaveBeenCalledTimes(1)
  })

  it('should set failed when an error occurs', async () => {
    const error = new Error('mock error')
    mockUpdateStackFromFile.mockRejectedValueOnce(error)

    await run()

    expect(mockSetFailed).toHaveBeenCalledWith(error.message)
  })
})
