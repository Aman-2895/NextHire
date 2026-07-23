import { useRef, useState } from "react";

/**
 * A card that tracks the cursor and renders a soft radial spotlight
 * behind the border, similar to the Aceternity "spotlight card" effect.
 */
const SpotlightCard = ({ children, className = "" }) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [opacity, setOpacity] = useState(0);

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-2xl border border-ink-600 bg-ink-800/60 ${className}`}
      style={{
        backgroundImage: `radial-gradient(500px circle at ${pos.x}% ${pos.y}%, rgba(124,92,252,${
          opacity * 0.16
        }), transparent 60%)`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(300px circle at ${pos.x}% ${pos.y}%, rgba(124,92,252,0.35), transparent 70%)`,
          WebkitMask: "linear-gradient(#000,#000) content-box, linear-gradient(#000,#000)",
          padding: 1,
        }}
      />
      {children}
    </div>
  );
};

export default SpotlightCard;
