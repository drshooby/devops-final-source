export default function PhotoList({ photos, onDelete }) {
  return (
    <div className="photo-list">
      {photos.map(photo => (
        <div key={photo.id} className="photo-card">
          <img src={photo.url} alt={photo.name} />
          <div className="photo-info">
            <strong>{photo.name}</strong>
            <button onClick={() => onDelete(photo.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}