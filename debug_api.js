
const API_KEY = process.env.API_FOOTBALL_KEY;
const BASE = "https://v3.football.api-sports.io";
console.log("API Key length:", API_KEY ? API_KEY.length : "MISSING");

fetch(BASE + "/leagues?current=true", {
  headers: { "x-rapidapi-key": API_KEY, "x-rapidapi-host": "v3.football.api-sports.io" }
})
.then(r => {
  console.log("Status:", r.status);
  return r.json();
})
.then(d => {
  console.log("Errors:", d.errors);
  console.log("Results:", d.results);
  if (d.response && d.response.length > 0) {
    console.log("First league:", d.response[0].league.name);
    console.log("Total leagues:", d.response.length);
    
    const majorIds = [39, 140, 135, 78, 61, 2, 3, 325];
    const target = d.response.filter(l => majorIds.includes(l.league.id));
    console.log("Major leagues found:", target.length);
    target.forEach(l => console.log(" -", l.league.id, l.league.name));
  }
})
.catch(e => console.log("FETCH ERROR:", e.message));
