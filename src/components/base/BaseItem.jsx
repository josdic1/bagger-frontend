// src/components/base/BaseItem.jsx
export function BaseItem({
  title,
  subtitle,
  meta,
  onEdit,
  onDelete,
  rightSlot, // optional extra UI on the right
}) {
  return (
    <div className="base-item">
      <div className="base-item__main">
        <div className="base-item__text">
          <div className="base-item__title">{title}</div>
          {subtitle ? <div className="base-item__subtitle">{subtitle}</div> : null}
        </div>

        {meta ? <div className="base-item__meta">{meta}</div> : null}
      </div>

      <div className="base-item__actions">
        {rightSlot}
        {onEdit ? (
          <button type="button" className="btn btn-secondary" onClick={onEdit}>
            Edit
          </button>
        ) : null}
        {onDelete ? (
          <button type="button" className="btn btn-danger" onClick={onDelete}>
            Delete
          </button>
        ) : null}
      </div>
    </div>
  );
}
