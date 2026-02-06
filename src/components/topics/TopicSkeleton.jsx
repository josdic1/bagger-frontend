// src/components/topics/TopicSkeleton.jsx
export function TopicSkeleton() {
  return (
    <div data-ui="item" style={{ borderRadius: 12 }}>
      <div data-ui="skeleton-line" data-size="md" data-skeleton="true" />
      <div data-ui="skeleton-line" data-size="lg" data-skeleton="true" />
    </div>
  );
}
