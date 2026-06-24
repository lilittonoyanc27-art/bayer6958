import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plane,
  GraduationCap,
  MessageSquare,
  CalendarDays,
  Sparkles,
  Trophy,
  Coins,
  Star,
  Gift,
  User,
  RefreshCw,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Volume2,
  ChevronRight,
  LogOut,
  Sparkle,
  Crown,
  HeartCrack,
  Award
} from 'lucide-react';
import {
  QUESTIONS,
  CATEGORIES,
  AVATARS,
  type Question,
  type Player,
  type CategoryId
} from './data';

export default function App() {
  // Game states
  const [screen, setScreen] = useState<'setup' | 'theme_select' | 'playing' | 'results'>('setup');
  
  // Players configuration
  const [player1Name, setPlayer1Name] = useState('Խաղացող 1');
  const [player2Name, setPlayer2Name] = useState('Խաղացող 2');
  const [player1Avatar, setPlayer1Avatar] = useState('🎒');
  const [player2Avatar, setPlayer2Avatar] = useState('🕵️');

  const [players, setPlayers] = useState<Player[]>([
    { name: 'Խաղացող 1', avatar: '🎒', points: 0, stars: 0, coins: 0, streak: 0, unlockedLevels: [] },
    { name: 'Խաղացող 2', avatar: '🕵️', points: 0, stars: 0, coins: 0, streak: 0, unlockedLevels: [] }
  ]);
  
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<0 | 1>(0);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Gameplay state values
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [answeredThisTurn, setAnsweredThisTurn] = useState(false);
  const [attemptsThisTurn, setAttemptsThisTurn] = useState(0);
  const [incorrectOptionsPicked, setIncorrectOptionsPicked] = useState<number[]>([]);
  const [latestRewardMessage, setLatestRewardMessage] = useState<string | null>(null);
  const [starredAnimation, setStarredAnimation] = useState(false);
  
  // UI overlays
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [giftPlayerName, setGiftPlayerName] = useState('');
  const [giftTitle, setGiftTitle] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  // Setup screen reset
  const handleStartSetup = () => {
    setScreen('setup');
    setSelectedCategory(null);
    setCurrentQuestionIndex(0);
  };

  // Start the game with customized names and avatars
  const handleStartGame = () => {
    setPlayers([
      { name: player1Name.trim() || 'Խաղացող 1', avatar: player1Avatar, points: 0, stars: 0, coins: 0, streak: 0, unlockedLevels: [] },
      { name: player2Name.trim() || 'Խաղացող 2', avatar: player2Avatar, points: 0, stars: 0, coins: 0, streak: 0, unlockedLevels: [] }
    ]);
    setCurrentPlayerIndex(0);
    setScreen('theme_select');
  };

  const handleSelectCategory = (catId: CategoryId) => {
    setSelectedCategory(catId);
    // Filter questions of this category
    const catQuestions = QUESTIONS.filter(q => q.category === catId);
    // Shuffling optional, but keeping stable lets both players experience different or same difficulties sequentially
    setCurrentQuestions(catQuestions);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setAnsweredThisTurn(false);
    setAttemptsThisTurn(0);
    setIncorrectOptionsPicked([]);
    setLatestRewardMessage(null);
    setShowTranslation(false);
    setScreen('playing');
  };

  // Speaks Spanish dialogue lines using standard SpeechSynthesis API
  const handlePronounce = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Clean up the prompt "___" for smoother speech
      const textToSpeak = text.replace('___', '...');
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'es-ES'; // Spanish (Spain)
      // Pick Spanish voice if available
      const voices = window.speechSynthesis.getVoices();
      const esVoice = voices.find(voice => voice.lang.startsWith('es'));
      if (esVoice) utterance.voice = esVoice;
      utterance.rate = 0.85; // slightly slower for educational clarity
      window.speechSynthesis.speak(utterance);
    }
  };

  // Submit/Check answer
  const handleAnswerSubmit = () => {
    if (selectedOptionIndex === null || answeredThisTurn) return;
    
    const currentQuestion = currentQuestions[currentQuestionIndex];
    if (currentQuestion.correctIndex === selectedOptionIndex) {
      // Correct!
      const updatedPlayers = [...players];
      const activePlayer = updatedPlayers[currentPlayerIndex];

      // If they answered correctly on the 1st attempt, they get rewards and streak increment
      if (attemptsThisTurn === 0) {
        activePlayer.points += 10;
        activePlayer.stars += 1;
        activePlayer.coins += 1;
        activePlayer.streak += 1;
        
        setLatestRewardMessage('🎯 Ճիշտ է առաջին փորձից. +10 միավոր, +1 աստղ, +1 մետաղադրամ!');
        setStarredAnimation(true);
        setTimeout(() => setStarredAnimation(false), 2000);

        // STREAK BONUS: Every 5-in-a-row correct answers triggers a massive achievement!
        if (activePlayer.streak > 0 && activePlayer.streak % 5 === 0) {
          const newLevelName = getBonusLevelName(activePlayer.streak);
          activePlayer.unlockedLevels.push(newLevelName);
          setGiftPlayerName(activePlayer.name);
          setGiftTitle(newLevelName);
          setShowGiftModal(true);
        }
      } else {
        // Correct, but took multiple attempts
        setLatestRewardMessage('👍 Ճիշտ է: Հրաշալի է, որ գտաք ճիշտ պատասխանը (այս փորձից մետաղադրամ չի տրվում):');
        activePlayer.streak = 0; // reset streak
      }

      setPlayers(updatedPlayers);
      setAnsweredThisTurn(true);
      setShowTranslation(true);
    } else {
      // Incorrect!
      // Add to incorrect picked collection and increment attempts
      setIncorrectOptionsPicked([...incorrectOptionsPicked, selectedOptionIndex]);
      setAttemptsThisTurn(prev => prev + 1);
      
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex].streak = 0; // reset streak instantly on error
      setPlayers(updatedPlayers);

      setSelectedOptionIndex(null); // let them choose again
    }
  };

  const getBonusLevelName = (streak: number) => {
    if (streak === 5) return '👑 Իսպաներենի Ասպետ (5 ճիշտ անընդմեջ)';
    if (streak === 10) return '🏆 Գանձերի Տիրակալ (10 ճիշտ անընդմեջ)';
    return `🔥 Անկանգնելի Գիտակ (${streak} ճիշտ անընդմեջ)`;
  };

  // Move to next question and alternate players
  const handleNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < currentQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
      // Reset turn status
      setSelectedOptionIndex(null);
      setAnsweredThisTurn(false);
      setAttemptsThisTurn(0);
      setIncorrectOptionsPicked([]);
      setLatestRewardMessage(null);
      setShowTranslation(false);
      // Switch player
      setCurrentPlayerIndex(currentPlayerIndex === 0 ? 1 : 0);
    } else {
      // No more questions in this theme, go to results
      setScreen('results');
    }
  };

  // Helper utility to get category icons dynamically
  const getCategoryIcon = (id: CategoryId, sizeClass = "w-6 h-6") => {
    switch (id) {
      case 'journey':
        return <Plane className={`${sizeClass} text-indigo-400`} />;
      case 'school':
        return <GraduationCap className={`${sizeClass} text-emerald-400`} />;
      case 'imperative':
        return <MessageSquare className={`${sizeClass} text-amber-400`} />;
      case 'past':
        return <CalendarDays className={`${sizeClass} text-orange-400`} />;
      case 'future':
        return <Sparkles className={`${sizeClass} text-cyan-400`} />;
      default:
        return <Sparkles className={`${sizeClass} text-blue-400`} />;
    }
  };

  const currentQuestion = currentQuestions[currentQuestionIndex];

  // Pick winner
  const getWinner = () => {
    if (players[0].points > players[1].points) return { ...players[0], index: 0 };
    if (players[1].points > players[0].points) return { ...players[1], index: 1 };
    // Tiebreaker on stars
    if (players[0].stars > players[1].stars) return { ...players[0], index: 0 };
    if (players[1].stars > players[0].stars) return { ...players[1], index: 1 };
    return null; // Tie
  };

  const winner = getWinner();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden font-sans">
      
      {/* Decorative cosmos glow circles */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-900/20 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-amber-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-emerald-950/20 blur-[100px] pointer-events-none" />

      {/* Main Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={handleStartSetup}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/10">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-amber-400 via-orange-400 to-indigo-400 bg-clip-text text-transparent">
                Completa el Diálogo
              </h1>
              <p className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Լրացրու երկխոսությունը</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              id="help-btn"
              onClick={() => setShowHelpModal(true)} 
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition flex items-center gap-1.5 text-xs text-slate-300 border border-slate-700/60 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Օգնություն</span>
            </button>

            {screen !== 'setup' && (
              <button 
                id="reset-btn"
                onClick={handleStartSetup}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-red-950 hover:text-red-300 transition flex items-center gap-1.5 text-xs text-slate-300 border border-slate-700/60 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Դուրս գալ</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Content Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          
          {/* ================= SCREEN 1: SETUP ================= */}
          {screen === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-xl mx-auto w-full bg-slate-900/80 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl relative"
            >
              <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-3 bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-mono text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-bold shadow-md">
                2 Խաղացող
              </div>

              <div className="text-center mb-8">
                <span className="text-amber-500 text-xs font-semibold tracking-widest uppercase bg-amber-500/10 px-3 py-1 rounded-full">
                  ԻՍՊԱՆԵՐԵՆԻ ՈՒՍՈՒՑՈՂԱԿԱՆ ԻՆՏԵՐԱԿՏԻՎ ԽԱՂ
                </span>
                <h2 className="text-3xl font-extrabold text-white mt-3 leading-tight">
                  Լրացրու երկխոսությունը
                </h2>
                <div className="h-1 w-20 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mt-4 rounded" />
                <p className="text-slate-400 text-xs mt-3 max-w-md mx-auto">
                  Կարդացեք իսպաներեն երկխոսությունները, գուշակեք համապատասխան բառերը, վաստակեք աստղեր, մետաղադրամներ և բացեք նոր մակարդակներ:
                </p>
              </div>

              {/* Player 1 Configuration */}
              <div className="space-y-5 bg-slate-950/60 p-4 rounded-xl border border-slate-800/40 mb-5">
                <div className="flex items-center space-x-3 border-b border-slate-800/80 pb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <h3 className="text-sm font-bold text-indigo-300">Խաղացող 1-ի տվյալներ</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                  <div className="col-span-2">
                    <label className="block text-xs text-slate-400 mb-1">Անուն</label>
                    <input
                      id="p1-name"
                      type="text"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      value={player1Name}
                      onChange={(e) => setPlayer1Name(e.target.value)}
                      placeholder="Մուտքագրեք անունը"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Էմոջի Կերպար</label>
                    <div className="relative">
                      <select
                        id="p1-avatar-select"
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition appearance-none cursor-pointer"
                        value={player1Avatar}
                        onChange={(e) => setPlayer1Avatar(e.target.value)}
                      >
                        {AVATARS.map((av) => (
                          <option key={av.char} value={av.char}>
                            {av.char} {av.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-slate-400">
                        ▼
                      </div>
                    </div>
                  </div>
                </div>

                {/* Avatar Preview */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Իմ պրոֆիլը՝</span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-950/60 border border-indigo-900/30 text-xs text-indigo-200">
                    <span className="text-lg">{player1Avatar}</span>
                    <span className="font-semibold">{player1Name}</span>
                  </span>
                </div>
              </div>

              {/* Player 2 Configuration */}
              <div className="space-y-5 bg-slate-950/60 p-4 rounded-xl border border-slate-800/40 mb-6">
                <div className="flex items-center space-x-3 border-b border-slate-800/80 pb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <h3 className="text-sm font-bold text-amber-300">Խաղացող 2-ի տվյալներ</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                  <div className="col-span-2">
                    <label className="block text-xs text-slate-400 mb-1">Անուն</label>
                    <input
                      id="p2-name"
                      type="text"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                      value={player2Name}
                      onChange={(e) => setPlayer2Name(e.target.value)}
                      placeholder="Մուտքագրեք անունը"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Էմոջի Կերպար</label>
                    <div className="relative">
                      <select
                        id="p2-avatar-select"
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition appearance-none cursor-pointer"
                        value={player2Avatar}
                        onChange={(e) => setPlayer2Avatar(e.target.value)}
                      >
                        {AVATARS.map((av) => (
                          <option key={av.char} value={av.char}>
                            {av.char} {av.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-slate-400">
                        ▼
                      </div>
                    </div>
                  </div>
                </div>

                {/* Avatar Preview */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Իմ պրոֆիլը՝</span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/60 border border-amber-900/30 text-xs text-amber-200">
                    <span className="text-lg">{player2Avatar}</span>
                    <span className="font-semibold">{player2Name}</span>
                  </span>
                </div>
              </div>

              {/* Start Button */}
              <button
                id="start-game-btn"
                onClick={handleStartGame}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 hover:from-amber-600 hover:via-orange-600 hover:to-indigo-700 active:scale-[0.98] font-bold text-white shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/25 transition-all text-center flex items-center justify-center space-x-2 text-base cursor-pointer"
              >
                <span>Սկսել խաղը</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* ================= SCREEN 2: THEME SELECT ================= */}
          {screen === 'theme_select' && (
            <motion.div
              key="theme_select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Scoreboard banner */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-4 flex items-center space-x-4 relative overflow-hidden shadow-lg">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full blur-md" />
                  <div className="w-12 h-12 bg-indigo-950 border border-indigo-500/30 rounded-xl flex items-center justify-center text-2xl">
                    {players[0].avatar}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs text-indigo-300 font-mono tracking-wide uppercase">Խաղացող 1</h4>
                    <span className="text-lg font-bold text-white block truncate">{players[0].name}</span>
                    <div className="flex items-center space-x-4 mt-1 text-slate-400 text-xs">
                      <span className="flex items-center gap-1"><Trophy className="w-3.5 h-3.5 text-indigo-400" /> {players[0].points}</span>
                      <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" /> {players[0].stars}</span>
                      <span className="flex items-center gap-1"><Coins className="w-3.5 h-3.5 text-amber-500" /> {players[0].coins}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-amber-500/20 rounded-2xl p-4 flex items-center space-x-4 relative overflow-hidden shadow-lg">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-md" />
                  <div className="w-12 h-12 bg-amber-950 border border-amber-500/30 rounded-xl flex items-center justify-center text-2xl">
                    {players[1].avatar}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs text-amber-300 font-mono tracking-wide uppercase">Խաղացող 2</h4>
                    <span className="text-lg font-bold text-white block truncate">{players[1].name}</span>
                    <div className="flex items-center space-x-4 mt-1 text-slate-400 text-xs">
                      <span className="flex items-center gap-1"><Trophy className="w-3.5 h-3.5 text-indigo-400" /> {players[1].points}</span>
                      <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" /> {players[1].stars}</span>
                      <span className="flex items-center gap-1"><Coins className="w-3.5 h-3.5 text-amber-500" /> {players[1].coins}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Theme selection panel */}
              <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-800/80 shadow-2xl">
                <div className="text-center max-w-lg mx-auto mb-8">
                  <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full uppercase tracking-widest font-mono">
                    Ընտրել խաղի թեման
                  </span>
                  <h3 className="text-2xl font-extrabold text-white mt-3">
                    Գանձերի երկխոսություն
                  </h3>
                  <p className="text-slate-400 text-xs mt-1.5">
                    Ընտրեք ստորև ներկայացված թեմաներից մեկը՝ երկխոսությունները սկսելու համար։ Յուրաքանչյուր թեմա պարունակում է 8 երկխոսություն։
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {CATEGORIES.map((cat) => (
                    <motion.div
                      key={cat.id}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectCategory(cat.id)}
                      className="group bg-slate-900 border border-slate-800 hover:border-indigo-500/40 p-5 rounded-2xl cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 bg-slate-800/30 rounded-bl-3xl group-hover:bg-indigo-950/20 transition-colors flex items-center justify-center">
                        {getCategoryIcon(cat.id, "w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all")}
                      </div>

                      <div className="space-y-2 mt-2">
                        <h4 className="font-bold text-slate-100 text-[15px] group-hover:text-amber-400 transition-colors pr-6">
                          {cat.name}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 pt-1">
                          {cat.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-800/80 text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                        <span>8 երկխոսություն</span>
                        <span className="flex items-center text-xs text-amber-500 font-semibold group-hover:translate-x-1 transition-transform">
                          Սկսել <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= SCREEN 3: GAMEPLAY ================= */}
          {screen === 'playing' && currentQuestion && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Top status bar */}
              <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-900/80 border border-slate-800 p-4 rounded-2xl gap-4">
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                    {getCategoryIcon(selectedCategory || 'journey', "w-4.5 h-4.5")}
                  </span>
                  <div>
                    <h4 className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Թեմա</h4>
                    <span className="text-sm font-bold text-white">
                      {CATEGORIES.find(c => c.id === selectedCategory)?.name}
                    </span>
                  </div>
                </div>

                {/* Progress dot indicators */}
                <div className="flex items-center space-x-1.5 bg-slate-950/60 px-3.5 py-2 rounded-lg border border-slate-800/40">
                  <span className="text-xs font-mono text-slate-400 mr-1.5">Հարց</span>
                  {currentQuestions.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === currentQuestionIndex
                          ? 'w-5 bg-indigo-500'
                          : idx < currentQuestionIndex
                          ? 'w-2 bg-emerald-500'
                          : 'w-2 bg-slate-700'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-mono font-bold text-indigo-300 ml-2">
                    {currentQuestionIndex + 1}/{currentQuestions.length}
                  </span>
                </div>

                {/* Display difficulty */}
                <div className="flex items-center">
                  <span className="text-xs text-slate-400 mr-2">Բարդություն՝</span>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold leading-none ${
                    currentQuestion.difficulty === 'հեշտ'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80'
                      : currentQuestion.difficulty === 'միջին'
                      ? 'bg-orange-950 text-orange-300 border border-orange-850/80'
                      : 'bg-red-950 text-red-300 border border-red-800/80'
                  }`}>
                    {currentQuestion.difficulty}
                  </span>
                </div>
              </div>

              {/* Player Turn visualizer stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                {/* Active Player Box P1 */}
                <div className={`p-4 rounded-2xl transition-all duration-300 relative border ${
                  currentPlayerIndex === 0
                    ? 'bg-indigo-950/40 border-indigo-500 glow-active shadow-indigo-500/5'
                    : 'bg-slate-900/60 border-slate-800 opacity-60'
                }`}>
                  {currentPlayerIndex === 0 && (
                    <span className="absolute -top-2.5 -left-2 bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shadow">
                      Հերթն է
                    </span>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{players[0].avatar}</span>
                      <div className="min-w-0">
                        <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider">Խաղացող 1</span>
                        <h4 className="font-bold text-white text-sm truncate">{players[0].name}</h4>
                      </div>
                    </div>
                    {/* Score detail counters */}
                    <div className="flex items-center space-x-3">
                      <div className="text-center">
                        <span className="text-[10px] text-slate-400 block uppercase">Միավոր</span>
                        <span className="font-bold text-sm text-indigo-300">{players[0].points}</span>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] text-slate-400 block uppercase">Աստղ</span>
                        <span className="font-bold text-sm text-amber-400">⭐ {players[0].stars}</span>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] text-slate-400 block uppercase">Շարք</span>
                        <span className="font-bold text-sm text-red-400">🔥 {players[0].streak}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Player Box P2 */}
                <div className={`p-4 rounded-2xl transition-all duration-300 relative border ${
                  currentPlayerIndex === 1
                    ? 'bg-amber-950/40 border-amber-500 glow-active shadow-amber-500/5'
                    : 'bg-slate-900/60 border-slate-800 opacity-60'
                }`}>
                  {currentPlayerIndex === 1 && (
                    <span className="absolute -top-2.5 -left-2 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shadow">
                      Հերթն է
                    </span>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{players[1].avatar}</span>
                      <div className="min-w-0">
                        <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">Խաղացող 2</span>
                        <h4 className="font-bold text-white text-sm truncate">{players[1].name}</h4>
                      </div>
                    </div>
                    {/* Score detail counters */}
                    <div className="flex items-center space-x-3">
                      <div className="text-center">
                        <span className="text-[10px] text-slate-400 block uppercase">Միավոր</span>
                        <span className="font-bold text-sm text-amber-300">{players[1].points}</span>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] text-slate-400 block uppercase">Աստղ</span>
                        <span className="font-bold text-sm text-amber-400">⭐ {players[1].stars}</span>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] text-slate-400 block uppercase">Շարք</span>
                        <span className="font-bold text-sm text-red-400">🔥 {players[1].streak}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dialogue Container */}
              <div className="bg-slate-900 border border-slate-850 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                
                {/* Spanish Conversation Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
                    <h3 className="font-bold text-slate-200">Իսպաներեն Երկխոսություն</h3>
                  </div>

                  {/* Audio Pronunciation Button for whole dialogue */}
                  <button
                    id="audio-all-btn"
                    onClick={() => {
                      const fullText = currentQuestion.dialogue.map(d => `${d.speaker} dice: ${d.text}`).join('. ');
                      handlePronounce(fullText);
                    }}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300"
                    title="Լսել երկխոսության արտասանությունը"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Լսել երկխոսությունը</span>
                  </button>
                </div>

                {/* Dialogues chat interface */}
                <div className="space-y-4">
                  {currentQuestion.dialogue.map((line, index) => {
                    const isMasked = index === currentQuestion.maskedIndex;
                    
                    // Replace word with animated blank if not checked yet
                    const renderedText = line.text.split('___').map((part, i, arr) => {
                      if (i === arr.length - 1) return part;
                      return (
                        <span key={i} className="inline-block">
                          {part}
                          <span className={`inline-flex items-center justify-center min-w-[120px] px-3.5 py-1.5 mx-1.5 text-center font-bold font-mono rounded-lg transition-all border-2 border-dashed ${
                            answeredThisTurn
                              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/50'
                              : 'bg-slate-950/90 text-amber-400 border-amber-500/40 animate-pulse'
                          }`}>
                            {answeredThisTurn ? currentQuestion.blankWord : '___'}
                          </span>
                        </span>
                      );
                    });

                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-2xl flex flex-col sm:flex-row sm:items-start gap-3 transition-colors ${
                          isMasked 
                            ? 'bg-slate-950/60 border border-indigo-900/30' 
                            : 'bg-slate-950/20'
                        }`}
                      >
                        {/* Speaker Identifier pill */}
                        <div className="flex items-center gap-2 sm:w-36 shrink-0">
                          <span className="w-2 h-2 rounded-full bg-orange-400" />
                          <span className="font-bold text-slate-300 text-[13px] tracking-wide uppercase truncate">
                            {line.speaker}:
                          </span>
                          
                          {/* Audio for specific line */}
                          <button
                            onClick={() => handlePronounce(line.text)}
                            className="p-1 rounded hover:bg-slate-800 transition text-slate-400 hover:text-white sm:hidden"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Speech content */}
                        <div className="flex-1">
                          <div className="text-slate-100 text-sm md:text-base leading-relaxed break-words font-medium">
                            {isMasked ? renderedText : line.text}
                          </div>
                        </div>

                        {/* Speaker Pronounce on Desktop */}
                        <button
                          onClick={() => handlePronounce(line.text)}
                          className="p-1.5 rounded bg-slate-800/40 hover:bg-slate-800 transition text-slate-400 hover:text-white hidden sm:block shrink-0"
                          title="Լսել այս տողի արտասանությունը"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Show/Hide Translation drawer */}
                <div className="pt-2">
                  {!showTranslation ? (
                    <button
                      id="toggle-translation-btn"
                      onClick={() => setShowTranslation(true)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer bg-indigo-505/5 hover:bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/10 transition"
                    >
                      <span>👀 Ցույց տալ հայերեն թարգմանությունը</span>
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2 mt-2"
                    >
                      <div className="font-bold text-indigo-300 flex items-center gap-1.5 border-b border-slate-800/80 pb-1.5">
                        <span>🇦🇲 Հայերեն թարգմանությունը.</span>
                      </div>
                      <p className="whitespace-pre-line leading-relaxed italic pr-2 font-medium">
                        {currentQuestion.translation}
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Multiple Choice Grid */}
              <div className="space-y-4">
                <h4 className="text-xs text-slate-400 uppercase tracking-widest font-mono">Ընտրեք ճիշտ տարբերակը.</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedOptionIndex === idx;
                    const isCorrectOption = idx === currentQuestion.correctIndex;
                    const isIncorrectPicked = incorrectOptionsPicked.includes(idx);
                    const letters = ['A', 'B', 'C', 'D'];

                    let btnStyles = 'bg-slate-900 border-slate-800 text-slate-100 hover:bg-slate-800 hover:border-slate-700';
                    
                    if (answeredThisTurn) {
                      if (isCorrectOption) {
                        btnStyles = 'bg-emerald-950/60 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/40';
                      } else if (isIncorrectPicked) {
                        btnStyles = 'bg-red-950/30 border-red-950 text-red-400/60 opacity-40 line-through cursor-not-allowed';
                      } else {
                        btnStyles = 'bg-slate-950/30 border-slate-900 text-slate-500 opacity-40 cursor-not-allowed';
                      }
                    } else if (isIncorrectPicked) {
                      // Disabled/Incorrect during tries
                      btnStyles = 'bg-red-950/70 border-red-800 text-red-300 opacity-60 cursor-not-allowed';
                    } else if (isSelected) {
                      btnStyles = 'bg-indigo-950 border-indigo-500 text-indigo-200 ring-2 ring-indigo-500/40';
                    }

                    return (
                      <button
                        key={idx}
                        disabled={answeredThisTurn || isIncorrectPicked}
                        onClick={() => setSelectedOptionIndex(idx)}
                        className={`p-4 rounded-xl border text-left flex items-center justify-between font-bold transition-all text-sm sm:text-base cursor-pointer ${btnStyles}`}
                      >
                        <div className="flex items-center space-x-3.5 min-w-0">
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                            isSelected 
                              ? 'bg-indigo-500 text-white' 
                              : isCorrectOption && answeredThisTurn
                              ? 'bg-emerald-500 text-white'
                              : isIncorrectPicked
                              ? 'bg-red-500 text-white'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {letters[idx]}
                          </span>
                          <span className="truncate">{option}</span>
                        </div>

                        {/* Context status icon */}
                        <div className="shrink-0">
                          {isCorrectOption && answeredThisTurn && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          )}
                          {isIncorrectPicked && (
                            <XCircle className="w-5 h-5 text-red-400" />
                          )}
                          {!answeredThisTurn && isSelected && (
                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feedback and Grammar Explanation Banner */}
              {answeredThisTurn && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
                >
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold pb-2 border-b border-slate-800/80">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Ճիշտ պատասխան՝ {currentQuestion.options[currentQuestion.correctIndex]}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pt-1 font-medium">
                    <strong className="text-amber-400">Բացատրություն՝</strong> {currentQuestion.explanation}
                  </p>

                  {latestRewardMessage && (
                    <div className="bg-indigo-950/40 p-3 rounded-lg border border-indigo-900/30 flex items-center space-x-2 text-indigo-300 font-semibold text-xs mt-3">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span>{latestRewardMessage}</span>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Answer submission warning/retry panel */}
              {!answeredThisTurn && attemptsThisTurn > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-950/30 p-3.5 rounded-xl border border-red-900/30 flex items-start space-x-2.5"
                >
                  <HeartCrack className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-red-300">Սխալ պատասխան: Փորձե՛ք կրկին:</p>
                    <p className="text-slate-400 mt-0.5">
                      Կարդացեք վերը նշված երկխոսությունը կամ օգտագործեք «Օգնություն» կոճակը՝ ճիշտ տարբերակը գտնելու համար: (Այս հարցից միավորներ չեք ստանա):
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Bottom control actions row */}
              <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t border-slate-900">
                <button
                  id="theme-select-btn"
                  onClick={() => setScreen('theme_select')}
                  className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 flex items-center justify-center gap-2 text-xs font-bold transition cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ընտրել այլ թեմա</span>
                </button>

                <div className="flex gap-3">
                  {!answeredThisTurn ? (
                    <button
                      id="answer-btn"
                      disabled={selectedOptionIndex === null}
                      onClick={handleAnswerSubmit}
                      className={`px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition text-xs shadow-lg ${
                        selectedOptionIndex !== null
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-[0.98]'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <CheckCircle2 className="w-4.5 h-4.5" />
                      <span>Պատասխանել</span>
                    </button>
                  ) : (
                    <button
                      id="next-btn"
                      onClick={handleNextQuestion}
                      className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/15 hover:shadow-indigo-500/25 transition active:scale-[0.98] cursor-pointer text-xs"
                    >
                      <span>Հաջորդ հարցը</span>
                      <ArrowRight className="w-4.5 h-4.5" />
                    </button>
                  )}

                  {currentQuestionIndex === currentQuestions.length - 1 && answeredThisTurn && (
                    <button
                      id="results-btn"
                      onClick={() => setScreen('results')}
                      className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/20 active:scale-[0.98] cursor-pointer text-xs"
                    >
                      <Trophy className="w-4.5 h-4.5" />
                      <span>Տեսնել խաղի արդյունքները</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= SCREEN 4: RESULTS ================= */}
          {screen === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-xl mx-auto w-full bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6 text-center relative"
            >
              {/* Stars animation on top */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-12 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/10 text-3xl animate-bounce">
                  🏆
                </div>
              </div>

              <div>
                <span className="text-xs text-amber-400 font-mono tracking-widest uppercase bg-amber-950/60 px-3 py-1 rounded-full border border-amber-900/40">
                  Խաղն Ավարտվեց
                </span>
                <h2 className="text-3xl font-extrabold text-white mt-3 leading-tight">
                  Գանձերի հաղթողը
                </h2>
              </div>

              {/* Celebrating the winner / draw */}
              {winner ? (
                <div className="bg-slate-950/60 border border-amber-500/40 p-5 rounded-2xl space-y-3 shadow-inner">
                  <div className="flex justify-center items-center space-x-1">
                    <Crown className="w-5 h-5 text-amber-500 fill-amber-500 animate-bounce" />
                    <span className="text-amber-400 font-extrabold text-sm uppercase tracking-wider">ՀԱՂԹՈՂ</span>
                    <Crown className="w-5 h-5 text-amber-500 fill-amber-500 animate-bounce" />
                  </div>
                  <div className="text-4xl">{winner.avatar}</div>
                  <h3 className="text-2xl font-black text-white truncate px-4">{winner.name}</h3>
                  <p className="text-xs text-slate-400">Հրաշալի՛ աշխատանք: Դուք զբաղեցրեցիք առաջին պատվավոր տեղը:</p>
                </div>
              ) : (
                <div className="bg-slate-950/60 border border-indigo-500/30 p-5 rounded-2xl shadow-inner text-slate-300 font-semibold space-y-2">
                  <span className="text-lg">🤝 Ոչ-ոքի (Հավասար միավորներ)</span>
                  <p className="text-xs text-slate-400 font-normal">Երկուսդ էլ փայլուն խաղ ցուցադրեցիք:</p>
                </div>
              )}

              {/* Stats side-by-side comparison */}
              <div className="grid grid-cols-2 gap-4">
                {/* Player 1 Stats Card */}
                <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 text-left space-y-3">
                  <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
                    <span className="text-2xl">{players[0].avatar}</span>
                    <div className="min-w-0">
                      <h4 className="text-[10px] text-indigo-400 uppercase font-mono font-bold">Խաղացող 1</h4>
                      <h5 className="font-bold text-white text-xs truncate">{players[0].name}</h5>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Միավոր՝</span>
                      <span className="font-bold text-indigo-300">{players[0].points}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Աստղեր՝</span>
                      <span className="font-bold text-amber-400">⭐ {players[0].stars}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Մետաղադրամ՝</span>
                      <span className="font-bold text-amber-500">🪙 {players[0].coins}</span>
                    </div>
                    {players[0].unlockedLevels.length > 0 && (
                      <div className="pt-2 border-t border-slate-850">
                        <span className="text-[9px] text-slate-400 uppercase block font-semibold mb-1">Մակարդակներ</span>
                        <div className="flex flex-wrap gap-1">
                          {players[0].unlockedLevels.map((lvl, index) => (
                            <span key={index} className="text-[8px] bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded truncate max-w-full inline-block" title={lvl}>
                              {lvl}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Player 2 Stats Card */}
                <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 text-left space-y-3">
                  <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
                    <span className="text-2xl">{players[1].avatar}</span>
                    <div className="min-w-0">
                      <h4 className="text-[10px] text-amber-400 uppercase font-mono font-bold">Խաղացող 2</h4>
                      <h5 className="font-bold text-white text-xs truncate">{players[1].name}</h5>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Միավոր՝</span>
                      <span className="font-bold text-indigo-300">{players[1].points}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Աստղեր՝</span>
                      <span className="font-bold text-amber-400">⭐ {players[1].stars}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Մետաղադրամ՝</span>
                      <span className="font-bold text-amber-500">🪙 {players[1].coins}</span>
                    </div>
                    {players[1].unlockedLevels.length > 0 && (
                      <div className="pt-2 border-t border-slate-850">
                        <span className="text-[9px] text-slate-400 uppercase block font-semibold mb-1">Մակարդակներ</span>
                        <div className="flex flex-wrap gap-1">
                          {players[1].unlockedLevels.map((lvl, index) => (
                            <span key={index} className="text-[8px] bg-amber-955 bg-amber-950/80 text-amber-300 px-1.5 py-0.5 rounded truncate max-w-full inline-block" title={lvl}>
                              {lvl}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  id="restart-game-btn"
                  onClick={handleStartSetup}
                  className="w-full sm:w-1/2 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-slate-200 border border-slate-700/60 flex items-center justify-center gap-2 cursor-pointer transition text-xs"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Սկսել նոր խաղ</span>
                </button>

                <button
                  id="play-again-btn"
                  onClick={() => setScreen('theme_select')}
                  className="w-full sm:w-1/2 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 font-bold text-white shadow-lg cursor-pointer flex items-center justify-center gap-2 transition text-xs"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ընտրել այլ թեմա (Կրկին խաղալ)</span>
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900/60 bg-slate-950 px-6 py-4 mt-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Completa el Diálogo • Իսպաներենի ուսուցողական խաղ</p>
          <div className="flex space-x-4">
            <span>🇦🇲 Ինտերֆեյսը՝ Հայերեն</span>
            <span>🇪🇸 Диалоги: Испанский</span>
          </div>
        </div>
      </footer>

      {/* ================= HELP MODAL OVERLAY ================= */}
      <AnimatePresence>
        {showHelpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl relative space-y-4"
            >
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <HelpCircle className="w-5 h-5 text-amber-500" />
                <h3 className="font-extrabold text-white text-lg">Ինչպե՞ս խաղալ</h3>
              </div>

              <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed max-h-[350px] overflow-y-auto pr-2">
                <p>
                  Բարի գալու՛ստ <strong>Completa el Diálogo</strong> իսպաներենի խաղ: Այս ինտերակտիվ խաղը նախատեսված է իսպաներեն սովորող դեռահասների համար:
                </p>
                
                <div className="space-y-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  <h4 className="font-bold text-amber-400">Կանոնները՝</h4>
                  <ul className="list-disc pl-4 space-y-1.5">
                    <li>Երկու խաղացողները պատասխանում են հերթով:</li>
                    <li>Էկրանին հայտնվում է կարճ երկխոսություն, որտեղ բացակայում է մեկ բառ:</li>
                    <li>Ընտրեք ճիշտ պատասխանը 4 տարբերակներից:</li>
                    <li>Առաջին փորձից ճիշտ պատասխանելու դեպքում ստանում եք՝ <strong>+10 միավոր, +1 աստղ և +1 մետաղադրամ</strong>:</li>
                    <li>Սխալ արձագանքելու դեպքում կարող եք փորձել նորից, բայց այդ հարցի համար նվերներ չեք ստանա:</li>
                  </ul>
                </div>

                <div className="space-y-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  <h4 className="font-bold text-emerald-400">🔥 Բոնուսներ՝</h4>
                  <p>
                    Եթե 5 անգամ անընդմեջ ճիշտ պատասխանեք առաջին փորձից, կբացեք <strong>նոր մակարդակ</strong> և կստանաք հատուկ տիտղոս:
                  </p>
                </div>

                <div className="space-y-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  <h4 className="font-bold text-indigo-400">🔊 Արտասանություն՝</h4>
                  <p>
                    Օգտագործեք <strong>Volume (լսել)</strong> կոճակը՝ իսպաներեն նախադասությունների ճիշտ արտասանությունը լսելու համար:
                  </p>
                </div>
              </div>

              <button
                id="close-help-btn"
                onClick={() => setShowHelpModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-slate-200 transition text-xs cursor-pointer"
              >
                Հասկանալի է
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= STREAK GIFT EXTRA BONUS MODAL ================= */}
      <AnimatePresence>
        {showGiftModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              className="bg-gradient-to-b from-slate-900 to-indigo-950 border border-amber-500/50 p-8 rounded-3xl max-w-md w-full shadow-full text-center space-y-6 relative"
            >
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-12 w-28 h-28 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex justify-center relative">
                <motion.div 
                  className="text-6xl"
                  animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
                >
                  🎁
                </motion.div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                  <Sparkles className="w-16 h-16 text-amber-400 animate-pulse opacity-80" />
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-amber-400 font-mono tracking-widest uppercase bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                  Դու համառ ես
                </span>
                <h3 className="text-2xl font-black text-white leading-tight">
                  Գանձերի Տուփը բացվեց՛
                </h3>
                <p className="text-slate-300 text-sm">
                  Շնորհավորո՛ւմ ենք, <strong className="text-indigo-300">{giftPlayerName}</strong>:
                </p>
                <p className="text-slate-400 text-xs">
                  Դուք անընդմեջ 5 ճիշտ պատասխան տվեցիք և հասաք նոր բարձունքի:
                </p>
              </div>

              {/* Achievement Badge element */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/30 font-bold text-amber-300 text-[13px] flex items-center justify-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>{giftTitle}</span>
              </div>

              <button
                id="claim-gift-btn"
                onClick={() => {
                  setShowGiftModal(false);
                  // Double trigger gift star bursts
                  setStarredAnimation(true);
                  setTimeout(() => setStarredAnimation(false), 2000);
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-white shadow-lg shadow-amber-500/20 hover:from-amber-600 transition active:scale-[0.98] cursor-pointer text-xs"
              >
                Ստանալ նվերը
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Sparkle/Star burst for Correct Reward trigger */}
      {starredAnimation && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: [1, 2.5], opacity: [0, 1, 0] }}
            transition={{ duration: 1.5 }}
            className="text-7xl"
          >
            ✨⭐🌟👑⭐✨
          </motion.div>
        </div>
      )}

    </div>
  );
}
