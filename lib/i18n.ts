export const SUPPORTED_LANGUAGES = [
  'English',
  'Español',
  'Français',
  'Deutsch',
  '日本語',
  'Português',
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'pt';

export const LANGUAGE_CODE_MAP: Record<SupportedLanguage, LanguageCode> = {
  English: 'en',
  Español: 'es',
  Français: 'fr',
  Deutsch: 'de',
  日本語: 'ja',
  Português: 'pt',
};

const langListeners = new Set<() => void>();
let currentMemoryLang: SupportedLanguage = 'English';

export function subscribeLanguage(callback: () => void) {
  langListeners.add(callback);
  return () => {
    langListeners.delete(callback);
  };
}

export function getLanguageSnapshot(): SupportedLanguage {
  if (typeof window === 'undefined') return 'English';
  const stored = localStorage.getItem('timetools_lang') as SupportedLanguage | null;
  if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
    currentMemoryLang = stored;
    return stored;
  }
  return currentMemoryLang;
}

export function getServerLanguageSnapshot(): SupportedLanguage {
  return 'English';
}

export function setGlobalLanguage(lang: SupportedLanguage) {
  currentMemoryLang = lang;
  if (typeof window !== 'undefined') {
    localStorage.setItem('timetools_lang', lang);
    document.documentElement.lang = LANGUAGE_CODE_MAP[lang] || 'en';
  }
  langListeners.forEach((fn) => fn());
}

export function normalizeTextKey(raw: string): string {
  return raw.replace(/\s+/g, ' ').trim();
}

type TranslationTuple = [es: string, fr: string, de: string, ja: string, pt: string];

