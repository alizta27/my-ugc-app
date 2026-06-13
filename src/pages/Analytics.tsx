import { Heart, MessageCircle, Eye, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockAnalyticsHistory } from '../mockData';
import { Facebook, Instagram } from '../components/Icons';

export default function Analytics() {
  const { posts } = useApp();

  // Total metrics
  const totalLikes = posts.reduce((sum, p) => sum + p.likes, 0);
  const totalComments = posts.reduce((sum, p) => sum + p.comments, 0);
  const totalReach = posts.reduce((sum, p) => sum + p.reach, 0);
  const engagementRate = posts.length > 0 ? (((totalLikes + totalComments) / (totalReach || 1)) * 100).toFixed(1) : '0.0';

  return (
    <div className="fade-in">
      {/* Top row stats summary */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon"><Heart size={22} style={{ color: '#f43f5e' }} /></div>
          <div className="stat-details">
            <span className="stat-value">{totalLikes.toLocaleString('id-ID')}</span>
            <span className="stat-label">Jumlah Like Konten</span>
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon"><MessageCircle size={22} style={{ color: '#8b5cf6' }} /></div>
          <div className="stat-details">
            <span className="stat-value">{totalComments.toLocaleString('id-ID')}</span>
            <span className="stat-label">Jumlah Komentar</span>
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon"><Eye size={22} style={{ color: '#0ea5e9' }} /></div>
          <div className="stat-details">
            <span className="stat-value">{totalReach.toLocaleString('id-ID')}</span>
            <span className="stat-label">Total Reach Jangkauan</span>
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon"><TrendingUp size={22} style={{ color: '#10b981' }} /></div>
          <div className="stat-details">
            <span className="stat-value">{engagementRate}%</span>
            <span className="stat-label">Tingkat Interaksi</span>
          </div>
        </div>
      </div>

      {/* Chart Grid & Platforms Split */}
      <div className="analytics-grid-two">
        {/* Left: Custom SVG/CSS Bar Chart */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Tren Pertumbuhan Like (Minggu Ini)</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Menampilkan perbandingan jangkauan suka harian Facebook vs Instagram.</p>

          <div className="custom-chart-container">
            {/* Y-Axis guide lines */}
            <div className="chart-axis-line" style={{ bottom: '20%' }} />
            <div className="chart-axis-line" style={{ bottom: '40%' }} />
            <div className="chart-axis-line" style={{ bottom: '60%' }} />
            <div className="chart-axis-line" style={{ bottom: '80%' }} />

            {mockAnalyticsHistory.map((dp, idx) => {
              const maxVal = 800; // Cap height scaling
              const fbPercent = Math.min((dp.facebook / maxVal) * 100, 100);
              const igPercent = Math.min((dp.instagram / maxVal) * 100, 100);

              return (
                <div key={idx} className="chart-bar-group">
                  <div className="chart-bars-wrapper">
                    <div
                      className="chart-bar facebook"
                      style={{ height: `${fbPercent}%` }}
                      data-value={`FB: ${dp.facebook} likes`}
                    />
                    <div
                      className="chart-bar instagram"
                      style={{ height: `${igPercent}%` }}
                      data-value={`IG: ${dp.instagram} likes`}
                    />
                  </div>
                  <span className="chart-label-text">{dp.label}</span>
                </div>
              );
            })}
          </div>

          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color facebook" />
              <span>Facebook Likes</span>
            </div>
            <div className="legend-item">
              <div className="legend-color instagram" />
              <span>Instagram Likes</span>
            </div>
          </div>
        </div>

        {/* Right: Distribution Analysis */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>Rasio Distribusi</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Distribusi penayangan konten UGC berdasarkan platform tujuan.</p>

            {/* Facebook Circle and Progress bar representation */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Facebook size={14} style={{ color: 'var(--fb-color)' }} /> Facebook Page
                </span>
                <span>40%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '40%', background: 'var(--fb-color)' }} />
              </div>
            </div>

            {/* Instagram Progress bar representation */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Instagram size={14} style={{ color: '#ec4899' }} /> Instagram
                </span>
                <span>60%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '60%', background: 'var(--ig-gradient)' }} />
              </div>
            </div>
          </div>

          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>💡 Insight Analitik</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Konten Instagram memperoleh tingkat interaksi 1.5x lebih tinggi dibandingkan Facebook Page. Postingan bergambar di hari Kamis sore mendapatkan respon terbaik.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
