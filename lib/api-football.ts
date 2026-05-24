const API_FOOTBALL_BASE = "https://v3.football.api-sports.io";
const API_KEY = process.env.API_FOOTBALL_KEY || "";

interface ApiFootballResponse<T> {
  get: string;
  parameters: Record<string, string>;
  errors: string[];
  results: number;
  paging: { current: number; total: number };
  response: T[];
}

async function fetchApi<T>(
  endpoint: string,
  params: Record<string, string | number | boolean> = {}
): Promise<ApiFootballResponse<T>> {
  const url = new URL(`${API_FOOTBALL_BASE}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));

  const res = await fetch(url.toString(), {
    headers: {
      "x-rapidapi-key": API_KEY,
      "x-rapidapi-host": "v3.football.api-sports.io",
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error(`API Football error: ${res.status}`);
  return res.json();
}

export async function getLiveMatches() {
  return fetchApi<any>("/fixtures", { live: "all" });
}

export async function getMatchesByDate(date: string) {
  return fetchApi<any>("/fixtures", { date });
}

export async function getMatchById(id: number) {
  const data = await fetchApi<any>("/fixtures", { id });
  return data.response?.[0] || null;
}

export async function getLeagueStandings(leagueId: number, season: number) {
  return fetchApi<any>("/standings", { league: leagueId, season });
}

export async function getTeamsByLeague(leagueId: number, season: number) {
  return fetchApi<any>("/teams", { league: leagueId, season });
}

export async function getTeamById(teamId: number) {
  const data = await fetchApi<any>("/teams", { id: teamId });
  return data.response?.[0] || null;
}

export async function getTeamSquad(teamId: number) {
  return fetchApi<any>("/players/squads", { team: teamId });
}

export async function getPlayerStats(playerId: number, season: number) {
  return fetchApi<any>("/players", { id: playerId, season });
}

export async function getTopScorers(leagueId: number, season: number) {
  return fetchApi<any>("/players/topscorers", { league: leagueId, season });
}

export async function getTopAssists(leagueId: number, season: number) {
  return fetchApi<any>("/players/topassists", { league: leagueId, season });
}

export async function getLeagues() {
  return fetchApi<any>("/leagues", { current: true });
}

export async function searchTeams(search: string) {
  return fetchApi<any>("/teams", { search });
}

export async function searchPlayers(search: string) {
  return fetchApi<any>("/players", { search });
}
