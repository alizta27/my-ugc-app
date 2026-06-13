import { useApp } from '../context/AppContext';
import { Facebook, Instagram } from '../components/Icons';

export default function Connect() {
  const { pages, handleToggleConnection } = useApp();

  return (
    <div className="fade-in">
      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '8px' }}>Bagaimana cara menghubungkan akun Facebook & Instagram?</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          Sebelum mempublikasikan konten, Anda perlu mengintegrasikan akun Facebook Page dan Instagram Business yang saling terhubung di bawah naungan **Meta Accounts Center** Anda.
          Dalam demonstrasi ini, Anda bisa menstimulasikan proses sinkronisasi OAuth Facebook dengan menekan tombol Konek/Putuskan akun di bawah.
        </p>
      </div>

      <div className="accounts-grid">
        {pages.map((page) => (
          <div key={page.id} className="glass-card account-card">
            <div>
              <div className="account-card-header">
                <div className="account-avatar-wrapper">
                  <img src={page.avatar} className="user-avatar" style={{ width: '56px', height: '56px' }} alt="" />
                  <div className={`account-icon-badge ${page.platform}`}>
                    {page.platform === 'facebook' ? <Facebook size={10} /> : <Instagram size={10} />}
                  </div>
                </div>

                <div>
                  <h4 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>{page.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {page.platform === 'facebook' ? page.username : `@${page.username}`}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Followers</span>
                <strong style={{ fontSize: '0.95rem' }}>{page.followers.toLocaleString('id-ID')}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status Koneksi</span>
                <span className="account-status-tag">
                  <span className={`status-dot ${page.isConnected ? 'connected' : 'disconnected'}`} />
                  <span style={{ color: page.isConnected ? 'var(--success)' : 'var(--text-secondary)' }}>
                    {page.isConnected ? 'Terhubung' : 'Terputus'}
                  </span>
                </span>
              </div>
            </div>

            <button
              className={`btn ${page.isConnected ? 'btn-danger' : 'btn-primary'}`}
              style={{ width: '100%', padding: '10px' }}
              onClick={() => handleToggleConnection(page.id)}
            >
              {page.isConnected ? 'Putuskan Hubungan' : 'Hubungkan Halaman'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
