// 375 unique CA zip codes from Melissa dataset
const MELISSA_ZIPS = {
  "90001": {
    "name": "Firestone Park",
    "county": "Los Angeles",
    "lat": 33.974,
    "lng": -118.2494
  },
  "90002": {
    "name": "Los Angeles",
    "county": "Los Angeles",
    "lat": 33.9493,
    "lng": -118.2462
  },
  "90003": {
    "name": "Broadway Manchester",
    "county": "Los Angeles",
    "lat": 33.9634,
    "lng": -118.2742
  },
  "90004": {
    "name": "Los Angeles",
    "county": "Los Angeles",
    "lat": 34.0761,
    "lng": -118.3031
  },
  "90005": {
    "name": "Los Angeles",
    "county": "Los Angeles",
    "lat": 34.059,
    "lng": -118.3024
  },
  "90006": {
    "name": "Los Angeles",
    "county": "Los Angeles",
    "lat": 34.0502,
    "lng": -118.2928
  },
  "90007": {
    "name": "Dockweiler",
    "county": "Los Angeles",
    "lat": 34.0282,
    "lng": -118.2851
  },
  "90008": {
    "name": "Baldwin Hills",
    "county": "Los Angeles",
    "lat": 34.0107,
    "lng": -118.3417
  },
  "90010": {
    "name": "Los Angeles",
    "county": "Los Angeles",
    "lat": 34.0618,
    "lng": -118.3036
  },
  "90011": {
    "name": "Los Angeles",
    "county": "Los Angeles",
    "lat": 34.008,
    "lng": -118.2591
  },
  "90012": {
    "name": "Federal",
    "county": "Los Angeles",
    "lat": 34.0591,
    "lng": -118.2421
  },
  "90013": {
    "name": "Federal",
    "county": "Los Angeles",
    "lat": 34.0464,
    "lng": -118.2454
  },
  "90014": {
    "name": "Los Angeles",
    "county": "Los Angeles",
    "lat": 34.0448,
    "lng": -118.2529
  },
  "90015": {
    "name": "Los Angeles",
    "county": "Los Angeles",
    "lat": 34.0403,
    "lng": -118.2641
  },
  "90016": {
    "name": "Los Angeles",
    "county": "Los Angeles",
    "lat": 34.029,
    "lng": -118.3529
  },
  "90017": {
    "name": "Foy",
    "county": "Los Angeles",
    "lat": 34.0521,
    "lng": -118.263
  },
  "90018": {
    "name": "Cimarron",
    "county": "Los Angeles",
    "lat": 34.0303,
    "lng": -118.3166
  },
  "90019": {
    "name": "Los Angeles",
    "county": "Los Angeles",
    "lat": 34.0487,
    "lng": -118.3362
  },
  "90020": {
    "name": "Los Angeles",
    "county": "Los Angeles",
    "lat": 34.0664,
    "lng": -118.3021
  },
  "90021": {
    "name": "Los Angeles",
    "county": "Los Angeles",
    "lat": 34.0307,
    "lng": -118.242
  },
  "90022": {
    "name": "Commerce",
    "county": "Los Angeles",
    "lat": 34.0233,
    "lng": -118.1551
  },
  "90023": {
    "name": "Commerce",
    "county": "Los Angeles",
    "lat": 34.0233,
    "lng": -118.2026
  },
  "90024": {
    "name": "Los Angeles",
    "county": "Los Angeles",
    "lat": 34.0615,
    "lng": -118.4407
  },
  "90025": {
    "name": "Los Angeles",
    "county": "Los Angeles",
    "lat": 34.0454,
    "lng": -118.4502
  },
  "90026": {
    "name": "Echo Park",
    "county": "Los Angeles",
    "lat": 34.0772,
    "lng": -118.265
  },
  "90027": {
    "name": "Hollywood",
    "county": "Los Angeles",
    "lat": 34.1051,
    "lng": -118.2923
  },
  "90028": {
    "name": "Hollywood",
    "county": "Los Angeles",
    "lat": 34.1006,
    "lng": -118.3276
  },
  "90029": {
    "name": "Los Angeles",
    "county": "Los Angeles",
    "lat": 34.0904,
    "lng": -118.2944
  },
  "90031": {
    "name": "Lincoln Heights",
    "county": "Los Angeles",
    "lat": 34.0773,
    "lng": -118.2131
  },
  "90032": {
    "name": "Los Angeles",
    "county": "Los Angeles",
    "lat": 34.0816,
    "lng": -118.1765
  },
  "90033": {
    "name": "Boyle Heights",
    "county": "Los Angeles",
    "lat": 34.0495,
    "lng": -118.2114
  },
  "90034": {
    "name": "Los Angeles",
    "county": "Los Angeles",
    "lat": 34.028,
    "lng": -118.4027
  },
  "90035": {
    "name": "Los Angeles",
    "county": "Los Angeles",
    "lat": 34.0544,
    "lng": -118.3837
  },
  "90036": {
    "name": "Farmer Market",
    "county": "Los Angeles",
    "lat": 34.0681,
    "lng": -118.3504
  },
  "90037": {
    "name": "Green",
    "county": "Los Angeles",
    "lat": 34.0036,
    "lng": -118.2871
  },
  "90038": {
    "name": "Hollywood",
    "county": "Los Angeles",
    "lat": 34.0893,
    "lng": -118.3252
  },
  "90039": {
    "name": "Griffith",
    "county": "Los Angeles",
    "lat": 34.1111,
    "lng": -118.2611
  },
  "90040": {
    "name": "Commerce",
    "county": "Los Angeles",
    "lat": 33.9947,
    "lng": -118.1517
  },
  "90041": {
    "name": "Eagle Rock",
    "county": "Los Angeles",
    "lat": 34.1361,
    "lng": -118.2065
  },
  "90042": {
    "name": "Highland Park",
    "county": "Los Angeles",
    "lat": 34.1137,
    "lng": -118.1919
  },
  "90043": {
    "name": "La Tijera",
    "county": "Los Angeles",
    "lat": 33.9867,
    "lng": -118.3332
  },
  "90044": {
    "name": "August F Haw",
    "county": "Los Angeles",
    "lat": 33.954,
    "lng": -118.2921
  },
  "90045": {
    "name": "Bradley International",
    "county": "Los Angeles",
    "lat": 33.9611,
    "lng": -118.3934
  },
  "90046": {
    "name": "Los Angeles",
    "county": "Los Angeles",
    "lat": 34.097,
    "lng": -118.3587
  },
  "90047": {
    "name": "Los Angeles",
    "county": "Los Angeles",
    "lat": 33.9568,
    "lng": -118.3088
  },
  "90048": {
    "name": "Bicentennial",
    "county": "Los Angeles",
    "lat": 34.0725,
    "lng": -118.3747
  },
  "90049": {
    "name": "Barrington",
    "county": "Los Angeles",
    "lat": 34.0622,
    "lng": -118.472
  },
  "90056": {
    "name": "Baldwin Hills",
    "county": "Los Angeles",
    "lat": 33.9862,
    "lng": -118.369
  },
  "90057": {
    "name": "Flint",
    "county": "Los Angeles",
    "lat": 34.062,
    "lng": -118.2767
  },
  "90058": {
    "name": "Los Angeles",
    "county": "Los Angeles",
    "lat": 34.0014,
    "lng": -118.2184
  },
  "90059": {
    "name": "August F Haw",
    "county": "Los Angeles",
    "lat": 33.9271,
    "lng": -118.2483
  },
  "90061": {
    "name": "August F Haw",
    "county": "Los Angeles",
    "lat": 33.9228,
    "lng": -118.2742
  },
  "90062": {
    "name": "Los Angeles",
    "county": "Los Angeles",
    "lat": 34.0049,
    "lng": -118.3087
  },
  "90063": {
    "name": "Hazard",
    "county": "Los Angeles",
    "lat": 34.0451,
    "lng": -118.186
  },
  "90064": {
    "name": "Los Angeles",
    "county": "Los Angeles",
    "lat": 34.0346,
    "lng": -118.4325
  },
  "90065": {
    "name": "Glassell",
    "county": "Los Angeles",
    "lat": 34.1093,
    "lng": -118.228
  },
  "90066": {
    "name": "Culver Cty",
    "county": "Los Angeles",
    "lat": 34.002,
    "lng": -118.4292
  },
  "90067": {
    "name": "Century City",
    "county": "Los Angeles",
    "lat": 34.0588,
    "lng": -118.4152
  },
  "90068": {
    "name": "Hollywood",
    "county": "Los Angeles",
    "lat": 34.1174,
    "lng": -118.3328
  },
  "90069": {
    "name": "Los Angeles",
    "county": "Los Angeles",
    "lat": 34.0893,
    "lng": -118.3799
  },
  "90071": {
    "name": "Arco",
    "county": "Los Angeles",
    "lat": 34.0519,
    "lng": -118.2552
  },
  "90073": {
    "name": "Los Angeles",
    "county": "Los Angeles",
    "lat": 34.0589,
    "lng": -118.4516
  },
  "90077": {
    "name": "Barrington",
    "county": "Los Angeles",
    "lat": 34.1044,
    "lng": -118.4517
  },
  "90089": {
    "name": "Los Angeles",
    "county": "Los Angeles",
    "lat": 34.0204,
    "lng": -118.2861
  },
  "90094": {
    "name": "Los Angeles",
    "county": "Los Angeles",
    "lat": 33.9737,
    "lng": -118.4233
  },
  "90201": {
    "name": "Bell",
    "county": "Los Angeles",
    "lat": 33.9694,
    "lng": -118.1741
  },
  "90210": {
    "name": "Beverly Hills",
    "county": "Los Angeles",
    "lat": 34.0859,
    "lng": -118.405
  },
  "90211": {
    "name": "Beverly Hills",
    "county": "Los Angeles",
    "lat": 34.0656,
    "lng": -118.3818
  },
  "90212": {
    "name": "Beverly Hills",
    "county": "Los Angeles",
    "lat": 34.0634,
    "lng": -118.3995
  },
  "90220": {
    "name": "Compton",
    "county": "Los Angeles",
    "lat": 33.8855,
    "lng": -118.2354
  },
  "90221": {
    "name": "Compton",
    "county": "Los Angeles",
    "lat": 33.8953,
    "lng": -118.2056
  },
  "90222": {
    "name": "Compton",
    "county": "Los Angeles",
    "lat": 33.9119,
    "lng": -118.2351
  },
  "90230": {
    "name": "Culver City",
    "county": "Los Angeles",
    "lat": 33.9948,
    "lng": -118.3953
  },
  "90232": {
    "name": "Culver City",
    "county": "Los Angeles",
    "lat": 34.0196,
    "lng": -118.3959
  },
  "90240": {
    "name": "Downey",
    "county": "Los Angeles",
    "lat": 33.957,
    "lng": -118.1194
  },
  "90241": {
    "name": "Downey",
    "county": "Los Angeles",
    "lat": 33.9413,
    "lng": -118.1319
  },
  "90242": {
    "name": "Downey",
    "county": "Los Angeles",
    "lat": 33.9215,
    "lng": -118.1413
  },
  "90245": {
    "name": "El Segundo",
    "county": "Los Angeles",
    "lat": 33.9195,
    "lng": -118.4022
  },
  "90247": {
    "name": "Gardena",
    "county": "Los Angeles",
    "lat": 33.8919,
    "lng": -118.2985
  },
  "90248": {
    "name": "Gardena",
    "county": "Los Angeles",
    "lat": 33.8758,
    "lng": -118.2857
  },
  "90249": {
    "name": "Gardena",
    "county": "Los Angeles",
    "lat": 33.9016,
    "lng": -118.3186
  },
  "90250": {
    "name": "Hawthorne",
    "county": "Los Angeles",
    "lat": 33.914,
    "lng": -118.3478
  },
  "90254": {
    "name": "Hermosa Beach",
    "county": "Los Angeles",
    "lat": 33.8643,
    "lng": -118.397
  },
  "90255": {
    "name": "Huntington Park",
    "county": "Los Angeles",
    "lat": 33.9788,
    "lng": -118.2187
  },
  "90260": {
    "name": "Lawndale",
    "county": "Los Angeles",
    "lat": 33.8888,
    "lng": -118.3524
  },
  "90262": {
    "name": "Lynwood",
    "county": "Los Angeles",
    "lat": 33.9246,
    "lng": -118.2027
  },
  "90263": {
    "name": "Malibu",
    "county": "Los Angeles",
    "lat": 34.0393,
    "lng": -118.7085
  },
  "90265": {
    "name": "Malibu",
    "county": "Los Angeles",
    "lat": 34.0378,
    "lng": -118.7577
  },
  "90266": {
    "name": "Manhattan Beach",
    "county": "Los Angeles",
    "lat": 33.8901,
    "lng": -118.4019
  },
  "90270": {
    "name": "Bell Gardens",
    "county": "Los Angeles",
    "lat": 33.9889,
    "lng": -118.1891
  },
  "90272": {
    "name": "Pacific Palisades",
    "county": "Los Angeles",
    "lat": 34.0485,
    "lng": -118.5359
  },
  "90274": {
    "name": "Palos Verdes Estates",
    "county": "Los Angeles",
    "lat": 33.7784,
    "lng": -118.378
  },
  "90275": {
    "name": "Palos Verdes Estates",
    "county": "Los Angeles",
    "lat": 33.7618,
    "lng": -118.3669
  },
  "90277": {
    "name": "Redondo Beach",
    "county": "Los Angeles",
    "lat": 33.8325,
    "lng": -118.3855
  },
  "90278": {
    "name": "Redondo Beach",
    "county": "Los Angeles",
    "lat": 33.8721,
    "lng": -118.3711
  },
  "90280": {
    "name": "South Gate",
    "county": "Los Angeles",
    "lat": 33.9436,
    "lng": -118.1974
  },
  "90290": {
    "name": "Topanga",
    "county": "Los Angeles",
    "lat": 34.1013,
    "lng": -118.6001
  },
  "90291": {
    "name": "Playa Del Rey",
    "county": "Los Angeles",
    "lat": 33.9929,
    "lng": -118.4659
  },
  "90292": {
    "name": "Marina Del Rey",
    "county": "Los Angeles",
    "lat": 33.9803,
    "lng": -118.4498
  },
  "90293": {
    "name": "Playa Del Rey",
    "county": "Los Angeles",
    "lat": 33.9574,
    "lng": -118.439
  },
  "90301": {
    "name": "Inglewood",
    "county": "Los Angeles",
    "lat": 33.9564,
    "lng": -118.3545
  },
  "90302": {
    "name": "Inglewood",
    "county": "Los Angeles",
    "lat": 33.9738,
    "lng": -118.3577
  },
  "90303": {
    "name": "Inglewood",
    "county": "Los Angeles",
    "lat": 33.938,
    "lng": -118.3315
  },
  "90304": {
    "name": "Inglewood",
    "county": "Los Angeles",
    "lat": 33.9396,
    "lng": -118.3583
  },
  "90305": {
    "name": "Inglewood",
    "county": "Los Angeles",
    "lat": 33.9581,
    "lng": -118.3285
  },
  "90401": {
    "name": "Santa Monica",
    "county": "Los Angeles",
    "lat": 34.0172,
    "lng": -118.4932
  },
  "90402": {
    "name": "Santa Monica",
    "county": "Los Angeles",
    "lat": 34.0328,
    "lng": -118.5055
  },
  "90403": {
    "name": "Santa Monica",
    "county": "Los Angeles",
    "lat": 34.0289,
    "lng": -118.4934
  },
  "90404": {
    "name": "Santa Monica",
    "county": "Los Angeles",
    "lat": 34.0277,
    "lng": -118.4746
  },
  "90405": {
    "name": "Santa Monica",
    "county": "Los Angeles",
    "lat": 34.0101,
    "lng": -118.4725
  },
  "90501": {
    "name": "Torrance",
    "county": "Los Angeles",
    "lat": 33.829,
    "lng": -118.3143
  },
  "90502": {
    "name": "Torrance",
    "county": "Los Angeles",
    "lat": 33.8316,
    "lng": -118.2929
  },
  "90503": {
    "name": "Torrance",
    "county": "Los Angeles",
    "lat": 33.8395,
    "lng": -118.354
  },
  "90504": {
    "name": "Torrance",
    "county": "Los Angeles",
    "lat": 33.8708,
    "lng": -118.3308
  },
  "90505": {
    "name": "Torrance",
    "county": "Los Angeles",
    "lat": 33.8109,
    "lng": -118.3483
  },
  "90601": {
    "name": "City Of Industry",
    "county": "Los Angeles",
    "lat": 33.9956,
    "lng": -118.0405
  },
  "90602": {
    "name": "Whittier",
    "county": "Los Angeles",
    "lat": 33.9709,
    "lng": -118.0354
  },
  "90603": {
    "name": "Whittier",
    "county": "Los Angeles",
    "lat": 33.9433,
    "lng": -117.9915
  },
  "90604": {
    "name": "Whittier",
    "county": "Los Angeles",
    "lat": 33.9301,
    "lng": -118.0136
  },
  "90605": {
    "name": "Whittier",
    "county": "Los Angeles",
    "lat": 33.9453,
    "lng": -118.0343
  },
  "90606": {
    "name": "Los Nietos",
    "county": "Los Angeles",
    "lat": 33.9764,
    "lng": -118.0658
  },
  "90620": {
    "name": "Buena Park",
    "county": "Orange",
    "lat": 33.8425,
    "lng": -118.0124
  },
  "90621": {
    "name": "Buena Park",
    "county": "Orange",
    "lat": 33.8706,
    "lng": -117.9963
  },
  "90623": {
    "name": "Buena Park",
    "county": "Orange",
    "lat": 33.8502,
    "lng": -118.0399
  },
  "90630": {
    "name": "Cypress",
    "county": "Orange",
    "lat": 33.8215,
    "lng": -118.04
  },
  "90631": {
    "name": "La Habra",
    "county": "Orange",
    "lat": 33.9314,
    "lng": -117.9524
  },
  "90638": {
    "name": "La Mirada",
    "county": "Los Angeles",
    "lat": 33.9052,
    "lng": -118.0074
  },
  "90639": {
    "name": "La Mirada",
    "county": "Los Angeles",
    "lat": 33.9062,
    "lng": -118.015
  },
  "90640": {
    "name": "Montebello",
    "county": "Los Angeles",
    "lat": 34.0129,
    "lng": -118.113
  },
  "90650": {
    "name": "Norwalk",
    "county": "Los Angeles",
    "lat": 33.9059,
    "lng": -118.0822
  },
  "90660": {
    "name": "Pico Rivera",
    "county": "Los Angeles",
    "lat": 33.99,
    "lng": -118.0908
  },
  "90670": {
    "name": "Santa Fe Springs",
    "county": "Los Angeles",
    "lat": 33.9372,
    "lng": -118.0664
  },
  "90680": {
    "name": "Stanton",
    "county": "Orange",
    "lat": 33.8011,
    "lng": -117.9952
  },
  "90701": {
    "name": "Artesia",
    "county": "Los Angeles",
    "lat": 33.8662,
    "lng": -118.0812
  },
  "90703": {
    "name": "Artesia",
    "county": "Los Angeles",
    "lat": 33.8684,
    "lng": -118.0682
  },
  "90704": {
    "name": "Avalon",
    "county": "Los Angeles",
    "lat": 33.3746,
    "lng": -118.4506
  },
  "90706": {
    "name": "Bellflower",
    "county": "Los Angeles",
    "lat": 33.8854,
    "lng": -118.1282
  },
  "90710": {
    "name": "Harbor City",
    "county": "Los Angeles",
    "lat": 33.7952,
    "lng": -118.2983
  },
  "90712": {
    "name": "Lakewood",
    "county": "Los Angeles",
    "lat": 33.8491,
    "lng": -118.1473
  },
  "90713": {
    "name": "Lakewood",
    "county": "Los Angeles",
    "lat": 33.8488,
    "lng": -118.1129
  },
  "90715": {
    "name": "Lakewood",
    "county": "Los Angeles",
    "lat": 33.8398,
    "lng": -118.0789
  },
  "90716": {
    "name": "Hawaiian Gardens",
    "county": "Los Angeles",
    "lat": 33.8312,
    "lng": -118.073
  },
  "90717": {
    "name": "Lomita",
    "county": "Los Angeles",
    "lat": 33.7944,
    "lng": -118.3175
  },
  "90720": {
    "name": "Cypress",
    "county": "Orange",
    "lat": 33.7989,
    "lng": -118.0686
  },
  "90723": {
    "name": "Paramount",
    "county": "Los Angeles",
    "lat": 33.8959,
    "lng": -118.1655
  },
  "90731": {
    "name": "Fort Macarthur",
    "county": "Los Angeles",
    "lat": 33.7328,
    "lng": -118.292
  },
  "90732": {
    "name": "San Pedro",
    "county": "Los Angeles",
    "lat": 33.7397,
    "lng": -118.3133
  },
  "90740": {
    "name": "Seal Beach",
    "county": "Orange",
    "lat": 33.7613,
    "lng": -118.0875
  },
  "90742": {
    "name": "Sunset Beach",
    "county": "Orange",
    "lat": 33.7167,
    "lng": -118.069
  },
  "90743": {
    "name": "Surfside",
    "county": "Orange",
    "lat": 33.7285,
    "lng": -118.0842
  },
  "90744": {
    "name": "Wilmington",
    "county": "Los Angeles",
    "lat": 33.7838,
    "lng": -118.2625
  },
  "90745": {
    "name": "Carson",
    "county": "Los Angeles",
    "lat": 33.826,
    "lng": -118.2694
  },
  "90746": {
    "name": "Carson",
    "county": "Los Angeles",
    "lat": 33.8612,
    "lng": -118.2598
  },
  "90747": {
    "name": "C S U Dom Hls",
    "county": "Los Angeles",
    "lat": 33.8671,
    "lng": -118.2593
  },
  "90755": {
    "name": "Long Beach",
    "county": "Los Angeles",
    "lat": 33.7995,
    "lng": -118.1664
  },
  "90802": {
    "name": "Long Beach",
    "county": "Los Angeles",
    "lat": 33.7691,
    "lng": -118.1848
  },
  "90803": {
    "name": "Belmont Shore",
    "county": "Los Angeles",
    "lat": 33.7616,
    "lng": -118.1373
  },
  "90804": {
    "name": "East Long Beach",
    "county": "Los Angeles",
    "lat": 33.7817,
    "lng": -118.1535
  },
  "90805": {
    "name": "Lakewood",
    "county": "Los Angeles",
    "lat": 33.8626,
    "lng": -118.1787
  },
  "90806": {
    "name": "Long Beach",
    "county": "Los Angeles",
    "lat": 33.8019,
    "lng": -118.1886
  },
  "90807": {
    "name": "Bixby Knolls",
    "county": "Los Angeles",
    "lat": 33.8328,
    "lng": -118.1815
  },
  "90808": {
    "name": "Long Beach",
    "county": "Los Angeles",
    "lat": 33.8245,
    "lng": -118.115
  },
  "90810": {
    "name": "Cabrillo",
    "county": "Los Angeles",
    "lat": 33.8135,
    "lng": -118.2176
  },
  "90813": {
    "name": "Long Beach",
    "county": "Los Angeles",
    "lat": 33.7815,
    "lng": -118.1863
  },
  "90814": {
    "name": "Long Beach",
    "county": "Los Angeles",
    "lat": 33.7715,
    "lng": -118.1521
  },
  "90815": {
    "name": "Long Beach",
    "county": "Los Angeles",
    "lat": 33.794,
    "lng": -118.1226
  },
  "90822": {
    "name": "Long Beach",
    "county": "Los Angeles",
    "lat": 33.7392,
    "lng": -118.2566
  },
  "91001": {
    "name": "Altadena",
    "county": "Los Angeles",
    "lat": 34.1908,
    "lng": -118.1392
  },
  "91006": {
    "name": "Arcadia",
    "county": "Los Angeles",
    "lat": 34.1324,
    "lng": -118.0253
  },
  "91007": {
    "name": "Arcadia",
    "county": "Los Angeles",
    "lat": 34.1276,
    "lng": -118.0536
  },
  "91008": {
    "name": "Bradbury",
    "county": "Los Angeles",
    "lat": 34.1499,
    "lng": -117.9657
  },
  "91010": {
    "name": "Duarte",
    "county": "Los Angeles",
    "lat": 34.1378,
    "lng": -117.9663
  },
  "91011": {
    "name": "Flintridge",
    "county": "Los Angeles",
    "lat": 34.2078,
    "lng": -118.2025
  },
  "91016": {
    "name": "Monrovia",
    "county": "Los Angeles",
    "lat": 34.1431,
    "lng": -118.0039
  },
  "91020": {
    "name": "Montrose",
    "county": "Los Angeles",
    "lat": 34.2102,
    "lng": -118.2308
  },
  "91024": {
    "name": "Sierra Madre",
    "county": "Los Angeles",
    "lat": 34.1648,
    "lng": -118.0526
  },
  "91030": {
    "name": "South Pasadena",
    "county": "Los Angeles",
    "lat": 34.112,
    "lng": -118.1545
  },
  "91040": {
    "name": "Shadow Hills",
    "county": "Los Angeles",
    "lat": 34.2603,
    "lng": -118.3248
  },
  "91042": {
    "name": "Tujunga",
    "county": "Los Angeles",
    "lat": 34.2547,
    "lng": -118.2869
  },
  "91046": {
    "name": "Verdugo City",
    "county": "Los Angeles",
    "lat": 34.2118,
    "lng": -118.2405
  },
  "91101": {
    "name": "Pasadena",
    "county": "Los Angeles",
    "lat": 34.1452,
    "lng": -118.1385
  },
  "91103": {
    "name": "Pasadena",
    "county": "Los Angeles",
    "lat": 34.1636,
    "lng": -118.1555
  },
  "91104": {
    "name": "Pasadena",
    "county": "Los Angeles",
    "lat": 34.1671,
    "lng": -118.1277
  },
  "91105": {
    "name": "Pasadena",
    "county": "Los Angeles",
    "lat": 34.1371,
    "lng": -118.1592
  },
  "91106": {
    "name": "Pasadena",
    "county": "Los Angeles",
    "lat": 34.1428,
    "lng": -118.1284
  },
  "91107": {
    "name": "Pasadena",
    "county": "Los Angeles",
    "lat": 34.1508,
    "lng": -118.0918
  },
  "91108": {
    "name": "Pasadena",
    "county": "Los Angeles",
    "lat": 34.1214,
    "lng": -118.1131
  },
  "91125": {
    "name": "Pasadena",
    "county": "Los Angeles",
    "lat": 34.1359,
    "lng": -118.1257
  },
  "91201": {
    "name": "Glendale",
    "county": "Los Angeles",
    "lat": 34.1698,
    "lng": -118.2918
  },
  "91202": {
    "name": "Glendale",
    "county": "Los Angeles",
    "lat": 34.1639,
    "lng": -118.2647
  },
  "91203": {
    "name": "Glendale",
    "county": "Los Angeles",
    "lat": 34.1528,
    "lng": -118.2612
  },
  "91204": {
    "name": "Glendale",
    "county": "Los Angeles",
    "lat": 34.1361,
    "lng": -118.26
  },
  "91205": {
    "name": "Glendale",
    "county": "Los Angeles",
    "lat": 34.1387,
    "lng": -118.2437
  },
  "91206": {
    "name": "Glendale",
    "county": "Los Angeles",
    "lat": 34.1539,
    "lng": -118.2372
  },
  "91207": {
    "name": "Glendale",
    "county": "Los Angeles",
    "lat": 34.164,
    "lng": -118.2481
  },
  "91208": {
    "name": "Glendale",
    "county": "Los Angeles",
    "lat": 34.1899,
    "lng": -118.2279
  },
  "91210": {
    "name": "Glendale",
    "county": "Los Angeles",
    "lat": 34.1452,
    "lng": -118.2563
  },
  "91214": {
    "name": "Glendale",
    "county": "Los Angeles",
    "lat": 34.2292,
    "lng": -118.2469
  },
  "91301": {
    "name": "Agoura",
    "county": "Los Angeles",
    "lat": 34.1414,
    "lng": -118.7593
  },
  "91302": {
    "name": "Calabasas",
    "county": "Los Angeles",
    "lat": 34.1434,
    "lng": -118.6615
  },
  "91303": {
    "name": "Canoga Park",
    "county": "Los Angeles",
    "lat": 34.198,
    "lng": -118.5996
  },
  "91304": {
    "name": "Box Canyon",
    "county": "Los Angeles",
    "lat": 34.2221,
    "lng": -118.6097
  },
  "91306": {
    "name": "Canoga Park",
    "county": "Los Angeles",
    "lat": 34.2088,
    "lng": -118.5759
  },
  "91307": {
    "name": "Bell Canyon",
    "county": "Los Angeles",
    "lat": 34.1978,
    "lng": -118.6377
  },
  "91311": {
    "name": "Chatsworth",
    "county": "Los Angeles",
    "lat": 34.2528,
    "lng": -118.5959
  },
  "91316": {
    "name": "Encino",
    "county": "Los Angeles",
    "lat": 34.1668,
    "lng": -118.5163
  },
  "91321": {
    "name": "Friendly Valley",
    "county": "Los Angeles",
    "lat": 34.3846,
    "lng": -118.5141
  },
  "91324": {
    "name": "Northridge",
    "county": "Los Angeles",
    "lat": 34.2359,
    "lng": -118.5467
  },
  "91325": {
    "name": "Northridge",
    "county": "Los Angeles",
    "lat": 34.2369,
    "lng": -118.5211
  },
  "91326": {
    "name": "Northridge",
    "county": "Los Angeles",
    "lat": 34.2754,
    "lng": -118.5505
  },
  "91330": {
    "name": "Northridge",
    "county": "Los Angeles",
    "lat": 34.2401,
    "lng": -118.5256
  },
  "91331": {
    "name": "Arleta",
    "county": "Los Angeles",
    "lat": 34.2577,
    "lng": -118.4197
  },
  "91335": {
    "name": "Reseda",
    "county": "Los Angeles",
    "lat": 34.1999,
    "lng": -118.5403
  },
  "91340": {
    "name": "San Fernando",
    "county": "Los Angeles",
    "lat": 34.2862,
    "lng": -118.4376
  },
  "91342": {
    "name": "Kagel Canyon",
    "county": "Los Angeles",
    "lat": 34.3053,
    "lng": -118.4358
  },
  "91343": {
    "name": "North Hills",
    "county": "Los Angeles",
    "lat": 34.2355,
    "lng": -118.4752
  },
  "91344": {
    "name": "Granada Hills",
    "county": "Los Angeles",
    "lat": 34.2748,
    "lng": -118.5014
  },
  "91345": {
    "name": "Mission Hills",
    "county": "Los Angeles",
    "lat": 34.2628,
    "lng": -118.4619
  },
  "91350": {
    "name": "Agua Dulce",
    "county": "Los Angeles",
    "lat": 34.4373,
    "lng": -118.5154
  },
  "91351": {
    "name": "Canyon Country",
    "county": "Los Angeles",
    "lat": 34.4232,
    "lng": -118.4725
  },
  "91352": {
    "name": "La Tuna Canyon",
    "county": "Los Angeles",
    "lat": 34.2254,
    "lng": -118.376
  },
  "91354": {
    "name": "Santa Clarita",
    "county": "Los Angeles",
    "lat": 34.4484,
    "lng": -118.5497
  },
  "91355": {
    "name": "Santa Clarita",
    "county": "Los Angeles",
    "lat": 34.4169,
    "lng": -118.5665
  },
  "91356": {
    "name": "Tarzana",
    "county": "Los Angeles",
    "lat": 34.17,
    "lng": -118.5411
  },
  "91364": {
    "name": "Woodland Hills",
    "county": "Los Angeles",
    "lat": 34.1621,
    "lng": -118.5984
  },
  "91367": {
    "name": "Woodland Hills",
    "county": "Los Angeles",
    "lat": 34.1789,
    "lng": -118.6097
  },
  "91381": {
    "name": "Newhall",
    "county": "Los Angeles",
    "lat": 34.3891,
    "lng": -118.5823
  },
  "91384": {
    "name": "Castaic",
    "county": "Los Angeles",
    "lat": 34.4765,
    "lng": -118.6362
  },
  "91387": {
    "name": "Canyon Country",
    "county": "Los Angeles",
    "lat": 34.4176,
    "lng": -118.4351
  },
  "91390": {
    "name": "Agua Dulce",
    "county": "Los Angeles",
    "lat": 34.4941,
    "lng": -118.4241
  },
  "91401": {
    "name": "Sherman Oaks",
    "county": "Los Angeles",
    "lat": 34.1805,
    "lng": -118.4351
  },
  "91402": {
    "name": "Panorama City",
    "county": "Los Angeles",
    "lat": 34.2262,
    "lng": -118.4483
  },
  "91403": {
    "name": "Sherman Oaks",
    "county": "Los Angeles",
    "lat": 34.1541,
    "lng": -118.4596
  },
  "91405": {
    "name": "Valley Glen",
    "county": "Los Angeles",
    "lat": 34.2004,
    "lng": -118.4485
  },
  "91406": {
    "name": "Lake Balboa",
    "county": "Los Angeles",
    "lat": 34.2006,
    "lng": -118.4871
  },
  "91411": {
    "name": "Sherman Oaks",
    "county": "Los Angeles",
    "lat": 34.1792,
    "lng": -118.4582
  },
  "91423": {
    "name": "Sherman Oaks",
    "county": "Los Angeles",
    "lat": 34.1533,
    "lng": -118.4332
  },
  "91436": {
    "name": "Encino",
    "county": "Los Angeles",
    "lat": 34.1545,
    "lng": -118.4876
  },
  "91501": {
    "name": "Burbank",
    "county": "Los Angeles",
    "lat": 34.1858,
    "lng": -118.3023
  },
  "91502": {
    "name": "Burbank",
    "county": "Los Angeles",
    "lat": 34.1764,
    "lng": -118.3068
  },
  "91504": {
    "name": "Burbank",
    "county": "Los Angeles",
    "lat": 34.1983,
    "lng": -118.33
  },
  "91505": {
    "name": "Burbank",
    "county": "Los Angeles",
    "lat": 34.167,
    "lng": -118.344
  },
  "91506": {
    "name": "Burbank",
    "county": "Los Angeles",
    "lat": 34.1714,
    "lng": -118.323
  },
  "91601": {
    "name": "North Hollywood",
    "county": "Los Angeles",
    "lat": 34.1676,
    "lng": -118.3726
  },
  "91602": {
    "name": "North Hollywood",
    "county": "Los Angeles",
    "lat": 34.1518,
    "lng": -118.3692
  },
  "91604": {
    "name": "North Hollywood",
    "county": "Los Angeles",
    "lat": 34.1444,
    "lng": -118.3938
  },
  "91605": {
    "name": "North Hollywood",
    "county": "Los Angeles",
    "lat": 34.2048,
    "lng": -118.4024
  },
  "91606": {
    "name": "North Hollywood",
    "county": "Los Angeles",
    "lat": 34.1866,
    "lng": -118.3872
  },
  "91607": {
    "name": "North Hollywood",
    "county": "Los Angeles",
    "lat": 34.1663,
    "lng": -118.3996
  },
  "91608": {
    "name": "North Hollywood",
    "county": "Los Angeles",
    "lat": 34.1377,
    "lng": -118.3588
  },
  "91702": {
    "name": "Azusa",
    "county": "Los Angeles",
    "lat": 34.1277,
    "lng": -117.905
  },
  "91706": {
    "name": "Baldwin Park",
    "county": "Los Angeles",
    "lat": 34.0843,
    "lng": -117.9687
  },
  "91711": {
    "name": "Claremont",
    "county": "Los Angeles",
    "lat": 34.1086,
    "lng": -117.7193
  },
  "91722": {
    "name": "Covina",
    "county": "Los Angeles",
    "lat": 34.0971,
    "lng": -117.9054
  },
  "91723": {
    "name": "Covina",
    "county": "Los Angeles",
    "lat": 34.086,
    "lng": -117.8868
  },
  "91724": {
    "name": "Charter Oak",
    "county": "Los Angeles",
    "lat": 34.0914,
    "lng": -117.8586
  },
  "91731": {
    "name": "El Monte",
    "county": "Los Angeles",
    "lat": 34.0785,
    "lng": -118.0399
  },
  "91732": {
    "name": "City Of Industry",
    "county": "Los Angeles",
    "lat": 34.0714,
    "lng": -118.0158
  },
  "91733": {
    "name": "El Monte",
    "county": "Los Angeles",
    "lat": 34.054,
    "lng": -118.0456
  },
  "91740": {
    "name": "Glendora",
    "county": "Los Angeles",
    "lat": 34.1166,
    "lng": -117.8532
  },
  "91741": {
    "name": "Glendora",
    "county": "Los Angeles",
    "lat": 34.1391,
    "lng": -117.8564
  },
  "91744": {
    "name": "City Of Industry",
    "county": "Los Angeles",
    "lat": 34.031,
    "lng": -117.9406
  },
  "91745": {
    "name": "City Of Industry",
    "county": "Los Angeles",
    "lat": 33.9976,
    "lng": -117.9657
  },
  "91746": {
    "name": "Bassett",
    "county": "Los Angeles",
    "lat": 34.0441,
    "lng": -117.9874
  },
  "91748": {
    "name": "City Of Industry",
    "county": "Los Angeles",
    "lat": 33.9846,
    "lng": -117.9012
  },
  "91750": {
    "name": "La Verne",
    "county": "Los Angeles",
    "lat": 34.1148,
    "lng": -117.7717
  },
  "91754": {
    "name": "Monterey Park",
    "county": "Los Angeles",
    "lat": 34.0523,
    "lng": -118.1385
  },
  "91755": {
    "name": "Monterey Park",
    "county": "Los Angeles",
    "lat": 34.0569,
    "lng": -118.1159
  },
  "91759": {
    "name": "Mt Baldy",
    "county": "Los Angeles",
    "lat": 34.2372,
    "lng": -117.6579
  },
  "91765": {
    "name": "Diamond Bar",
    "county": "Los Angeles",
    "lat": 34.0022,
    "lng": -117.8168
  },
  "91766": {
    "name": "Phillips Ranch",
    "county": "Los Angeles",
    "lat": 34.0447,
    "lng": -117.7521
  },
  "91767": {
    "name": "Pomona",
    "county": "Los Angeles",
    "lat": 34.081,
    "lng": -117.738
  },
  "91768": {
    "name": "Pomona",
    "county": "Los Angeles",
    "lat": 34.0638,
    "lng": -117.7793
  },
  "91770": {
    "name": "Rosemead",
    "county": "Los Angeles",
    "lat": 34.0666,
    "lng": -118.0851
  },
  "91773": {
    "name": "San Dimas",
    "county": "Los Angeles",
    "lat": 34.1036,
    "lng": -117.8149
  },
  "91775": {
    "name": "San Gabriel",
    "county": "Los Angeles",
    "lat": 34.1156,
    "lng": -118.0857
  },
  "91776": {
    "name": "San Gabriel",
    "county": "Los Angeles",
    "lat": 34.0895,
    "lng": -118.0967
  },
  "91780": {
    "name": "Temple City",
    "county": "Los Angeles",
    "lat": 34.1022,
    "lng": -118.0544
  },
  "91789": {
    "name": "City Of Industry",
    "county": "Los Angeles",
    "lat": 34.0162,
    "lng": -117.8578
  },
  "91790": {
    "name": "West Covina",
    "county": "Los Angeles",
    "lat": 34.067,
    "lng": -117.9378
  },
  "91791": {
    "name": "West Covina",
    "county": "Los Angeles",
    "lat": 34.0635,
    "lng": -117.8969
  },
  "91792": {
    "name": "West Covina",
    "county": "Los Angeles",
    "lat": 34.0219,
    "lng": -117.8996
  },
  "91801": {
    "name": "Alhambra",
    "county": "Los Angeles",
    "lat": 34.0921,
    "lng": -118.1295
  },
  "91803": {
    "name": "Alhambra",
    "county": "Los Angeles",
    "lat": 34.0759,
    "lng": -118.1439
  },
  "92602": {
    "name": "Irvine",
    "county": "Orange",
    "lat": 33.7261,
    "lng": -117.7757
  },
  "92603": {
    "name": "Irvine",
    "county": "Orange",
    "lat": 33.6387,
    "lng": -117.804
  },
  "92604": {
    "name": "Irvine",
    "county": "Orange",
    "lat": 33.6879,
    "lng": -117.7893
  },
  "92606": {
    "name": "Irvine",
    "county": "Orange",
    "lat": 33.6963,
    "lng": -117.8147
  },
  "92610": {
    "name": "El Toro",
    "county": "Orange",
    "lat": 33.6827,
    "lng": -117.6633
  },
  "92612": {
    "name": "Irvine",
    "county": "Orange",
    "lat": 33.6672,
    "lng": -117.8426
  },
  "92614": {
    "name": "Irvine",
    "county": "Orange",
    "lat": 33.6834,
    "lng": -117.8411
  },
  "92617": {
    "name": "Irvine",
    "county": "Orange",
    "lat": 33.6432,
    "lng": -117.8379
  },
  "92618": {
    "name": "Irvine",
    "county": "Orange",
    "lat": 33.6621,
    "lng": -117.7483
  },
  "92620": {
    "name": "Irvine",
    "county": "Orange",
    "lat": 33.7061,
    "lng": -117.758
  },
  "92624": {
    "name": "Capistrano Beach",
    "county": "Orange",
    "lat": 33.4622,
    "lng": -117.6687
  },
  "92625": {
    "name": "Corona Del Mar",
    "county": "Orange",
    "lat": 33.5993,
    "lng": -117.8697
  },
  "92626": {
    "name": "Costa Mesa",
    "county": "Orange",
    "lat": 33.6796,
    "lng": -117.9038
  },
  "92627": {
    "name": "Costa Mesa",
    "county": "Orange",
    "lat": 33.6472,
    "lng": -117.9187
  },
  "92629": {
    "name": "Dana Point",
    "county": "Orange",
    "lat": 33.4747,
    "lng": -117.7017
  },
  "92630": {
    "name": "El Toro",
    "county": "Orange",
    "lat": 33.6414,
    "lng": -117.6889
  },
  "92637": {
    "name": "Laguna Hills",
    "county": "Orange",
    "lat": 33.608,
    "lng": -117.723
  },
  "92646": {
    "name": "Huntington",
    "county": "Orange",
    "lat": 33.6692,
    "lng": -117.9702
  },
  "92647": {
    "name": "Huntington Beach",
    "county": "Orange",
    "lat": 33.7209,
    "lng": -118.0015
  },
  "92648": {
    "name": "Beach Center",
    "county": "Orange",
    "lat": 33.675,
    "lng": -117.9994
  },
  "92649": {
    "name": "Huntington Beach",
    "county": "Orange",
    "lat": 33.7213,
    "lng": -118.0434
  },
  "92651": {
    "name": "Laguna Beach",
    "county": "Orange",
    "lat": 33.5353,
    "lng": -117.7703
  },
  "92653": {
    "name": "Aliso Viejo",
    "county": "Orange",
    "lat": 33.6003,
    "lng": -117.7051
  },
  "92655": {
    "name": "Midway City",
    "county": "Orange",
    "lat": 33.7456,
    "lng": -117.9859
  },
  "92656": {
    "name": "Aliso Viejo",
    "county": "Orange",
    "lat": 33.579,
    "lng": -117.7258
  },
  "92657": {
    "name": "Newport Beach",
    "county": "Orange",
    "lat": 33.6021,
    "lng": -117.8308
  },
  "92660": {
    "name": "Newport Beach",
    "county": "Orange",
    "lat": 33.639,
    "lng": -117.8752
  },
  "92661": {
    "name": "Newport Beach",
    "county": "Orange",
    "lat": 33.6025,
    "lng": -117.9022
  },
  "92662": {
    "name": "Balboa",
    "county": "Orange",
    "lat": 33.6061,
    "lng": -117.8915
  },
  "92663": {
    "name": "Newport Beach",
    "county": "Orange",
    "lat": 33.6205,
    "lng": -117.9273
  },
  "92672": {
    "name": "San Clemente",
    "county": "Orange",
    "lat": 33.4241,
    "lng": -117.6119
  },
  "92673": {
    "name": "San Clemente",
    "county": "Orange",
    "lat": 33.4612,
    "lng": -117.6184
  },
  "92675": {
    "name": "Mission Viejo",
    "county": "Orange",
    "lat": 33.5004,
    "lng": -117.66
  },
  "92676": {
    "name": "Modjeska",
    "county": "Orange",
    "lat": 33.7172,
    "lng": -117.6427
  },
  "92677": {
    "name": "Laguna Beach",
    "county": "Orange",
    "lat": 33.5331,
    "lng": -117.7008
  },
  "92678": {
    "name": "Trabuco Canyon",
    "county": "Orange",
    "lat": 33.6605,
    "lng": -117.5903
  },
  "92679": {
    "name": "Coto De Caza",
    "county": "Orange",
    "lat": 33.6339,
    "lng": -117.5906
  },
  "92683": {
    "name": "Westminster",
    "county": "Orange",
    "lat": 33.754,
    "lng": -117.9934
  },
  "92688": {
    "name": "Rancho Santa Margarita",
    "county": "Orange",
    "lat": 33.6369,
    "lng": -117.6043
  },
  "92691": {
    "name": "Mission Viejo",
    "county": "Orange",
    "lat": 33.6072,
    "lng": -117.6675
  },
  "92692": {
    "name": "Mission Viejo",
    "county": "Orange",
    "lat": 33.6123,
    "lng": -117.6441
  },
  "92694": {
    "name": "Ladera Ranch",
    "county": "Orange",
    "lat": 33.5515,
    "lng": -117.6364
  },
  "92701": {
    "name": "Santa Ana",
    "county": "Orange",
    "lat": 33.7481,
    "lng": -117.8613
  },
  "92703": {
    "name": "Bristol",
    "county": "Orange",
    "lat": 33.7485,
    "lng": -117.9054
  },
  "92704": {
    "name": "Diamond",
    "county": "Orange",
    "lat": 33.7213,
    "lng": -117.9071
  },
  "92705": {
    "name": "Cowan Heights",
    "county": "Orange",
    "lat": 33.7555,
    "lng": -117.8241
  },
  "92706": {
    "name": "King",
    "county": "Orange",
    "lat": 33.7648,
    "lng": -117.8806
  },
  "92707": {
    "name": "Costa Mesa",
    "county": "Orange",
    "lat": 33.7112,
    "lng": -117.8703
  },
  "92708": {
    "name": "Fountain Valley",
    "county": "Orange",
    "lat": 33.7104,
    "lng": -117.9513
  },
  "92780": {
    "name": "Tustin",
    "county": "Orange",
    "lat": 33.738,
    "lng": -117.8211
  },
  "92782": {
    "name": "Tustin",
    "county": "Orange",
    "lat": 33.7341,
    "lng": -117.7926
  },
  "92801": {
    "name": "Anaheim",
    "county": "Orange",
    "lat": 33.8423,
    "lng": -117.953
  },
  "92802": {
    "name": "Anaheim",
    "county": "Orange",
    "lat": 33.8062,
    "lng": -117.9234
  },
  "92804": {
    "name": "Anaheim",
    "county": "Orange",
    "lat": 33.819,
    "lng": -117.9789
  },
  "92805": {
    "name": "Anaheim",
    "county": "Orange",
    "lat": 33.8328,
    "lng": -117.908
  },
  "92806": {
    "name": "Anaheim",
    "county": "Orange",
    "lat": 33.8368,
    "lng": -117.8748
  },
  "92807": {
    "name": "Anaheim",
    "county": "Orange",
    "lat": 33.8524,
    "lng": -117.7957
  },
  "92808": {
    "name": "Anaheim",
    "county": "Orange",
    "lat": 33.8583,
    "lng": -117.7423
  },
  "92821": {
    "name": "Brea",
    "county": "Orange",
    "lat": 33.9224,
    "lng": -117.8932
  },
  "92823": {
    "name": "Brea",
    "county": "Orange",
    "lat": 33.9201,
    "lng": -117.8346
  },
  "92831": {
    "name": "Fullerton",
    "county": "Orange",
    "lat": 33.8798,
    "lng": -117.8914
  },
  "92832": {
    "name": "Fullerton",
    "county": "Orange",
    "lat": 33.8673,
    "lng": -117.9283
  },
  "92833": {
    "name": "Fullerton",
    "county": "Orange",
    "lat": 33.8737,
    "lng": -117.963
  },
  "92835": {
    "name": "Fullerton",
    "county": "Orange",
    "lat": 33.9011,
    "lng": -117.9135
  },
  "92840": {
    "name": "Garden Grove",
    "county": "Orange",
    "lat": 33.7854,
    "lng": -117.9318
  },
  "92841": {
    "name": "Garden Grove",
    "county": "Orange",
    "lat": 33.7859,
    "lng": -117.9783
  },
  "92843": {
    "name": "Garden Grove",
    "county": "Orange",
    "lat": 33.7645,
    "lng": -117.9324
  },
  "92844": {
    "name": "Garden Grove",
    "county": "Orange",
    "lat": 33.7671,
    "lng": -117.971
  },
  "92845": {
    "name": "Garden Grove",
    "county": "Orange",
    "lat": 33.7834,
    "lng": -118.0274
  },
  "92861": {
    "name": "Orange",
    "county": "Orange",
    "lat": 33.8172,
    "lng": -117.8111
  },
  "92865": {
    "name": "Orange",
    "county": "Orange",
    "lat": 33.829,
    "lng": -117.8463
  },
  "92866": {
    "name": "Orange",
    "county": "Orange",
    "lat": 33.7845,
    "lng": -117.846
  },
  "92867": {
    "name": "Orange",
    "county": "Orange",
    "lat": 33.8107,
    "lng": -117.8312
  },
  "92868": {
    "name": "Orange",
    "county": "Orange",
    "lat": 33.7864,
    "lng": -117.8763
  },
  "92869": {
    "name": "Orange",
    "county": "Orange",
    "lat": 33.792,
    "lng": -117.7993
  },
  "92870": {
    "name": "Placentia",
    "county": "Orange",
    "lat": 33.8782,
    "lng": -117.8547
  },
  "92886": {
    "name": "Yorba Linda",
    "county": "Orange",
    "lat": 33.8899,
    "lng": -117.8065
  },
  "92887": {
    "name": "Yorba Linda",
    "county": "Orange",
    "lat": 33.8806,
    "lng": -117.7416
  },
  "93510": {
    "name": "Acton",
    "county": "Los Angeles",
    "lat": 34.4863,
    "lng": -118.1974
  },
  "93532": {
    "name": "Elizabeth Lake",
    "county": "Los Angeles",
    "lat": 34.6739,
    "lng": -118.4322
  },
  "93534": {
    "name": "Del Sur",
    "county": "Los Angeles",
    "lat": 34.6874,
    "lng": -118.1498
  },
  "93535": {
    "name": "Hi Vista",
    "county": "Los Angeles",
    "lat": 34.6881,
    "lng": -118.0618
  },
  "93536": {
    "name": "Del Sur",
    "county": "Los Angeles",
    "lat": 34.6867,
    "lng": -118.2375
  },
  "93543": {
    "name": "Juniper Hills",
    "county": "Los Angeles",
    "lat": 34.5293,
    "lng": -117.9632
  },
  "93544": {
    "name": "Crystalaire",
    "county": "Los Angeles",
    "lat": 34.4808,
    "lng": -117.8097
  },
  "93550": {
    "name": "Lake Los Angeles",
    "county": "Los Angeles",
    "lat": 34.569,
    "lng": -118.0959
  },
  "93551": {
    "name": "City Ranch",
    "county": "Los Angeles",
    "lat": 34.6052,
    "lng": -118.1833
  },
  "93552": {
    "name": "Palmdale",
    "county": "Los Angeles",
    "lat": 34.5631,
    "lng": -118.0357
  },
  "93553": {
    "name": "Juniper Hills",
    "county": "Los Angeles",
    "lat": 34.4966,
    "lng": -117.8962
  },
  "93563": {
    "name": "Pearblossom",
    "county": "Los Angeles",
    "lat": 34.3171,
    "lng": -117.8582
  },
  "93591": {
    "name": "Lake Los Angeles",
    "county": "Los Angeles",
    "lat": 34.5976,
    "lng": -117.8398
  }
};
export default MELISSA_ZIPS;
