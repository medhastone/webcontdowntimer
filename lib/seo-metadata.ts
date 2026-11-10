import type { Metadata } from 'next';
import type { LanguageCode } from '@/lib/i18n';

export interface LocalizedSeoEntry {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogLocale: string;
  alternatesLanguages: Record<string, string>;
}

interface PageSeoBlueprint {
  enTitle: string;
  enDesc: string;
  enKeywords: string[];
  esName: string;
  esHook: string;
  esKeywords: string[];
  frName: string;
  frHook: string;
  frKeywords: string[];
  deName: string;
  deHook: string;
  deKeywords: string[];
  jaName: string;
  jaHook: string;
  jaKeywords: string[];
  ptName: string;
  ptHook: string;
  ptKeywords: string[];
}

const SITE_URL = 'https://WebCountDownTimer.com';

const OG_LOCALE_MAP: Record<LanguageCode, string> = {
  en: 'en_US',
  es: 'es_ES',
  fr: 'fr_FR',
  de: 'de_DE',
  ja: 'ja_JP',
  pt: 'pt_PT',
};

/**
 * Curated High-Search-Volume + Low-KD + High-CTA SEO Blueprints
 * Every page has a unique primary keyword cluster, low-KD long-tail modifier, and high-converting CTA.
 */
const SEO_BLUEPRINTS: Record<string, PageSeoBlueprint> = {
  '/': {
    enTitle: 'Free Online Countdown Timer, Flip Clock & Visual Timers – Start in 1 Click',
    enDesc:
      'Launch 49+ drift-free online countdown timers, retro split-flap clocks, sensory classroom timers & stage monitors. 100% free, fullscreen & no sign-up—Start now!',
    enKeywords: [
      'free online countdown timer',
      'online timer fullscreen with alarm',
      'retro flip clock online free',
      'visual timer for classroom',
      'no drift web timer',
    ],
    esName: 'Temporizador de Cuenta Regresiva, Reloj Flip y Temporizadores Visuales Online Gratis',
    esHook:
      'Inicia más de 49 temporizadores online sin retraso, relojes flip retro, temporizadores sensoriales de aula y monitores de escenario. ¡100% gratis, pantalla completa y sin registro—Empezar ahora!',
    esKeywords: ['temporizador online gratis pantalla completa', 'cuenta regresiva con alarma', 'reloj flip online gratis', 'temporizador visual aula'],
    frName: 'Minuteur en Ligne Gratuit, Horloge Flip & Minuteurs Visuels Plein Écran',
    frHook:
      'Lancez plus de 49 minuteurs en ligne ultra-précis, horloges flip rétro, minuteurs sensoriels de classe et moniteurs de scène. 100 % gratuit, plein écran et sans inscription — Démarrer maintenant !',
    frKeywords: ['minuteur en ligne gratuit plein écran', 'compte à rebours avec alarme', 'horloge flip en ligne', 'minuteur visuel classe'],
    deName: 'Kostenloser Online Countdown-Timer, Flip-Clock & Visuelle Vollbild-Timer',
    deHook:
      'Starten Sie über 49 präzise Online-Countdown-Timer, Retro-Klappzahlenuhren, sensorische Klassenzimmer-Timer und Bühnenmonitore. 100 % kostenlos, Vollbild & ohne Anmeldung – Jetzt starten!',
    deKeywords: ['online countdown timer kostenlos vollbild', 'flip clock online', 'visueller timer klassenzimmer', 'stoppuhr online mit alarm'],
    jaName: '無料オンライン・カウントダウンタイマー＆フリップ時計（全画面・登録不要）｜今すぐ開始',
    jaHook:
      '49種類以上の高精度オンラインタイマー、レトロなパタパタ時計、教室・勉強向け感覚ビジュアルタイマーをワンクリックで起動。完全無料・フルスクリーン対応・登録不要で今すぐ使えます！',
    jaKeywords: ['オンラインタイマー 無料 全画面', 'カウントダウンタイマー アラーム付き', 'フリップ時計 オンライン', '勉強用タイマー パタパタ時計'],
    ptName: 'Temporizador Online Grátis, Relógio Flip e Temporizadores Visuais em Tela Cheia',
    ptHook:
      'Inicie mais de 49 temporizadores de contagem regressiva precisos, relógios flip retrô, temporizadores sensoriais de aula e monitores de palco. 100% grátis, tela cheia e sem cadastro — Comece agora!',
    ptKeywords: ['temporizador online grátis tela cheia', 'contagem regressiva com alarme', 'relógio flip online', 'temporizador visual sala de aula'],
  },

  // ============================================================================
  // CATEGORY & DIRECTORY HUB PAGES
  // ============================================================================
  '/tools': {
    enTitle: 'All 49+ Free Online Timers, Clocks & Time Calculators – Launch Instantly',
    enDesc:
      'Browse our complete directory of 49+ free online countdown timers, sensory visual clocks, stage monitors, world clocks & payroll calculators. Click any tool to start free!',
    enKeywords: ['online timer directory', 'free web time tools', 'all online countdown timers', 'fullscreen classroom and stage timers'],
    esName: 'Directorio de 49+ Temporizadores, Relojes y Calculadoras de Tiempo Gratis',
    esHook: 'Explora nuestro catálogo completo de 49+ temporizadores de cuenta regresiva, relojes visuales sensoriales, monitores de escenario y calculadoras. ¡Haz clic y úsalos gratis al instante!',
    esKeywords: ['directorio de temporizadores online', 'herramientas de tiempo gratis', 'todos los relojes y cronómetros'],
    frName: 'Répertoire des 49+ Minuteurs, Horloges & Calculatrices de Temps Gratuits',
    frHook: 'Découvrez notre collection complète de 49+ minuteurs en ligne, horloges visuelles sensorielles, moniteurs de scène et calculatrices d’heures. Cliquez pour lancer gratuitement !',
    frKeywords: ['tous les minuteurs en ligne', 'outils de gestion du temps gratuits', 'annuaire minuteurs plein écran'],
    deName: 'Alle 49+ Kostenlosen Online-Timer, Uhren & Zeitrechner – Sofort Starten',
    deHook: 'Entdecken Sie unser Verzeichnis mit über 49 kostenlosen Countdown-Timern, sensorischen Uhren, Bühnenmonitoren und Arbeitszeitrechnern. Jetzt kostenlos im Browser starten!',
    deKeywords: ['alle online timer kostenlos', 'zeitwerkzeuge verzeichnis', 'vollbild timer und rechner'],
    jaName: '全49種類以上の無料オンラインタイマー・時計・時間計算ツール一覧｜ワンクリック起動',
    jaHook: 'カウントダウンタイマー、感覚ビジュアルタイマー、フリップ時計、ステージモニター、時間計算機など49種類以上の無料ツールを網羅。登録不要で今すぐブラウザから使えます！',
    jaKeywords: ['オンラインタイマー 一覧 無料', '時間計算ツール 無料', 'ビジュアルタイマー 種類'],
    ptName: 'Diretório com 49+ Temporizadores, Relógios e Calculadoras de Tempo Grátis',
    ptHook: 'Explore nossa coleção completa de 49+ temporizadores online, relógios visuais sensoriais, monitores de palco e calculadoras de horas. Clique para iniciar grátis agora!',
    ptKeywords: ['todos os temporizadores online', 'ferramentas de tempo grátis', 'relógios e cronômetros tela cheia'],
  },

  '/education': {
    enTitle: 'Free Classroom Timers for Teachers & Kids (Visual, Sensory & Fullscreen)',
    enDesc:
      'Keep students focused with free fullscreen classroom timers, sensory visual countdowns, noise meters & random name pickers. Zero ads, no login—Open for your class now!',
    enKeywords: ['classroom timers for teachers free', 'visual timer for kids fullscreen', 'sensory classroom timer ADHD', 'smartboard timer with alarm'],
    esName: 'Temporizadores de Aula Gratis para Profesores y Niños (Visual y Pantalla Completa)',
    esHook: 'Mantén a tus alumnos concentrados con temporizadores visuales de aula, relojes sensoriales, medidor de ruido y selector de nombres al azar. ¡100% gratis y sin registro—Ábrelo en tu pizarra digital!',
    esKeywords: ['temporizador de aula gratis para profesores', 'temporizador visual para niños pantalla completa', 'reloj para pizarra interactiva'],
    frName: 'Minuteurs de Classe Gratuits pour Enseignants & Élèves (Visuel & Plein Écran)',
    frHook: 'Captez l’attention de votre classe avec nos minuteurs visuels plein écran, minuteurs sensoriels, sonomètre et tirage au sort de noms. 100 % gratuit sans compte — Lancez-le sur votre TBI !',
    frKeywords: ['minuteur de classe gratuit enseignant', 'minuteur visuel enfants plein écran', 'outils tbi classe gratuits'],
    deName: 'Kostenlose Klassenzimmer-Timer für Lehrer & Schüler (Visuell & Vollbild)',
    deHook: 'Fördern Sie die Konzentration im Unterricht mit kostenlosen visuellen Vollbild-Timern, Sensorik-Uhren, Lautstärkeampel und Zufalls-Namenswahl. Ohne Anmeldung direkt am Smartboard starten!',
    deKeywords: ['klassenzimmer timer kostenlos lehrer', 'visueller timer grundschule smartboard', 'lautstärkeampel und zufallsgenerator'],
    jaName: '教室・授業向け無料ビジュアルタイマー＆学習ツール（全画面・感覚タイマー）｜先生・子供用に最適',
    jaHook: '電子黒板やタブレットで使える無料の教室タイマー、感覚ビジュアルタイマー、音量メーター、ランダム名前ピッカーを収録。登録不要・広告なしで今すぐ授業に導入できます！',
    jaKeywords: ['教室タイマー 無料 全画面', '小学校 授業 タイマー 電子黒板', '子供向け ビジュアルタイマー'],
    ptName: 'Temporizadores de Sala de Aula Grátis para Professores e Alunos (Tela Cheia)',
    ptHook: 'Mantenha sua turma focada com temporizadores visuais em tela cheia, relógios sensoriais, medidor de ruído e sorteador de nomes. 100% grátis e sem login — Abra na lousa digital agora!',
    ptKeywords: ['temporizador de sala de aula grátis', 'temporizador visual infantil tela cheia', 'ferramentas para professores online'],
  },

  '/category/education': {
    enTitle: 'Free Education & Classroom Timers for Smartboards – Launch Now',
    enDesc:
      'Discover K–12 classroom timers, sensory visual clocks, student group generators & decibel noise meters. 100% free, fullscreen & teacher-approved—Start in 1 click!',
    enKeywords: ['education timers online free', 'smartboard countdown timer', 'teacher classroom management timers'],
    esName: 'Temporizadores Educativos y de Aula para Pizarras Digitales – Iniciar Gratis',
    esHook: 'Descubre temporizadores escolares K–12, relojes visuales sensoriales, generador de grupos y medidor de decibelios. ¡100% gratis para docentes—Inícialo en 1 clic!',
    esKeywords: ['temporizadores educativos online', 'herramientas de gestión de aula gratis'],
    frName: 'Minuteurs Éducatifs & Outils de Gestion de Classe sur TBI – Lancer Gratuitement',
    frHook: 'Découvrez nos minuteurs scolaires, horloges visuelles sensorielles, générateur de groupes et sonomètre de classe. 100 % gratuit pour les enseignants — Démarrer en 1 clic !',
    frKeywords: ['minuteurs éducatifs tbi', 'outils gestion de classe en ligne'],
    deName: 'Kostenlose Bildungs- & Unterrichts-Timer für Smartboards – Sofort Starten',
    deHook: 'Entdecken Sie Unterrichts-Timer, sensorische Uhren, Gruppengeneratoren und Lautstärkemesser für Schulen. 100 % kostenlos für Lehrkräfte – Mit 1 Klick starten!',
    deKeywords: ['unterrichts timer smartboard kostenlos', 'schultimer online vollbild'],
    jaName: '教育・学校授業向け無料タイマー＆クラス運営ツール特集｜電子黒板・タブレット対応',
    jaHook: '小中高の授業で活躍する視覚タイマー、グループ分けツール、教室音量メーターを完備。登録不要・完全無料で先生の授業進行をサポートします！',
    jaKeywords: ['教育用タイマー 無料', '授業 タイムキーパー アプリ Web'],
    ptName: 'Temporizadores Educacionais e de Gestão de Sala de Aula – Iniciar Grátis',
    ptHook: 'Descubra temporizadores escolares, relógios sensoriais, gerador de grupos e medidor de barulho para turmas. 100% grátis para professores — Comece em 1 clique!',
    ptKeywords: ['temporizadores educacionais online', 'ferramentas gratuitas para sala de aula'],
  },

  '/category/timers': {
    enTitle: 'Free Everyday Online Timers, Visual Clocks & Stopwatches – Start Now',
    enDesc:
      'Use drift-free everyday countdown timers, retro split-flap clocks, sand hourglasses & millisecond stopwatches. Free fullscreen display with custom alarms—Try now!',
    enKeywords: ['everyday online timers free', 'fullscreen countdown clock with alarm', 'online visual and sand timers', 'digital stopwatch with laps'],
    esName: 'Temporizadores Cotidianos, Relojes Visuales y Cronómetros Online Gratis',
    esHook: 'Usa temporizadores diarios sin desfase, relojes flip retro, relojes de arena y cronómetros con vueltas. ¡Pantalla completa gratis con alarmas personalizadas—Pruébalo ahora!',
    esKeywords: ['temporizadores diarios online gratis', 'reloj cuenta atrás con alarma', 'cronómetro digital con vueltas'],
    frName: 'Minuteurs du Quotidien, Horloges Visuelles & Chronomètres en Ligne Gratuits',
    frHook: 'Utilisez nos minuteurs quotidiens sans dérive, horloges flip rétro, sabliers numériques et chronomètres au milliseconde. Plein écran gratuit avec alarme — Essayez maintenant !',
    frKeywords: ['minuteurs quotidiens gratuits', 'compte à rebours plein écran avec alarme', 'sablier et chronomètre en ligne'],
    deName: 'Kostenlose Alltags-Timer, Visuelle Uhren & Stoppuhren im Vollbildmodus',
    deHook: 'Nutzen Sie präzise tägliche Countdown-Timer, Retro-Flip-Clocks, digitale Sanduhren und Millisekunden-Stoppuhren. Kostenlos im Vollbild mit Alarmton – Jetzt ausprobieren!',
    deKeywords: ['alltags timer online kostenlos', 'countdown uhr mit alarmton', 'digitale sanduhr und stoppuhr'],
    jaName: '日常・作業用無料オンラインタイマー・砂時計・ストップウォッチ特集｜全画面＆アラーム対応',
    jaHook: '毎日の家事・勉強・仕事に使える高精度カウントダウンタイマー、フリップ時計、デジタル砂時計、ラップ計測ストップウォッチ。完全無料・登録不要で今すぐスタート！',
    jaKeywords: ['日常タイマー 無料 Web', 'デジタル砂時計 オンライン', 'ストップウォッチ ラップ計測 無料'],
    ptName: 'Temporizadores do Dia a Dia, Relógios Visuais e Cronômetros Online Grátis',
    ptHook: 'Use temporizadores diários precisos, relógios flip retrô, ampulhetas digitais e cronômetros com voltas. Tela cheia grátis com alarmes — Experimente agora!',
    ptKeywords: ['temporizadores diários online grátis', 'ampulheta digital e cronômetro', 'relógio regressivo tela cheia'],
  },

  '/category/everyday': {
    enTitle: 'Everyday Countdown Timers, Sand Hourglasses & Alarm Clocks – Free Online',
    enDesc:
      'Quick-launch everyday timers for cooking, study, breaks & workouts. Includes fullscreen digital countdowns, flip clocks & visual timers—Start free in 1 click!',
    enKeywords: ['everyday countdown timer online', 'quick kitchen and study timers free', 'fullscreen alarm timer browser'],
    esName: 'Temporizadores de Uso Diario, Relojes de Arena y Alarmas Online Gratis',
    esHook: 'Inicia al instante temporizadores para cocina, estudio, descansos y ejercicio. Incluye cuenta regresiva en pantalla completa y relojes flip. ¡Empieza gratis en 1 clic!',
    esKeywords: ['temporizador de uso diario gratis', 'reloj para cocina y estudio online'],
    frName: 'Minuteurs Quotidiens, Sabliers & Réveils en Ligne Gratuits – Lancer en 1 Clic',
    frHook: 'Lancez instantanément des minuteurs pour la cuisine, les études, les pauses et le sport. Compte à rebours plein écran et horloges flip inclus — Démarrer gratuitement !',
    frKeywords: ['minuteur quotidien cuisine étude', 'alarme en ligne gratuite plein écran'],
    deName: 'Tägliche Countdown-Timer, Sanduhren & Online-Wecker – Kostenlos Starten',
    deHook: 'Schnellstart-Timer für Küche, Studium, Pausen und Training. Inklusive Vollbild-Countdowns, Flip-Clocks und visuellen Timern – Kostenlos mit 1 Klick starten!',
    deKeywords: ['täglicher countdown timer kostenlos', 'küchen und lerntimer online'],
    jaName: '毎日使える無料カウントダウンタイマー・キッチン＆勉強タイマー一覧｜ワンクリック開始',
    jaHook: '料理・勉強・休憩・エクササイズにすぐ使える定番オンラインタイマー集。フルスクリーン表示・アラーム音切り替え対応で今すぐ無料で使えます！',
    jaKeywords: ['毎日使えるタイマー 無料', '勉強 キッチン タイマー Web'],
    ptName: 'Temporizadores Cotidianos, Ampulhetas e Despertadores Online Grátis',
    ptHook: 'Inicie rapidamente temporizadores para cozinha, estudo, pausas e treinos. Inclui contagem regressiva em tela cheia e relógios flip — Comece grátis em 1 clique!',
    ptKeywords: ['temporizador cotidiano grátis', 'timer para cozinha e estudo online'],
  },

  '/category/events': {
    enTitle: 'Free Stage Timers, Speaker Confidence Monitors & Event Clocks – Launch Live',
    enDesc:
      'Run professional conferences, keynotes, Toastmasters & debates with dual-screen stage timers, green/amber/red visual cues & live operator sync. Start free now!',
    enKeywords: ['free stage timer confidence monitor', 'speaker timer green yellow red', 'keynote presentation countdown clock', 'dual screen event timer free'],
    esName: 'Temporizadores de Escenario, Monitores de Oradores y Eventos en Vivo Gratis',
    esHook: 'Dirige conferencias, discursos, Toastmasters y debates con monitores de escenario de doble pantalla, señales verde/ámbar/rojo y sincronización en vivo. ¡Inícialo gratis ahora!',
    esKeywords: ['temporizador de escenario gratis', 'reloj para oradores y conferencias', 'monitor de confianza doble pantalla'],
    frName: 'Minuteurs de Scène, Moniteurs d’Orateur & Horloges d’Événement en Direct',
    frHook: 'Gérez vos conférences, keynotes, Toastmasters et débats avec nos minuteurs de scène double écran, alertes vert/ambre/rouge et synchronisation en direct. Lancer gratuitement !',
    frKeywords: ['minuteur de scène gratuit', 'chronomètre conférencier double écran', 'minuteur événementiel en direct'],
    deName: 'Kostenlose Bühnen-Timer, Redner-Monitore & Event-Uhren mit Dual-Screen-Sync',
    deHook: 'Steuern Sie Konferenzen, Keynotes, Toastmasters und Debatten mit Dual-Screen-Bühnenmonitoren, Grün/Gelb/Rot-Phasenwarnungen und Live-Sync. Jetzt kostenlos starten!',
    deKeywords: ['bühnen timer kostenlos', 'redneruhr konferenz vollbild', 'confidence monitor timer online'],
    jaName: 'イベント・学会・ステージ進行用無料タイマー＆登壇者モニター｜2画面リアルタイム同期',
    jaHook: 'カンファレンス、基調講演、討論会、ウェビナーに最適なデュアル画面ステージタイマー。緑・黄・赤のフェーズ警告とメッセージ送信機能を完全無料で今すぐ利用可能！',
    jaKeywords: ['ステージタイマー 無料 2画面', '学会 プレゼン タイマー ベル', '登壇者用 カウントダウンモニター'],
    ptName: 'Temporizadores de Palco, Monitores de Palestrante e Relógios de Eventos Grátis',
    ptHook: 'Gerencie conferências, palestras, Toastmasters e debates com monitores de palco em tela dupla, alertas verde/âmbar/vermelho e sincronização ao vivo. Comece grátis agora!',
    ptKeywords: ['temporizador de palco grátis', 'cronômetro para palestras e eventos', 'monitor de retorno para palestrante'],
  },

  '/category/stage': {
    enTitle: 'Stage Confidence Monitor & Podium Countdown Timers – Free Browser Sync',
    enDesc:
      'Control downstage speaker monitors from your booth laptop with zero-latency BroadcastChannel sync, flash messages & overtime tracking. Open your stage room free!',
    enKeywords: ['stage confidence monitor timer', 'podium countdown clock free', 'stagetimer io free alternative'],
    esName: 'Monitor de Confianza para Escenario y Temporizadores de Podio con Sincronización',
    esHook: 'Controla pantallas de escenario desde tu portátil de cabina sin latencia, envía mensajes en pantalla y mide tiempo extra. ¡Abre tu sala de escenario gratis!',
    esKeywords: ['monitor de escenario sincronizado gratis', 'temporizador de podio para eventos'],
    frName: 'Moniteur de Retour Scène & Minuteurs de Pupitre Synchronisés – 100 % Gratuit',
    frHook: 'Contrôlez les écrans de scène depuis la régie sans latence avec messages flash et suivi du dépassement de temps. Ouvrez votre salle de scène gratuitement !',
    frKeywords: ['moniteur retour scène gratuit', 'minuteur pupitre conférence synchronisé'],
    deName: 'Bühnen-Confidence-Monitor & Podium-Countdown-Timer – Kostenloser Live-Sync',
    deHook: 'Steuern Sie Bühnenmonitore direkt vom Regie-Laptop mit verzögerungsfreiem Sync, Live-Nachrichten und Überzeit-Anzeige. Jetzt Bühnen-Timer kostenlos öffnen!',
    deKeywords: ['confidence monitor bühne kostenlos', 'regie timer mit zweitbildschirm'],
    jaName: 'ステージ進行・演台用カウントダウンモニター（別画面リアルタイム同期）｜完全無料',
    jaHook: '調整室のPCから演台モニターをミリ秒単位で同期操作。カンペメッセージ表示や超過時間（オーバータイム）計測にも対応したプロ仕様ステージタイマーを今すぐ無料で起動！',
    jaKeywords: ['演台タイマー 無料', 'ステージ進行 カウントダウン 同期'],
    ptName: 'Monitor de Retorno de Palco e Temporizadores de Púlpito com Sincronia Grátis',
    ptHook: 'Controle telas de palco direto do notebook da técnica com sincronização instantânea, mensagens ao vivo e tempo excedente. Abra seu painel de palco grátis!',
    ptKeywords: ['monitor de palco sincronizado grátis', 'temporizador de púlpito eventos'],
  },

  '/category/productivity': {
    enTitle: 'Free Study & Productivity Timers (Pomodoro 25/5, Flip Clock & Deep Work)',
    enDesc:
      'Boost deep focus with free Pomodoro 25/5 timers, aesthetic retro flip clocks, ADHD study timers & 20-20-20 eye-break reminders. No account needed—Start focusing now!',
    enKeywords: ['aesthetic study timer online free', 'pomodoro timer 25 5 fullscreen', 'productivity focus clock no login', 'ADHD deep work timer'],
    esName: 'Temporizadores de Estudio y Productividad Gratis (Pomodoro 25/5 y Reloj Flip)',
    esHook: 'Multiplica tu concentración con temporizadores Pomodoro 25/5, relojes flip estéticos de escritorio y recordatorios de descanso visual. ¡Sin cuenta—Empieza a concentrarte hoy!',
    esKeywords: ['temporizador de estudio estético gratis', 'reloj pomodoro 25 5 online', 'temporizador de productividad pantalla completa'],
    frName: 'Minuteurs d’Étude & Productivité Gratuits (Pomodoro 25/5, Horloge Flip & Focus)',
    frHook: 'Boostez votre concentration avec nos minuteurs Pomodoro 25/5, horloges flip esthétiques de bureau et rappels de pause visuelle. Sans inscription — Concentrez-vous maintenant !',
    frKeywords: ['minuteur étude esthétique gratuit', 'pomodoro 25 5 en ligne plein écran', 'outil concentration travail profond'],
    deName: 'Kostenlose Lern- & Produktivitäts-Timer (Pomodoro 25/5, Flip-Clock & Deep Work)',
    deHook: 'Steigern Sie Ihren Fokus mit kostenlosen 25/5 Pomodoro-Timern, ästhetischen Schreibtisch-Flip-Clocks und Pausen-Timern. Ohne Registrierung – Jetzt konzentriert starten!',
    deKeywords: ['ästhetischer lerntimer online kostenlos', 'pomodoro timer 25 5 vollbild', 'produktivitäts uhr studium'],
    jaName: '勉強・仕事効率化向け無料ポモドーロ＆生産性タイマー特集（25分集中・フリップ時計）',
    jaHook: 'ポモドーロタイマー（25分集中＋5分休憩）、おしゃれなデスク用フリップ時計、読書・勉強タイマー、目の休憩タイマーを無料提供。今すぐ集中セッションを始めましょう！',
    jaKeywords: ['勉強タイマー おしゃれ 無料', 'ポモドーロタイマー 25分 Web', '作業用 フリップ時計 全画面'],
    ptName: 'Temporizadores de Estudo e Produtividade Grátis (Pomodoro 25/5 e Relógio Flip)',
    ptHook: 'Aumente seu foco com temporizadores Pomodoro 25/5, relógios flip estéticos de mesa e lembretes de pausa visual. Sem cadastro — Comece a focar agora mesmo!',
    ptKeywords: ['temporizador de estudo estético grátis', 'pomodoro 25 5 online tela cheia', 'relógio de foco e produtividade'],
  },

  '/category/fitness': {
    enTitle: 'Free HIIT, Tabata & Boxing Interval Timers + 8-Lane Stopwatch – Start Workout',
    enDesc:
      'Power your training with programmable HIIT & Tabata work/rest clocks, 3-minute boxing round bells, breathing pacers & 8-lane track stopwatches. Launch free now!',
    enKeywords: ['free online HIIT interval timer', 'tabata timer 20 10 with sound', 'boxing round timer 3 minute bell', 'multi lane stopwatch CSV'],
    esName: 'Temporizadores de Intervalos HIIT, Tabata, Boxeo y Cronómetro Multicarril Gratis',
    esHook: 'Entrena al máximo con relojes programables de trabajo/descanso HIIT y Tabata, campana de asaltos de boxeo y cronómetro de 8 carriles. ¡Inicia tu entrenamiento gratis ahora!',
    esKeywords: ['temporizador hiit online gratis', 'reloj tabata 20 10 con sonido', 'temporizador de rounds de boxeo'],
    frName: 'Minuteurs d’Intervalles HIIT, Tabata, Boxe & Chronomètre 8 Couloirs Gratuits',
    frHook: 'Optimisez vos entraînements avec nos minuteurs HIIT et Tabata programmables, gong de rounds de boxe et chronomètre multi-couloirs. Lancez votre séance gratuitement !',
    frKeywords: ['minuteur hiit en ligne gratuit', 'chronomètre tabata 20 10 avec son', 'minuteur round boxe gratuit'],
    deName: 'Kostenlose HIIT-, Tabata- & Box-Intervall-Timer + 8-Spur-Stoppuhr – Training Starten',
    deHook: 'Trainieren Sie effektiv mit programmierbaren HIIT- & Tabata-Intervalluhren, 3-Minuten-Boxrunden-Gong und 8-Spur-Stoppuhr. Jetzt kostenlos im Vollbild starten!',
    deKeywords: ['hiit intervall timer online kostenlos', 'tabata timer mit ton vollbild', 'boxrunden timer 3 minuten'],
    jaName: '筋トレ・HIIT・タバタ式・ボクシング用無料インターバルタイマー＆8レーン計測',
    jaHook: 'ワーク＆レストを自由に設定できるHIIT・タバタタイマー、3分ラウンドゴング付きボクシングタイマー、8レーン同時計測ストップウォッチを収録。完全無料で今すぐトレーニング開始！',
    jaKeywords: ['HIITタイマー 無料 Web', 'タバタ式タイマー 音付き', 'ボクシング ラウンドタイマー 無料'],
    ptName: 'Temporizadores de Intervalo HIIT, Tabata, Boxe e Cronômetro de 8 Pistas Grátis',
    ptHook: 'Potencialize seu treino com relógios programáveis de HIIT e Tabata, gongo de rounds de boxe e cronômetro de 8 raias com exportação CSV. Comece seu treino grátis agora!',
    ptKeywords: ['temporizador hiit online grátis', 'timer tabata 20 10 com som', 'cronômetro de rounds de boxe'],
  },

  '/category/world': {
    enTitle: 'Live World Clock, Time-Zone Converter & Global Meeting Planner – Check Time Now',
    enDesc:
      'Compare live local time across international cities, convert UTC/IANA time zones with 2026 DST accuracy & find overlapping meeting hours. 100% free—Open now!',
    enKeywords: ['live world clock with seconds', 'time zone converter meeting planner', 'international time difference calculator DST'],
    esName: 'Reloj Mundial en Vivo, Conversor de Zonas Horarias y Planificador de Reuniones',
    esHook: 'Compara la hora exacta en ciudades de todo el mundo, convierte zonas horarias con ajuste automático de horario de verano y planifica reuniones globales. ¡Ábrelo gratis ahora!',
    esKeywords: ['reloj mundial en vivo con segundos', 'conversor de zonas horarias gratis', 'planificador de reuniones internacionales'],
    frName: 'Horloge Mondiale en Direct, Convertisseur de Fuseaux & Planificateur de Réunion',
    frHook: 'Comparez l’heure exacte dans les villes du monde, convertissez les fuseaux horaires IANA avec heure d’été automatique et planifiez vos réunions. Essayez gratuitement !',
    frKeywords: ['horloge mondiale en direct avec secondes', 'convertisseur fuseau horaire gratuit', 'planificateur réunion internationale'],
    deName: 'Live-Weltuhr, Zeitzonen-Umrechner & Internationaler Meeting-Planer – Jetzt Prüfen',
    deHook: 'Vergleichen Sie Live-Uhrzeiten weltweit, rechnen Sie Zeitzonen inklusive Sommerzeit automatisch um und finden Sie optimale Meeting-Zeiten. 100 % kostenlos öffnen!',
    deKeywords: ['weltuhr live mit sekunden', 'zeitzonen umrechner kostenlos', 'internationaler meeting planer'],
    jaName: 'リアルタイム世界時計・タイムゾーン時差変換＆海外会議プランナー｜夏時間(DST)自動対応',
    jaHook: '世界の主要都市の現在時刻を秒単位で一覧表示。夏時間（DST）に自動対応した時差変換ツールと国際ミーティング時間調整プランナーを登録不要・完全無料で今すぐ利用できます！',
    jaKeywords: ['世界時計 リアルタイム 秒表示', 'タイムゾーン 時差変換 無料', '海外会議 時間調整 ツール'],
    ptName: 'Relógio Mundial ao Vivo, Conversor de Fuso Horário e Planejador de Reuniões',
    ptHook: 'Compare a hora exata em cidades globais, converta fusos horários com ajuste de horário de verão e encontre horários ideais para reuniões. 100% grátis — Confira agora!',
    ptKeywords: ['relógio mundial ao vivo com segundos', 'conversor de fuso horário grátis', 'planejador de reuniões internacionais'],
  },

  '/category/world-clock': {
    enTitle: 'Global City World Clocks & UTC Time-Zone Converters – Free Live Display',
    enDesc:
      'Track accurate local times across New York, London, Tokyo, Sydney & 200+ cities with automatic Daylight Saving adjustments. Customize your world clock grid free!',
    enKeywords: ['global world clock grid free', 'UTC time zone converter online', 'live international city clocks'],
    esName: 'Relojes de Ciudades del Mundo y Conversores UTC en Tiempo Real – Gratis',
    esHook: 'Sigue la hora local exacta en Madrid, Ciudad de México, Nueva York, Tokio y más de 200 ciudades con ajuste automático de horario de verano. ¡Consúltalo gratis!',
    esKeywords: ['reloj mundial ciudades en vivo', 'conversor hora utc a local'],
    frName: 'Horloges Mondiales par Ville & Convertisseurs UTC en Temps Réel – Gratuit',
    frHook: 'Suivez l’heure locale exacte à Paris, Montréal, New York, Tokyo et plus de 200 villes avec changement d’heure automatique. Consultez gratuitement !',
    frKeywords: ['heure mondiale en direct villes', 'convertisseur heure utc gratuit'],
    deName: 'Globale Weltzeituhren & UTC-Zeitzonen-Rechner in Echtzeit – Kostenlos',
    deHook: 'Verfolgen Sie exakte Ortszeiten in Berlin, Zürich, New York, Tokio und über 200 Städten mit automatischer Sommerzeit-Umstellung. Jetzt kostenlos nutzen!',
    deKeywords: ['weltzeituhr städte live', 'utc zeitzonen rechner online'],
    jaName: '世界の都市時計＆UTC時差コンバーター（東京・NY・ロンドン他200都市対応）｜無料',
    jaHook: '東京、ニューヨーク、ロンドン、パリなど世界200都市以上の現在時刻とUTCオフセットをリアルタイム表示。完全無料で今すぐチェック！',
    jaKeywords: ['世界時計 都市一覧 リアルタイム', 'UTC 日本時間 変換 ツール'],
    ptName: 'Relógios de Cidades Globais e Conversores UTC em Tempo Real – Grátis',
    ptHook: 'Acompanhe a hora exata em São Paulo, Lisboa, Nova York, Tóquio e mais de 200 cidades com ajuste automático de fuso. Acesse gratuitamente agora!',
    ptKeywords: ['relógio mundial cidades ao vivo', 'conversor utc para horário local'],
  },

  '/category/calculators': {
    enTitle: 'Free Time Duration, Work Time Card & Payroll Decimal Calculators – Calculate Now',
    enDesc:
      'Compute exact hours & minutes between timestamps, convert HH:MM to base-10 payroll decimals, calculate overtime & count calendar days. 100% free & instant!',
    enKeywords: ['time duration calculator hours and minutes', 'time card calculator with lunch break', 'minutes to decimal hours payroll calculator', 'date difference calculator days'],
    esName: 'Calculadoras de Duración de Tiempo, Horas Trabajadas y Nómina Decimal Gratis',
    esHook: 'Calcula horas y minutos exactos entre dos horas, convierte HH:MM a horas decimales para nómina, calcula horas extra y días entre fechas. ¡100% gratis al instante!',
    esKeywords: ['calculadora de horas y minutos trabajados', 'convertir minutos a horas decimales nómina', 'calculadora de días entre fechas'],
    frName: 'Calculatrices de Durée, Feuille de Temps & Heures Décimales de Paie Gratuites',
    frHook: 'Calculez les heures et minutes exactes entre deux horaires, convertissez HH:MM en heures décimales de paie, calculez les heures supplémentaires et les jours. Gratuit et immédiat !',
    frKeywords: ['calculatrice heures de travail gratuit', 'conversion heures minutes en centièmes paie', 'calculateur de durée entre deux heures'],
    deName: 'Kostenlose Zeitdauer-, Arbeitszeit- & Dezimalstunden-Rechner für Lohnabrechnung',
    deHook: 'Berechnen Sie exakte Stunden und Minuten zwischen zwei Uhrzeiten, wandeln Sie HH:MM in Dezimalstunden um und prüfen Sie Überstunden & Kalendertage. Sofort kostenlos berechnen!',
    deKeywords: ['arbeitszeitrechner kostenlos mit pause', 'industrieminuten dezimalstunden umrechnen', 'zeitdauer berechnen uhrzeit'],
    jaName: '無料の時間計算・勤務時間（タイムカード）・給与用小数時間変換ツール一覧｜即時計算',
    jaHook: '開始・終了時刻からの経過時間計算、休憩控除付きタイムカード集計、60進法（時:分）から10進法（小数時間）への変換、日数計算をワンクリックで正確に実行！',
    jaKeywords: ['時間計算 ツール 無料', '勤務時間 計算 休憩引き', '分 小数時間 変換 給与計算'],
    ptName: 'Calculadoras de Duração de Tempo, Cartão de Ponto e Horas Decimais Grátis',
    ptHook: 'Calcule horas e minutos exatos entre horários, converta HH:MM em horas decimais para folha de pagamento, calcule horas extras e dias entre datas. 100% grátis agora!',
    ptKeywords: ['calculadora de horas trabalhadas grátis', 'converter minutos em horas decimais', 'calculadora de diferença de tempo'],
  },

  // ============================================================================
  // FLAGSHIP VISUAL & SENSORY TIMERS (/timers/*)
  // ============================================================================
  '/timers/flip-clock': {
    enTitle: 'Free Online Flip Clock (Fullscreen, Seconds & 12/24h) – Launch Retro Clock',
    enDesc:
      'Turn your screen into a realistic retro split-flap clock with Live Time, Countdown & Stopwatch modes, Dark/Light themes & fullscreen display. Start free in 1 click!',
    enKeywords: ['free online flip clock fullscreen', 'aesthetic retro split flap clock with seconds', 'desk flip clock browser no download', 'flip clock study timer'],
    esName: 'Reloj Flip Online Gratis en Pantalla Completa (Segundos y 12/24h) – Iniciar Ahora',
    esHook: 'Convierte tu pantalla en un reloj retro de paneles abatibles con hora en vivo, cuenta regresiva y cronómetro, temas claro/oscuro y pantalla completa. ¡Úsalo gratis en 1 clic!',
    esKeywords: ['reloj flip online gratis pantalla completa', 'reloj retro de paneles abatibles con segundos', 'reloj flip para escritorio y estudio'],
    frName: 'Horloge Flip en Ligne Gratuite Plein Écran (Secondes & 12/24h) – Lancer Maintenant',
    frHook: 'Transformez votre écran en véritable horloge rétro à palettes avec heure en direct, compte à rebours et chronomètre, thèmes clair/sombre et plein écran. 100 % gratuit !',
    frKeywords: ['horloge flip en ligne plein écran', 'horloge rétro à palettes gratuite', 'minuteur flip bureau étude'],
    deName: 'Kostenlose Online Flip-Clock im Vollbild (Sekunden & 12/24h) – Jetzt Starten',
    deHook: 'Verwandeln Sie Ihren Bildschirm in eine realistische Retro-Klappzahlenuhr mit Live-Uhrzeit, Countdown & Stoppuhr, Hell/Dunkel-Design und Vollbildmodus. Sofort kostenlos starten!',
    deKeywords: ['flip clock online kostenlos vollbild', 'retro klappzahlenuhr mit sekunden', 'schreibtisch flip uhr im browser'],
    jaName: '無料オンライン・フリップ時計（全画面・秒表示・カウントダウン対応）｜今すぐ起動',
    jaHook: 'リアルなレトロ・パタパタ時計をブラウザで全画面表示！現在時刻・カウントダウン・ストップウォッチの3モード、12/24時間制、ダーク＆ライトテーマに対応。登録不要・完全無料！',
    jaKeywords: ['フリップ時計 オンライン 無料 全画面', 'パタパタ時計 Web サイト 勉強', 'デスク時計 フルスクリーン 無料'],
    ptName: 'Relógio Flip Online Grátis em Tela Cheia (Segundos e 12/24h) – Iniciar Agora',
    ptHook: 'Transforme sua tela em um relógio retrô de placas giratórias com hora ao vivo, contagem regressiva e cronômetro, temas escuro/claro e tela cheia. Comece grátis em 1 clique!',
    ptKeywords: ['relógio flip online grátis tela cheia', 'relógio retrô placas giratórias com segundos', 'relógio flip para estudo e mesa'],
  },

  '/timers/sensory-timers': {
    enTitle: 'Free Sensory Visual Timers for Classroom, ADHD & Autism – Start Calm Timer',
    enDesc:
      'Explore 8 soothing, low-distraction sensory visual timers (Liquid, Lava Lamp, Sand, Frost & Galaxy) with muted-by-default chimes & fullscreen mode. Try free now!',
    enKeywords: ['sensory visual timers online free', 'calm timer for ADHD and autism classroom', 'low stimulation visual countdown timer', 'liquid and lava lamp timer fullscreen'],
    esName: 'Temporizadores Visuales Sensoriales Gratis para Aula, TDAH y Calma – Iniciar Ahora',
    esHook: 'Explora 8 relajantes temporizadores visuales sensoriales (Líquido, Lámpara de Lava, Arena, Escarcha y Galaxia) con sonido suave y pantalla completa. ¡Pruébalo gratis hoy!',
    esKeywords: ['temporizadores sensoriales online gratis', 'temporizador visual calmado para tdah y autismo', 'reloj sensorial para aula'],
    frName: 'Minuteurs Visuels Sensoriels Gratuits (Classe, TDAH & Calme) – Essayer Maintenant',
    frHook: 'Découvrez 8 minuteurs visuels sensoriels apaisants (Liquide, Lampe à Lave, Sablier, Givre et Galaxie) sans distraction avec mode plein écran. 100 % gratuit sans inscription !',
    frKeywords: ['minuteurs visuels sensoriels gratuits', 'minuteur apaisant tdah autisme classe', 'minuteur liquide et lampe à lave'],
    deName: 'Kostenlose Sensorische Visuelle Timer für Schule, ADHS & Fokus – Jetzt Starten',
    deHook: 'Entdecken Sie 8 beruhigende, reizarme sensorische Timer (Flüssigkeit, Lavalampe, Sanduhr, Frost & Galaxie) im Vollbildmodus. Ideal für Unterricht & Therapie – Kostenlos testen!',
    deKeywords: ['sensorische visuelle timer kostenlos', 'ruhiger timer für adhs und autismus', 'entspannender klassenzimmer timer'],
    jaName: '無料・感覚ビジュアルタイマー8選（発達サポート・教室・リラックス向け）｜全画面対応',
    jaHook: 'リキッド、ラバランプ、砂時計、フロストなど穏やかな動きで残り時間がわかる8種類の感覚ビジュアルタイマー。刺激を抑えた静音設計＆全画面表示で教室や家庭学習に最適！',
    jaKeywords: ['感覚タイマー 無料 オンライン', '視覚支援 タイマー 発達 教室', 'リラックス ビジュアルタイマー'],
    ptName: 'Temporizadores Visuais Sensoriais Grátis para Sala de Aula, TDAH e Calma',
    ptHook: 'Explore 8 temporizadores visuais sensoriais calmantes (Líquido, Lâmpada de Lava, Areia, Geada e Galáxia) sem distrações e em tela cheia. Experimente grátis agora!',
    ptKeywords: ['temporizadores sensoriais online grátis', 'timer visual calmo para tdah e autismo', 'relógio sensorial infantil'],
  },

  '/timers/forest-fire-timer': {
    enTitle: 'Free Online Forest Fire Timer – Nature Ember Visual Countdown (Fullscreen)',
    enDesc:
      'Watch a stylized forest ember glow progress across 4 nature themes as your countdown runs. Includes soothing sound toggle, quick presets & fullscreen—Start free now!',
    enKeywords: ['forest fire timer online free', 'nature visual countdown timer fullscreen', 'campfire ember study timer'],
    esName: 'Temporizador Fuego del Bosque Online Gratis – Cuenta Regresiva Visual Natural',
    esHook: 'Observa cómo avanza el resplandor de brasas en el bosque a través de 4 escenarios naturales mientras corre tu cuenta regresiva en pantalla completa. ¡Inícialo gratis ahora!',
    esKeywords: ['temporizador fuego del bosque gratis', 'temporizador visual naturaleza pantalla completa'],
    frName: 'Minuteur Feu de Forêt en Ligne Gratuit – Compte à Rebours Visuel Nature',
    frHook: 'Suivez la lueur apaisante des braises à travers 4 thèmes forestiers illustrés pendant votre compte à rebours plein écran. Lancez-le gratuitement en 1 clic !',
    frKeywords: ['minuteur feu de forêt gratuit', 'compte à rebours visuel nature plein écran'],
    deName: 'Kostenloser Online Waldbrand-Timer – Visueller Natur-Countdown im Vollbild',
    deHook: 'Erleben Sie einen atmosphärischen Natur-Countdown mit 4 illustrierten Waldszenen, Schnellwahl-Zeiten und Vollbildmodus. Jetzt kostenlos im Browser starten!',
    deKeywords: ['waldbrand timer online kostenlos', 'natur visueller countdown vollbild'],
    jaName: '無料オンライン・フォレストファイア・タイマー｜森と焚き火の視覚カウントダウン',
    jaHook: '4つの美しい森のイラストテーマで残り時間を視覚的に表示する自然派カウントダウンタイマー。フルスクリーン＆プリセット対応で教室や集中作業に最適！今すぐ無料で開始。',
    jaKeywords: ['フォレストタイマー 無料', '自然 ビジュアルタイマー 全画面'],
    ptName: 'Temporizador Fogo na Floresta Online Grátis – Contagem Regressiva Visual',
    ptHook: 'Acompanhe o brilho estilizado das brasas em 4 cenários de floresta enquanto sua contagem regressiva avança em tela cheia. Comece grátis em 1 clique!',
    ptKeywords: ['temporizador fogo na floresta grátis', 'timer visual natureza tela cheia'],
  },

  '/timers/train-timer': {
    enTitle: 'Free Online Train Timer – Split-Flap Station Board & Moving Train Countdown',
    enDesc:
      'Make classroom transitions & focus sessions fun with a live railway departure board and animated train that travels from start to arrival at 00:00. Launch free now!',
    enKeywords: ['train timer online free classroom', 'railway departure board countdown timer', 'animated train visual timer for kids'],
    esName: 'Temporizador de Tren Online Gratis – Panel de Estación y Tren en Movimiento',
    esHook: 'Haz que las transiciones en el aula y sesiones de enfoque sean divertidas con un panel ferroviario abatible y un tren animado hasta llegar a 00:00. ¡Úsalo gratis!',
    esKeywords: ['temporizador de tren online gratis', 'temporizador animado de tren para niños y aula'],
    frName: 'Minuteur de Train en Ligne Gratuit – Tableau de Gare & Train Animé Plein Écran',
    frHook: 'Animez vos transitions de classe et séances de travail avec un tableau des départs à palettes et un train illustré qui arrive en gare à 00:00. Lancer gratuitement !',
    frKeywords: ['minuteur train en ligne gratuit', 'minuteur visuel train enfants classe'],
    deName: 'Kostenloser Online Zug-Timer – Bahnhofs-Abfahrtstafel & Animierter Zug-Countdown',
    deHook: 'Ideal für Unterricht und Fokusphasen: Ein animierter Zug fährt synchron zur Klappzahlen-Abfahrtstafel bis zum Zielbahnhof bei 00:00. Jetzt kostenlos starten!',
    deKeywords: ['zug timer online kostenlos', 'bahnhof abfahrtstafel countdown kinder'],
    jaName: '無料オンライン・トレインタイマー｜駅のパタパタ出発案内板＆走る列車カウントダウン',
    jaHook: 'レトロな駅のパタパタ出発ボードと、残り時間に合わせて終着駅へ走る列車アニメーション！教室の切り替えや子供の時間管理、イベント進行に今すぐ無料で使えます。',
    jaKeywords: ['電車タイマー 無料 子供', '駅 パタパタ時計 カウントダウン'],
    ptName: 'Temporizador de Trem Online Grátis – Painel de Estação e Trem em Movimento',
    ptHook: 'Torne as transições de aula e sessões de foco divertidas com um painel ferroviário retrô e um trem animado que chega à estação em 00:00. Inicie grátis agora!',
    ptKeywords: ['temporizador de trem online grátis', 'timer visual de trem para crianças'],
  },

  '/timers/flip-timer': {
    enTitle: 'Free Online Flip Timer – Retro Split-Flap Countdown Clock with Alarm',
    enDesc:
      'Count down any duration with authentic 3D mechanical split-flap cards, 4 retro chassis themes, auto-loop & fullscreen projection. No sign-up—Start your flip timer now!',
    enKeywords: ['free online flip timer countdown', 'split flap countdown timer fullscreen', 'retro mechanical flip timer with alarm'],
    esName: 'Temporizador Flip Online Gratis – Cuenta Regresiva Retro de Paneles Abatibles',
    esHook: 'Cuenta atrás cualquier duración con tarjetas mecánicas 3D abatibles, 4 temas retro, repetición automática y pantalla completa. ¡Inicia tu temporizador flip gratis!',
    esKeywords: ['temporizador flip cuenta regresiva gratis', 'reloj cuenta atrás paneles abatibles'],
    frName: 'Minuteur Flip en Ligne Gratuit – Compte à Rebours Rétro à Palettes Plein Écran',
    frHook: 'Lancez un compte à rebours mécanique 3D à palettes avec 4 thèmes rétro, mode boucle et affichage plein écran. Sans inscription — Démarrer maintenant !',
    frKeywords: ['minuteur flip compte à rebours gratuit', 'minuteur rétro à palettes plein écran'],
    deName: 'Kostenloser Online Flip-Timer – Retro-Klappzahlen-Countdown mit Alarm & Vollbild',
    deHook: 'Starten Sie Ihren Countdown mit realistischen 3D-Klappzahlen, 4 Retro-Gehäusedesigns, Loop-Funktion und Vollbildanzeige. Kostenlos ohne Anmeldung starten!',
    deKeywords: ['flip timer countdown kostenlos', 'klappzahlen countdown vollbild'],
    jaName: '無料オンライン・フリップタイマー｜レトロな3Dパタパタ数字カウントダウン（全画面対応）',
    jaHook: '立体的なパタパタめくりアニメーションと4種類のレトロテーマを備えたフリップ式カウントダウンタイマー。リピート機能・アラーム・フルスクリーン対応で今すぐ無料開始！',
    jaKeywords: ['フリップタイマー 無料 カウントダウン', 'パタパタタイマー 全画面 勉強'],
    ptName: 'Temporizador Flip Online Grátis – Contagem Regressiva Retrô em Tela Cheia',
    ptHook: 'Faça contagens regressivas com cartões giratórios mecânicos 3D, 4 temas retrô, repetição automática e tela cheia. Sem cadastro — Inicie seu flip timer agora!',
    ptKeywords: ['temporizador flip contagem regressiva grátis', 'timer retrô tela cheia'],
  },
};

