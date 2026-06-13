import { UploadCloud } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function FBMockup() {
  const { pages, currentUser, mediaSource, selectedMediaUrl, customMediaUrl, postCaption } = useApp();

  const connectedFB = pages.filter(p => p.platform === 'facebook' && p.isConnected);

  return (
    <div className="fb-mockup fade-in">
      <div className="fb-mockup-header">
        <img
          src={connectedFB.length > 0 ? connectedFB[0].avatar : currentUser.avatar}
          className="fb-avatar"
          alt=""
        />
        <div className="fb-header-info">
          <span className="fb-page-name">
            {connectedFB.length > 0 ? connectedFB[0].name : 'UGC Hub Halaman'}
          </span>
          <span className="fb-post-time">Baru saja · 🌐</span>
        </div>
      </div>

      <div className="fb-mockup-caption">
        {postCaption || 'Tulis caption di sebelah kiri untuk melihat pembaruan instan...'}
      </div>

      <div className="fb-media-area">
        {mediaSource === 'sample' ? (
          <img src={selectedMediaUrl} alt="" />
        ) : customMediaUrl ? (
          <img src={customMediaUrl} alt="" />
        ) : (
          <div className="fb-placeholder-media">
            <UploadCloud size={32} />
            <span style={{ fontSize: '0.8rem' }}>Tinjauan Media</span>
          </div>
        )}
      </div>

      <div className="fb-mockup-actions">
        <div className="fb-action-btn">👍 Suka</div>
        <div className="fb-action-btn">💬 Komentar</div>
        <div className="fb-action-btn">↩️ Bagikan</div>
      </div>
    </div>
  );
}
