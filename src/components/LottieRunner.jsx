import { useEffect, useRef } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const ART_W = 720;
const ART_H = 636;

function LottieRunner({ className = '', height = 40 }) {
  const playerRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = (reduce) => {
      const player = playerRef.current;
      if (!player) return;
      if (reduce) player.pause();
      else player.play();
    };
    apply(mq.matches);
    const handler = (event) => apply(event.matches);
    if (mq.addEventListener) mq.addEventListener('change', handler);
    else if (mq.addListener) mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handler);
      else if (mq.removeListener) mq.removeListener(handler);
    };
  }, []);

  return (
    <div
      className={className}
      style={{
        height,
        aspectRatio: `${ART_W} / ${ART_H}`,
        lineHeight: 0,
      }}
    >
      <DotLottieReact
        src="/lottie/runner.json"
        autoplay
        loop
        ariaLabel="Our speedy delivery runner"
        dotLottieRefCallback={(player) => {
          playerRef.current = player;
        }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

export default LottieRunner;