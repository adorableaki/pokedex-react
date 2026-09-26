import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = 'https://api.pokemontcg.io/v2';
const FAVORITES_KEY = 'pokemon_favorites';
const pageSize = 24;

// Master list of Pokémon names
const POKEMON_NAMES = [
  'Bulbasaur', 'Ivysaur', 'Venusaur', 'Charmander', 'Charmeleon', 'Charizard',
  'Squirtle', 'Wartortle', 'Blastoise', 'Pikachu', 'Raichu', 'Sandshrew', 'Sandslash',
  'Nidoran', 'Nidorina', 'Nidoqueen', 'Nidoking', 'Clefairy', 'Clefable', 'Vulpix',
  'Ninetales', 'Jigglypuff', 'Wigglytuff', 'Zubat', 'Golbat', 'Oddish', 'Gloom',
  'Vileplume', 'Meowth', 'Persian', 'Psyduck', 'Golduck', 'Mankey', 'Primeape',
  'Growlithe', 'Arcanine', 'Poliwag', 'Poliwhirl', 'Poliwrath', 'Abra', 'Kadabra',
  'Alakazam', 'Machop', 'Machoke', 'Machamp', 'Bellsprout', 'Weepinbell', 'Victreebel',
  'Tentacool', 'Tentacruel', 'Geodude', 'Graveler', 'Golem', 'Ponyta', 'Rapidash',
  'Slowpoke', 'Slowbro', 'Magnemite', 'Magneton', 'Farfetchd', 'Doduo', 'Dodrio',
  'Seel', 'Dewgong', 'Grimer', 'Muk', 'Shellder', 'Cloyster', 'Gastly', 'Haunter',
  'Gengar', 'Onix', 'Drowzee', 'Hypno', 'Krabby', 'Kingler', 'Voltorb', 'Electrode',
  'Exeggcute', 'Exeggutor', 'Cubone', 'Marowak', 'Hitmonlee', 'Hitmonchan', 'Lickitung',
  'Koffing', 'Weezing', 'Rhyhorn', 'Rhydon', 'Chansey', 'Tangela', 'Kangaskhan',
  'Horsea', 'Seadra', 'Goldeen', 'Seaking', 'Staryu', 'Starmie', 'MrMime', 'Scyther',
  'Jynx', 'Electabuzz', 'Magmar', 'Pinsir', 'Tauros', 'Magikarp', 'Gyarados', 'Lapras',
  'Ditto', 'Eevee', 'Vaporeon', 'Jolteon', 'Flareon', 'Porygon', 'Omanyte', 'Omastar',
  'Kabuto', 'Kabutops', 'Aerodactyl', 'Snorlax', 'Articuno', 'Zapdos', 'Moltres',
  'Dratini', 'Dragonair', 'Dragonite', 'Mewtwo', 'Mew', 'Chikorita', 'Cyndaquil',
  'Totodile', 'Bayleef', 'Meganium', 'Quilava', 'Typhlosion', 'Croconaw', 'Feraligatr',
  'Sentret', 'Furret', 'Hoothoot', 'Noctowl', 'Ledyba', 'Ledian', 'Spinarak', 'Ariados',
  'Crobat', 'Chinchou', 'Lanturn', 'Pichu', 'Cleffa', 'Igglybuff', 'Togepi', 'Togetic',
  'Natu', 'Xatu', 'Mareep', 'Flaaffy', 'Ampharos', 'Bellossom', 'Marill', 'Azumarill',
  'Sudowoodo', 'Politoed', 'Hoppip', 'Skiploom', 'Jumpluff', 'Aipom', 'Sunkern',
  'Sunflora', 'Yanma', 'Wooper', 'Quagsire', 'Espeon', 'Umbreon', 'Murkrow', 'Slowking',
  'Misdreavus', 'Unown', 'Wobbuffet', 'Girafarig', 'Pineco', 'Forretress', 'Dunsparce',
  'Gligar', 'Steelix', 'Snubbull', 'Granbull', 'Qwilfish', 'Scizor', 'Shuckle',
  'Heracross', 'Sneasel', 'Teddiursa', 'Ursaring', 'Slugma', 'Magcargo', 'Swinub',
  'Piloswine', 'Corsola', 'Remoraid', 'Octillery', 'Delibird', 'Mantine', 'Skarmory',
  'Houndour', 'Houndoom', 'Kingdra', 'Phanpy', 'Donphan', 'Porygon2', 'Stantler',
  'Smeargle', 'Tyrogue', 'Hitmontop', 'Smoochum', 'Elekid', 'Magby', 'Miltank',
  'Blissey', 'Raikou', 'Entei', 'Suicune', 'Larvitar', 'Pupitar', 'Tyranitar',
  'Lugia', 'HoOh', 'Celebi', 'Treecko', 'Grovyle', 'Sceptile', 'Torchic', 'Combusken',
  'Blaziken', 'Mudkip', 'Marshtomp', 'Swampert', 'Poochyena', 'Mightyena', 'Zigzagoon',
  'Linoone', 'Wurmple', 'Silcoon', 'Beautifly', 'Cascoon', 'Dustox', 'Lotad',
  'Lombre', 'Ludicolo', 'Seedot', 'Nuzleaf', 'Shiftry', 'Taillow', 'Swellow',
  'Wingull', 'Pelipper', 'Ralts', 'Kirlia', 'Gardevoir', 'Surskit', 'Masquerain',
  'Shroomish', 'Breloom', 'Slakoth', 'Vigoroth', 'Slaking', 'Nincada', 'Ninjask',
  'Shedinja', 'Whismur', 'Loudred', 'Exploud', 'Makuhita', 'Hariyama', 'Azurill',
  'Nosepass', 'Skitty', 'Delcatty', 'Sableye', 'Mawile', 'Aron', 'Lairon',
  'Aggron', 'Meditite', 'Medicham', 'Electrike', 'Manectric', 'Plusle', 'Minun',
  'Volbeat', 'Illumise', 'Roselia', 'Gulpin', 'Swalot', 'Carvanha', 'Sharpedo',
  'Wailmer', 'Wailord', 'Numel', 'Camerupt', 'Torkoal', 'Spoink', 'Grumpig',
  'Spinda', 'Trapinch', 'Vibrava', 'Flygon', 'Cacnea', 'Cacturne', 'Swablu',
  'Altaria', 'Zangoose', 'Seviper', 'Lunatone', 'Solrock', 'Barboach', 'Whiscash',
  'Corphish', 'Crawdaunt', 'Baltoy', 'Claydol', 'Lileep', 'Cradily', 'Anorith',
  'Armaldo', 'Feebas', 'Milotic', 'Castform', 'Kecleon', 'Shuppet', 'Banette',
  'Duskull', 'Dusclops', 'Tropius', 'Chimecho', 'Absol', 'Wynaut', 'Snorunt',
  'Glalie', 'Spheal', 'Sealeo', 'Walrein', 'Clamperl', 'Huntail', 'Gorebyss',
  'Relicanth', 'Latios', 'Latias', 'Kyogre', 'Groudon', 'Rayquaza', 'Jirachi',
  'Deoxys', 'Turtwig', 'Grotle', 'Torterra', 'Chimchar', 'Monferno', 'Infernape',
  'Piplup', 'Prinplup', 'Empoleon', 'Starly', 'Staravia', 'Staraptor', 'Bidoof',
  'Bibarel', 'Kricketot', 'Kricketune', 'Shinx', 'Luxio', 'Luxray', 'Budew',
  'Roserade', 'Cranidos', 'Rampardos', 'Shieldon', 'Bastiodon', 'Burmy', 'Wormadam',
  'Mothim', 'Combee', 'Vespiquen', 'Pachirisu', 'Buizel', 'Floatzel', 'Cherubi',
  'Cherrim', 'Shellos', 'Gastrodon', 'Ambipom', 'Drifloon', 'Drifblim', 'Buneary',
  'Lopunny', 'Mismagius', 'Honchkrow', 'Glameow', 'Purugly', 'Chingling', 'Stunky',
  'Skuntank', 'Bronzor', 'Bronzong', 'Bonsly', 'MimeJr', 'Happiny', 'Chatot',
  'Spiritomb', 'Gible', 'Gabite', 'Garchomp', 'Riolu', 'Lucario', 'Hippopotas',
  'Hippowdon', 'Skorupi', 'Drapion', 'Croagunk', 'Toxicroak', 'Carnivine', 'Finneon',
  'Lumineon', 'Mantyke', 'Snover', 'Abomasnow', 'Weavile', 'Magnezone', 'Lickilicky',
  'Rhyperior', 'Tangrowth', 'Electivire', 'Magmortar', 'Togekiss', 'Yanmega',
  'Leafeon', 'Glaceon', 'Gliscor', 'Mamoswine', 'PorygonZ', 'Gallade', 'Probopass',
  'Dusknoir', 'Froslass', 'Rotom', 'Uxie', 'Mesprit', 'Azelf', 'Dialga', 'Palkia',
  'Giratina', 'Heatran', 'Regigigas', 'Cresselia', 'Phione', 'Manaphy',
  'Darkrai', 'Shaymin', 'Arceus', 'Victini', 'Snivy', 'Servine', 'Serperior',
  'Tepig', 'Pignite', 'Emboar', 'Oshawott', 'Dewott', 'Samurott', 'Patrat',
  'Watchog', 'Lillipup', 'Herdier', 'Stoutland', 'Purrloin', 'Liepard', 'Pansage',
  'Simisage', 'Pansear', 'Simisear', 'Panpour', 'Simipour', 'Munna', 'Musharna',
  'Pidove', 'Tranquill', 'Unfezant', 'Blitzle', 'Zebstrika', 'Roggenrola', 'Boldore',
  'Gigalith', 'Woobat', 'Swoobat', 'Drilbur', 'Excadrill', 'Audino', 'Timburr',
  'Gurdurr', 'Conkeldurr', 'Tympole', 'Palpitoad', 'Seismitoad', 'Throh', 'Sawk',
  'Sewaddle', 'Swadloon', 'Leavanny', 'Venipede', 'Whirlipede', 'Scolipede',
  'Cottonee', 'Whimsicott', 'Petilil', 'Lilligant', 'Basculin', 'Sandile',
  'Krokorok', 'Krookodile', 'Darumaka', 'Darmanitan', 'Maractus', 'Dwebble',
  'Crustle', 'Scraggy', 'Scrafty', 'Sigilyph', 'Yamask', 'Cofagrigus', 'Tirtouga',
  'Carracosta', 'Archen', 'Archeops', 'Trubbish', 'Garbodor', 'Zorua', 'Zoroark',
  'Minccino', 'Cinccino', 'Gothita', 'Gothorita', 'Gothitelle', 'Solosis',
  'Duosion', 'Reuniclus', 'Ducklett', 'Swanna', 'Vanillite', 'Vanillish', 'Vanilluxe',
  'Deerling', 'Sawsbuck', 'Emolga', 'Karrablast', 'Escavalier', 'Shelmet',
  'Accelgor', 'Stunfisk', 'Mienfoo', 'Mienshao', 'Druddigon', 'Golett', 'Golurk',
  'Pawniard', 'Bisharp', 'Bouffalant', 'Volcarona', 'Cobalion',
  'Terrakion', 'Virizion', 'Tornadus', 'Thundurus', 'Reshiram', 'Zekrom', 'Landorus',
  'Kyurem', 'Keldeo', 'Meloetta', 'Genesect', 'Chespin', 'Quilladin', 'Chesnaught',
  'Fennekin', 'Braixen', 'Delphox', 'Froakie', 'Frogadier', 'Greninja', 'Bunnelby',
  'Diggersby', 'Fletchling', 'Talonflame', 'Scatterbug', 'Spewpa', 'Vivillon',
  'Litleo', 'Pyroar', 'Flabebe', 'Floette', 'Florges', 'Skrelp', 'Dragalge',
  'Clauncher', 'Clawitzer', 'Helioptile', 'Heliolisk', 'Tyrunt', 'Tyrantrum',
  'Amaura', 'Aurorus', 'Sylveon', 'Hawlucha', 'Dedenne', 'Carbink', 'Goomy',
  'Sliggoo', 'Goodra', 'Klefki', 'Phantump', 'Trevenant', 'Pumpkaboo', 'Gourgeist',
  'Bergmite', 'Avalugg', 'Noibat', 'Noivern', 'Xerneas', 'Yveltal', 'Zygarde',
  'Diancie', 'Hoopa', 'Volcanion', 'Rowlet', 'Dartrix', 'Decidueye', 'Litten',
  'Torracat', 'Incineroar', 'Popplio', 'Brionne', 'Primarina', 'Pikipek', 'Trumbeak',
  'Toucannon', 'Yungoos', 'Gumshoos', 'Grubbin', 'Charjabug', 'Vikavolt',
  'Crabrawler', 'Crabominable', 'Oricorio', 'Cutiefly', 'Ribombee', 'Rockruff',
  'Lycanroc', 'Wishiwashi', 'Mareanie', 'Toxapex', 'Mudsdale', 'Dewpider',
  'Araquanid', 'Fomantis', 'Lurantis', 'Morelull', 'Shiinotic', 'Salandit',
  'Salazzle', 'Stufful', 'Bewear', 'Bounsweet', 'Steenee', 'Tsareena',
  'Comfey', 'Oranguru', 'Passimian', 'Wimpod', 'Golisopod', 'Sandygast',
  'Palossand', 'Pyukumuku', 'TypeNull', 'Silvally', 'Minior', 'Komala',
  'Turtonator', 'Togedemaru', 'Mimikyu', 'Bruxish', 'Drampa', 'Dhelmise',
  'JangmoO', 'HakamoO', 'KommoO', 'TapuKoko', 'TapuLele', 'TapuBulu', 'TapuFini',
  'Cosmog', 'Cosmoem', 'Solgaleo', 'Lunala', 'Nihilego', 'Buzzwole',
  'Pheromosa', 'Xurkitree', 'Celesteela', 'Kartana', 'Guzzlord', 'Necrozma',
  'Magearna', 'Marshadow', 'Blacephalon', 'Stakataka', 'Zacian',
  'Zamazenta', 'Eternatus', 'Kubfu', 'Urshifu', 'Zarude', 'Regieleki', 'Regidrago',
  'Glastrier', 'Spectrier', 'Calyrex', 'Sprigatito', 'Floragato', 'Meowscarada',
  'Fuecoco', 'Crocalor', 'Skeledirge', 'Quaxly', 'Quaxwell', 'Quaquaval',
  'Dudunsparce', 'Clodsire', 'Ogerpon', 'Okidogi', 'Munkidori', 'Fezandipiti',
  'Terapagos'
];