export const UI_DICTIONARY: Record<string, TranslationTuple> = {
  // Navigation & Mega Menu
  Home: ['Inicio', 'Accueil', 'Startseite', 'ホーム', 'Início'],
  Timers: ['Temporizadores', 'Minuteurs', 'Timer', 'タイマー', 'Temporizadores'],
  'World Clock': ['Reloj Mundial', 'Horloge Mondiale', 'Weltuhr', '世界時計', 'Relógio Mundial'],
  Categories: ['Categorías', 'Catégories', 'Kategorien', 'カテゴリー', 'Categorias'],
  Calculators: ['Calculadoras', 'Calculatrices', 'Rechner', '計算機', 'Calculadoras'],
  'All Tools': ['Todas las Herramientas', 'Tous les Outils', 'Alle Werkzeuge', 'すべてのツール', 'Todas as Ferramentas'],
  'Search tools...': ['Buscar herramientas...', 'Rechercher des outils...', 'Werkzeuge suchen...', 'ツールを検索...', 'Pesquisar ferramentas...'],
  'Search time tools...': ['Buscar herramientas de tiempo...', 'Rechercher des outils de temps...', 'Zeitwerkzeuge suchen...', '時間ツールを検索...', 'Pesquisar ferramentas de tempo...'],
  'Quick Launch Tools': ['Herramientas Rápidas', 'Outils Rapides', 'Schnellstart-Werkzeuge', 'クイック起動ツール', 'Ferramentas Rápidas'],
  'Enter to open': ['Enter para abrir', 'Entrée pour ouvrir', 'Enter zum Öffnen', 'Enterで開く', 'Enter para abrir'],
  Open: ['Abrir', 'Ouvrir', 'Öffnen', '開く', 'Abrir'],
  'Open All Tools Directory': ['Abrir Directorio de Herramientas', 'Ouvrir le Répertoire Complet', 'Alle Werkzeuge öffnen', '全ツール一覧を開く', 'Abrir Diretório de Ferramentas'],
  'Open Sensory Visual Timers Collection': ['Abrir Colección de Temporizadores Sensoriales', 'Ouvrir la Collection de Minuteurs Sensoriels', 'Sensorische visuelle Timer öffnen', '感覚ビジュアルタイマー一覧を開く', 'Abrir Coleção de Temporizadores Sensoriais'],
  'Open All Timers': ['Ver Todos los Temporizadores', 'Voir Tous les Minuteurs', 'Alle Timer anzeigen', 'すべてのタイマーを開く', 'Ver Todos os Temporizadores'],
  'Browse by Use Case & Community': ['Explorar por Caso de Uso y Comunidad', 'Parcourir par Cas d’Usage', 'Nach Anwendungsfall durchsuchen', '用途・コミュニティ別に探す', 'Explorar por Caso de Uso'],
  'New Releases': ['Nuevos Lanzamientos', 'Nouveautés', 'Neuerscheinungen', '新着リリース', 'Novos Lançamentos'],
  'Trending Visual Timers': ['Temporizadores Visuales en Tendencia', 'Minuteurs Visuels Tendances', 'Beliebte Visuelle Timer', 'トレンドのビジュアルタイマー', 'Temporizadores Visuais em Alta'],
  'Hot & Daily Essentials': ['Esenciales Diarios Populares', 'Essentiels du Quotidien', 'Tägliche Favoriten', '定番・毎日使えるタイマー', 'Essenciais Diários Populares'],
  New: ['Nuevo', 'Nouveau', 'Neu', '新着', 'Novo'],
  NEW: ['NUEVO', 'NOUVEAU', 'NEU', '新着', 'NOVO'],
  Trending: ['Tendencia', 'Tendance', 'Trend', 'トレンド', 'Em Alta'],
  TRENDING: ['TENDENCIA', 'TENDANCE', 'TREND', 'トレンド', 'EM ALTA'],
  Hot: ['Popular', 'Populaire', 'Beliebt', '人気', 'Popular'],
  HOT: ['POPULAR', 'POPULAIRE', 'BELIEBT', '人気', 'POPULAR'],
  Education: ['Educación', 'Éducation', 'Bildung', '教育・教室', 'Educação'],
  'Events & Stage': ['Eventos y Escenario', 'Événements & Scène', 'Events & Bühne', 'イベント・ステージ', 'Eventos e Palco'],

  // Tool Names & Menu Descriptions
  'Sensory Visual Timers': ['Temporizadores Visuales Sensoriales', 'Minuteurs Visuels Sensoriels', 'Sensorische Visuelle Timer', '感覚ビジュアルタイマー', 'Temporizadores Visuais Sensoriais'],
  'Sensory Timers': ['Temporizadores Sensoriales', 'Minuteurs Sensoriels', 'Sensorische Timer', '感覚タイマー', 'Temporizadores Sensoriais'],
  '8 calm, low-distraction visual styles': ['8 estilos visuales calmados y sin distracciones', '8 styles visuels calmes sans distraction', '8 ruhige, ablenkungsarme visuelle Stile', '落ち着いて集中できる8種類のビジュアルスタイル', '8 estilos visuais calmos e sem distrações'],
  'Flip Clock': ['Reloj Flip', 'Horloge Flip', 'Flip-Clock (Klappzahlenuhr)', 'フリップ時計', 'Relógio Flip'],
  'FLIP CLOCK': ['RELOJ FLIP', 'HORLOGE FLIP', 'FLIP-CLOCK', 'フリップ時計', 'RELÓGIO FLIP'],
  'Live clock, countdown & stopwatch': ['Reloj en vivo, cuenta regresiva y cronómetro', 'Horloge en direct, compte à rebours et chronomètre', 'Live-Uhr, Countdown & Stoppuhr', 'リアルタイム時計・カウントダウン・ストップウォッチ', 'Relógio ao vivo, contagem regressiva e cronômetro'],
  'Forest Fire Timer': ['Temporizador Fuego del Bosque', 'Minuteur Feu de Forêt', 'Waldbrand-Timer', 'フォレストファイア・タイマー', 'Temporizador Fogo na Floresta'],
  'Nature forest ember countdown': ['Cuenta regresiva natural con brasas de bosque', 'Compte à rebours braises de forêt', 'Natur-Countdown mit glühenden Funken', '森の残り火が輝く自然派カウントダウン', 'Contagem regressiva com brasas da floresta'],
  'Train Timer': ['Temporizador de Tren', 'Minuteur de Train', 'Zug-Timer', 'トレイン・タイマー', 'Temporizador de Trem'],
  'Station departure board & train': ['Panel de salidas de estación y tren en vivo', 'Tableau des départs de gare et train', 'Bahnhofs-Abfahrtstafel & Zug', '駅の出発案内板と列車アニメーション', 'Painel de partidas da estação e trem'],
  'Flip Timer': ['Temporizador Flip', 'Minuteur Flip', 'Flip-Timer', 'フリップタイマー', 'Temporizador Flip'],
  'Retro split-flap countdown digits': ['Dígitos retro de paneles abatibles', 'Chiffres rétro à palettes', 'Retro-Klappzahlen-Countdown', 'レトロなパタパタ数字カウントダウン', 'Dígitos retrô de placas giratórias'],
  'A retro split-flap countdown.': ['Una cuenta regresiva retro de paneles abatibles.', 'Un compte à rebours rétro à palettes.', 'Ein Retro-Klappzahlen-Countdown.', 'レトロなパタパタ式カウントダウン。', 'Uma contagem regressiva retrô de placas giratórias.'],
  'Spinner Timer': ['Temporizador de Ruleta', 'Minuteur Roue', 'Drehrad-Timer', 'スピナータイマー', 'Temporizador Giratório'],
  'Rotating wheel visual countdown': ['Cuenta regresiva visual de rueda giratoria', 'Compte à rebours visuel à roue rotative', 'Visueller Drehrad-Countdown', '回転ホイール式ビジュアルカウントダウン', 'Contagem regressiva visual em roda giratória'],
  'Lava Lamp Timer': ['Temporizador Lámpara de Lava', 'Minuteur Lampe à Lave', 'Lavalampe-Timer', 'ラバランプ・タイマー', 'Temporizador Lâmpada de Lava'],
  'Rising & merging retro wax blobs': ['Burbujas de cera retro que suben y se fusionan', 'Bulles de cire rétro fluides', 'Aufsteigende Retro-Wachstropfen', 'ゆったり浮かび上がるレトロなワックス', 'Bolhas de cera retrô que sobem e se fundem'],
  'Galaxy Timer': ['Temporizador Galaxia', 'Minuteur Galaxie', 'Galaxie-Timer', 'ギャラクシー・タイマー', 'Temporizador Galáxia'],
  'Deep space spiral starfield': ['Campo estelar en espiral del espacio profundo', 'Champ d’étoiles en spirale cosmique', 'Tiefenraum-Spiralsternfeld', '深宇宙の渦巻きスターフィールド', 'Campo estelar em espiral do espaço profundo'],
  'Liquid Timer': ['Temporizador Líquido', 'Minuteur Liquide', 'Flüssigkeits-Timer', 'リキッド・タイマー', 'Temporizador Líquido'],
  'Smooth draining glass & bubbles': ['Cristal con drenaje suave y burbujas', 'Verre fluide avec bulles apaisantes', 'Sanft abfließendes Glas & Blasen', 'なめらかに流れる液体と気泡', 'Vidro com drenagem suave e bolhas'],
  'Rainbow Timer': ['Temporizador Arcoíris', 'Minuteur Arc-en-Ciel', 'Regenbogen-Timer', 'レインボー・タイマー', 'Temporizador Arco-Íris'],
  'Colorful arc visual countdown': ['Cuenta regresiva visual de arco colorido', 'Compte à rebours visuel en arc coloré', 'Farbenfroher Regenbogen-Countdown', 'カラフルなアーチ型カウントダウン', 'Contagem regressiva visual em arco colorido'],
  'Frost Timer': ['Temporizador de Escarcha', 'Minuteur Givre', 'Frost-Timer', 'フロスト・タイマー', 'Temporizador de Geada'],
  'Spreading ice crystal patterns': ['Patrones de cristales de hielo en expansión', 'Motifs de cristaux de glace', 'Wachsende Eiskristall-Muster', '広がる氷の結晶パターン', 'Padrões de cristais de gelo em expansão'],
  'Snow Timer': ['Temporizador de Nieve', 'Minuteur Neige', 'Schnee-Timer', 'スノー・タイマー', 'Temporizador de Neve'],
  'Gentle winter snowfall & cabin': ['Suave nevada de invierno y cabaña acogedora', 'Douce chute de neige hivernale et chalet', 'Sanfter Schneefall & Winterhütte', '穏やかな冬の雪景色とキャビン', 'Neve suave de inverno e cabana aconchegante'],
  'Countdown Timer': ['Temporizador de Cuenta Regresiva', 'Compte à Rebours', 'Countdown-Timer', 'カウントダウンタイマー', 'Temporizador de Contagem Regressiva'],
  'Precision daily countdown clock': ['Reloj de cuenta regresiva diario de precisión', 'Horloge de compte à rebours de précision', 'Präzise tägliche Countdown-Uhr', '高精度な定番カウントダウン時計', 'Relógio de contagem regressiva diário de precisão'],
  'A simple, classic digital countdown.': ['Una cuenta regresiva digital simple y clásica.', 'Un compte à rebours numérique simple et classique.', 'Ein einfacher, klassischer digitaler Countdown.', 'シンプルで定番のデジタルカウントダウン。', 'Uma contagem regressiva digital simples e clássica.'],
  'A simple numeric countdown.': ['Una cuenta regresiva numérica simple.', 'Un compte à rebours numérique simple.', 'Ein einfacher numerischer Countdown.', 'シンプルな数字カウントダウン。', 'Uma contagem regressiva numérica simples.'],
  'Pomodoro Timer': ['Temporizador Pomodoro', 'Minuteur Pomodoro', 'Pomodoro-Timer', 'ポモドーロタイマー', 'Temporizador Pomodoro'],
  '25/5 focus & break intervals': ['Intervalos de enfoque y descanso 25/5', 'Intervalles de concentration et pause 25/5', '25/5 Fokus- & Pausenintervalle', '25分集中・5分休憩のサイクル', 'Intervalos de foco e pausa 25/5'],
  'Focus and break intervals for study and work.': ['Intervalos de concentración y descanso para estudio y trabajo.', 'Intervalles de travail et de pause pour étudier.', 'Fokus- und Pausenintervalle für Studium und Arbeit.', '勉強や仕事に最適な集中＆休憩インターバル。', 'Intervalos de foco e descanso para estudo e trabalho.'],
  'Visual Timer': ['Temporizador Visual', 'Minuteur Visuel', 'Visueller Timer', 'ビジュアルタイマー', 'Temporizador Visual'],
  'A simple visual countdown.': ['Una cuenta regresiva visual simple.', 'Un compte à rebours visuel simple.', 'Ein einfacher visueller Countdown.', 'シンプルなビジュアルカウントダウン。', 'Uma contagem regressiva visual simples.'],
  'Progress Timer': ['Temporizador de Progreso', 'Minuteur de Progression', 'Fortschritts-Timer', 'プログレスタイマー', 'Temporizador de Progresso'],
  'A visual progress bar timer.': ['Un temporizador de barra de progreso visual.', 'Un minuteur à barre de progression visuelle.', 'Ein Timer mit visuellem Fortschrittsbalken.', '視覚的なプログレスバー式タイマー。', 'Um temporizador de barra de progresso visual.'],
  'Shrinking proportional time disc': ['Disco de tiempo proporcional que se reduce', 'Disque de temps proportionnel', 'Schrumpfende proportionale Zeitscheibe', '残り時間が一目でわかる円盤タイマー', 'Disco de tempo proporcional que diminui'],
  'Sand Timer': ['Reloj de Arena', 'Sablier Numérique', 'Sanduhr-Timer', '砂時計タイマー', 'Ampulheta Digital'],
  'Realistic digital glass hourglass': ['Reloj de arena digital realista en cristal', 'Sablier en verre numérique réaliste', 'Realistische digitale Glas-Sanduhr', 'リアルなデジタルガラス砂時計', 'Ampulheta digital realista em vidro'],
  Stopwatch: ['Cronómetro', 'Chronomètre', 'Stoppuhr', 'ストップウォッチ', 'Cronômetro'],
  'Measure elapsed time with precision.': ['Mide el tiempo transcurrido con precisión.', 'Mesurez le temps écoulé avec précision.', 'Messen Sie die verstrichene Zeit präzise.', '経過時間を正確に計測します。', 'Meça o tempo decorrido com precisão.'],
  'Millisecond split-lap timer': ['Cronómetro de vueltas con milisegundos', 'Chronomètre au milliseconde avec tours', 'Millisekunden-Rundenstoppuhr', 'ミリ秒対応ラップ計測ストップウォッチ', 'Cronômetro de voltas em milissegundos'],
  'Clean digital stopwatch with laps.': ['Cronómetro digital limpio con registro de vueltas.', 'Chronomètre numérique clair avec tours.', 'Übersichtliche digitale Stoppuhr mit Runden.', 'ラップ計測機能付きのシンプルなストップウォッチ。', 'Cronômetro digital limpo com voltas.'],
  'Interval Timer': ['Temporizador de Intervalos', 'Minuteur d’Intervalles', 'Intervall-Timer', 'インターバルタイマー', 'Temporizador de Intervalos'],
  'HIIT, Tabata & circuit rounds': ['Rondas de HIIT, Tabata y circuito', 'Séances HIIT, Tabata et circuits', 'HIIT-, Tabata- & Zirkelrunden', 'HIIT・タバタ・サーキットトレーニング対応', 'Séries de HIIT, Tabata e circuito'],
  'Stage Timer': ['Temporizador de Escenario', 'Minuteur de Scène', 'Bühnen-Timer', 'ステージタイマー', 'Temporizador de Palco'],
  'Classroom Timer': ['Temporizador de Aula', 'Minuteur de Classe', 'Klassenzimmer-Timer', '教室タイマー', 'Temporizador de Sala de Aula'],
  'Time-Zone Converter': ['Conversor de Zonas Horarias', 'Convertisseur de Fuseaux Horaires', 'Zeitzonen-Umrechner', 'タイムゾーン変換', 'Conversor de Fuso Horário'],
  'Meeting Planner': ['Planificador de Reuniones', 'Planificateur de Réunion', 'Meeting-Planer', 'ミーティングプランナー', 'Planejador de Reuniões'],
  'Duration Calculator': ['Calculadora de Duración', 'Calculateur de Durée', 'Dauer-Rechner', '時間・期間計算機', 'Calculadora de Duração'],
  'Random Name Picker': ['Selector de Nombres al Azar', 'Tirage au Sort de Noms', 'Zufalls-Namensgenerator', 'ランダム名前ピッカー', 'Sorteador de Nomes'],

  // Categories
  'Everyday Timers': ['Temporizadores Cotidianos', 'Minuteurs du Quotidien', 'Alltags-Timer', '日常タイマー', 'Temporizadores do Dia a Dia'],
  'Countdown, visual, sand, liquid & sensory timers': ['Cuenta regresiva, visual, arena, líquido y sensoriales', 'Compte à rebours, visuel, sablier, liquide et sensoriel', 'Countdown-, visuelle, Sand-, Flüssigkeits- & Sensorik-Timer', 'カウントダウン、砂時計、液体、感覚タイマー', 'Contagem regressiva, visual, areia, líquido e sensoriais'],
  'Education & Classroom': ['Educación y Aula', 'Éducation & Salle de Classe', 'Bildung & Klassenzimmer', '教育・教室ツール', 'Educação e Sala de Aula'],
  'Classroom timers, name pickers & noise meters': ['Temporizadores de aula, selector de nombres y medidor de ruido', 'Minuteurs de classe, tirage au sort et sonomètre', 'Klassenzimmer-Timer, Namenswahl & Lautstärkemesser', '教室タイマー、名前ピッカー、音量メーター', 'Temporizadores de aula, sorteador de nomes e medidor de ruído'],
  'Events & Presentations': ['Eventos y Presentaciones', 'Événements & Présentations', 'Events & Präsentationen', 'イベント・プレゼン', 'Eventos e Apresentações'],
  'Presentation & Events': ['Presentaciones y Eventos', 'Présentations & Événements', 'Präsentationen & Events', 'プレゼン・イベント', 'Apresentações e Eventos'],
  'Stage confidence monitors, speaker & debate timers': ['Monitores de escenario, temporizadores de oradores y debate', 'Moniteurs de scène, minuteurs d’orateur et débat', 'Bühnenmonitore, Redner- & Debatten-Timer', 'ステージモニター、スピーチ・討論タイマー', 'Monitores de palco, temporizadores de palestra e debate'],
  'Productivity & Study': ['Productividad y Estudio', 'Productivité & Études', 'Produktivität & Lernen', '生産性・学習', 'Produtividade e Estudo'],
  'Pomodoro focus blocks, flip clocks & study tools': ['Bloques Pomodoro, relojes flip y herramientas de estudio', 'Blocs Pomodoro, horloges flip et outils d’étude', 'Pomodoro-Fokusblöcke, Flip-Clocks & Lerntools', 'ポモドーロ集中ブロック、フリップ時計、学習ツール', 'Blocos Pomodoro, relógios flip e ferramentas de estudo'],
  'Fitness & Intervals': ['Fitness e Intervalos', 'Fitness & Intervalles', 'Fitness & Intervalle', 'フィットネス・インターバル', 'Fitness e Intervalos'],
  'Fitness & Wellness': ['Fitness y Bienestar', 'Fitness & Bien-être', 'Fitness & Wellness', 'フィットネス・ウェルネス', 'Fitness e Bem-Estar'],
  'HIIT, Tabata, rings & multi-lane stopwatches': ['HIIT, Tabata, anillos y cronómetros multicarril', 'HIIT, Tabata, anneaux et chronomètres multi-couloirs', 'HIIT, Tabata, Ringe & Mehrspur-Stoppuhren', 'HIIT、タバタ、マルチレーン・ストップウォッチ', 'HIIT, Tabata, anéis e cronômetros multipista'],
  'World Clock & Time Zones': ['Reloj Mundial y Zonas Horarias', 'Horloge Mondiale & Fuseaux Horaires', 'Weltuhr & Zeitzonen', '世界時計・タイムゾーン', 'Relógio Mundial e Fusos Horários'],
  'World Time & Tools': ['Hora Mundial y Herramientas', 'Heure Mondiale & Outils', 'Weltzeit & Werkzeuge', '世界時間＆ツール', 'Hora Mundial e Ferramentas'],
  'Global city clocks, converters & meeting planners': ['Relojes de ciudades globales, conversores y planificadores', 'Horloges mondiales, convertisseurs et réunions', 'Weltstadtuhr, Umrechner & Meeting-Planer', '世界の都市時計、時差変換、会議プランナー', 'Relógios mundiais, conversores e planejadores de reuniões'],

  // Interactive Controls & Flip Clock UI
  'Live Clock': ['Reloj en Vivo', 'Horloge en Direct', 'Live-Uhr', '現在時刻', 'Relógio ao Vivo'],
  'LIVE CLOCK': ['RELOJ EN VIVO', 'HORLOGE EN DIRECT', 'LIVE-UHR', '現在時刻', 'RELÓGIO AO VIVO'],
  Countdown: ['Cuenta Regresiva', 'Compte à Rebours', 'Countdown', 'カウントダウン', 'Contagem Regressiva'],
  COUNTDOWN: ['CUENTA REGRESIVA', 'COMPTE À REBOURS', 'COUNTDOWN', 'カウントダウン', 'CONTAGEM REGRESSIVA'],
  STOPWATCH: ['CRONÓMETRO', 'CHRONOMÈTRE', 'STOPPUHR', 'ストップウォッチ', 'CRONÔMETRO'],
  'Countdown Mode': ['Modo Cuenta Regresiva', 'Mode Compte à Rebours', 'Countdown-Modus', 'カウントダウンモード', 'Modo Contagem Regressiva'],
  'Stopwatch Mode': ['Modo Cronómetro', 'Mode Chronomètre', 'Stoppuhr-Modus', 'ストップウォッチモード', 'Modo Cronômetro'],
  'Time Format': ['Formato de Hora', 'Format de l’Heure', 'Zeitformat', '時刻表示形式', 'Formato de Hora'],
  '12-hour (AM/PM)': ['12 horas (AM/PM)', '12 heures (AM/PM)', '12-Stunden (AM/PM)', '12時間制 (AM/PM)', '12 horas (AM/PM)'],
  '24-hour': ['24 horas', '24 heures', '24-Stunden', '24時間制', '24 horas'],
  'Time Zone': ['Zona Horaria', 'Fuseau Horaire', 'Zeitzone', 'タイムゾーン', 'Fuso Horário'],
  'Countdown Controls': ['Controles de Cuenta Regresiva', 'Commandes du Compte à Rebours', 'Countdown-Steuerung', 'カウントダウン操作', 'Controles de Contagem Regressiva'],
  'Stopwatch Controls': ['Controles del Cronómetro', 'Commandes du Chronomètre', 'Stoppuhr-Steuerung', 'ストップウォッチ操作', 'Controles do Cronômetro'],
  Start: ['Iniciar', 'Démarrer', 'Start', 'スタート', 'Iniciar'],
  Pause: ['Pausar', 'Pause', 'Pause', '一時停止', 'Pausar'],
  Resume: ['Reanudar', 'Reprendre', 'Fortsetzen', '再開', 'Retomar'],
  Reset: ['Reiniciar', 'Réinitialiser', 'Zurücksetzen', 'リセット', 'Redefinir'],
  Lap: ['Vuelta', 'Tour', 'Runde', 'ラップ', 'Volta'],
  Clear: ['Limpiar', 'Effacer', 'Löschen', 'クリア', 'Limpar'],
  Apply: ['Aplicar', 'Appliquer', 'Anwenden', '適用', 'Aplicar'],
  Cancel: ['Cancelar', 'Annuler', 'Abbrechen', 'キャンセル', 'Cancelar'],
  'Custom Time': ['Tiempo Personalizado', 'Temps Personnalisé', 'Eigene Zeit', 'カスタム時間', 'Tempo Personalizado'],
  'Set Custom Countdown': ['Configurar Cuenta Regresiva Personalizada', 'Définir un Compte à Rebours Personnalisé', 'Eigenen Countdown einstellen', 'カスタムカウントダウンを設定', 'Definir Contagem Regressiva Personalizada'],
  Hours: ['Horas', 'Heures', 'Stunden', '時間', 'Horas'],
  Minutes: ['Minutos', 'Minutes', 'Minuten', '分', 'Minutos'],
  Seconds: ['Segundos', 'Secondes', 'Sekunden', '秒', 'Segundos'],
  'Display Theme': ['Tema de Pantalla', 'Thème d’Affichage', 'Anzeigethema', '表示テーマ', 'Tema de Exibição'],
  'Dark (Classic)': ['Oscuro (Clásico)', 'Sombre (Classique)', 'Dunkel (Klassisch)', 'ダーク (クラシック)', 'Escuro (Clássico)'],
  'Light (Retro)': ['Claro (Retro)', 'Clair (Rétro)', 'Hell (Retro)', 'ライト (レトロ)', 'Claro (Retrô)'],
  Sound: ['Sonido', 'Son', 'Ton', 'サウンド', 'Som'],
  On: ['Activado', 'Activé', 'Ein', 'オン', 'Ligado'],
  Off: ['Desactivado', 'Désactivé', 'Aus', 'オフ', 'Desligado'],
  Fullscreen: ['Pantalla Completa', 'Plein Écran', 'Vollbild', 'フルスクリーン', 'Tela Cheia'],
  'Exit Fullscreen (F)': ['Salir de Pantalla Completa (F)', 'Quitter le Plein Écran (F)', 'Vollbild beenden (F)', 'フルスクリーン終了 (F)', 'Sair da Tela Cheia (F)'],
  'Mode Overview': ['Resumen de Modos', 'Aperçu des Modes', 'Modus-Übersicht', 'モード概要', 'Visão Geral dos Modos'],
  'Choose a mode and use the flip clock your way.': [
    'Elige un modo y usa el reloj flip a tu manera.',
    'Choisissez un mode et utilisez l’horloge flip à votre façon.',
    'Wählen Sie einen Modus und nutzen Sie die Flip-Clock auf Ihre Weise.',
    '用途に合わせて3つのモードを自由に切り替えられます。',
    'Escolha um modo e use o relógio flip do seu jeito.',
  ],
  'Show the current time in a real split-flap display.': [
    'Muestra la hora actual en una pantalla real de paneles abatibles.',
    'Affichez l’heure actuelle sur un véritable affichage à palettes.',
    'Zeigt die aktuelle Uhrzeit auf einer echten Klappzahlenanzeige.',
    '現在時刻をリアルなパタパタ時計スタイルで表示します。',
    'Mostre a hora atual em um visor real de placas giratórias.',
  ],
  'Count down from a set time with a flipping display.': [
    'Cuenta hacia atrás desde un tiempo establecido con paneles abatibles.',
    'Comptez à rebours à partir d’une durée définie avec un affichage à palettes.',
    'Zählt von einer festgelegten Zeit mit Klappzahlen herunter.',
    '設定した時間からパタパタ表示でカウントダウンします。',
    'Conte regressivamente a partir de um tempo definido com placas giratórias.',
  ],
  'Measure elapsed time with a retro flip clock.': [
    'Mide el tiempo transcurrido con un reloj flip retro.',
    'Mesurez le temps écoulé avec une horloge flip rétro.',
    'Messen Sie die verstrichene Zeit mit einer Retro-Flip-Clock.',
    'レトロなフリップ時計で経過時間を計測します。',
    'Meça o tempo decorrido com um relógio flip retrô.',
  ],
  'Quick Timer Presets (Countdown Mode)': [
    'Ajustes Rápidos de Temporizador (Modo Cuenta Regresiva)',
    'Préréglages Rapides (Mode Compte à Rebours)',
    'Schnellwahl-Timer (Countdown-Modus)',
    'クイックタイマー・プリセット（カウントダウンモード）',
    'Predefinições Rápidas (Modo Contagem Regressiva)',
  ],
  'Start a countdown with a single click.': [
    'Inicia una cuenta regresiva con un solo clic.',
    'Démarrez un compte à rebours en un seul clic.',
    'Starten Sie einen Countdown mit einem einzigen Klick.',
    'ワンクリックですぐにカウントダウンを開始できます。',
    'Inicie uma contagem regressiva com um único clique.',
  ],

  // Hero & Editorial Guide Headings
  'Free Online Flip Clock': [
    'Reloj Flip Online Gratis',
    'Horloge Flip en Ligne Gratuite',
    'Kostenlose Online-Flip-Clock',
    '無料オンライン・フリップ時計',
    'Relógio Flip Online Grátis',
  ],
  'A realistic retro split-flap clock with live time, countdown and stopwatch modes. Simple, stylish and perfect for your desk, study or display.': [
    'Un reloj retro realista de paneles abatibles con modos de hora en vivo, cuenta regresiva y cronómetro. Simple, elegante y perfecto para tu escritorio, estudio o pantalla.',
    'Une horloge rétro réaliste à palettes avec modes heure en direct, compte à rebours et chronomètre. Simple, élégante et parfaite pour votre bureau, vos études ou votre écran.',
    'Eine realistische Retro-Klappzahlenuhr mit Live-Uhrzeit, Countdown- und Stoppuhr-Modus. Schlicht, stilvoll und perfekt für Schreibtisch, Studium oder Display.',
    '現在時刻、カウントダウン、ストップウォッチを備えたリアルなレトロ・パタパタ時計。シンプルで洗練されたデザインで、デスクや勉強、ディスプレイ表示に最適です。',
    'Um relógio retrô realista de placas giratórias com modos de hora ao vivo, contagem regressiva e cronômetro. Simples, elegante e perfeito para sua mesa, estudo ou tela.',
  ],
  '12/24-hour format': ['Formato de 12/24 horas', 'Format 12/24 heures', '12/24-Stunden-Format', '12/24時間表示対応', 'Formato de 12/24 horas'],
  'Fullscreen display': ['Pantalla completa', 'Affichage plein écran', 'Vollbild-Anzeige', 'フルスクリーン表示', 'Exibição em tela cheia'],
  'Free to use': ['Gratis para usar', 'Gratuit à utiliser', 'Kostenlos nutzbar', '完全無料', 'Grátis para usar'],
  'On This Page': ['En Esta Página', 'Sur Cette Page', 'Auf Dieser Seite', 'このページの目次', 'Nesta Página'],
  'Related Tools': ['Herramientas Relacionadas', 'Outils Associés', 'Verwandte Werkzeuge', '関連ツール', 'Ferramentas Relacionadas'],
  'A COMPLETE GUIDE': ['UNA GUÍA COMPLETA', 'UN GUIDE COMPLET', 'EIN VOLLSTÄNDIGER LEITFADEN', '完全ガイド', 'UM GUIA COMPLETO'],
  'Popular Uses': ['Usos Populares', 'Utilisations Courantes', 'Beliebte Anwendungen', '人気の活用シーン', 'Usos Populares'],
  'Frequently Asked Questions': ['Preguntas Frecuentes', 'Questions Fréquentes', 'Häufig gestellte Fragen (FAQ)', 'よくある質問（FAQ）', 'Perguntas Frequentes'],
  'Explore More Timers': ['Explorar Más Temporizadores', 'Explorer Plus de Minuteurs', 'Weitere Timer entdecken', '他のタイマーを探す', 'Explorar Mais Temporizadores'],
  'Discover more tools from our collection:': [
    'Descubre más herramientas de nuestra colección:',
    'Découvrez plus d’outils de notre collection :',
    'Entdecken Sie weitere Werkzeuge aus unserer Sammlung:',
    'コレクションから他の便利なツールもご覧ください：',
    'Descubra mais ferramentas da nossa coleção:',
  ],
  'Ready to Use the Flip Clock?': [
    '¿Listo para Usar el Reloj Flip?',
    'Prêt à Utiliser l’Horloge Flip ?',
    'Bereit für die Flip-Clock?',
    'フリップ時計を使ってみませんか？',
    'Pronto para Usar o Relógio Flip?',
  ],
  'Launch the Flip Clock': [
    'Abrir el Reloj Flip',
    'Lancer l’Horloge Flip',
    'Flip-Clock starten',
    'フリップ時計を起動する',
    'Iniciar o Relógio Flip',
  ],
  'What Is a Flip Clock?': [
    '¿Qué es un Reloj Flip?',
    'Qu’est-ce qu’une Horloge Flip ?',
    'Was ist eine Flip-Clock (Klappzahlenuhr)?',
    'フリップ時計（パタパタ時計）とは？',
    'O Que É um Relógio Flip?',
  ],
  'How a Retro Split-Flap Clock Works': [
    'Cómo Funciona un Reloj Retro de Paneles Abatibles',
    'Comment Fonctionne une Horloge Rétro à Palettes',
    'Wie eine Retro-Klappzahlenuhr funktioniert',
    'レトロなパタパタ時計の仕組み',
    'Como Funciona um Relógio Retrô de Placas Giratórias',
  ],
  'How to Use the Online Flip Clock': [
    'Cómo Usar el Reloj Flip Online',
    'Comment Utiliser l’Horloge Flip en Ligne',
    'So nutzen Sie die Online-Flip-Clock',
    'オンライン・フリップ時計の使い方',
    'Como Usar o Relógio Flip Online',
  ],
  'Flip Clock Countdown and Stopwatch Modes': [
    'Modos de Cuenta Regresiva y Cronómetro del Reloj Flip',
    'Modes Compte à Rebours et Chronomètre de l’Horloge Flip',
    'Countdown- und Stoppuhr-Modus der Flip-Clock',
    'フリップ時計のカウントダウン＆ストップウォッチモード',
    'Modos de Contagem Regressiva e Cronômetro do Relógio Flip',
  ],
  'Flip Clock for Desks and Displays': [
    'Reloj Flip para Escritorios y Pantallas',
    'Horloge Flip pour Bureaux et Écrans',
    'Flip-Clock für Schreibtische und Displays',
    'デスクやディスプレイ表示に最適なフリップ時計',
    'Relógio Flip para Mesas e Telas',
  ],
  'Flip Clock vs Flip Timer': [
    'Reloj Flip vs Temporizador Flip',
    'Horloge Flip vs Minuteur Flip',
    'Flip-Clock vs. Flip-Timer',
    'フリップ時計とフリップタイマーの違い',
    'Relógio Flip vs Temporizador Flip',
  ],
  'Why Use a Flip Clock for Study, Desk & Focus': [
    'Por Qué Usar un Reloj Flip para Estudio, Escritorio y Enfoque',
    'Pourquoi Utiliser une Horloge Flip pour Étudier et se Concentrer',
    'Warum eine Flip-Clock für Studium, Schreibtisch & Fokus?',
    '勉強・デスク・集中にフリップ時計が選ばれる理由',
    'Por Que Usar um Relógio Flip para Estudo, Mesa e Foco',
  ],
  'Flip Clock vs. Digital Timer vs. Analog Clock': [
    'Reloj Flip vs. Temporizador Digital vs. Reloj Analógico',
    'Horloge Flip vs Minuteur Numérique vs Horloge Analogique',
    'Flip-Clock vs. Digitaler Timer vs. Analoge Uhr',
    'フリップ時計・デジタルタイマー・アナログ時計の比較',
    'Relógio Flip vs. Temporizador Digital vs. Relógio Analógico',
  ],
  Tip: ['Consejo', 'Astuce', 'Tipp', 'ヒント', 'Dica'],
  'Note:': ['Nota:', 'Remarque :', 'Hinweis:', '注記：', 'Nota:'],
  '. All rights reserved.': [
    '. Todos los derechos reservados.',
    '. Tous droits réservés.',
    '. Alle Rechte vorbehalten.',
    '. All rights reserved.',
    '. Todos os direitos reservados.',
  ],

  // Footer
  'Precision online countdown timers, split-flap clocks, sensory visual timers, and global time tools designed for classrooms, stage events, and deep work.': [
    'Temporizadores de cuenta regresiva de precisión, relojes flip, temporizadores visuales sensoriales y herramientas de tiempo globales diseñadas para aulas, eventos en escenario y trabajo profundo.',
    'Minuteurs de précision en ligne, horloges à palettes, minuteurs visuels sensoriels et outils de temps mondiaux conçus pour les salles de classe, les événements sur scène et le travail concentré.',
    'Präzise Online-Countdown-Timer, Klappzahlenuhren, sensorische visuelle Timer und globale Zeitwerkzeuge für Klassenzimmer, Bühnen-Events und konzentriertes Arbeiten.',
    '教室、ステージイベント、集中作業のために設計された、高精度オンラインカウントダウンタイマー、パタパタ時計、感覚ビジュアルタイマー、世界時計ツール。',
    'Temporizadores de contagem regressiva de precisão, relógios flip, temporizadores visuais sensoriais e ferramentas globais de tempo projetadas para salas de aula, eventos de palco e trabalho focado.',
  ],
  '100% Free': ['100% Gratis', '100 % Gratuit', '100 % Kostenlos', '100% 無料', '100% Grátis'],
  'No Sign-Up': ['Sin Registro', 'Sans Inscription', 'Ohne Anmeldung', '登録不要', 'Sem Cadastro'],
  'Fullscreen Ready': ['Listo para Pantalla Completa', 'Plein Écran Prêt', 'Vollbild-fähig', 'フルスクリーン対応', 'Pronto para Tela Cheia'],
  'Explore All 47+ Tools': ['Explorar las 47+ Herramientas', 'Explorer les 47+ Outils', 'Alle 47+ Werkzeuge entdecken', '全47種類以上のツールを見る', 'Explorar Todas as 47+ Ferramentas'],
  'Essential Timers': ['Temporizadores Esenciales', 'Minuteurs Essentiels', 'Wichtige Timer', '定番タイマー', 'Temporizadores Essenciais'],
  'Visual & Sensory': ['Visual y Sensorial', 'Visuel & Sensoriel', 'Visuell & Sensorisch', 'ビジュアル＆感覚タイマー', 'Visual e Sensorial'],
  'Stage, Class & World': ['Escenario, Aula y Mundo', 'Scène, Classe & Monde', 'Bühne, Klasse & Welt', 'ステージ・教室・世界時計', 'Palco, Aula e Mundo'],
  'About & Methodology': ['Acerca de y Metodología', 'À Propos & Méthodologie', 'Über uns & Methodik', '当サイトについて・設計方針', 'Sobre e Metodologia'],
  Guides: ['Guías', 'Guides', 'Anleitungen', 'ガイド', 'Guias'],
  Accessibility: ['Accesibilidad', 'Accessibilité', 'Barrierefreiheit', 'アクセシビリティ', 'Acessibilidade'],
  'Privacy Policy': ['Política de Privacidad', 'Politique de Confidentialité', 'Datenschutz', 'プライバシーポリシー', 'Política de Privacidade'],
  'Terms of Use': ['Términos de Uso', 'Conditions d’Utilisation', 'Nutzungsbedingungen', '利用規約', 'Termos de Uso'],
  Contact: ['Contacto', 'Contact', 'Kontakt', 'お問い合わせ', 'Contato'],
  Sitemap: ['Mapa del Sitio', 'Plan du Site', 'Sitemap', 'サイトマップ', 'Mapa do Site'],
  Theme: ['Tema', 'Thème', 'Design', 'テーマ', 'Tema'],
  Top: ['Arriba', 'Haut', 'Oben', 'トップ', 'Topo'],
};

