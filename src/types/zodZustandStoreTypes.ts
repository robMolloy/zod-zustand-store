import { z, ZodArray, ZodTypeAny } from 'zod'
import { StoreApi, UseBoundStore } from 'zustand'
import Fuse from 'fuse.js'

export type TZodPlural<TSchema extends ZodTypeAny> = ZodArray<TSchema, 'many'>

export type TZodZustandStoreData<TSchema extends ZodTypeAny> =
  | z.infer<TZodPlural<TSchema>>
  | null
  | undefined

export type TSafeParseReturnTypeFromSchema<TSchema extends ZodTypeAny> =
  ReturnType<TSchema['safeParse']>

export type TZodZustandAPIStore<TSchema extends ZodTypeAny> = {
  data: TZodZustandStoreData<TSchema>
  itemSchema: TSchema
  itemsSchema: TZodPlural<TSchema>
  error: null
  loading: undefined
  empty: []
  useParser: (
    payload: unknown,
  ) => TSafeParseReturnTypeFromSchema<TZodPlural<TSchema>>
  setData: (payload: TZodZustandStoreData<TSchema>) => void
  handleSetData: (payload: unknown) => void
  safeSetData: (payload: unknown) => void
  fetchData: (...params: unknown[]) => Promise<unknown>
  fetchAndSetData: (...params: unknown[]) => void
  isError: () => boolean
  isLoading: () => boolean
  isEmpty: () => boolean
  getSafeParsed: () => TSafeParseReturnTypeFromSchema<TZodPlural<TSchema>>
  isValid: () => boolean
  isInvalid: () => boolean
  getValidData: () => z.infer<TZodPlural<TSchema>>
  search: (
    needle: string,
    keys: Fuse.FuseOptionKey<TSchema['_output']>[],
  ) => z.infer<TZodPlural<TSchema>>
}

export type TCreateZodZustandAPIStoreReturn<TSchema extends ZodTypeAny> =
  UseBoundStore<StoreApi<TZodZustandAPIStore<TSchema>>>
