// src/components/base/BaseList.jsx
export function BaseList({
  title,
  count,
  onAdd,
  addLabel = "Add",
  emptyTitle = "Nothing here yet",
  emptyHint = "Create your first item.",
  children,
}) {
  const isEmpty = count === 0;

  return (
    <section className="base-list">
      <header className="base-list__header">
        <div className="base-list__title">
          <h2>{title}</h2>
          <span className="base-list__count">{count}</span>
        </div>

        {onAdd && (
          <button type="button" className="btn btn-primary" onClick={onAdd}>
            {addLabel}
          </button>
        )}
      </header>

      {isEmpty ? (
        <div className="base-list__empty">
          <div className="base-list__empty-title">{emptyTitle}</div>
          <div className="base-list__empty-hint">{emptyHint}</div>
        </div>
      ) : (
        <div className="base-list__items">{children}</div>
      )}
    </section>
  );
}
