
require('dotenv').config({ path: '/opt/football-world-vps/.env' });

const KEY = process.env.API_FOOTBALL_KEY;
const BASE = "https://v3.football.api-sports.io";

async function test(headers, label) {
  try {
    const r = await fetch(BASE + "/leagues?current=true", { headers });
    const d = await r.json();
    console.log(label + ":", r.status, "results:", d.results, "errors:", JSON.stringify(d.errors || {}));
    return d.results > 0;
  } catch(e) {
    console.log(label + ": FETCH ERROR:", e.message);
    return false;
  }
}

(async () => {
  console.log("Testing API key:", KEY.substring(0,15) + "...");
  console.log("Key length:", KEY.length);
  
  // Test 1: x-rapidapi-key (standard)
  await test({
    "x-rapidapi-key": KEY,
    "x-rapidapi-host": "v3.football.api-sports.io"
  }, "rapidapi-key");
  
  // Test 2: x-apisports-key (alternative)
  await test({
    "x-apisports-key": KEY
  }, "apisports-key");
  
  // Test 3: Authorization Bearer
  await test({
    "Authorization": "Bearer " + KEY,
    "x-rapidapi-host": "v3.football.api-sports.io"
  }, "Bearer");
  
  // Test 4: Query parameter
  const url = BASE + "/leagues?current=true&key=" + KEY;
  try {
    const r = await fetch(url);
    const d = await r.json();
    console.log("query-key:", r.status, "results:", d.results);
  } catch(e) {
    console.log("query-key: ERROR", e.message);
  }
  
  // Test 5: Try thesportsdb or other endpoint
  try {
    const r = await fetch("https://www.thesportsdb.com/api/v1/json/3/all_leagues.php");
    const d = await r.json();
    console.log("thesportsdb:", r.status, "leagues:", (d.leagues || []).length);
  } catch(e) {
    console.log("thesportsdb: ERROR", e.message);
  }
})();
