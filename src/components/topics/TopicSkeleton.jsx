// components/topics/TopicSkeleton.jsx
export function TopicSkeleton() {
  return (
    <div className="skeleton-wrapper">
      <div className="skeleton-title"></div>
      <div className="skeleton-text"></div>
      <style>{`
        .skeleton-wrapper {
          padding: 1rem;
          border-bottom: 1px solid #eee;
          animate: pulse 1.5s infinite ease-in-out;
        }
        .skeleton-title {
          width: 40%;
          height: 1.25rem;
          background: #e0e0e0;
          margin-bottom: 0.5rem;
          border-radius: 4px;
        }
        .skeleton-text {
          width: 80%;
          height: 0.75rem;
          background: #f0f0f0;
          border-radius: 4px;
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
          .skeleton-bone {
  background: #eee;
  background: linear-gradient(
    110deg, 
    #ececec 8%, 
    #f5f5f5 18%, 
    #ececec 33%
  );
  border-radius: 4px;
  background-size: 200% 100%;
  animation: 1.5s shine linear infinite;
}

@keyframes shine {
  to {
    background-position-x: -200%;
  }
}
          
      `}</style>
    </div>
  );
}
