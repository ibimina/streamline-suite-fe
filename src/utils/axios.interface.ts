export interface IBaseUrl {
  url: string
}

export interface IPost extends IBaseUrl {
  body?: any
}

export type IPatch = IPost

export type IPut = IPost

export interface IGet extends IBaseUrl {
  query?: any
}

export interface IGetWithQuery extends IBaseUrl {
  query?: Record<string, any>
}
