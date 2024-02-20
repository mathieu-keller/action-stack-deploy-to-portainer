import PortainerApiInstance from '../src/portainer-api'
import { Stack } from '../src/models'
import { Parameters } from '../src/parameters'
describe('PortainerApiInstance', () => {
  const parameters: Parameters = {
    portainerHost: 'mock host',
    portainerApiKey: 'mock api key',
    portainerStackName: 'mock-stack-name',
    portainerFilePath: './__tests__/docker-compose.yml',
    portainerEnvVars: '{"test": "test"}'
  }

  const mockFetch = jest.fn()
  global.fetch = mockFetch

  it('should get stack list', async () => {
    const instance = new PortainerApiInstance(parameters)
    const mockStacks: Stack[] = [
      {
        Id: 1,
        Name: 'Test',
        Type: 2,
        EndpointId: 2,
        SwarmId: '',
        EntryPoint: 'docker-compose.yml',
        Env: [],
        ResourceControl: {
          Id: 2,
          ResourceId: '2_Test',
          SubResourceIds: [],
          Type: 6,
          UserAccesses: [],
          TeamAccesses: [],
          Public: false,
          AdministratorsOnly: true,
          System: false
        },
        Status: 1,
        ProjectPath: '/data/compose/1',
        CreationDate: 1699946498,
        CreatedBy: 'TestUser',
        UpdateDate: 1708101479,
        UpdatedBy: 'TestUser',
        AdditionalFiles: null,
        AutoUpdate: null,
        Option: null,
        GitConfig: null,
        FromAppTemplate: false,
        Namespace: '',
        IsComposeFormat: false
      }
    ]
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => Promise.resolve(mockStacks)
    })

    const stacks = await instance.getStackListAsync()

    expect(stacks).toEqual(mockStacks)
    expect(mockFetch).toHaveBeenCalledWith(
      `${parameters.portainerHost}/api/stacks?filters={"EndpointID":2}`,
      expect.anything()
    )
  })

  it('should throw error if response is not ok', async () => {
    const instance = new PortainerApiInstance(parameters)
    const jsonResponse = {
      message: 'A valid authorisation token is missing',
      details: 'Unauthorized'
    }
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => Promise.resolve(jsonResponse)
    })
    await expect(async () => {
      return await instance.getStackListAsync()
    }).rejects.toStrictEqual(new Error(JSON.stringify(jsonResponse)))

    expect(mockFetch).toHaveBeenCalledWith(
      `${parameters.portainerHost}/api/stacks?filters={"EndpointID":2}`,
      expect.anything()
    )
  })

  it('should put stack update from file', async () => {
    const instance = new PortainerApiInstance(parameters)
    const mockStacks: Stack[] = [
      {
        Id: 42,
        Name: 'mock-stack-name',
        Type: 2,
        EndpointId: 2,
        SwarmId: '',
        EntryPoint: 'docker-compose.yml',
        Env: [],
        ResourceControl: {
          Id: 2,
          ResourceId: '2_Test',
          SubResourceIds: [],
          Type: 6,
          UserAccesses: [],
          TeamAccesses: [],
          Public: false,
          AdministratorsOnly: true,
          System: false
        },
        Status: 1,
        ProjectPath: '/data/compose/1',
        CreationDate: 1699946498,
        CreatedBy: 'TestUser',
        UpdateDate: 1708101479,
        UpdatedBy: 'TestUser',
        AdditionalFiles: null,
        AutoUpdate: null,
        Option: null,
        GitConfig: null,
        FromAppTemplate: false,
        Namespace: '',
        IsComposeFormat: false
      }
    ]
    instance.getStackListAsync = jest.fn().mockResolvedValue(mockStacks)
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => Promise.resolve({})
    })

    await instance.updateStackFromFile()
    expect(mockFetch).toHaveBeenCalledWith(
      `${parameters.portainerHost}/api/stacks/42?endpointId=2`,
      expect.objectContaining({ method: 'PUT' })
    )
  })

  it('should return error if stack update from file fails', async () => {
    const instance = new PortainerApiInstance(parameters)
    const mockStacks: Stack[] = [
      {
        Id: 42,
        Name: 'mock-stack-name',
        Type: 2,
        EndpointId: 2,
        SwarmId: '',
        EntryPoint: 'docker-compose.yml',
        Env: [],
        ResourceControl: {
          Id: 2,
          ResourceId: '2_Test',
          SubResourceIds: [],
          Type: 6,
          UserAccesses: [],
          TeamAccesses: [],
          Public: false,
          AdministratorsOnly: true,
          System: false
        },
        Status: 1,
        ProjectPath: '/data/compose/1',
        CreationDate: 1699946498,
        CreatedBy: 'TestUser',
        UpdateDate: 1708101479,
        UpdatedBy: 'TestUser',
        AdditionalFiles: null,
        AutoUpdate: null,
        Option: null,
        GitConfig: null,
        FromAppTemplate: false,
        Namespace: '',
        IsComposeFormat: false
      }
    ]
    instance.getStackListAsync = jest.fn().mockResolvedValue(mockStacks)
    const jsonResponse = {
      message: 'A valid authorisation token is missing',
      details: 'Unauthorized'
    }
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => Promise.resolve(jsonResponse)
    })
    await expect(async () => {
      return await instance.updateStackFromFile()
    }).rejects.toStrictEqual(new Error(JSON.stringify(jsonResponse)))
    expect(mockFetch).toHaveBeenCalledWith(
      `${parameters.portainerHost}/api/stacks/42?endpointId=2`,
      expect.objectContaining({ method: 'PUT' })
    )
  })

  it('should return error if no stack found with the given name', async () => {
    const instance = new PortainerApiInstance(parameters)
    const mockStacks: Stack[] = [
      {
        Id: 42,
        Name: 'wrong-stack-name',
        Type: 2,
        EndpointId: 2,
        SwarmId: '',
        EntryPoint: 'docker-compose.yml',
        Env: [],
        ResourceControl: {
          Id: 2,
          ResourceId: '2_Test',
          SubResourceIds: [],
          Type: 6,
          UserAccesses: [],
          TeamAccesses: [],
          Public: false,
          AdministratorsOnly: true,
          System: false
        },
        Status: 1,
        ProjectPath: '/data/compose/1',
        CreationDate: 1699946498,
        CreatedBy: 'TestUser',
        UpdateDate: 1708101479,
        UpdatedBy: 'TestUser',
        AdditionalFiles: null,
        AutoUpdate: null,
        Option: null,
        GitConfig: null,
        FromAppTemplate: false,
        Namespace: '',
        IsComposeFormat: false
      }
    ]
    instance.getStackListAsync = jest.fn().mockResolvedValue(mockStacks)

    await expect(async () => {
      return await instance.updateStackFromFile()
    }).rejects.toStrictEqual(
      new Error("Stack with name 'mock-stack-name' not found")
    )
  })

  it('should put stack update from file also if env vars are not defined', async () => {
    const instance = new PortainerApiInstance({
      ...parameters,
      portainerEnvVars: undefined
    })
    const mockStacks: Stack[] = [
      {
        Id: 42,
        Name: 'mock-stack-name',
        Type: 2,
        EndpointId: 2,
        SwarmId: '',
        EntryPoint: 'docker-compose.yml',
        Env: [],
        ResourceControl: {
          Id: 2,
          ResourceId: '2_Test',
          SubResourceIds: [],
          Type: 6,
          UserAccesses: [],
          TeamAccesses: [],
          Public: false,
          AdministratorsOnly: true,
          System: false
        },
        Status: 1,
        ProjectPath: '/data/compose/1',
        CreationDate: 1699946498,
        CreatedBy: 'TestUser',
        UpdateDate: 1708101479,
        UpdatedBy: 'TestUser',
        AdditionalFiles: null,
        AutoUpdate: null,
        Option: null,
        GitConfig: null,
        FromAppTemplate: false,
        Namespace: '',
        IsComposeFormat: false
      }
    ]
    instance.getStackListAsync = jest.fn().mockResolvedValue(mockStacks)
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => Promise.resolve({})
    })

    await instance.updateStackFromFile()
    expect(mockFetch).toHaveBeenCalledWith(
      `${parameters.portainerHost}/api/stacks/42?endpointId=2`,
      expect.objectContaining({ method: 'PUT' })
    )
  })

  it('replace the template values', async () => {
    const instance = new PortainerApiInstance({
      ...parameters,
      portainerEnvVars: JSON.stringify({ version: 'latest' })
    })
    const file = instance.getStackDefinition()
    expect(file).toContain('nginx:latest')
  })
})
