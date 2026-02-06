// components/common/SyncIndicator.jsx
import { useData } from "../../hooks/useData";

export function SyncIndicator() {
  const { refreshing } = useData();

  if (!refreshing) return null; // Use the real state now

  return (
    <div className="sync-spinner">
      <div className="icon"></div>
      <span>Syncing...</span>
      <style>{`
        .sync-spinner {
          position: fixed;
          bottom: 20px;
          right: 20px;
          display: flex;
          align-items: center;
          background: #1a1a1a;
          color: #fff;
          padding: 8px 16px;
          border-radius: 20px;
          z-index: 10000;
          border: 1px solid #333;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        }
        .icon {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.2);
          border-top-color: #3b82f6; /* Nice Blue */
          border-radius: 50%;
          margin-right: 10px;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
