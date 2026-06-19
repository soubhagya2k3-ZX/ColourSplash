import React from 'react';

/**
 * Fixed full-viewport static-feel background.
 *
 * Optimizations vs previous version:
 *  - Removed mix-blend-mode (forced compositing on every frame).
 *  - Replaced 3 CSS-keyframe animated blobs with static radial gradients.
 *    Motion is now provided by the .csa-ambient layer in index.html, which
 *    is single-source-of-truth for ambient page motion. This component just
 *    paints once and never invalidates.
 *  - opacity-60 retained via gradient alpha.
 */
const AnimatedBackground = () => {
  return (
    <div
      className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-slate-50"
      aria-hidden="true"
    >
      {/* Subtle dot texture */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "url('data:image/svg+xml,%3Csvg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23000\" fill-opacity=\"1\" fill-rule=\"evenodd\"%3E%3Ccircle cx=\"3\" cy=\"3\" r=\"3\"/%3E%3Ccircle cx=\"13\" cy=\"13\" r=\"3\"/%3E%3C/g%3E%3C/svg%3E')",
        }}
      />

      {/* Static colour wash — three radial gradients, one paint, zero invalidation */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(80vw 80vh at 0% 0%, rgba(251,146,60,0.18), transparent 60%),' +
            'radial-gradient(80vw 80vh at 100% 30%, rgba(236,72,153,0.14), transparent 60%),' +
            'radial-gradient(80vw 80vh at 30% 100%, rgba(168,85,247,0.16), transparent 60%)',
        }}
      />

      {/* Soft veil to keep contrast against text */}
      <div className="absolute inset-0 bg-slate-50/30" />
    </div>
  );
};

export default React.memo(AnimatedBackground);