let setsCache = null;
let cacheLoaded = false;

function App() {
  const [cards, setCards] = useState([]);
  const [favCards, setFavCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Card Supertype Filter
  const [supertypeFilter, setSupertypeFilter] = useState('all'); // all / Pokémon / Trainer / Energy
  
  const [filterType, setFilterType] = useState('all');
  const [pokemonSubtype, setPokemonSubtype] = useState('all');
  const [rarity, setRarity] = useState('all');
  const [setId, setSetId] = useState('all');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const [officialSets, setOfficialSets] = useState([]);
  const [setsByYear, setSetsByYear] = useState({});
  const [selectedSet, setSelectedSet] = useState(null);
  const [currentSetCards, setCurrentSetCards] = useState([]);
  const [setViewPage, setSetViewPage] = useState(1);
  const [setViewTotalCount, setSetViewTotalCount] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [setsDropdownOpen, setSetsDropdownOpen] = useState(false);
  
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef(null);

  // Load favorites
  useEffect(() => {
    const saved = localStorage.getItem(FAVORITES_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFavCards(parsed);
        setFavorites(parsed.map(c => c.id));
      } catch {}
    }
  }, []);

  // Suggestions — Pokémon names
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }
    const term = searchTerm.toLowerCase().trim();
    setSuggestions(
      POKEMON_NAMES.filter(name => name.toLowerCase().includes(term)).slice(0, 8)
    );
  }, [searchTerm]);

  // Load sets
  useEffect(() => {
    if (cacheLoaded && setsCache) {
      setOfficialSets(setsCache.allSets);
      setSetsByYear(setsCache.grouped);
      return;
    }
    const loadAllSets = async (retryCount = 0) => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/sets?orderBy=-releaseDate&pageSize=1000`, { 
          timeout: 30000,
          headers: { 'Accept': 'application/json' }
        });
        const allSets = res.data?.data || [];
        setOfficialSets(allSets);
        const grouped = {};
        allSets.forEach(s => {
          if (!s.releaseDate) return;
          const year = new Date(s.releaseDate).getFullYear();
          if (!grouped[year]) grouped[year] = [];
          grouped[year].push(s);
        });
        setSetsByYear(grouped);
        setsCache = { allSets, grouped };
        cacheLoaded = true;
      } catch (err) {
        if (retryCount < 2) {
          setTimeout(() => loadAllSets(retryCount + 1), 1500);
          return;
        }
        setErrorMsg('Could not load sets. Refresh to try again.');
      } finally {
        setLoading(false);
      }
    };
    loadAllSets();
  }, []);
const toggleFavorite = (card) => {
  const updated = favorites.includes(card.id)
    ? favCards.filter(c => c.id !== card.id)
    : [...favCards, card];
  setFavCards(updated);
  setFavorites(updated.map(c => c.id));
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
};

// Clear All Favorites
const clearAllFavorites = () => {
  if (window.confirm('Remove ALL cards from favorites?')) {
    setFavCards([]);
    setFavorites([]);
    localStorage.removeItem(FAVORITES_KEY);
  }
};

const isFavorite = (id) => favorites.includes(id);

const openSet = useCallback(async (set) => {
  if (!set?.id) return;
  
  const fullSet = officialSets.find(s => s.id === set.id) || set;
  
  setSetsDropdownOpen(false);
  setSelectedSet(fullSet);  // Use complete set data
  setActiveView('setView');
  setSetViewPage(1);
  setCurrentSetCards([]);
  setSelectedCard(null);
  setErrorMsg(''); // Clear old errors
  await loadSetCards(set.id, 1);
}, [officialSets]); // officialSets to dependencies

  const loadSetCards = useCallback(async (targetSetId, targetPage) => {
    if (!targetSetId) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE}/cards?q=set.id:"${targetSetId}"&page=${targetPage}&pageSize=${pageSize}`,
        { timeout: 20000 }
      );
      setCurrentSetCards(res.data?.data || []);
      setSetViewTotalCount(res.data?.totalCount || 0);
      setSetViewPage(targetPage);
    } catch {
      setErrorMsg('Could not load cards.');
    } finally {
      setLoading(false);
    }
  }, []);

  const closeSet = () => {
    setSelectedSet(null);
    setActiveView('browse');
  };

  const toggleSetsDropdown = () => {
    if (selectedSet) closeSet();
    else setSetsDropdownOpen(!setsDropdownOpen);
  };

  const goToHome = () => { setActiveView('home'); setSelectedSet(null); setSetsDropdownOpen(false); setSelectedCard(null); };
  const goToSearch = () => { setActiveView('browse'); setSelectedSet(null); setSetsDropdownOpen(false); setSelectedCard(null); };
  const goToFavorites = () => { setActiveView('favorites'); setSelectedSet(null); setSetsDropdownOpen(false); setSelectedCard(null); };

  //  Query with Supertype Filter
  const buildQuery = useCallback(() => {
    const parts = [];
    if (searchTerm.trim()) parts.push(`name:*${searchTerm.trim()}*`);
    
    // text matching API values
    if (supertypeFilter === 'pokemon') parts.push('supertype:"Pokémon"');
    if (supertypeFilter === 'trainer') parts.push('supertype:"Trainer"');
    if (supertypeFilter === 'energy') parts.push('supertype:"Energy"');
    
    // Type filter only applies to Pokémon cards
    if (filterType !== 'all') parts.push(`types:"${filterType}"`);
    
    // Subtype filters
    if (pokemonSubtype !== 'all') parts.push(`subtypes:"${pokemonSubtype}"`);
    if (rarity !== 'all') parts.push(`rarity:"${rarity}"`);
    if (setId !== 'all') parts.push(`set.id:"${setId}"`);
    
    return parts.join(' AND ');
  }, [searchTerm, supertypeFilter, filterType, pokemonSubtype, rarity, setId]);

  const executeSearch = useCallback(async () => {
    setShowSuggestions(false);
    setPage(1);
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE}/cards?q=${encodeURIComponent(buildQuery())}&page=1&pageSize=${pageSize}`,
        { timeout: 20000 }
      );
      setCards(res.data?.data || []);
      setTotalCount(res.data?.totalCount || 0);
    } catch {
      setErrorMsg('Search unavailable.');
      setCards([]);
    }
    setLoading(false);
  }, [searchTerm, buildQuery]);

  useEffect(() => {
    if (activeView !== 'browse') return;
    if (!searchTerm.trim() && supertypeFilter === 'all' && filterType === 'all' && 
        pokemonSubtype === 'all' && rarity === 'all' && setId === 'all') {
      setCards([]);
      return;
    }
    if (!searchTerm.trim()) {
      const q = buildQuery();
      if (!q) return;
      setLoading(true);
      axios.get(`${API_BASE}/cards?q=${encodeURIComponent(q)}&page=1&pageSize=${pageSize}`)
        .then(res => { setCards(res.data?.data || []); setTotalCount(res.data?.totalCount || 0); })
        .finally(() => setLoading(false));
      return;
    }
    const timer = setTimeout(executeSearch, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, supertypeFilter, filterType, pokemonSubtype, rarity, setId, activeView, executeSearch]);

  useEffect(() => {
    if (activeView !== 'browse' || page === 1) return;
    setLoading(true);
    axios.get(
      `${API_BASE}/cards?q=${encodeURIComponent(buildQuery())}&page=${page}&pageSize=${pageSize}`
    ).then(res => { setCards(res.data?.data || []); setTotalCount(res.data?.totalCount || 0); })
     .finally(() => setLoading(false));
  }, [page, buildQuery, activeView]);

  const clearSearch = () => {
    setSearchTerm('');
    setSupertypeFilter('all');
    setFilterType('all');
    setPokemonSubtype('all');
    setRarity('all');
    setSetId('all');
    setPage(1);
    setCards([]);
    setErrorMsg('');
    setSuggestions([]);
  };

  const selectSuggestion = (term) => {
    setSearchTerm(term);
    setShowSuggestions(false);
    setTimeout(executeSearch, 50);
  };

  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const setViewTotalPages = Math.ceil(setViewTotalCount / pageSize) || 1;

  // Card Display
  const CardView = ({ card }) => (
    <div 
      className={`card-card ${isFavorite(card.id) ? 'fav-border' : ''}`}
      onClick={() => setSelectedCard(card)}
    >
      <div className="card-image-wrapper">
        {card.rarity && (
          <span className="rarity-badge-top">{card.rarity}</span>
        )}
        <span 
          className="fav-star-top" 
          onClick={(e) => { e.stopPropagation(); toggleFavorite(card); }}
        >
          {isFavorite(card.id) ? '⭐' : '☆'}
        </span>
        <img 
          src={card.images?.small || card.images?.large} 
          alt={card.name} 
          className="card-image"
          loading="lazy"
        />
      </div>
    </div>
  );

  const formatCost = (cost) => {
    if (!cost) return '—';
    return cost;
  };

  // Unified Card Detail — works for Pokémon, Trainer, Energy, Supporter
  const CardDetailSection = ({ label, children }) => {
    const hasContent = Array.isArray(children) ? children.some(c => c) : !!children;
    if (!hasContent) return null;
    return (
      <div className="info-section">
        <h3 className="section-heading">{label}</h3>
        {children}
      </div>
    );
  };

  return (
    <div className="app">
      <div className="stars-bg"></div>
      
      {errorMsg && (
        <div className="error-banner">
          ⚠️ {errorMsg}
          {errorMsg.includes('Could not load sets') && (
            <button className="refresh-btn" onClick={() => window.location.reload()}>🔄 Refresh</button>
          )}
        </div>
      )}
      
      {/* Card Modal */}
      {selectedCard && (
        <div className="card-modal-overlay" onClick={() => setSelectedCard(null)}>
          <div className="card-modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedCard(null)}>×</button>
            
            <div className="card-modal-grid">
              <div className="modal-image-col">
                <img 
                  src={selectedCard.images?.large || selectedCard.images?.small}
                  alt={selectedCard.name}
                  className="modal-card-img"
                />
                <button 
                  className="fav-toggle-btn"
                  onClick={() => toggleFavorite(selectedCard)}
                  style={{marginTop: '1rem', width: '100%'}}
                >
                  {isFavorite(selectedCard.id) ? ' Remove from Favorites' : '☆ Add to Favorites'}
                </button>
              </div>
              
              <div className="modal-card-info">
                <h2 className="modal-card-name">{selectedCard.name}</h2>
                
                {selectedCard.set && (
                  <p className="modal-card-set-link">
                     From:{' '}
                    <button 
                      className="set-link-btn"
                      onClick={() => openSet(selectedCard.set)}
                    >
                      {selectedCard.set.name}
                    </button>
                    {' '}#{selectedCard.number || '???'}
                  </p>
                )}
                
                {/* Basic Info for EVERY card type */}
                <div className="info-stats-row">
                  {selectedCard.supertype && (
                    <div className="stat-item"><strong>Card Type</strong><span>{selectedCard.supertype}</span></div>
                  )}
                  {selectedCard.subtypes && selectedCard.subtypes.length > 0 && (
                    <div className="stat-item"><strong>Subtype</strong><span>{selectedCard.subtypes.join(', ')}</span></div>
                  )}
                  {selectedCard.rarity && (
                    <div className="stat-item"><strong>Rarity</strong><span>{selectedCard.rarity}</span></div>
                  )}
                  {selectedCard.hp && (
                    <div className="stat-item"><strong>HP</strong><span>{selectedCard.hp}</span></div>
                  )}
                </div>
                
                {/* Pokémon Element Type */}
                {selectedCard.types && selectedCard.types.length > 0 && (
                  <CardDetailSection label="Element Type">
                    {selectedCard.types.map(t => (
                      <span key={t} className="type-badge">{t}</span>
                    ))}
                  </CardDetailSection>
                )}
                
                {/* Abilities — Pokémon */}
                {selectedCard.abilities && selectedCard.abilities.length > 0 && (
                  <CardDetailSection label="Abilities">
                    {selectedCard.abilities.map((ab, i) => (
                      <div key={i} className="ability-block">
                        <strong className="ability-name">{ab.name}</strong>
                        {ab.type && <span className="ability-type">({ab.type})</span>}
                        {ab.text && <p className="ability-text">{ab.text}</p>}
                      </div>
                    ))}
                  </CardDetailSection>
                )}
                
                {/* Attacks / Moves — Pokémon */}
                {selectedCard.attacks && selectedCard.attacks.length > 0 && (
                  <CardDetailSection label="Moves">
                    {selectedCard.attacks.map((atk, i) => (
                      <div key={i} className="attack-block-full">
                        <div className="attack-header-row">
                          <span className="attack-cost">{formatCost(atk.cost)}</span>
                          <strong className="attack-name">{atk.name}</strong>
                          <span className="attack-damage">{atk.damage || '—'}</span>
                        </div>
                        {atk.text && <p className="attack-text">{atk.text}</p>}
                        {atk.convertedEnergyCost && (
                          <span className="converted-cost">Energy Cost: {atk.convertedEnergyCost}</span>
                        )}
                      </div>
                    ))}
                  </CardDetailSection>
                )}
                
                {/* Trainer / Supporter — Effect Text */}
                {selectedCard.rules && selectedCard.rules.length > 0 && (
                  <CardDetailSection label="Effect / Rules">
                    {selectedCard.rules.map((rule, i) => (
                      <p key={i} style={{margin: '0.5rem 0', lineHeight: '1.6'}}>{rule}</p>
                    ))}
                  </CardDetailSection>
                )}
                
                {/* Energy — Special Rules */}
                {selectedCard.text && selectedCard.text.length > 0 && (
                  <CardDetailSection label="Details">
                    {selectedCard.text.map((txt, i) => (
                      <p key={i} style={{margin: '0.5rem 0', lineHeight: '1.6'}}>{txt}</p>
                    ))}
                  </CardDetailSection>
                )}
                
                {/* Weakness / Resistance / Retreat — Pokémon */}
                {(selectedCard.weaknesses || selectedCard.resistances || selectedCard.retreatCost) && (
                  <CardDetailSection label="Battle Info">
                    <div className="detail-grid">
                      {selectedCard.weaknesses && selectedCard.weaknesses.length > 0 && (
                        <div className="detail-item">
                          <strong>Weakness:</strong>
                          {selectedCard.weaknesses.map((w, i) => (
                            <span key={i} className="detail-value">{w.type} {w.value}</span>
                          ))}
                        </div>
                      )}
                      {selectedCard.resistances && selectedCard.resistances.length > 0 && (
                        <div className="detail-item">
                          <strong>Resistance:</strong>
                          {selectedCard.resistances.map((r, i) => (
                            <span key={i} className="detail-value">{r.type} {r.value}</span>
                          ))}
                        </div>
                      )}
                      {selectedCard.retreatCost && (
                        <div className="detail-item">
                          <strong>Retreat Cost:</strong>
                          <span className="detail-value">{formatCost(selectedCard.retreatCost)}</span>
                          {selectedCard.convertedRetreatCost && (
                            <span className="detail-numeric">({selectedCard.convertedRetreatCost})</span>
                          )}
                        </div>
                      )}
                    </div>
                  </CardDetailSection>
                )}
                
                {/* Flavor Text — All card types */}
                {selectedCard.flavorText && (
                  <div className="info-section flavor-section">
                    <em className="flavor-text">"{selectedCard.flavorText}"</em>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <header className="main-header">
        <h1>Hellsing's Pokémon TCG Explorer</h1>
        <p className="subtitle">Unseal The Divine Seal And Collect the Pokémon's Within</p>
        
        <nav className="view-tabs">
          <button className={`tab-btn ${activeView === 'home' ? 'active' : ''}`} onClick={goToHome}> Home</button>
          <button className={`tab-btn ${activeView === 'browse' ? 'active' : ''}`} onClick={goToSearch}> Search Cards</button>
          
          <div className="sets-nav-wrapper">
            <button 
              className={`tab-btn ${(activeView === 'setView' || setsDropdownOpen) ? 'active' : ''}`}
              onClick={toggleSetsDropdown}
            >
               All Sets {setsDropdownOpen ? '▴' : '▾'} {loading ? '⏳' : ''}
            </button>
            
            {setsDropdownOpen && !selectedSet && (
              <div className="sets-dropdown-menu">
                {loading ? (
                  <div className="dropdown-loading">Loading sets… ⏳</div>
                ) : officialSets.length === 0 ? (
                  <div className="dropdown-empty">
                    No sets loaded. <button className="refresh-btn" onClick={() => window.location.reload()}>🔄 Refresh</button>
                  </div>
                ) : (
                  Object.keys(setsByYear).sort((a, b) => b - a).map(year => (
                    <div key={year} className="sets-year-group">
                      <div className="year-label">{year}</div>
                      {setsByYear[year].map(set => (
                        <button key={set.id} onClick={() => openSet(set)} className="set-option-btn">
                          <span className="set-name">{set.name}</span>
                          <span className="set-meta">{set.ptcgoCode || set.series} • {set.total || 0} cards</span>
                        </button>
                      ))}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          
          <button className={`tab-btn ${activeView === 'favorites' ? 'active' : ''}`} onClick={goToFavorites}>
           Favorites <span className="fav-count-badge">{favCards.length}</span>
          </button>
        </nav>
      </header>
      
      <main className="main-content">
        {activeView === 'home' && (
          <section className="home-section">
            <div className="hero">
              <h2>The bird of the Hermes is my name, eating my wings to make me tame.</h2>
              <p>Do not be afraid of me. For I am the shadow that protects the light.</p>
              <p style={{marginTop: '0.5rem', opacity: '0.85'}}>
                <strong>Reminder:</strong>You are merely a beast. I am the king of beasts.
              </p>
              <div className="hero-stats">
                <div className="stat-card"><span className="stat-num">{officialSets.length}</span><span className="stat-label">Sets</span></div>
                <div className="stat-card"><span className="stat-num">{Object.keys(setsByYear).length}</span><span className="stat-label">Years</span></div>
                <div className="stat-card"><span className="stat-num">{favCards.length}</span><span className="stat-label">Favorites</span></div>
              </div>
            </div>
          </section>
        )}
        
        {activeView === 'browse' && (
          <section className="search-section">
            <h2 className="section-title">Find Cards</h2>
            
            <div className="search-bar-container">
              <div className="search-bar-row">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Type a Pokemon Name, Trainer, or Energy Card"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
                  className="search-input"
                />
                {searchTerm && <button className="clear-btn" onClick={clearSearch}>✕ Clear</button>}
                <button className="search-submit-btn" onClick={executeSearch}> Search</button>
              </div>
              
              {showSuggestions && suggestions.length > 0 && (
                <div className="suggestions-dropdown">
                  {suggestions.map((term, i) => (
                    <button key={i} className="suggestion-item" onClick={() => selectSuggestion(term)}>
                      <span className="suggestion-icon">🔹</span> {term}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Filters with Card Type Selector — Plain Words Only */}
            <div className="filters-row">
              {/* Card Type — Main Filter */}
              <select value={supertypeFilter} onChange={(e) => setSupertypeFilter(e.target.value)} className="filter-select">
                <option value="all">All Card Types</option>
                <option value="pokemon">Pokémon Cards</option>
                <option value="trainer">Trainer Cards</option>
                <option value="energy">Energy Cards</option>
              </select>
              
              {/* Element Type — only applies to Pokémon */}
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)} 
                className="filter-select"
                disabled={supertypeFilter !== 'all' && supertypeFilter !== 'pokemon'}
              >
                <option value="all">All Element Types</option>
                {['Fire','Water','Grass','Lightning','Psychic','Fighting','Darkness','Dragon','Metal','Fairy'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              
              {/* Subtype — Basic, Stage 1, Supporter, etc. */}
              <select value={pokemonSubtype} onChange={(e) => setPokemonSubtype(e.target.value)} className="filter-select">
                <option value="all">All Subtypes</option>
                {['Basic','Stage 1','Stage 2','V','VMAX','ex','GX','Supporter','Item','Tool','Stadium','Basic','Special'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              
              <select value={rarity} onChange={(e) => setRarity(e.target.value)} className="filter-select">
                <option value="all">All Rarities</option>
                {['Common','Uncommon','Rare','Holo Rare','Ultra Rare','Secret Rare'].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              
              <select value={setId} onChange={(e) => setSetId(e.target.value)} className="filter-select">
                <option value="all">— All Sets —</option>
                {officialSets.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({new Date(s.releaseDate).getFullYear()})</option>
                ))}
              </select>
            </div>
            
            {!searchTerm && setId === 'all' && supertypeFilter === 'all' && filterType === 'all' && pokemonSubtype === 'all' && rarity === 'all' ? (
              <div className="browse-prompt">
                Start typing a name above, or select a Card Type to browse! 
              </div>
            ) : loading ? (
              <div className="loading-state">Finding cards…</div>
            ) : cards.length === 0 ? (
              <div className="empty-state">No cards match your filters.</div>
            ) : (
              <>
                <div className="results-count">Found <strong>{totalCount.toLocaleString()}</strong> cards — Page {page} of {totalPages}</div>
                <div className="cards-grid">{cards.map(card => <CardView key={card.id} card={card} />)}</div>
                {totalPages > 1 && (
                  <div className="pagination">
                    <button onClick={() => setPage(p => p - 1)} disabled={page <= 1} className="page-btn">← Previous</button>
                    <span className="page-info">{page} of {totalPages}</span>
                    <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages} className="page-btn">Next →</button>
                  </div>
                )}
              </>
            )}
          </section>
        )}
        
        {activeView === 'setView' && selectedSet && (
          <section className="set-view-section">
            <div className="set-view-header">
              <button className="back-btn" onClick={closeSet}>← Back</button>
              <div className="set-view-title-group">
                <h2 className="view-set-name">{selectedSet.name}</h2>
                <p className="view-set-desc">{selectedSet.series} • {selectedSet.releaseDate}</p>
              </div>
            </div>
            {loading ? <div className="loading-state">Loading…</div> : (
              <>
                <div className="results-count">Showing {currentSetCards.length} of {setViewTotalCount} cards</div>
                <div className="cards-grid">{currentSetCards.map(card => <CardView key={card.id} card={card} />)}</div>
                {setViewTotalPages > 1 && (
                  <div className="pagination">
                    <button onClick={() => loadSetCards(selectedSet.id, setViewPage - 1)} disabled={setViewPage <= 1} className="page-btn">← Previous</button>
                    <span className="page-info">{setViewPage} of {setViewTotalPages}</span>
                    <button onClick={() => loadSetCards(selectedSet.id, setViewPage + 1)} disabled={setViewPage >= setViewTotalPages} className="page-btn">Next →</button>
                  </div>
                )}
              </>
            )}
          </section>
        )}
        
        {activeView === 'favorites' && (
          <section className="favorites-section">
            <div className="fav-header">
              <h2>Your Favorite Cards</h2>
              {favCards.length > 0 && <button className="clear-fav-btn" onClick={clearAllFavorites}>🗑️ Clear All</button>}
            </div>
            {favCards.length === 0 ? (
              <div className="empty-fav">
                <p>No favorite cards yet! </p>
                <p>Click any card to add it here.</p>
              </div>
            ) : (
              <div className="cards-grid">{favCards.map(card => <CardView key={card.id} card={card} />)}</div>
            )}
          </section>
        )}
      </main>
      
     <footer className="site-footer">
  <div className="footer-content">
    <h3 className="footer-title">Hellsing's Pokémon Card Explorer</h3>
    
    <div className="footer-credit-block">
      <p className="footer-credit-heading"> Pokémon TCG Data</p>
      <p className="footer-credit-text">
        Powered by the <a href="https://pokemontcg.io" target="_blank" rel="noopener noreferrer">Pokémon TCG API</a>
        <br />
        Pokémon and all related media are © The Pokémon Company, Nintendo, Game Freak, and Creatures Inc.
        <br />
        This is a fan-made project and is <strong>not affiliated with or endorsed by</strong> The Pokémon Company or its partners.
      </p>
    </div>
    
    <div className="footer-divider"></div>
    
    <div className="footer-credit-block">
      <p className="footer-credit-heading"> Alucard Theme & Inspiration</p>
      <p className="footer-credit-text">
        Visual theme inspired by <em>Hellsing</em> and Alucard — created by Kouta Hirano
        <br />
        Original anime production by Satelight / Graphinica — all rights belong to their respective owners.
      </p>
    </div>
    
    <div className="footer-divider"></div>
    
    <div className="footer-credit-block">
      <p className="footer-credit-heading"> Built With</p>
      <p className="footer-credit-text">
        React • JavaScript • CSS3 • Pokémon TCG API
        <br />
        Design & Development by Lebron James
      </p>
    </div>
    
    <p className="footer-copyright">
      © {new Date().getFullYear()} Lebron James — Made with respect and gratitude to all creators.
      <br />
      Fair use — for educational and fan appreciation purposes only.
    </p>
  </div>
</footer>
    </div>
  );
}

export default App;