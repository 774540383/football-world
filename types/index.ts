export interface MatchType {
  id: string;
  apiId: number;
  leagueId?: string | null;
  league?: LeagueType | null;
  round?: string | null;
  status: "SCHEDULED" | "LIVE" | "FINISHED" | "POSTPONED" | "CANCELLED";
  minute: number;
  homeTeamId: string;
  homeTeam: TeamType;
  awayTeamId: string;
  awayTeam: TeamType;
  homeScore: number | null;
  awayScore: number | null;
  homePenalty: number | null;
  awayPenalty: number | null;
  date: Date | string;
  venue?: string | null;
  referee?: string | null;
  attendance?: number | null;
  homeStats?: MatchStatType | null;
  awayStats?: MatchStatType | null;
  events?: MatchEventType[];
}

export interface LeagueType {
  id: string;
  apiId: number;
  name: string;
  nameAr?: string | null;
  type: string;
  logo?: string | null;
  banner?: string | null;
  country?: string | null;
  countryFlag?: string | null;
  season: number;
}

export interface TeamType {
  id: string;
  apiId: number;
  name: string;
  nameAr?: string | null;
  logo?: string | null;
  banner?: string | null;
  country?: string | null;
  founded?: number | null;
  stadium?: string | null;
  capacity?: number | null;
  coach?: string | null;
  leagueId?: string | null;
  rating: number;
}

export interface PlayerType {
  id: string;
  apiId: number;
  name: string;
  nameAr?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  age?: number | null;
  nationality?: string | null;
  flag?: string | null;
  photo?: string | null;
  position?: string | null;
  number?: number | null;
  height?: string | null;
  weight?: string | null;
  rating: number;
  teamId?: string | null;
  team?: TeamType | null;
  goals: number;
  assists: number;
  appearances: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
  stats?: PlayerStatType[];
}

export interface PlayerStatType {
  id: string;
  playerId: string;
  matchId?: string | null;
  match?: MatchType | null;
  leagueId?: string | null;
  season: number;
  goals: number;
  assists: number;
  shots: number;
  shotsOnTarget: number;
  passes: number;
  keyPasses: number;
  tackles: number;
  interceptions: number;
  fouls: number;
  offsides: number;
  rating: number;
}

export interface MatchStatType {
  id: string;
  matchId: string;
  teamSide: string;
  possession: number;
  shots: number;
  shotsOnTarget: number;
  corners: number;
  fouls: number;
  yellowCards: number;
  redCards: number;
  offsides: number;
  saves: number;
}

export interface MatchEventType {
  id: string;
  matchId: string;
  teamSide: string;
  type: string;
  player?: string | null;
  minute: number;
  extraMinute?: number | null;
  assist?: string | null;
  detail?: string | null;
  scoreHome?: number | null;
  scoreAway?: number | null;
}

export interface StandingType {
  id: string;
  leagueId: string;
  season: number;
  position: number;
  teamId: string;
  team: TeamType;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  form?: string | null;
  group?: string | null;
}

export interface NewsType {
  id: string;
  title: string;
  titleAr?: string | null;
  slug: string;
  excerpt?: string | null;
  content: string;
  image?: string | null;
  category: NewsCategoryType;
  tags?: string | null;
  source?: string | null;
  sourceUrl?: string | null;
  authorId?: string | null;
  author?: UserType | null;
  matchId?: string | null;
  match?: MatchType | null;
  teamId?: string | null;
  team?: TeamType | null;
  playerId?: string | null;
  player?: PlayerType | null;
  featured: boolean;
  published: boolean;
  views: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type NewsCategoryType =
  | "TRANSFERS"
  | "MATCH_REPORT"
  | "INJURY"
  | "RUMOR"
  | "INTERVIEW"
  | "ANALYSIS"
  | "OFFICIAL"
  | "OTHER";

export interface UserType {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  role: "USER" | "ADMIN" | "EDITOR";
  favoriteTeam?: string | null;
  favoriteLeague?: string | null;
}

export interface CommentType {
  id: string;
  content: string;
  userId?: string | null;
  user?: UserType | null;
  newsId: string;
  parentId?: string | null;
  parent?: CommentType | null;
  replies?: CommentType[];
  likes: number;
  createdAt: Date | string;
}

export interface AdType {
  id: string;
  name: string;
  type: string;
  position: string;
  imageUrl?: string | null;
  code?: string | null;
  linkUrl?: string | null;
  active: boolean;
  clicks: number;
  views: number;
}

export interface MatchFilters {
  status?: string;
  leagueId?: string;
  teamId?: string;
  date?: string;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
