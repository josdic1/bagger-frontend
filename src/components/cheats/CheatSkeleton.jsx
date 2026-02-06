export function CheatSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-bone" style={{ width: "45%", height: 18 }} />
      <div className="skeleton-bone" style={{ width: "70%", height: 12 }} />
      <div className="skeleton-bone" style={{ width: "100%", height: 44 }} />
      <style>{`
        .skeleton-card {
          display: grid;
          gap: 10px;
          padding: 14px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          background: rgba(255,255,255,0.02);
        }
        .skeleton-bone {
          background: linear-gradient(110deg,#2a2a2a 8%,#3a3a3a 18%,#2a2a2a 33%);
          border-radius: 6px;
          background-size: 200% 100%;
          animation: 1.25s shine linear infinite;
        }
        @keyframes shine { to { background-position-x: -200%; } }
      `}</style>
    </div>
  );
}
