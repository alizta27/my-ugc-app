import { useLocation } from 'react-router-dom';

export default function TopBar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <header className="top-bar">
      <h2 className="page-title">
        {path === '/' && 'Dashboard Overview'}
        {path === '/connect' && 'Koneksi Halaman & Akun'}
        {path === '/upload' && 'Buat & Unggah Konten'}
        {path === '/posts' && 'Riwayat & Status Publikasi'}
        {path === '/analytics' && 'Kinerja Konten'}
        {path === '/settings' && 'Pengaturan Akun'}
        {path.startsWith('/account/') && 'Detail Akun'}
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
