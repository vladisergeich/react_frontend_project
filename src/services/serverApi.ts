import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {ArticleType} from "../types/articleType";

const serverPort = process.env.REACT_APP_SERVER_PORT
const baseUrl = `//localhost:${serverPort}/api`

type ArticlesResponse = ArticleType[]

// Define a service using a base URL and expected endpoints
export const serverApi = createApi({
    reducerPath: 'serverApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl
    }),
    tagTypes: ['Articles'],
    endpoints: (builder) => ({
        getArticles: builder.query<ArticlesResponse, void>({
            query: () => '/articles',
            // Provides a list of `Articles` by `id`.
            // If any mutation is executed that `invalidate`s any of these tags, this query will re-run to be always up-to-date.
            // The `LIST` id is a "virtual id" we just made up to be able to invalidate this query specifically if a new `Articles` element was added.
            providesTags: (result) =>
                // is result available?
                result
                    ? // successful query
                    [
                        ...result.map(({ id }) => ({ type: 'Articles', id } as const)),
                        { type: 'Articles', id: 'LIST' },
                    ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Articles', id: 'LIST' }` is invalidated
                    [{ type: 'Articles', id: 'LIST' }],
        }),
        getArticle: builder.query<ArticleType, string>({
            query: (id) => `/articles/${id}`,
            providesTags: (result, error, id) => [{ type: 'Articles', id }],
        }),
        addArticle: builder.mutation<ArticleType, Partial<ArticleType>>({
            query(body) {
                return {
                    url: '/articles',
                    method: 'POST',
                    body,
                }
            },
            // Invalidates all Post-type queries providing the `LIST` id - after all, depending of the sort order,
            // that newly created post could show up in any lists.
            invalidatesTags: [{ type: 'Articles', id: 'LIST' }],
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetArticlesQuery,
    useGetArticleQuery,
    useAddArticleMutation
} = serverApi
