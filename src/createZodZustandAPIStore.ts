import Fuse from 'fuse.js'
import { z, ZodTypeAny } from 'zod'
import create from 'zustand'
import { TZodZustandAPIStore, TCreateZodZustandAPIStoreReturn } from './types'
import lodash from 'lodash'

export const createZodZustandAPIStore = <TItemSchema extends ZodTypeAny>(
  itemSchema: TItemSchema,
  fetchDataFn: (...params: unknown[]) => Promise<unknown>,
): TCreateZodZustandAPIStoreReturn<TItemSchema> => {
  const itemsSchema = z.array(itemSchema)
  type TItem = z.infer<TItemSchema>
  type TItems = TItem[]

  return create<TZodZustandAPIStore<TItemSchema>>((set, get) => ({
    data: undefined,
    error: null,
    loading: undefined,
    empty: [],
    itemSchema: itemSchema,
    itemsSchema: itemsSchema,
    useParser: (payload) => get().itemsSchema.safeParse(payload),
    setData: (payload) => set({ data: payload }),
    handleSetData: (payload) => {
      const parsed = get().useParser(payload)
      get().setData(parsed.success ? (payload as TItems) : get().error)
    },
    safeSetData: (payload) => {
      const parsed = get().useParser(payload)
      get().setData(parsed.success ? (payload as TItems) : get().empty)
    },
    fetchData: fetchDataFn,
    fetchAndSetData: async (...params) => {
      const data = await get().fetchData(...params)
      get().handleSetData(data)
    },
    isError: () => get().data === get().error,
    isLoading: () => get().data === get().loading,
    isEmpty: () => lodash.isEqual(get().data, get().empty),
    getSafeParsed: () => get().itemsSchema.safeParse(get().data),
    isValid: () => get().getSafeParsed().success,
    isInvalid: () => !get().isValid,
    getValidData: () => {
      const parsed = get().getSafeParsed()
      return parsed.success ? parsed.data : get().empty
    },
    search: (needle, keys) => {
      const searcher = new Fuse(get().getValidData(), { keys })
      const result = searcher.search(needle) as TItems
      return result.map(({ item }) => item)
    },
  }))
}
