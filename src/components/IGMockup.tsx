import { UploadCloud } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function IGMockup() {
  const { pages, currentUser, mediaSource, selectedMediaUrl, customMediaUrl, postCaption } = useApp();

  const connectedIG = pages.filter(p => p.platform === 'instagram' && p.isConnected);

  return (
    <div className="ig-mockup fade-in">
      <div className="ig-mockup-header">
        <img
          src={connectedIG.length > 0 ? connectedIG[0].avatar : currentUser.avatar}
          className="ig-avatar"
          alt=""
        />
        <span className="ig-username">
          {connectedIG.length > 0 ? connectedIG[0].username : 'preview_ugc'}
        </span>
      </div>

      <div className="ig-media-area">
        {mediaSource === 'sample' ? (
          <img src={selectedMediaUrl} alt="" />
        ) : customMediaUrl ? (
          <img src={customMediaUrl} alt="" />
        ) : (
          <div className="ig-placeholder-media">
            <UploadCloud size={32} />
            <span style={{ fontSize: '0.8rem' }}>Tinjauan Media</span>
          </div>
        )}
      </div>

      <div className="ig-mockup-actions">
        <span style={{ color: '#f43f5e' }}>❤️</span>
        <span>💬</span>
        <span>✈️</span>
      </div>

      <div className="ig-mockup-likes">99 Likes</div>

      <div className="ig-mockup-caption">
        <span className="username-link">
          {connectedIG.length > 0 ? connectedIG[0].username : 'preview_ugc'}
        </span>
        {postCaption || 'Tulis caption di sebelah kiri untuk melihat pembaruan instan...'}
      </div>
    </div>
  );
}
