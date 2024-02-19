export type PageRequest = {
  pageNumber: number,
  amount: number,
  search?: string | null,
  date?: Date,
  entityUuid?: string,
}

export type PageResponse<T> = {
  rows: T[],
  count: number
}

export type PagesMeta = {
  nextPage: number | null,
  prevPage: number | null,
  leftCount: number
}