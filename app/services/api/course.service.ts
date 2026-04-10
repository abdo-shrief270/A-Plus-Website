import type { TrendingCoursesResponse } from '@/types/course'
import createAxiosInstance from './instance'

export const courseService = {
  /**
   * Get trending courses from the platform.
   * Authentication Required: This endpoint requires a valid JWT Bearer token.
   * @param limit Max number of courses to return. Default: 10
   */
  async getTrendingCourses(limit: number = 10): Promise<TrendingCoursesResponse> {
    const axiosInstance = createAxiosInstance()
    const response = await axiosInstance.get<TrendingCoursesResponse>('/v2/trending-courses', {
      params: { limit }
    })
    return response.data
  }
}
