import { FileText, Heart, Eye, TrendingUp, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Facebook, Instagram } from '../components/Icons';

export default function Dashboard() {
  const { posts, pages, setCurrentView } = useApp();

  const connectedFB = pages.filter(p => p.platform === 'facebook' && p.isConnected);
  const connectedIG = pages.filter(p => p.platform === 'instagram' && p.isConnected);

  // Total metrics
  const totalLikes = posts.reduce((sum, p) => sum + p.likes, 0);
  const totalComments = posts.reduce((sum, p) => sum + p.comments, 0);
  const totalReach = posts.reduce((sum, p) => sum + p.reach, 0);
  const engagementRate = posts.length > 0 ? (((totalLikes + totalComments) / (totalReach || 1)) * 100).toFixed(1) : '0.0';

  return (
    <div className="fade-in">
      {/* Key Quick Stats */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon"><FileText size={22} /></div>
          <div className="stat-details">
            <span className="stat-value">{posts.length}</span>
            <span className="stat-label">Total Konten</span>
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon"><Heart size={22} style={{ color: '#f43f5e' }} /></div>
          <div className="stat-details">
            <span className="stat-value">{totalLikes.toLocaleString('id-ID')}</span>
            <span className="stat-label">Total Suka</span>
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon"><Eye size={22} style={{ color: '#0ea5e9' }} /></div>
          <div className="stat-details">
            <span className="stat-value">{totalReach.toLocaleString('id-ID')}</span>
            <span className="stat-label">Total Jangkauan</span>
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon"><TrendingUp size={22} style={{ color: '#10b981' }} /></div>
          <div className="stat-details">
            <span className="stat-value">{engagementRate}%</span>
            <span className="stat-label">Interaksi (ER)</span>
          </div>
        </div>
      </div>

      {/* Main row grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', alignItems: 'start' }}>
        {/* Left card: Accounts connected */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Integrasi Media Sosial</h3>
            <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setCurrentView('connect')}>
              Kelola Koneksi
            </button>
          </div>

          <div className="accounts-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.01)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <Facebook size={20} style={{ color: 'var(--fb-color)' }} />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Facebook Page</span>
              </div>
              <span className="stat-value" style={{ fontSize: '1.3rem' }}>{connectedFB.length} Terhubung</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {connectedFB.length > 0 ? `Aktif: ${connectedFB[0].name}` : 'Hubungkan halaman Facebook untuk mulai posting'}
              </p>
            </div>

            <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.01)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <Instagram size={20} style={{ color: '#ec4899' }} />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Instagram Account</span>
              </div>
              <span className="stat-value" style={{ fontSize: '1.3rem' }}>{connectedIG.length} Terhubung</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {connectedIG.length > 0 ? `Aktif: ${connectedIG[0].username}` : 'Hubungkan akun Instagram Bisnis Anda'}
              </p>
            </div>
          </div>

          {/* Call to action */}
          <div style={{ marginTop: '24px', padding: '16px', background: 'var(--primary-glow)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary-hover)' }}>Siap untuk Mengunggah Konten?</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Publikasikan foto atau ulasan setup Anda sekaligus ke Facebook dan Instagram.</p>
            </div>
            <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => setCurrentView('upload')}>
              Mulai Upload <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Right card: recent status queue */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Aktivitas Terbaru</h3>
            <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setCurrentView('posts')}>
              Lihat Semua
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {posts.slice(0, 3).map((post) => (
              <div key={post.id} style={{ display: 'flex', gap: '12px', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'rgba(255,255,255,0.01)' }}>
                <img src={post.mediaUrl} className="table-post-thumb" style={{ width: '48px', height: '48px' }} alt="" />
                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {post.title}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    {new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="platforms-list-badges">
                      {post.platforms.map((p) => (
                        <span key={p} className={`platform-mini-badge ${p}`} style={{ width: '18px', height: '18px', fontSize: '8px' }}>
                          {p === 'facebook' ? 'F' : 'I'}
                        </span>
                      ))}
                    </div>
                    <span className={`status-badge ${post.status}`} style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                      {post.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {posts.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '24px 0' }}>
                Belum ada aktivitas konten.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
