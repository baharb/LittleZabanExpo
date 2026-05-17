import React from 'react';
import MemoryGame from './games/MemoryGame';
import QuizGame from './games/QuizGame';
import ColorMatchGame from './games/ColorMatchGame';
import CountingGame from './games/CountingGame';
import SpellingGame from './games/SpellingGame';
import CultureQuizGame from './games/CultureQuizGame';

export default function GameScreen({ gameId }: { gameId: string }) {
  switch (gameId) {
    case 'memory':      return <MemoryGame />;
    case 'quiz':        return <QuizGame />;
    case 'colormatch':  return <ColorMatchGame />;
    case 'counting':    return <CountingGame />;
    case 'spelling':    return <SpellingGame />;
    case 'culturequiz': return <CultureQuizGame />;
    default:            return <QuizGame />;
  }
}
