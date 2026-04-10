export interface Course {
  id: number
  title: string
  slug: string
  description: string
  image: string
  price: number
  level: 'beginner' | 'intermediate' | 'advanced'
  rating: number
  total_hours: number
  lectures_count: number
  enrollments_count: number
  start_date: string | null
  end_date: string | null
}

export interface TrendingCoursesResponse {
  status: number
  data: Course[]
}
