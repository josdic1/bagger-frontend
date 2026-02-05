// src/components/shared/SkeletonCard.jsx
export function SkeletonCard({ count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} data-ui="skeleton-card">
          <div data-ui="skeleton-line" data-size="sm" data-skeleton="true" />
          <div data-ui="skeleton-line" data-size="lg" data-skeleton="true" />
          <div data-ui="skeleton-line" data-size="md" data-skeleton="true" />
          <div data-ui="skeleton-line" data-size="lg" data-skeleton="true" />
        </div>
      ))}
    </>
  );
}
