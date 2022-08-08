export interface Paginated<T = any> {
  total: number
  totalPage: number
  perPage: number
  currentPage: number
  items: T[]
}
