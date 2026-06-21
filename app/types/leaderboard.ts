export interface LeaderboardRow {
  rank: number
  student_id: number
  name: string
  points: number
  is_me: boolean
}

export interface LeagueInfo {
  id: number
  name: string
  color: string | null
  icon_path: string | null
  members_count: number
}

export interface LadderLeague {
  id: number
  name: string
  min_score: number
  color: string | null
  icon_path: string | null
  order: number
  is_current: boolean
}

export interface LeaderboardData {
  period: 'week' | 'all'
  league: LeagueInfo
  me: {
    rank: number | null
    points: number
    total_score: number
    next_league: { name: string, min_score: number, points_needed: number } | null
  }
  top: LeaderboardRow[]
  ladder: LadderLeague[]
}
