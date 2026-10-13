/**
 * API client — EventHub Java backend'ine tüm istekler axiosInstance
 * üzerinden geçer (bkz. axiosInstance.ts). Yanıtlar backend'in
 * Result<T> / DataResult<T> zarfına ve GlobalExceptionHandler'ın ürettiği
 * hata biçimlerine göre burada normalize edilir.
 */
import { isAxiosError } from 'axios'
import { toast } from 'react-hot-toast'
import { axiosInstance } from './axiosInstance'

export class ApiError extends Error {
  status: number
  code?: number
  errors?: string[]
  constructor(status: number, message: string, code?: number, errors?: string[]) {
    super(message)
    this.status = status
    this.code = code
    this.errors = errors
  }
}

export interface PageInfo {
  currentPage: number
  totalPages: number
  totalElements: number
  hasNext: boolean
}

export interface PagedResult<T> {
  data: T[]
  pageInfo: PageInfo
}

// Backend Result<T> / DataResult<T> zarfı: { success, code, message?, errors?, data?, pageInfo? }
interface BackendResult<T = unknown> {
  success: boolean
  code: number
  message?: string
  errors?: string[]
  data?: T
  pageInfo?: PageInfo
}

function isBackendResult(value: unknown): value is BackendResult {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as BackendResult).success === 'boolean' &&
    typeof (value as BackendResult).code === 'number'
  )
}

function resultErrorMessage(result: BackendResult): string {
  return result.message || result.errors?.join(', ') || 'İşlem başarısız.'
}

function failWith(status: number, message: string, code?: number, errors?: string[]): never {
  toast.error(message)
  throw new ApiError(status, message, code, errors)
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  try {
    const res = await axiosInstance.request<T | BackendResult<T>>({ method, url: path, data: body })
    const payload = res.data

    // Bazı hatalar (ör. validasyon) HTTP 200 ile success:false döner.
    if (isBackendResult(payload)) {
      if (!payload.success) {
        failWith(res.status, resultErrorMessage(payload), payload.code, payload.errors)
      }
      // Sayfalı yanıtlarda (data + pageInfo) zarfın tamamı korunur.
      if (payload.pageInfo) {
        return { data: payload.data ?? [], pageInfo: payload.pageInfo } as T
      }
      // Backend boş liste/null data'yı @JsonInclude(NON_NULL) yüzünden "data" alanını
      // hiç göndermeden atabiliyor — anahtarın varlığına bakılmalı, sadece undefined
      // kontrolü null/omitted data'yı zarfın tamamıymış gibi döndürebilir.
      return ('data' in payload ? payload.data : payload) as T
    }

    return payload as T
  } catch (err) {
    if (err instanceof ApiError) throw err
    if (isAxiosError(err)) {
      const status = err.response?.status ?? 0
      const data = err.response?.data

      if (isBackendResult(data)) {
        failWith(status, resultErrorMessage(data), data.code, data.errors)
      }
      if (typeof data === 'string' && data.trim()) {
        failWith(status, data)
      }
      failWith(status, err.message)
    }
    throw err
  }
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body ?? {}),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body ?? {}),
  delete: <T>(path: string) => request<T>('DELETE', path),
}
