export function PlatformSkeleton() {
  return (
    <div className="skeleton-row">
      <div className="skeleton-bone" style={{ width: "28%", height: 18 }} />
      <div className="skeleton-bone" style={{ width: "40%", height: 14 }} />
      <div className="skeleton-bone" style={{ width: "22%", height: 14 }} />
      <style>{`
        .skeleton-row {
          display: grid;
          grid-template-columns: 1fr 1.3fr 0.7fr;
          gap: 12px;
          padding: 12px 14px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
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
