import { User } from "@clerk/nextjs/server"
import { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const customBaseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object,
) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  })

  try {
    const result = await baseQuery(args, api, extraOptions)
    if (result.data) {
      result.data = (result.data as { data: any }).data
    }
    return result
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error"

    return { error: { status: "FETCH_ERROR", error: errorMessage } }
  }
}

export const api = createApi({
  baseQuery: customBaseQuery,
  reducerPath: "api",
  tagTypes: ["Courses", "Users"],
  endpoints: (build) => ({
    updateUser: build.mutation<User, Partial<User> & { userId: string }>({
      query: ({ userId, ...updateUser }) => ({
        url: `user/clerk/${userId}`,
        method: "PUT",
        body: updateUser,
      }),
      invalidatesTags: ["Users"],
    }),
    getCourses: build.query<Course[], { category?: string }>({
      query: ({ category }) => ({
        url: "courses",
        params: { category },
      }),
      providesTags: ["Courses"],
    }),
    getCourse: build.query<Course, string>({
      query: (id) => `courses/${id}`,
      providesTags: (result, error, id) => [{ type: "Courses", id }],
    }),
  }),
})

export const { useUpdateUserMutation, useGetCoursesQuery, useGetCourseQuery } =
  api
