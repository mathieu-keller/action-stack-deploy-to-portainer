import { Stack } from './models'
import { Parameters } from './parameters'
import * as core from '@actions/core'
import * as utils from './utils'

export default class PortainerApiInstance {
  private readonly _host: string
  private readonly _envId: string
  private readonly _parameters: Parameters
  private readonly _defaultHeaders: Headers

  constructor(params: Parameters) {
    this._host = params.portainerHost
    this._envId = params.portainerEnvId
    this._parameters = params
    this._defaultHeaders = this.getDefaultHeaders()
  }

  async getStackListAsync(): Promise<Stack[]> {
    const requestOptions = {
      method: 'GET',
      headers: this._defaultHeaders,
      redirect: 'follow'
    } as RequestInit

    const response = await fetch(
      `${this._host}/api/stacks?filters={"EndpointID":2,"IncludeOrphanedStacks":true}`,
      requestOptions
    )
    const jsonResponse = await response.json()
    if (!response.ok) core.setFailed(JSON.stringify(jsonResponse))
    return jsonResponse as Stack[]
  }

  async deleteStackAsync(stackId: number): Promise<void> {
    const requestOptions = {
      method: 'DELETE',
      headers: this._defaultHeaders,
      redirect: 'follow'
    } as RequestInit

    const response = await fetch(
      `${this._host}/api/stacks/${stackId}?endpointId=${this._envId}`,
      requestOptions
    )
    if (!response.ok) core.setFailed(JSON.stringify(response))
  }

  async postStandaloneStackFromFile(): Promise<Stack> {
    const formdata = new FormData()
    formdata.append('Name', this._parameters.portainerStackName)
    formdata.append('Env', this._parameters.portainerEnvVars)
    formdata.append(
      'file',
      utils.getFileBlob(this._parameters.portainerFilePath)
    )

    const requestOptions = {
      method: 'POST',
      headers: this._defaultHeaders,
      body: formdata,
      redirect: 'follow'
    } as RequestInit

    const response = await fetch(
      `${this._host}/api/stacks/create/standalone/file?endpointId=${this._envId}`,
      requestOptions
    )
    const jsonResponse = await response.json()
    if (!response.ok) core.setFailed(JSON.stringify(jsonResponse))
    return jsonResponse as Stack
  }

  private getDefaultHeaders(): Headers {
    const headers = new Headers()
    headers.append('Accept', '*/*')
    headers.append('X-API-KEY', this._parameters.portainerApiKey)
    return headers
  }
}
