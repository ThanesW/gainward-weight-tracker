import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * SquirrelMascot
 *
 * A friendly floating mascot, fixed to the bottom-left corner (the FAB owns
 * bottom-right — see FAB.jsx), that gently bobs and occasionally pops up a
 * speech bubble cheering the person on to eat. Tapping the squirrel shows
 * a new random line immediately and resets the idle timer.
 *
 * Image: user-provided transparent PNG cutout (public/squirrel-mascot.png),
 * served locally rather than from a remote CDN.
 */

const CHEER_LINES = [
  'กินข้าวยัง? 🍚',
  'กินอีกหน่อยน้า~',
  'อย่าลืมกินนะ!',
  'มื้อนี้กินครบไหม?',
  'เพิ่มน้ำหนักด้วยกันนะ!',
  'ของอร่อยรอเธออยู่ 🌰',
  'กินเยอะๆ แข็งแรงๆ!',
  'ถึงเวลามื้อต่อไปยัง?',
];

const MASCOT_IMAGE_URL = '/squirrel-mascot.png';

const IDLE_INTERVAL_MS = 9000;
const BUBBLE_VISIBLE_MS = 4200;

function pickRandomLine(excludeIndex) {
  if (CHEER_LINES.length <= 1) return 0;
  let next = excludeIndex;
  while (next === excludeIndex) {
    next = Math.floor(Math.random() * CHEER_LINES.length);
  }
  return next;
}

export default function SquirrelMascot() {
  const [lineIndex, setLineIndex] = useState(0);
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);
  const hideTimerRef = useRef(null);
  const idleTimerRef = useRef(null);
  const lineIndexRef = useRef(0);

  const showLine = useCallback((index) => {
    lineIndexRef.current = index;
    setLineIndex(index);
    setBubbleVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setBubbleVisible(false), BUBBLE_VISIBLE_MS);
  }, []);

  // Cycle to a new cheer line on an idle interval.
  useEffect(() => {
    idleTimerRef.current = setInterval(() => {
      showLine(pickRandomLine(lineIndexRef.current));
    }, IDLE_INTERVAL_MS);

    return () => {
      clearInterval(idleTimerRef.current);
      clearTimeout(hideTimerRef.current);
    };
  }, [showLine]);

  const handleTap = () => {
    showLine(pickRandomLine(lineIndexRef.current));
  };

  return (
    <div
      className="fixed z-40 left-4 bottom-[calc(9.5rem+env(safe-area-inset-bottom))] sm:bottom-32
                 flex flex-col items-start gap-1.5 select-none"
    >
      {bubbleVisible && (
        <div
          role="status"
          className="mascot-bubble relative max-w-[10rem] rounded-2xl rounded-bl-sm
                     bg-white dark:bg-ink-dark-surface border border-line dark:border-line-dark
                     px-3 py-1.5 shadow-card text-xs font-medium text-ink dark:text-cream-dark-text
                     ml-1"
        >
          {CHEER_LINES[lineIndex]}
        </div>
      )}

      <button
        type="button"
        onClick={handleTap}
        aria-label="กระรอกเชียร์ให้กินข้าว แตะเพื่อฟังคำเชียร์อีกครั้ง"
        className="mascot-bounce-in mascot-bob h-16 w-16 sm:h-20 sm:w-20
                   flex items-center justify-center bg-transparent
                   transition-transform active:scale-90 hover:scale-105"
      >
        {imageFailed ? (
          <span className="text-4xl drop-shadow-lg" aria-hidden="true">
            🐿️
          </span>
        ) : (
          <img
            src={MASCOT_IMAGE_URL}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-contain drop-shadow-lg"
            onError={() => setImageFailed(true)}
            draggable={false}
          />
        )}
      </button>
    </div>
  );
}