const LANG_INDEX: Record<Exclude<LanguageCode, 'en'>, number> = {
  es: 0,
  fr: 1,
  de: 2,
  ja: 3,
  pt: 4,
};

export function translateSync(text: string, langCode: LanguageCode): string | null {
  if (langCode === 'en') return text;
  const normalized = normalizeTextKey(text);
  if (!normalized) return text;

  const idx = LANG_INDEX[langCode];
  const exact = UI_DICTIONARY[normalized];
  if (exact) {
    return exact[idx];
  }

  // Pattern: "1 Minute" / "5 Minutes" / "10 Minutes Timer"
  const minMatch = normalized.match(/^(\d+)\s+Minutes?(\s+Timer)?$/i);
  if (minMatch) {
    const n = minMatch[1];
    const isPlural = Number(n) !== 1;
    const hasTimer = Boolean(minMatch[2]);
    if (langCode === 'es') {
      const unit = isPlural ? 'Minutos' : 'Minuto';
      return hasTimer ? `Temporizador de ${n} ${unit}` : `${n} ${unit}`;
    }
    if (langCode === 'fr') {
      const unit = isPlural ? 'Minutes' : 'Minute';
      return hasTimer ? `Minuteur de ${n} ${unit}` : `${n} ${unit}`;
    }
    if (langCode === 'de') {
      const unit = isPlural ? 'Minuten' : 'Minute';
      return hasTimer ? `${n}-${unit}-Timer` : `${n} ${unit}`;
    }
    if (langCode === 'ja') {
      return hasTimer ? `${n}分タイマー` : `${n}分`;
    }
    if (langCode === 'pt') {
      const unit = isPlural ? 'Minutos' : 'Minuto';
      return hasTimer ? `Temporizador de ${n} ${unit}` : `${n} ${unit}`;
    }
  }

  // Pattern: "X Second(s)"
  const secMatch = normalized.match(/^(\d+)\s+Seconds?$/i);
  if (secMatch) {
    const n = secMatch[1];
    const isPlural = Number(n) !== 1;
    const map: Record<Exclude<LanguageCode, 'en'>, string> = {
      es: `${n} ${isPlural ? 'Segundos' : 'Segundo'}`,
      fr: `${n} ${isPlural ? 'Secondes' : 'Seconde'}`,
      de: `${n} ${isPlural ? 'Sekunden' : 'Sekunde'}`,
      ja: `${n}秒`,
      pt: `${n} ${isPlural ? 'Segundos' : 'Segundo'}`,
    };
    return map[langCode];
  }

  // Pattern: "X Hour(s)"
  const hrMatch = normalized.match(/^(\d+)\s+Hours?$/i);
  if (hrMatch) {
    const n = hrMatch[1];
    const isPlural = Number(n) !== 1;
    const map: Record<Exclude<LanguageCode, 'en'>, string> = {
      es: `${n} ${isPlural ? 'Horas' : 'Hora'}`,
      fr: `${n} ${isPlural ? 'Heures' : 'Heure'}`,
      de: `${n} ${isPlural ? 'Stunden' : 'Stunde'}`,
      ja: `${n}時間`,
      pt: `${n} ${isPlural ? 'Horas' : 'Hora'}`,
    };
    return map[langCode];
  }

  // Pattern: "Search Results (X)"
  const searchResMatch = normalized.match(/^Search Results\s*\((\d+)\)$/i);
  if (searchResMatch) {
    const n = searchResMatch[1];
    const map: Record<Exclude<LanguageCode, 'en'>, string> = {
      es: `Resultados de Búsqueda (${n})`,
      fr: `Résultats de Recherche (${n})`,
      de: `Suchergebnisse (${n})`,
      ja: `検索結果 (${n}件)`,
      pt: `Resultados da Pesquisa (${n})`,
    };
    return map[langCode];
  }

  // Pattern: "All (32)", "Trending (9)", "Hot (9)", "New (14)"
  const filterTabMatch = normalized.match(/^(All|Trending|Hot|New)\s*\((\d+)\)$/i);
  if (filterTabMatch) {
    const word = filterTabMatch[1].toLowerCase();
    const n = filterTabMatch[2];
    const wordMap: Record<string, TranslationTuple> = {
      all: ['Todos', 'Tous', 'Alle', 'すべて', 'Todos'],
      trending: ['Tendencia', 'Tendance', 'Trend', 'トレンド', 'Em Alta'],
      hot: ['Populares', 'Populaires', 'Beliebt', '人気', 'Populares'],
      new: ['Nuevos', 'Nouveaux', 'Neu', '新着', 'Novos'],
    };
    const tuple = wordMap[word];
    if (tuple) {
      return `${tuple[idx]} (${n})`;
    }
  }

  // Pattern: "1 min", "5 min", "15 min", "1 hour"
  const shortMinMatch = normalized.match(/^(\d+)\s*min$/i);
  if (shortMinMatch) {
    const n = shortMinMatch[1];
    if (langCode === 'ja') return `${n}分`;
    if (langCode === 'de') return `${n} Min.`;
    return `${n} min`;
  }

  const shortHrMatch = normalized.match(/^(\d+)\s*hours?$/i);
  if (shortHrMatch) {
    const n = shortHrMatch[1];
    const isPlural = Number(n) !== 1;
    const map: Record<Exclude<LanguageCode, 'en'>, string> = {
      es: `${n} ${isPlural ? 'horas' : 'hora'}`,
      fr: `${n} ${isPlural ? 'heures' : 'heure'}`,
      de: `${n} ${isPlural ? 'Stunden' : 'Stunde'}`,
      ja: `${n}時間`,
      pt: `${n} ${isPlural ? 'horas' : 'hora'}`,
    };
    return map[langCode];
  }

  // Pattern: "Open <Tool Name>" where <Tool Name> is in UI_DICTIONARY
  const openToolMatch = normalized.match(/^Open\s+(.+)$/);
  if (openToolMatch) {
    const targetName = openToolMatch[1].trim();
    const targetExact = UI_DICTIONARY[targetName];
    if (targetExact) {
      const translatedTarget = targetExact[idx];
      if (langCode === 'es') return `Abrir ${translatedTarget}`;
      if (langCode === 'fr') return `Ouvrir ${translatedTarget}`;
      if (langCode === 'de') return `${translatedTarget} öffnen`;
      if (langCode === 'ja') return `${translatedTarget}を開く`;
      if (langCode === 'pt') return `Abrir ${translatedTarget}`;
    }
  }

  return null;
}
