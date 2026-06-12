
require('dotenv').config({ path: '/opt/football-world-vps/.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

const LEAGUES = {
  "English Premier League": {
    "apiId": 39,
    "logo": "https://media.api-sports.io/football/leagues/39.png",
    "country": "England",
    "season": 2024
  },
  "Spanish La Liga": {
    "apiId": 140,
    "logo": "https://media.api-sports.io/football/leagues/140.png",
    "country": "Spain",
    "season": 2024
  },
  "Italian Serie A": {
    "apiId": 135,
    "logo": "https://media.api-sports.io/football/leagues/135.png",
    "country": "Italy",
    "season": 2024
  },
  "German Bundesliga": {
    "apiId": 78,
    "logo": "https://media.api-sports.io/football/leagues/78.png",
    "country": "Germany",
    "season": 2024
  },
  "French Ligue 1": {
    "apiId": 61,
    "logo": "https://media.api-sports.io/football/leagues/61.png",
    "country": "France",
    "season": 2024
  },
  "UEFA Champions League": {
    "apiId": 2,
    "logo": "https://media.api-sports.io/football/leagues/2.png",
    "country": "Europe",
    "season": 2024
  },
  "Saudi Pro League": {
    "apiId": 325,
    "logo": "https://media.api-sports.io/football/leagues/325.png",
    "country": "Saudi Arabia",
    "season": 2024
  }
};

const TEAMS_BY_LEAGUE = {
  "39": [
    {
      "id": 133604,
      "name": "Arsenal",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/uyhbfe1612467038.png",
      "country": "England",
      "stadium": "Emirates Stadium",
      "founded": "1892"
    },
    {
      "id": 133601,
      "name": "Aston Villa",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/jykrpv1717309891.png",
      "country": "England",
      "stadium": "Villa Park",
      "founded": "1874"
    },
    {
      "id": 134301,
      "name": "Bournemouth",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/y08nak1534071116.png",
      "country": "England",
      "stadium": "Vitality Stadium",
      "founded": "1890"
    },
    {
      "id": 134355,
      "name": "Brentford",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/grv1aw1546453779.png",
      "country": "England",
      "stadium": "Brentford Community Stadium",
      "founded": "1889"
    },
    {
      "id": 133619,
      "name": "Brighton and Hove Albion",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/ywypts1448810904.png",
      "country": "England",
      "stadium": "American Express Stadium",
      "founded": "1901"
    },
    {
      "id": 133610,
      "name": "Chelsea",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/yvwvtu1448813215.png",
      "country": "England",
      "stadium": "Stamford Bridge",
      "founded": "1905"
    },
    {
      "id": 133625,
      "name": "Coventry City",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/uxyqys1424033798.png",
      "country": "England",
      "stadium": "The Coventry Building Society Arena",
      "founded": "1883"
    },
    {
      "id": 133632,
      "name": "Crystal Palace",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/ia6i3m1656014992.png",
      "country": "England",
      "stadium": "Selhurst Park",
      "founded": "1905"
    },
    {
      "id": 133615,
      "name": "Everton",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/eqayrf1523184794.png",
      "country": "England",
      "stadium": "Hill Dickinson Stadium",
      "founded": "1878"
    },
    {
      "id": 133600,
      "name": "Fulham",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/xwwvyt1448811086.png",
      "country": "England",
      "stadium": "Craven Cottage",
      "founded": "1879"
    }
  ],
  "140": [
    {
      "id": 133727,
      "name": "Athletic Bilbao",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/68w7fe1639408210.png",
      "country": "Spain",
      "stadium": "San Mam\u00e9s Barria",
      "founded": "1898"
    },
    {
      "id": 133729,
      "name": "Atl\u00e9tico Madrid",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/0ulh3q1719984315.png",
      "country": "Spain",
      "stadium": "Riyadh Air Metropolitano",
      "founded": "1903"
    },
    {
      "id": 133739,
      "name": "Barcelona",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/wq9sir1639406443.png",
      "country": "Spain",
      "stadium": "Spotify Camp Nou",
      "founded": "1899"
    },
    {
      "id": 133937,
      "name": "Celta Vigo",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/xfjtku1690436219.png",
      "country": "Spain",
      "stadium": "Estadio Abanca-Bala\u00eddos",
      "founded": "1923"
    },
    {
      "id": 134221,
      "name": "Deportivo Alav\u00e9s",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/mfn99h1734673842.png",
      "country": "Spain",
      "stadium": "Estadio de Mendizorroza",
      "founded": "1921"
    },
    {
      "id": 134384,
      "name": "Elche",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/e4vaw51655594332.png",
      "country": "Spain",
      "stadium": "Estadio Mart\u00ednez Valero",
      "founded": "1923"
    },
    {
      "id": 133734,
      "name": "Espanyol",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/867nzz1681703222.png",
      "country": "Spain",
      "stadium": "RCDE Stadium",
      "founded": "1900"
    },
    {
      "id": 133731,
      "name": "Getafe",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/eyh2891655594452.png",
      "country": "Spain",
      "stadium": "Estadio Coliseum",
      "founded": "1946"
    },
    {
      "id": 134700,
      "name": "Girona",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/kfu7zu1659897499.png",
      "country": "Spain",
      "stadium": "Estadi Municipal de Montilivi",
      "founded": "1930"
    },
    {
      "id": 133732,
      "name": "Levante",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/xwtxsx1473503739.png",
      "country": "Spain",
      "stadium": "Estadio Ciudad de Valencia",
      "founded": "1909"
    }
  ],
  "135": [
    {
      "id": 133667,
      "name": "AC Milan",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/wvspur1448806617.png",
      "country": "Italy",
      "stadium": "Stadio Giuseppe Meazza",
      "founded": "1899"
    },
    {
      "id": 134782,
      "name": "Atalanta",
      "logo": "https://www.thesportsdb.com/images/media/team/badge/qix5ku1780561327.png",
      "country": "Italy",
      "stadium": "New Balance Arena",
      "founded": "1907"
    },
    {
      "id": 134781,
      "name": "Bologna",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/2qi1u31655592366.png",
      "country": "Italy",
      "stadium": "Stadio Renato Dall'Ara",
      "founded": "1909"
    },
    {
      "id": 134783,
      "name": "Cagliari",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/wvsvxt1447534471.png",
      "country": "Italy",
      "stadium": "Unipol Domus",
      "founded": "1920"
    },
    {
      "id": 134243,
      "name": "Como",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/02x81t1627405841.png",
      "country": "Italy",
      "stadium": "Stadio Giuseppe Sinigaglia",
      "founded": "1907"
    },
    {
      "id": 133674,
      "name": "Fiorentina",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/hc8nhu1656098030.png",
      "country": "Italy",
      "stadium": "Stadio Artemio Franchi",
      "founded": "1926"
    },
    {
      "id": 133818,
      "name": "Frosinone",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/a7xa151603170120.png",
      "country": "Italy",
      "stadium": "Stadio Benito Stirpe",
      "founded": "1912"
    },
    {
      "id": 133675,
      "name": "Genoa",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/52s8dn1655553600.png",
      "country": "Italy",
      "stadium": "Stadio Luigi Ferraris",
      "founded": "1823"
    },
    {
      "id": 133681,
      "name": "Inter Milan",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/ryhu6d1617113103.png",
      "country": "Italy",
      "stadium": "Stadio Giuseppe Meazza",
      "founded": "1908"
    },
    {
      "id": 133676,
      "name": "Juventus",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/uxf0gr1742983727.png",
      "country": "Italy",
      "stadium": "Allianz Stadium Turin",
      "founded": "1897"
    }
  ],
  "78": [
    {
      "id": 133652,
      "name": "Augsburg",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/xqyyvq1473453233.png",
      "country": "Germany",
      "stadium": "WWK Arena",
      "founded": "1907"
    },
    {
      "id": 133666,
      "name": "Bayer Leverkusen",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/3x9k851726760113.png",
      "country": "Germany",
      "stadium": "BayArena",
      "founded": "1904"
    },
    {
      "id": 133664,
      "name": "Bayern Munich",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/01ogkh1716960412.png",
      "country": "Germany",
      "stadium": "Allianz Arena",
      "founded": "1900"
    },
    {
      "id": 133650,
      "name": "Borussia Dortmund",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/tqo8ge1716960353.png",
      "country": "Germany",
      "stadium": "Signal Iduna Park",
      "founded": "1909"
    },
    {
      "id": 134779,
      "name": "Borussia M\u00f6nchengladbach",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/sysurw1473453380.png",
      "country": "Germany",
      "stadium": "Stadion im Borussia-Park",
      "founded": "1900"
    },
    {
      "id": 133814,
      "name": "Eintracht Frankfurt",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/rurwpy1473453269.png",
      "country": "Germany",
      "stadium": "Deutsche Bank Park",
      "founded": "1899"
    },
    {
      "id": 138411,
      "name": "Elversberg",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/z079go1677573926.png",
      "country": "Germany",
      "stadium": "Waldstadion Kaiserlinde",
      "founded": "1907"
    },
    {
      "id": 133653,
      "name": "Freiburg",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/urwtup1473453288.png",
      "country": "Germany",
      "stadium": "Europa-Park Stadion",
      "founded": "1904"
    },
    {
      "id": 133651,
      "name": "Hamburg",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/tvtppt1473453296.png",
      "country": "Germany",
      "stadium": "Volksparkstadion",
      "founded": "1887"
    },
    {
      "id": 133657,
      "name": "Hoffenheim",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/9hwvb21621593919.png",
      "country": "Germany",
      "stadium": "PreZero Arena",
      "founded": "1899"
    }
  ],
  "61": [
    {
      "id": 134709,
      "name": "Angers",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/ix6q4w1678808069.png",
      "country": "France",
      "stadium": "Stade Raymond Kopa",
      "founded": "1919"
    },
    {
      "id": 134788,
      "name": "Auxerre",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/lzdtbf1658753355.png",
      "country": "France",
      "stadium": "Stade de l'Abb\u00e9 Deschamps",
      "founded": "1905"
    },
    {
      "id": 133704,
      "name": "Brest",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/z69be41598797026.png",
      "country": "France",
      "stadium": "Stade Francis-Le Bl\u00e9",
      "founded": "1903"
    },
    {
      "id": 133862,
      "name": "Le Havre",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/aikowk1546475003.png",
      "country": "France",
      "stadium": "Stade Oc\u00e9ane",
      "founded": "1872"
    },
    {
      "id": 133848,
      "name": "Le Mans",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/wjhziv1700145026.png",
      "country": "France",
      "stadium": "Stade Marie-Marvingt",
      "founded": "1985"
    },
    {
      "id": 133822,
      "name": "Lens",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/3pxoum1598797195.png",
      "country": "France",
      "stadium": "Stade Bollaert-Delelis",
      "founded": "1906"
    },
    {
      "id": 133711,
      "name": "Lille",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/2giize1534005340.png",
      "country": "France",
      "stadium": "Decathlon Arena - Stade Pierre-Mauroy",
      "founded": "1944"
    },
    {
      "id": 133715,
      "name": "Lorient",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/sxsttw1473504748.png",
      "country": "France",
      "stadium": "Stade du Moustoir",
      "founded": "1926"
    },
    {
      "id": 133713,
      "name": "Lyon",
      "logo": "https://r2.thesportsdb.com/images/media/team/badge/blk9771656932845.png",
      "country": "France",
      "stadium": "Groupama Stadium",
      "founded": "1950"
    },
    {
      "id": 133707,
      "name": "Marseille",
      "logo": "https://www.thesportsdb.com/images/media/team/badge/c6bazh1779212287.png",
      "country": "France",
      "stadium": "Orange V\u00e9lodrome",
      "founded": "1899"
    }
  ],
  "2": [],
  "325": []
};

// Known top players for major teams
const TOP_PLAYERS = {
  // Premier League - Man City
  "Man City": [
    {name:"Erling Haaland",pos:"Forward",num:9,age:24,nat:"Norway",goals:28,assists:5},
    {name:"Kevin De Bruyne",pos:"Midfielder",num:17,age:33,nat:"Belgium",goals:6,assists:18},
    {name:"Phil Foden",pos:"Midfielder",num:47,age:24,nat:"England",goals:14,assists:9},
    {name:"Rodri",pos:"Midfielder",num:16,age:28,nat:"Spain",goals:5,assists:8},
    {name:"Bernardo Silva",pos:"Midfielder",num:20,age:30,nat:"Portugal",goals:8,assists:6},
    {name:"Ruben Dias",pos:"Defender",num:3,age:27,nat:"Portugal",goals:2,assists:1},
    {name:"Jack Grealish",pos:"Midfielder",num:10,age:29,nat:"England",goals:4,assists:7},
    {name:"Josko Gvardiol",pos:"Defender",num:24,age:22,nat:"Croatia",goals:3,assists:2},
    {name:"Ederson",pos:"Goalkeeper",num:31,age:31,nat:"Brazil",goals:0,assists:1},
    {name:"Julian Alvarez",pos:"Forward",num:19,age:24,nat:"Argentina",goals:12,assists:6},
  ],
  "Liverpool": [
    {name:"Mohamed Salah",pos:"Forward",num:11,age:32,nat:"Egypt",goals:22,assists:14},
    {name:"Virgil van Dijk",pos:"Defender",num:4,age:33,nat:"Netherlands",goals:3,assists:2},
    {name:"Darwin Nunez",pos:"Forward",num:9,age:25,nat:"Uruguay",goals:16,assists:8},
    {name:"Trent Alexander-Arnold",pos:"Defender",num:66,age:26,nat:"England",goals:4,assists:12},
    {name:"Alisson Becker",pos:"Goalkeeper",num:1,age:32,nat:"Brazil",goals:0,assists:0},
    {name:"Luis Diaz",pos:"Forward",num:7,age:27,nat:"Colombia",goals:11,assists:5},
    {name:"Dominik Szoboszlai",pos:"Midfielder",num:8,age:24,nat:"Hungary",goals:5,assists:6},
    {name:"Alexis Mac Allister",pos:"Midfielder",num:10,age:25,nat:"Argentina",goals:6,assists:7},
    {name:"Cody Gakpo",pos:"Forward",num:18,age:25,nat:"Netherlands",goals:9,assists:4},
    {name:"Ibrahima Konate",pos:"Defender",num:5,age:25,nat:"France",goals:2,assists:1},
  ],
  "Arsenal": [
    {name:"Bukayo Saka",pos:"Midfielder",num:7,age:23,nat:"England",goals:18,assists:13},
    {name:"Martin Odegaard",pos:"Midfielder",num:8,age:25,nat:"Norway",goals:9,assists:10},
    {name:"Gabriel Jesus",pos:"Forward",num:9,age:27,nat:"Brazil",goals:8,assists:6},
    {name:"Declan Rice",pos:"Midfielder",num:41,age:25,nat:"England",goals:7,assists:9},
    {name:"William Saliba",pos:"Defender",num:2,age:23,nat:"France",goals:2,assists:1},
    {name:"Gabriel Magalhaes",pos:"Defender",num:6,age:26,nat:"Brazil",goals:3,assists:2},
    {name:"Kai Havertz",pos:"Midfielder",num:29,age:25,nat:"Germany",goals:10,assists:5},
    {name:"Leandro Trossard",pos:"Forward",num:19,age:29,nat:"Belgium",goals:8,assists:7},
    {name:"David Raya",pos:"Goalkeeper",num:22,age:29,nat:"Spain",goals:0,assists:0},
    {name:"Ben White",pos:"Defender",num:4,age:27,nat:"England",goals:3,assists:4},
  ],
  "Man United": [
    {name:"Bruno Fernandes",pos:"Midfielder",num:8,age:30,nat:"Portugal",goals:12,assists:10},
    {name:"Marcus Rashford",pos:"Forward",num:10,age:27,nat:"England",goals:10,assists:6},
    {name:"Alejandro Garnacho",pos:"Forward",num:17,age:20,nat:"Argentina",goals:8,assists:5},
    {name:"Rasmus Hojlund",pos:"Forward",num:11,age:21,nat:"Denmark",goals:11,assists:3},
    {name:"Kobbie Mainoo",pos:"Midfielder",num:37,age:19,nat:"England",goals:3,assists:2},
    {name:"Andre Onana",pos:"Goalkeeper",num:24,age:28,nat:"Cameroon",goals:0,assists:0},
    {name:"Lisandro Martinez",pos:"Defender",num:6,age:26,nat:"Argentina",goals:1,assists:1},
    {name:"Diogo Dalot",pos:"Defender",num:20,age:25,nat:"Portugal",goals:2,assists:4},
    {name:"Mason Mount",pos:"Midfielder",num:7,age:25,nat:"England",goals:3,assists:3},
    {name:"Harry Maguire",pos:"Defender",num:5,age:31,nat:"England",goals:2,assists:0},
  ],
  "Chelsea": [
    {name:"Cole Palmer",pos:"Midfielder",num:20,age:22,nat:"England",goals:24,assists:13},
    {name:"Nicolas Jackson",pos:"Forward",num:15,age:23,nat:"Senegal",goals:15,assists:6},
    {name:"Enzo Fernandez",pos:"Midfielder",num:8,age:23,nat:"Argentina",goals:5,assists:7},
    {name:"Moises Caicedo",pos:"Midfielder",num:25,age:23,nat:"Ecuador",goals:2,assists:4},
    {name:"Reece James",pos:"Defender",num:24,age:25,nat:"England",goals:1,assists:3},
    {name:"Conor Gallagher",pos:"Midfielder",num:23,age:24,nat:"England",goals:6,assists:5},
    {name:"Raheem Sterling",pos:"Forward",num:7,age:29,nat:"England",goals:9,assists:8},
    {name:"Levi Colwill",pos:"Defender",num:26,age:21,nat:"England",goals:1,assists:2},
    {name:"Robert Sanchez",pos:"Goalkeeper",num:1,age:27,nat:"Spain",goals:0,assists:0},
    {name:"Mykhailo Mudryk",pos:"Forward",num:10,age:23,nat:"Ukraine",goals:5,assists:3},
  ],
  // La Liga
  "Real Madrid": [
    {name:"Vinicius Junior",pos:"Forward",num:7,age:24,nat:"Brazil",goals:22,assists:9},
    {name:"Jude Bellingham",pos:"Midfielder",num:5,age:21,nat:"England",goals:21,assists:11},
    {name:"Kylian Mbappe",pos:"Forward",num:9,age:25,nat:"France",goals:28,assists:8},
    {name:"Rodrygo",pos:"Forward",num:11,age:23,nat:"Brazil",goals:12,assists:7},
    {name:"Federico Valverde",pos:"Midfielder",num:8,age:26,nat:"Uruguay",goals:7,assists:6},
    {name:"Antonio Rudiger",pos:"Defender",num:22,age:31,nat:"Germany",goals:3,assists:2},
    {name:"Eduardo Camavinga",pos:"Midfielder",num:12,age:22,nat:"France",goals:3,assists:5},
    {name:"Thibaut Courtois",pos:"Goalkeeper",num:1,age:32,nat:"Belgium",goals:0,assists:0},
    {name:"Dani Carvajal",pos:"Defender",num:2,age:32,nat:"Spain",goals:2,assists:4},
    {name:"Aurelien Tchouameni",pos:"Midfielder",num:14,age:24,nat:"France",goals:2,assists:3},
  ],
  "Barcelona": [
    {name:"Robert Lewandowski",pos:"Forward",num:9,age:36,nat:"Poland",goals:23,assists:6},
    {name:"Lamine Yamal",pos:"Forward",num:19,age:17,nat:"Spain",goals:8,assists:12},
    {name:"Pedri",pos:"Midfielder",num:8,age:22,nat:"Spain",goals:6,assists:8},
    {name:"Gavi",pos:"Midfielder",num:6,age:20,nat:"Spain",goals:4,assists:6},
    {name:"Raphinha",pos:"Forward",num:11,age:28,nat:"Brazil",goals:10,assists:9},
    {name:"Ilkay Gundogan",pos:"Midfielder",num:22,age:34,nat:"Germany",goals:7,assists:8},
    {name:"Ronald Araujo",pos:"Defender",num:4,age:25,nat:"Uruguay",goals:2,assists:1},
    {name:"Marc-Andre ter Stegen",pos:"Goalkeeper",num:1,age:32,nat:"Germany",goals:0,assists:0},
    {name:"Joao Felix",pos:"Forward",num:14,age:25,nat:"Portugal",goals:8,assists:4},
    {name:"Frenkie de Jong",pos:"Midfielder",num:21,age:27,nat:"Netherlands",goals:3,assists:5},
  ],
  "Atletico Madrid": [
    {name:"Antoine Griezmann",pos:"Forward",num:7,age:33,nat:"France",goals:17,assists:8},
    {name:"Alvaro Morata",pos:"Forward",num:19,age:32,nat:"Spain",goals:12,assists:4},
    {name:"Jan Oblak",pos:"Goalkeeper",num:13,age:31,nat:"Slovenia",goals:0,assists:0},
    {name:"Koke",pos:"Midfielder",num:6,age:32,nat:"Spain",goals:2,assists:7},
    {name:"Marcos Llorente",pos:"Midfielder",num:14,age:29,nat:"Spain",goals:5,assists:6},
    {name:"Jose Gimenez",pos:"Defender",num:2,age:29,nat:"Uruguay",goals:1,assists:2},
    {name:"Rodrigo De Paul",pos:"Midfielder",num:5,age:30,nat:"Argentina",goals:4,assists:6},
    {name:"Samuel Lino",pos:"Forward",num:12,age:25,nat:"Brazil",goals:6,assists:4},
    {name:"Axel Witsel",pos:"Midfielder",num:20,age:35,nat:"Belgium",goals:1,assists:0},
  ],
  // Serie A
  "Inter Milan": [
    {name:"Lautaro Martinez",pos:"Forward",num:10,age:27,nat:"Argentina",goals:25,assists:7},
    {name:"Marcus Thuram",pos:"Forward",num:9,age:27,nat:"France",goals:14,assists:8},
    {name:"Nicolo Barella",pos:"Midfielder",num:23,age:27,nat:"Italy",goals:6,assists:9},
    {name:"Hakan Calhanoglu",pos:"Midfielder",num:20,age:30,nat:"Turkey",goals:8,assists:7},
    {name:"Alessandro Bastoni",pos:"Defender",num:95,age:25,nat:"Italy",goals:2,assists:4},
    {name:"Yann Sommer",pos:"Goalkeeper",num:1,age:36,nat:"Switzerland",goals:0,assists:0},
    {name:"Federico Dimarco",pos:"Defender",num:32,age:27,nat:"Italy",goals:4,assists:6},
    {name:"Henrikh Mkhitaryan",pos:"Midfielder",num:22,age:35,nat:"Armenia",goals:5,assists:6},
    {name:"Denzel Dumfries",pos:"Defender",num:2,age:28,nat:"Netherlands",goals:3,assists:5},
    {name:"Stefan de Vrij",pos:"Defender",num:6,age:32,nat:"Netherlands",goals:1,assists:1},
  ],
  "AC Milan": [
    {name:"Rafael Leao",pos:"Forward",num:10,age:25,nat:"Portugal",goals:12,assists:9},
    {name:"Olivier Giroud",pos:"Forward",num:9,age:38,nat:"France",goals:14,assists:5},
    {name:"Theo Hernandez",pos:"Defender",num:19,age:27,nat:"France",goals:5,assists:7},
    {name:"Mike Maignan",pos:"Goalkeeper",num:16,age:29,nat:"France",goals:0,assists:0},
    {name:"Ismael Bennacer",pos:"Midfielder",num:4,age:27,nat:"Algeria",goals:3,assists:4},
    {name:"Christian Pulisic",pos:"Midfielder",num:11,age:26,nat:"USA",goals:9,assists:6},
    {name:"Tijjani Reijnders",pos:"Midfielder",num:14,age:26,nat:"Netherlands",goals:4,assists:5},
    {name:"Fikayo Tomori",pos:"Defender",num:23,age:27,nat:"England",goals:2,assists:1},
    {name:"Samuel Chukwueze",pos:"Forward",num:21,age:25,nat:"Nigeria",goals:5,assists:3},
    {name:"Davide Calabria",pos:"Defender",num:2,age:28,nat:"Italy",goals:1,assists:2},
  ],
  "Juventus": [
    {name:"Dusan Vlahovic",pos:"Forward",num:9,age:24,nat:"Serbia",goals:18,assists:5},
    {name:"Federico Chiesa",pos:"Forward",num:7,age:27,nat:"Italy",goals:10,assists:7},
    {name:"Manuel Locatelli",pos:"Midfielder",num:5,age:26,nat:"Italy",goals:3,assists:4},
    {name:"Gleison Bremer",pos:"Defender",num:3,age:27,nat:"Brazil",goals:2,assists:1},
    {name:"Adrien Rabiot",pos:"Midfielder",num:25,age:29,nat:"France",goals:5,assists:6},
    {name:"Wojciech Szczesny",pos:"Goalkeeper",num:1,age:34,nat:"Poland",goals:0,assists:0},
    {name:"Kenan Yildiz",pos:"Forward",num:10,age:19,nat:"Turkey",goals:6,assists:3},
    {name:"Andrea Cambiaso",pos:"Defender",num:27,age:24,nat:"Italy",goals:3,assists:4},
    {name:"Weston McKennie",pos:"Midfielder",num:16,age:26,nat:"USA",goals:4,assists:5},
    {name:"Danilo",pos:"Defender",num:6,age:33,nat:"Brazil",goals:1,assists:2},
  ],
  // Bundesliga
  "Bayern Munich": [
    {name:"Harry Kane",pos:"Forward",num:9,age:31,nat:"England",goals:35,assists:10},
    {name:"Jamal Musiala",pos:"Midfielder",num:42,age:21,nat:"Germany",goals:12,assists:8},
    {name:"Joshua Kimmich",pos:"Midfielder",num:6,age:29,nat:"Germany",goals:3,assists:11},
    {name:"Leroy Sane",pos:"Forward",num:10,age:28,nat:"Germany",goals:10,assists:9},
    {name:"Manuel Neuer",pos:"Goalkeeper",num:1,age:38,nat:"Germany",goals:0,assists:0},
    {name:"Alphonso Davies",pos:"Defender",num:19,age:24,nat:"Canada",goals:2,assists:5},
    {name:"Serge Gnabry",pos:"Forward",num:7,age:29,nat:"Germany",goals:8,assists:5},
    {name:"Leon Goretzka",pos:"Midfielder",num:8,age:29,nat:"Germany",goals:4,assists:4},
    {name:"Matthijs de Ligt",pos:"Defender",num:4,age:25,nat:"Netherlands",goals:2,assists:1},
    {name:"Thomas Muller",pos:"Forward",num:25,age:35,nat:"Germany",goals:5,assists:8},
  ],
  "Borussia Dortmund": [
    {name:"Marco Reus",pos:"Midfielder",num:11,age:35,nat:"Germany",goals:8,assists:6},
    {name:"Julian Brandt",pos:"Midfielder",num:19,age:28,nat:"Germany",goals:7,assists:8},
    {name:"Karim Adeyemi",pos:"Forward",num:27,age:22,nat:"Germany",goals:9,assists:5},
    {name:"Niclas Fullkrug",pos:"Forward",num:14,age:31,nat:"Germany",goals:14,assists:4},
    {name:"Julian Ryerson",pos:"Defender",num:26,age:27,nat:"Norway",goals:2,assists:3},
    {name:"Mats Hummels",pos:"Defender",num:15,age:36,nat:"Germany",goals:3,assists:1},
    {name:"Gregor Kobel",pos:"Goalkeeper",num:1,age:27,nat:"Switzerland",goals:0,assists:0},
    {name:"Donyell Malen",pos:"Forward",num:21,age:25,nat:"Netherlands",goals:7,assists:4},
    {name:"Felix Nmecha",pos:"Midfielder",num:8,age:24,nat:"Germany",goals:2,assists:3},
    {name:"Nico Schlotterbeck",pos:"Defender",num:4,age:25,nat:"Germany",goals:1,assists:2},
  ],
  // Ligue 1
  "PSG": [
    {name:"Kylian Mbappe",pos:"Forward",num:7,age:25,nat:"France",goals:30,assists:9},
    {name:"Ousmane Dembele",pos:"Forward",num:10,age:27,nat:"France",goals:9,assists:11},
    {name:"Randal Kolo Muani",pos:"Forward",num:23,age:26,nat:"France",goals:12,assists:5},
    {name:"Vitinha",pos:"Midfielder",num:17,age:24,nat:"Portugal",goals:6,assists:7},
    {name:"Warren Zaire-Emery",pos:"Midfielder",num:33,age:18,nat:"France",goals:4,assists:5},
    {name:"Achraf Hakimi",pos:"Defender",num:2,age:26,nat:"Morocco",goals:4,assists:7},
    {name:"Marquinhos",pos:"Defender",num:5,age:30,nat:"Brazil",goals:2,assists:1},
    {name:"Gianluigi Donnarumma",pos:"Goalkeeper",num:1,age:25,nat:"Italy",goals:0,assists:0},
    {name:"Fabian Ruiz",pos:"Midfielder",num:8,age:28,nat:"Spain",goals:4,assists:5},
    {name:"Lucas Hernandez",pos:"Defender",num:21,age:28,nat:"France",goals:1,assists:2},
  ],
  "Marseille": [
    {name:"Pierre-Emerick Aubameyang",pos:"Forward",num:10,age:35,nat:"Gabon",goals:14,assists:6},
    {name:"Amine Harit",pos:"Midfielder",num:11,age:27,nat:"Morocco",goals:5,assists:7},
    {name:"Jordan Veretout",pos:"Midfielder",num:27,age:31,nat:"France",goals:4,assists:6},
    {name:"Jonathan Clauss",pos:"Defender",num:7,age:32,nat:"France",goals:3,assists:8},
    {name:"Chancel Mbemba",pos:"Defender",num:99,age:30,nat:"DR Congo",goals:2,assists:1},
    {name:"Pau Lopez",pos:"Goalkeeper",num:16,age:30,nat:"Spain",goals:0,assists:0},
    {name:"Azzedine Ounahi",pos:"Midfielder",num:8,age:24,nat:"Morocco",goals:3,assists:4},
    {name:"Iliman Ndiaye",pos:"Forward",num:29,age:24,nat:"Senegal",goals:7,assists:4},
    {name:"Samuel Gigot",pos:"Defender",num:4,age:31,nat:"France",goals:2,assists:0},
  ],
  // Saudi Pro League
  "Al Nassr": [
    {name:"Cristiano Ronaldo",pos:"Forward",num:7,age:39,nat:"Portugal",goals:35,assists:12},
    {name:"Sadio Mane",pos:"Forward",num:10,age:32,nat:"Senegal",goals:13,assists:7},
    {name:"Otavio",pos:"Midfielder",num:25,age:29,nat:"Portugal",goals:5,assists:6},
    {name:"Marcelo Brozovic",pos:"Midfielder",num:77,age:32,nat:"Croatia",goals:4,assists:5},
    {name:"Aymeric Laporte",pos:"Defender",num:27,age:30,nat:"Spain",goals:3,assists:2},
    {name:"Alex Telles",pos:"Defender",num:15,age:32,nat:"Brazil",goals:2,assists:4},
    {name:"David Ospina",pos:"Goalkeeper",num:1,age:36,nat:"Colombia",goals:0,assists:0},
    {name:"Anderson Talisca",pos:"Midfielder",num:94,age:30,nat:"Brazil",goals:16,assists:5},
    {name:"Abdulrahman Ghareeb",pos:"Forward",num:29,age:27,nat:"Saudi Arabia",goals:6,assists:3},
    {name:"Sultan Al-Ghannam",pos:"Defender",num:2,age:30,nat:"Saudi Arabia",goals:1,assists:3},
  ],
  "Al Hilal": [
    {name:"Neymar",pos:"Forward",num:10,age:32,nat:"Brazil",goals:8,assists:5},
    {name:"Aleksandar Mitrovic",pos:"Forward",num:9,age:30,nat:"Serbia",goals:28,assists:6},
    {name:"Malcom",pos:"Forward",num:77,age:27,nat:"Brazil",goals:14,assists:8},
    {name:"Sergej Milinkovic-Savic",pos:"Midfielder",num:22,age:29,nat:"Serbia",goals:10,assists:7},
    {name:"Ruben Neves",pos:"Midfielder",num:8,age:27,nat:"Portugal",goals:7,assists:9},
    {name:"Kalidou Koulibaly",pos:"Defender",num:3,age:33,nat:"Senegal",goals:2,assists:1},
    {name:"Yassine Bounou",pos:"Goalkeeper",num:37,age:33,nat:"Morocco",goals:0,assists:0},
    {name:"Michael",pos:"Midfielder",num:96,age:28,nat:"Brazil",goals:8,assists:6},
    {name:"Salem Al-Dawsari",pos:"Forward",num:29,age:33,nat:"Saudi Arabia",goals:9,assists:7},
    {name:"Ali Al-Bulaihi",pos:"Defender",num:5,age:35,nat:"Saudi Arabia",goals:1,assists:0},
  ],
};

const teamNameToPlayers = {};
for (const [team, players] of Object.entries(TOP_PLAYERS)) {
  teamNameToPlayers[team] = players;
}

async function main() {
  console.log("=== COMPREHENSIVE DATABASE SEEDING ===\n");
  
  // Create admin user
  const hash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@footballworld.com" },
    update: {},
    create: {
      email: "admin@footballworld.com",
      name: "Football World Admin",
      passwordHash: hash,
      role: "ADMIN",
    },
  });
  console.log("Admin user created");
  
  const teamPrismaIds = {}; // apiId -> prisma id
  
  // Seed leagues and teams
  for (const [leagueName, info] of Object.entries(LEAGUES)) {
    const league = await prisma.league.upsert({
      where: { apiId: info.apiId },
      update: { name: leagueName, logo: info.logo, country: info.country, season: info.season },
      create: { apiId: info.apiId, name: leagueName, logo: info.logo, country: info.country, season: info.season },
    });
    console.log("League:", leagueName);
    
    const apiLeagueId = String(info.apiId);
    const teams = TEAMS_BY_LEAGUE[apiLeagueId] || [];
    
    for (const t of teams) {
      if (!t.name) continue;
      const team = await prisma.team.upsert({
        where: { apiId: t.id },
        update: { name: t.name, logo: t.logo || undefined, country: t.country || info.country, leagueId: league.id },
        create: { apiId: t.id, name: t.name, logo: t.logo || undefined, country: t.country || info.country, leagueId: league.id },
      });
      teamPrismaIds[t.id] = team.id;
    }
    console.log("  Teams:", teams.length);
  }
  
  // Seed players from TOP_PLAYERS
  let playerCount = 0;
  for (const [teamName, players] of Object.entries(TOP_PLAYERS)) {
    // Find team by name
    const team = await prisma.team.findFirst({ where: { name: { contains: teamName.split(" ")[0] } } });
    if (!team) continue;
    
    for (const p of players) {
      await prisma.player.upsert({
        where: { apiId: Math.abs(p.name.hashCode() || playerCount + 1000) },
        update: {
          name: p.name, position: p.pos, number: p.num, age: p.age,
          nationality: p.nat, goals: p.goals, assists: p.assists,
          teamId: team.id,
        },
        create: {
          apiId: Math.abs(p.name.hashCode() || playerCount + 1000),
          name: p.name, position: p.pos, number: p.num, age: p.age,
          nationality: p.nat, goals: p.goals, assists: p.assists,
          teamId: team.id,
        },
      });
      playerCount++;
    }
    console.log("  Players for", teamName, ":", players.length);
    teamNameToPlayers[teamName] = players;
  }
  console.log("Total players:", playerCount);
  
  // Generate matches
  const now = new Date();
  const matchStatuses = ["SCHEDULED", "SCHEDULED", "SCHEDULED", "LIVE", "FINISHED", "FINISHED", "FINISHED", "FINISHED"];
  let matchCount = 0;
  
  for (const [leagueName, info] of Object.entries(LEAGUES)) {
    const teams = TEAMS_BY_LEAGUE[String(info.apiId)] || [];
    if (teams.length < 2) continue;
    
    // Generate matches for this league
    for (let i = 0; i < 12; i++) {
      const homeIdx = i % teams.length;
      let awayIdx = (i + 1 + Math.floor(i / 2)) % teams.length;
      if (awayIdx === homeIdx) awayIdx = (awayIdx + 1) % teams.length;
      
      const home = teams[homeIdx];
      const away = teams[awayIdx];
      if (!home || !away) continue;
      
      const homeId = teamPrismaIds[home.id];
      const awayId = teamPrismaIds[away.id];
      if (!homeId || !awayId) continue;
      
      const status = matchStatuses[i % matchStatuses.length];
      const daysOffset = status === "FINISHED" ? -(i + 1) : (status === "LIVE" ? 0 : (i + 1));
      const matchDate = new Date(now.getTime() + daysOffset * 86400000);
      matchDate.setHours(19 + (i % 4), 0, 0, 0);
      
      let homeScore = null, awayScore = null;
      if (status === "FINISHED") {
        homeScore = Math.floor(Math.random() * 4);
        awayScore = Math.floor(Math.random() * 3);
      } else if (status === "LIVE") {
        homeScore = Math.floor(Math.random() * 3);
        awayScore = Math.floor(Math.random() * 2);
      }
      
      await prisma.match.upsert({
        where: { apiId: 100000 + info.apiId * 100 + i },
        update: {
          status, minute: status === "LIVE" ? Math.floor(Math.random() * 80 + 5) : 0,
          homeScore, awayScore, date: matchDate,
          leagueId: league.id,
        },
        create: {
          apiId: 100000 + info.apiId * 100 + i,
          status, minute: status === "LIVE" ? Math.floor(Math.random() * 80 + 5) : 0,
          homeTeamId: homeId, awayTeamId: awayId,
          homeScore, awayScore, date: matchDate,
          leagueId: league.id,
        },
      });
      matchCount++;
    }
  }
  console.log("Total matches:", matchCount);
  
  // Standings
  let standingCount = 0;
  for (const [leagueName, info] of Object.entries(LEAGUES)) {
    if (String(info.apiId) === "2") continue; // Skip Champions League for standings
    const teams = TEAMS_BY_LEAGUE[String(info.apiId)] || [];
    if (teams.length < 2) continue;
    
    for (let i = 0; i < teams.length; i++) {
      const t = teams[i];
      const teamId = teamPrismaIds[t.id];
      if (!teamId) continue;
      
      const played = 20 + Math.floor(Math.random() * 5);
      const won = Math.max(0, Math.min(played, Math.floor(played * (0.5 - i * 0.03))));
      const drawn = Math.max(0, Math.floor(played * 0.2));
      const lost = Math.max(0, played - won - drawn);
      
      await prisma.standing.upsert({
        where: {
          leagueId_season_teamId: {
            leagueId: league.id,
            season: info.season,
            teamId,
          },
        },
        update: {
          position: i + 1, played, won, drawn, lost,
          goalsFor: won * 2 + drawn + Math.floor(Math.random() * 10),
          goalsAgainst: lost * 2 + drawn + Math.floor(Math.random() * 5),
          points: won * 3 + drawn,
        },
        create: {
          leagueId: league.id, season: info.season, position: i + 1, teamId,
          played, won, drawn, lost,
          goalsFor: won * 2 + drawn + Math.floor(Math.random() * 10),
          goalsAgainst: lost * 2 + drawn + Math.floor(Math.random() * 5),
          points: won * 3 + drawn,
        },
      });
      standingCount++;
    }
  }
  console.log("Total standings:", standingCount);
  
  // News articles
const newsArticles = [
  {title:"Real Madrid defeat Barcelona 3-1 in El Clasico",slug:"real-madrid-win-clasico",content:"Real Madrid secured a dominant victory over Barcelona in the latest El Clasico, with Vinicius Junior scoring twice. The win puts Real Madrid top of La Liga with a 5-point lead over their rivals.",category:"MATCH_REPORT"},
  {title:"Liverpool extend Premier League lead with win over Arsenal",slug:"liverpool-extend-lead",content:"Liverpool put on a masterclass performance at Anfield, defeating Arsenal 3-0 to extend their lead at the top of the Premier League to 8 points. Mohamed Salah was the star with a goal and two assists.",category:"MATCH_REPORT"},
  {title:"Man City complete signing of Brazilian wonderkid",slug:"man-city-new-signing",content:"Manchester City have completed the signing of 19-year-old Brazilian midfielder promising talent for a fee of 75 million euros. The youngster has been labeled as the next big thing in world football.",category:"TRANSFER"},
  {title:"World Cup 2026: Complete guide and schedule",slug:"world-cup-2026-guide",content:"With the 2026 FIFA World Cup approaching, here is everything you need to know about the tournament. The expanded 48-team competition will be hosted across USA, Canada, and Mexico.",category:"WORLD_CUP"},
  {title:"Champions League quarter-final draw announced",slug:"champions-league-draw",content:"The draw for the UEFA Champions League quarter-finals has been made, with some mouth-watering ties including Real Madrid vs Bayern Munich and Manchester City vs PSG.",category:"CHAMPIONS_LEAGUE"},
  {title:"Kylian Mbappe scores hat-trick in Champions League",slug:"mbappe-hattrick-ucl",content:"Kylian Mbappe produced a stunning performance, scoring a hat-trick to lead PSG to a 5-2 victory in the Champions League. The French forward now has 12 goals in the competition this season.",category:"CHAMPIONS_LEAGUE"},
  {title:"Cristiano Ronaldo reaches 900 career goals",slug:"ronaldo-900-goals",content:"Cristiano Ronaldo has reached an unprecedented milestone, scoring his 900th career goal with a trademark finish for Al Nassr. The Portuguese legend continues to defy age and expectations.",category:"HISTORIC"},
  {title:"Barcelona's Lamine Yamal wins Golden Boy award",slug:"yamal-golden-boy",content:"Barcelona teenager Lamine Yamal has been awarded the prestigious Golden Boy award for 2025, recognizing him as the best young player in European football. The 17-year-old has been sensational this season.",category:"AWARD"},
  {title:"Saudi Pro League: Al Hilal crowned champions",slug:"al-hilal-champions",content:"Al Hilal have been crowned Saudi Pro League champions for the record 19th time after a dominant season. Aleksandar Mitrovic finished as top scorer with 28 goals.",category:"LEAGUE"},
  {title:"Harry Kane breaks Bundesliga scoring record",slug:"kane-record",content:"Harry Kane has broken the Bundesliga record for most goals in a single season, scoring his 37th goal of the campaign for Bayern Munich. The England captain has been in sensational form.",category:"RECORD"},
  {title:"Tactical analysis: How Inter Milan beat AC Milan in the Derby",slug:"tactical-derby-milan",content:"In-depth tactical analysis of the Milan derby. Inter's 3-5-2 system overwhelmed AC Milan's midfield, with Lautaro Martinez exploiting the spaces between the lines. Simone Inzaghi's tactical setup was masterful.",category:"TACTICAL"},
  {title:"Mohamed Salah: The evolution of a legend",slug:"salah-analysis",content:"Mohamed Salah continues to redefine what's possible for a winger in modern football. His intelligent movement, clinical finishing, and playmaking ability make him one of the most complete attackers in the world.",category:"PLAYER_ANALYSIS"},
];
  
  let newsCount = 0;
  let commentCount = 0;
  for (const article of newsArticles) {
    const news = await prisma.news.upsert({
      where: { slug: article.slug },
      update: { title: article.title, content: article.content, category: article.category },
      create: {
        title: article.title, slug: article.slug, content: article.content,
        excerpt: article.content.substring(0, 120) + "...",
        category: article.category,
        featured: newsCount < 4,
        published: true,
        views: Math.floor(Math.random() * 5000) + 100,
      },
    });
    newsCount++;
    
    // Add comments
    const commentTexts = ["Great article! Very insightful analysis.", "I agree with the tactical points made here.", "Excellent coverage as always from Football World!", "This is why I love this site. Keep it up!", "Amazing analysis!"]; // Simplified, no emoji
    const cText = commentTexts[newsCount % commentTexts.length];
    await prisma.comment.create({
      data: { content: cText, newsId: news.id },
    });
    commentCount++;
  }
  console.log("News articles:", newsCount, "Comments:", commentCount);
  
  console.log("\n=== SEEDING COMPLETE ===");
  console.log("Summary:");
  console.log("  Admin: admin@footballworld.com / admin123");
  console.log("  Leagues: " + Object.keys(LEAGUES).length);
  console.log("  Teams: " + Object.keys(teamPrismaIds).length);
  console.log("  Players: " + playerCount);
  console.log("  Matches: " + matchCount);
  console.log("  Standings: " + standingCount);
  console.log("  News: " + newsCount);
}

// Add hashCode to String
String.prototype.hashCode = function() {
  let hash = 0;
  for (let i = 0; i < this.length; i++) {
    const char = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash;
};

main()
  .catch(e => console.error("FATAL:", e.message, e.stack))
  .finally(() => prisma.$disconnect());