function humanizeSlug(slug: string): string {
  return slug
    .replace(/^\/timers\//, '')
    .replace(/^\//, '')
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Generates a unique, high-search-volume, low-KD, high-CTA SEO entry for ANY route and ANY language.
 */
export function getLocalizedPageSeo(
  rawPathname: string,
  langCode: LanguageCode = 'en'
): LocalizedSeoEntry {
  // Strip any language prefix (/es/..., /ja/...) to get the canonical route path
  const cleanPath =
    rawPathname.replace(/^\/(en|es|fr|de|ja|pt)(\/|$)/, '/') || '/';
  const normalizedPath =
    cleanPath.length > 1 && cleanPath.endsWith('/')
      ? cleanPath.slice(0, -1)
      : cleanPath;

  const canonicalBase = `${SITE_URL}${normalizedPath === '/' ? '' : normalizedPath}`;
  const canonicalUrl =
    langCode === 'en' ? canonicalBase : `${canonicalBase}?lang=${langCode}`;

  const alternatesLanguages: Record<string, string> = {
    en: canonicalBase,
    es: `${canonicalBase}?lang=es`,
    fr: `${canonicalBase}?lang=fr`,
    de: `${canonicalBase}?lang=de`,
    ja: `${canonicalBase}?lang=ja`,
    pt: `${canonicalBase}?lang=pt`,
    'x-default': canonicalBase,
  };

  const ogLocale = OG_LOCALE_MAP[langCode] || 'en_US';

  // 1. Check curated blueprint first
  const blueprint = SEO_BLUEPRINTS[normalizedPath];
  if (blueprint) {
    if (langCode === 'en') {
      return {
        title: blueprint.enTitle,
        description: blueprint.enDesc,
        keywords: blueprint.enKeywords,
        canonicalUrl,
        ogLocale,
        alternatesLanguages,
      };
    }
    if (langCode === 'es') {
      return {
        title: `${blueprint.esName} | WebCountDownTimer`,
        description: blueprint.esHook,
        keywords: blueprint.esKeywords,
        canonicalUrl,
        ogLocale,
        alternatesLanguages,
      };
    }
    if (langCode === 'fr') {
      return {
        title: `${blueprint.frName} | WebCountDownTimer`,
        description: blueprint.frHook,
        keywords: blueprint.frKeywords,
        canonicalUrl,
        ogLocale,
        alternatesLanguages,
      };
    }
    if (langCode === 'de') {
      return {
        title: `${blueprint.deName} | WebCountDownTimer`,
        description: blueprint.deHook,
        keywords: blueprint.deKeywords,
        canonicalUrl,
        ogLocale,
        alternatesLanguages,
      };
    }
    if (langCode === 'ja') {
      return {
        title: `${blueprint.jaName} | WebCountDownTimer`,
        description: blueprint.jaHook,
        keywords: blueprint.jaKeywords,
        canonicalUrl,
        ogLocale,
        alternatesLanguages,
      };
    }
    if (langCode === 'pt') {
      return {
        title: `${blueprint.ptName} | WebCountDownTimer`,
        description: blueprint.ptHook,
        keywords: blueprint.ptKeywords,
        canonicalUrl,
        ogLocale,
        alternatesLanguages,
      };
    }
  }

  // 2. Check if it's a Preset Duration Timer route (/1-minute-timer .. /90-minute-timer or /30-second-timer)
  const durationMatch = normalizedPath.match(/^\/(\d+)-(minute|second)-timer$/);
  if (durationMatch) {
    const val = Number(durationMatch[1]);
    const isMin = durationMatch[2] === 'minute';
    const totalSec = isMin ? val * 60 : val;

    if (langCode === 'en') {
      const unitCap = isMin ? 'Minute' : 'Second';
      const unitLow = isMin ? 'minute' : 'second';
      return {
        title: `Free ${val} ${unitCap} Timer (${totalSec.toLocaleString()}s) – Fullscreen Online Countdown & Alarm`,
        description: `Set a ${val} ${unitLow} timer (${totalSec.toLocaleString()} seconds) instantly! Drift-free online countdown with custom alarm chime, auto-repeat loop & fullscreen display—Start in 1 click!`,
        keywords: [
          `${val} ${unitLow} timer`,
          `set a timer for ${val} ${unitLow}s`,
          `free online ${val} ${unitLow} countdown fullscreen`,
          `${totalSec} second timer with alarm`,
        ],
        canonicalUrl,
        ogLocale,
        alternatesLanguages,
      };
    }
    if (langCode === 'es') {
      const unit = isMin ? (val === 1 ? 'Minuto' : 'Minutos') : 'Segundos';
      return {
        title: `Temporizador de ${val} ${unit} (${totalSec.toLocaleString()}s) Online Gratis – Pantalla Completa y Alarma`,
        description: `¡Activa tu temporizador de ${val} ${unit.toLowerCase()} (${totalSec.toLocaleString()} segundos) en 1 clic! Cuenta regresiva online exacta con alarma sonora, modo bucle y pantalla completa gratis.`,
        keywords: [
          `temporizador de ${val} ${unit.toLowerCase()}`,
          `cuenta regresiva ${val} ${unit.toLowerCase()} con alarma`,
          `poner alarma en ${val} ${unit.toLowerCase()} online gratis`,
        ],
        canonicalUrl,
        ogLocale,
        alternatesLanguages,
      };
    }
    if (langCode === 'fr') {
      const unit = isMin ? (val === 1 ? 'Minute' : 'Minutes') : 'Secondes';
      return {
        title: `Minuteur de ${val} ${unit} (${totalSec.toLocaleString()}s) en Ligne Gratuit – Alarme & Plein Écran`,
        description: `Lancez un minuteur de ${val} ${unit.toLowerCase()} (${totalSec.toLocaleString()} secondes) en 1 clic ! Compte à rebours précis avec alarme sonore, répétition en boucle et mode plein écran gratuit.`,
        keywords: [
          `minuteur ${val} ${unit.toLowerCase()} en ligne`,
          `compte à rebours ${val} ${unit.toLowerCase()} gratuit`,
          `alarme ${val} ${unit.toLowerCase()} plein écran`,
        ],
        canonicalUrl,
        ogLocale,
        alternatesLanguages,
      };
    }
    if (langCode === 'de') {
      const unit = isMin ? (val === 1 ? 'Minute' : 'Minuten') : 'Sekunden';
      return {
        title: `Kostenloser ${val}-${unit}-Timer (${totalSec.toLocaleString()}s) – Online Countdown mit Alarm & Vollbild`,
        description: `Starten Sie Ihren ${val}-${unit}-Timer (${totalSec.toLocaleString()} Sekunden) sofort mit 1 Klick! Präziser Online-Countdown mit Alarmton, Endlosschleife und Vollbildmodus – 100 % kostenlos.`,
        keywords: [
          `${val} ${unit.toLowerCase()} timer online kostenlos`,
          `countdown ${val} ${unit.toLowerCase()} mit alarm`,
          `timer auf ${val} ${unit.toLowerCase()} stellen vollbild`,
        ],
        canonicalUrl,
        ogLocale,
        alternatesLanguages,
      };
    }
    if (langCode === 'ja') {
      const unit = isMin ? '分' : '秒';
      return {
        title: `無料・${val}${unit}タイマー（${totalSec.toLocaleString()}秒）オンライン全画面カウントダウン＆アラーム｜今すぐ開始`,
        description: `ワンクリックで${val}${unit}（${totalSec.toLocaleString()}秒）のカウントダウンを即座にスタート！アラーム音切り替え・自動リピート・フルスクリーン表示対応の完全無料オンラインタイマー。`,
        keywords: [
          `${val}${unit}タイマー 無料 オンライン`,
          `${val}${unit} カウントダウン 全画面 アラーム`,
          `${totalSec}秒タイマー Web`,
        ],
        canonicalUrl,
        ogLocale,
        alternatesLanguages,
      };
    }
    if (langCode === 'pt') {
      const unit = isMin ? (val === 1 ? 'Minuto' : 'Minutos') : 'Segundos';
      return {
        title: `Temporizador de ${val} ${unit} (${totalSec.toLocaleString()}s) Online Grátis – Tela Cheia e Alarme`,
        description: `Inicie seu temporizador de ${val} ${unit.toLowerCase()} (${totalSec.toLocaleString()} segundos) em 1 clique! Contagem regressiva online precisa com alarme sonoro, repetição e tela cheia grátis.`,
        keywords: [
          `temporizador de ${val} ${unit.toLowerCase()} online grátis`,
          `contagem regressiva ${val} ${unit.toLowerCase()} com alarme`,
          `timer ${val} ${unit.toLowerCase()} tela cheia`,
        ],
        canonicalUrl,
        ogLocale,
        alternatesLanguages,
      };
    }
  }

  // 3. Individual Tool & Editorial Pages (unique per route + per language)
  const isVisualTimerRoute = normalizedPath.startsWith('/timers/');
  const rawSlug = normalizedPath.replace(/^\/timers\//, '').replace(/^\//, '');
  const toolName = humanizeSlug(rawSlug || 'Time Tool');
  const lowerName = toolName.toLowerCase();

  const isCalculator =
    rawSlug.includes('calculator') ||
    rawSlug.includes('converter') ||
    rawSlug.includes('hours') ||
    rawSlug.includes('minutes') ||
    rawSlug.includes('planner') ||
    rawSlug.includes('what-time');

  if (langCode === 'en') {
    const routeModifier = isVisualTimerRoute
      ? 'Fullscreen Visual Countdown & Custom Themes'
      : isCalculator
      ? 'Instant Base-60 & Decimal Time Math'
      : 'Drift-Free Fullscreen Clock & Alarm';

    return {
      title: `Free Online ${toolName} (${routeModifier}) – Start Now`,
      description: isCalculator
        ? `Calculate exact time with our free online ${toolName}. Instant HH:MM and decimal hour results with zero sign-up or ads—Run your calculation in 1 click!`
        : `Use our free online ${toolName} with ${
            isVisualTimerRoute
              ? 'soothing high-contrast visual animations, custom color themes,'
              : 'millisecond epoch accuracy, customizable audio chimes,'
          } and distraction-free fullscreen mode. No login—Launch free now!`,
      keywords: [
        `free online ${lowerName}`,
        `${lowerName} fullscreen no login`,
        `best ${lowerName} for classroom and study`,
        `${lowerName} with alarm sound`,
      ],
      canonicalUrl,
      ogLocale,
      alternatesLanguages,
    };
  }

  if (langCode === 'es') {
    const tag = isVisualTimerRoute ? 'Visual en Pantalla Completa' : 'Online Gratis sin Registro';
    return {
      title: `${toolName} (${tag}) – Usar Gratis en 1 Clic | WebCountDownTimer`,
      description: `Utiliza nuestra herramienta gratuita ${toolName} en línea con precisión al milisegundo, modo pantalla completa y alertas personalizables. ¡100% gratis y sin registro—Empezar ahora!`,
      keywords: [
        `${lowerName} online gratis`,
        `${lowerName} pantalla completa con alarma`,
        `herramienta ${lowerName} sin registro`,
      ],
      canonicalUrl,
      ogLocale,
      alternatesLanguages,
    };
  }

  if (langCode === 'fr') {
    const tag = isVisualTimerRoute ? 'Visuel Plein Écran' : 'en Ligne Gratuit Sans Inscription';
    return {
      title: `${toolName} (${tag}) – Lancer Gratuitement | WebCountDownTimer`,
      description: `Utilisez notre outil gratuit ${toolName} directement dans votre navigateur avec mode plein écran, thèmes personnalisés et alarme sonore. 100 % gratuit — Démarrer en 1 clic !`,
      keywords: [
        `${lowerName} en ligne gratuit`,
        `${lowerName} plein écran avec alarme`,
        `outil ${lowerName} sans inscription`,
      ],
      canonicalUrl,
      ogLocale,
      alternatesLanguages,
    };
  }

  if (langCode === 'de') {
    const tag = isVisualTimerRoute ? 'Visueller Vollbild-Timer' : 'Online Kostenlos Ohne Anmeldung';
    return {
      title: `Kostenloser ${toolName} (${tag}) – Jetzt Sofort Starten | WebCountDownTimer`,
      description: `Nutzen Sie unser kostenloses Online-Tool ${toolName} mit Millisekunden-Präzision, individuellen Themen, Alarmton und Vollbildmodus. Ohne Anmeldung sofort im Browser starten!`,
      keywords: [
        `${lowerName} online kostenlos`,
        `${lowerName} vollbild mit alarm`,
        `${lowerName} im browser ohne anmeldung`,
      ],
      canonicalUrl,
      ogLocale,
      alternatesLanguages,
    };
  }

  if (langCode === 'ja') {
    const tag = isVisualTimerRoute ? '全画面ビジュアル表示・テーマ切替' : '完全無料・登録不要・全画面対応';
    return {
      title: `無料オンライン・${toolName}（${tag}）｜ワンクリックで今すぐ開始`,
      description: `ブラウザですぐに使える無料オンライン「${toolName}」。ミリ秒単位の高精度計測、カスタムテーマ、アラーム音、フルスクリーン表示に対応。登録不要で今すぐスタート！`,
      keywords: [
        `${lowerName} 無料 オンライン`,
        `${lowerName} 全画面 アラーム`,
        `Webタイマー ${lowerName} 登録不要`,
      ],
      canonicalUrl,
      ogLocale,
      alternatesLanguages,
    };
  }

  // Portuguese ('pt')
  const tagPt = isVisualTimerRoute ? 'Visual em Tela Cheia' : 'Online Grátis Sem Cadastro';
  return {
    title: `${toolName} (${tagPt}) – Iniciar Grátis Agora | WebCountDownTimer`,
    description: `Use nossa ferramenta online gratuita ${toolName} com precisão de milissegundos, temas personalizáveis, alarme sonoro e modo tela cheia. 100% grátis — Comece em 1 clique!`,
    keywords: [
      `${lowerName} online grátis`,
      `${lowerName} tela cheia com alarme`,
      `ferramenta ${lowerName} sem cadastro`,
    ],
    canonicalUrl,
    ogLocale,
    alternatesLanguages,
  };
}

/**
 * Helper to construct a complete Next.js Metadata object for any pathname and language.
 */
export function buildNextMetadata(
  pathname: string,
  langCode: LanguageCode = 'en'
): Metadata {
  const seo = getLocalizedPageSeo(pathname, langCode);
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: seo.canonicalUrl,
      languages: seo.alternatesLanguages,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.canonicalUrl,
      siteName: 'WebCountDownTimer',
      locale: seo.ogLocale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
    },
  };
}
