import { AlertCircle, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockSampleMedia } from '../mockData';
import { Facebook, Instagram } from '../components/Icons';
import IGMockup from '../components/IGMockup';
import FBMockup from '../components/FBMockup';
import { useNavigate } from 'react-router-dom';

export default function Upload() {
  const navigate = useNavigate();
  const {
    pages,
    postTitle,
    setPostTitle,
    postCaption,
    setPostCaption,
    selectedMediaUrl,
    setSelectedMediaUrl,
    customMediaUrl,
    setCustomMediaUrl,
    selectedPlatforms,
    setSelectedPlatforms,
    mediaType,
    setMediaType,
    mediaSource,
    setMediaSource,
    activePreviewTab,
    setActivePreviewTab,
    handlePublishPost
  } = useApp();

  const connectedFB = pages.filter(p => p.platform === 'facebook' && p.isConnected);
  const connectedIG = pages.filter(p => p.platform === 'instagram' && p.isConnected);

  return (
    <div className="fade-in">
      {connectedFB.length === 0 && connectedIG.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <AlertCircle size={48} style={{ color: 'var(--warning)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>Belum ada akun sosial media terhubung</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '460px', margin: '0 auto 24px' }}>
            Anda perlu mengaktifkan minimal satu halaman Facebook atau akun Instagram di tab **Koneksi Akun** sebelum bisa mempublikasikan konten.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/connect')}>
            Ke Koneksi Akun
          </button>
        </div>
      ) : (
        <div className="upload-layout">
          {/* Left Column: Form */}
          <form onSubmit={handlePublishPost} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '20px' }}>Formulir Publikasi Konten</h3>

            {/* Platform Selector */}
            <div className="form-group">
              <label className="form-label">Pilih Target Publikasi</label>
              <div className="platform-selector">
                {/* Facebook Option */}
                <div
                  className={`platform-card ${selectedPlatforms.includes('facebook') ? 'selected facebook' : ''} ${connectedFB.length === 0 ? 'btn-disabled' : ''}`}
                  onClick={() => {
                    if (connectedFB.length === 0) return;
                    setSelectedPlatforms(prev =>
                      prev.includes('facebook')
                        ? prev.filter(p => p !== 'facebook')
                        : [...prev, 'facebook']
                    );
                  }}
                >
                  <div className="platform-details">
                    <Facebook className="platform-card-icon facebook" size={20} />
                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block' }}>Facebook Page</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {connectedFB.length > 0 ? connectedFB[0].name : 'Akun belum terkoneksi'}
                      </span>
                    </div>
                  </div>
                  <div className="checkbox-indicator">
                    {selectedPlatforms.includes('facebook') && <Check size={12} />}
                  </div>
                </div>

                {/* Instagram Option */}
                <div
                  className={`platform-card ${selectedPlatforms.includes('instagram') ? 'selected instagram' : ''} ${connectedIG.length === 0 ? 'btn-disabled' : ''}`}
                  onClick={() => {
                    if (connectedIG.length === 0) return;
                    setSelectedPlatforms(prev =>
                      prev.includes('instagram')
                        ? prev.filter(p => p !== 'instagram')
                        : [...prev, 'instagram']
                    );
                  }}
                >
                  <div className="platform-details">
                    <Instagram className="platform-card-icon instagram" size={20} />
                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block' }}>Instagram Business</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {connectedIG.length > 0 ? `@${connectedIG[0].username}` : 'Akun belum terkoneksi'}
                      </span>
                    </div>
                  </div>
                  <div className="checkbox-indicator">
                    {selectedPlatforms.includes('instagram') && <Check size={12} />}
                  </div>
                </div>
              </div>
            </div>

            {/* Post Title */}
            <div className="form-group">
              <label className="form-label">Judul Postingan (Internal/Database)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Contoh: Showcase Desk Setup Minimalis Juni"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                required
              />
            </div>

            {/* Post Caption */}
            <div className="form-group">
              <label className="form-label">Caption / Deskripsi Postingan</label>
              <textarea
                className="form-textarea"
                placeholder="Tulis caption menarik di sini. Gunakan emoji atau hashtag untuk interaksi ekstra... 🚀✨"
                value={postCaption}
                onChange={(e) => setPostCaption(e.target.value)}
                required
              />
            </div>

            {/* Media Type Selection */}
            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label className="form-label">Jenis Media</label>
              <div className="media-source-toggle" style={{ maxWidth: '200px' }}>
                <button
                  type="button"
                  className={`media-source-btn ${mediaType === 'image' ? 'active' : ''}`}
                  onClick={() => setMediaType('image')}
                >
                  Foto / Gambar
                </button>
                <button
                  type="button"
                  className={`media-source-btn ${mediaType === 'video' ? 'active' : ''}`}
                  onClick={() => setMediaType('video')}
                >
                  Reels / Video
                </button>
              </div>
            </div>

            {/* Media URL selector */}
            <div className="form-group">
              <label className="form-label">Unggah / Pilih Media</label>
              <div className="media-source-toggle">
                <button
                  type="button"
                  className={`media-source-btn ${mediaSource === 'sample' ? 'active' : ''}`}
                  onClick={() => setMediaSource('sample')}
                >
                  Pilih Template Media Dummy
                </button>
                <button
                  type="button"
                  className={`media-source-btn ${mediaSource === 'custom' ? 'active' : ''}`}
                  onClick={() => setMediaSource('custom')}
                >
                  Gunakan Custom URL Gambar
                </button>
              </div>

              {mediaSource === 'sample' ? (
                <div className="media-selector-grid">
                  {mockSampleMedia.map(m => (
                    <div
                      key={m.id}
                      className={`media-thumb ${selectedMediaUrl === m.url ? 'selected' : ''}`}
                      onClick={() => setSelectedMediaUrl(m.url)}
                    >
                      <img src={m.url} alt={m.name} />
                    </div>
                  ))}
                </div>
              ) : (
                <input
                  type="url"
                  className="form-input"
                  placeholder="Masukkan URL Gambar (Unsplash/S3) misal: https://images.unsplash.com/photo-..."
                  value={customMediaUrl}
                  onChange={(e) => setCustomMediaUrl(e.target.value)}
                />
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ marginTop: '16px', padding: '14px' }}
            >
              Publish Sekarang
            </button>
          </form>

          {/* Right Column: Live Mockup Feed Preview */}
          <div className="preview-container">
            <div className="preview-tabs">
              <button
                type="button"
                className={`preview-tab ${activePreviewTab === 'instagram' ? 'active' : ''}`}
                onClick={() => setActivePreviewTab('instagram')}
              >
                <Instagram size={14} /> Instagram Post Feed
              </button>
              <button
                type="button"
                className={`preview-tab ${activePreviewTab === 'facebook' ? 'active' : ''}`}
                onClick={() => setActivePreviewTab('facebook')}
              >
                <Facebook size={14} /> Facebook Page Post
              </button>
            </div>

            {activePreviewTab === 'instagram' ? (
              <IGMockup />
            ) : (
              <FBMockup />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
