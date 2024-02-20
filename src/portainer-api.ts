import { Stack } from './models'
import { Parameters } from './parameters'
import * as core from '@actions/core'
import fs from 'fs'

export default class PortainerApiInstance {
  private readonly _host: string
  private readonly _parameters: Parameters
  private readonly _defaultHeaders: Headers

  constructor(params: Parameters) {
    this._host = params.portainerHost
    this._parameters = params
    this._defaultHeaders = this.getDefaultHeaders()
  }

  async getStackListAsync(): Promise<Stack[]> {
    core.info('Getting existing stack...')
    const requestOptions = {
      method: 'GET',
      headers: this._defaultHeaders,
      redirect: 'follow'
    } as RequestInit

    const response = await fetch(
      `${this._host}/api/stacks?filters={"EndpointID":2}`,
      requestOptions
    )
    const jsonResponse = await response.json()
    if (!response.ok) {
      return Promise.reject(new Error(JSON.stringify(jsonResponse)))
    }
    core.info(`Founded ${jsonResponse.length} stacks`)
    return jsonResponse as Stack[]
  }

  async updateStackFromFile(): Promise<void> {
    const stacks = await this.getStackListAsync()
    const stack = stacks.find(
      s => s.Name === this._parameters.portainerStackName
    )
    if (!stack) {
      return Promise.reject(
        new Error(
          `Stack with name '${this._parameters.portainerStackName}' not found`
        )
      )
    }
    core.info(`Found ${stack.Name} stack`)
    const stackContentFile = this.getStackDefinition()
    const body = {
      prune: true,
      pullImage: true,
      stackFileContent: stackContentFile
    }
    core.info('Updating stack...')
    const requestOptions = {
      method: 'PUT',
      headers: this._defaultHeaders,
      body: JSON.stringify(body),
      redirect: 'follow'
    } as RequestInit

    const response = await fetch(
      `${this._host}/api/stacks/${stack.Id}?endpointId=2`,
      requestOptions
    )
    const jsonResponse = await response.json()
    if (!response.ok)
      return Promise.reject(new Error(JSON.stringify(jsonResponse)))
  }

  getStackDefinition(): string {
    let stackContentFile = fs.readFileSync(
      this._parameters.portainerFilePath,
      'utf8'
    )
    const envVars = this._parameters.portainerEnvVars
      ? JSON.parse(this._parameters.portainerEnvVars)
      : undefined
    for (const [key, value] of Object.entries(envVars || {})) {
      stackContentFile = stackContentFile.replace(
        new RegExp(`\\{\\{${key}}}`, 'g'),
        value as string
      )
    }
    return stackContentFile
  }

  private getDefaultHeaders(): Headers {
    const headers = new Headers()
    headers.append('Accept', '*/*')
    headers.append('X-API-KEY', this._parameters.portainerApiKey)
    return headers
  }
}
