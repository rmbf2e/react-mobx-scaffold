import { TableProps } from 'antd/lib/table'
import {
  FxiosConfig,
  FxiosRequestOption,
  RequestFunction,
} from 'fxios/typings/index'

export { FxiosRequestOption, TableProps }

export type FxiosRequest = (v?: FxiosRequestOption) => Promise<any>

interface IBaseOption {
  name: string
}

export interface ISetterOption extends IBaseOption {
  default: any
  shallow?: boolean
}

export type IModalOption = string[] | IBaseOption[]

export interface IRes {
  data?: any
}

export interface IRecord {
  [key: string]: any
}

type IInterceptorRequest = (
  this: IExtendableObject,
  fxiosOption: FxiosRequestOption,
) => any
type IInterceptorResponse = (this: IExtendableObject, res: any) => any

interface IInterceptor {
  request?: IInterceptorRequest
  response?: IInterceptorResponse
}

interface IRestAction {
  url: string
  request?: RequestFunction
  interceptor?: IInterceptor
}

export type TactionMethod = 'create' | 'update' | 'fetch' | 'destroy'
export type TrequestMethod = 'post' | 'put' | 'delete'

export interface IRestOption extends ISetterOption {
  create?: IRestAction
  update?: IRestAction
  destroy?: IRestAction
  fetch?: IRestAction
  // [key: TactionMethod]: IRestAction
}

export interface IExtendableObject {
  [key: string]: any
}

export interface IListOption extends IBaseOption {
  url: string
  rowKey: string
  rowSelectionKey?: string
  request?: RequestFunction
  interceptor?: {
    request?: (
      url: string,
      requestOption: FxiosRequestOption,
      runtimeOption?: FxiosConfig,
    ) => [string, FxiosRequestOption, FxiosConfig | undefined]
    response?: (data: any) => any
  }
  independent?: boolean
}

export interface IList {
  independent?: boolean
  tableProps: TableProps<object>
  checkedKeys?: string[]
  checkedRecords?: object[]
  hasCheckedKeys?: boolean
  query?: IExtendableObject
}

export interface ILazyOption extends IBaseOption {
  default: any
  lazy: (cb: (d: any) => any) => Promise<any>
}

export interface IOption {
  modal?: IModalOption
  setter?: ISetterOption[]
  list?: IListOption[]
  rest?: IRestOption[]
  lazy?: ILazyOption[]
  [key: string]: any
}
