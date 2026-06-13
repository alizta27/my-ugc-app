import { useApp } from '../context/AppContext';

export default function TopBar() {
  const { currentView } = useApp();

  return (
    <header className="top-bar">
      <h2 className="page-title">
        {currentView === 'dashboard' && 'Dashboard Overview'}
        {currentView === 'connect' && 'Koneksi Halaman & Akun'}
        {currentView === 'upload' && 'Buat & Unggah Konten'}
        {currentView === 'posts' && 'Riwayat & Status Publikasi'}
        {currentView === 'analytics' && 'Kinerja Konten'}
        {currentView === 'settings' && 'Pengaturan Akun'}
      </h2>

      <div style={{ display: 'flex', gap: '12px' }}>
        <span
          className="status-badge"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-secondary)',
            fontSize: '0.75rem',
            textTransform: 'none'
          }}
        >
          Mode Demo / Dummy
        </span>
      </div>
    </header>
  );
}
