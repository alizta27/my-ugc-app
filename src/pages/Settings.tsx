import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Settings() {
  const {
    currentUser,
    settingsName,
    setSettingsName,
    settingsEmail,
    setSettingsEmail,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    settingsAlert,
    handleSaveSettings
  } = useApp();

  return (
    <div className="fade-in glass-card" style={{ maxWidth: '640px' }}>
      <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '8px' }}>Pengaturan Profil & Keamanan</h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
        Perbarui nama publik Anda atau lakukan simulasi pergantian kata sandi untuk akun demonstrasi ini.
      </p>

      {settingsAlert && (
        <div className={`alert ${settingsAlert.type}`}>
          {settingsAlert.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{settingsAlert.message}</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>
          <img src={currentUser.avatar} className="user-avatar" style={{ width: '64px', height: '64px' }} alt="" />
          <div>
            <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600 }}>Foto Profil Kreator</span>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Avatar default terikat dengan demo</span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Nama Lengkap</label>
          <input
            type="text"
            className="form-input"
            value={settingsName}
            onChange={(e) => setSettingsName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Alamat Email</label>
          <input
            type="email"
            className="form-input"
            value={settingsEmail}
            onChange={(e) => setSettingsEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password Baru (Opsional)</label>
          <input
            type="password"
            className="form-input"
            placeholder="Masukkan password baru jika ingin mengubah"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Konfirmasi Password Baru</label>
          <input
            type="password"
            className="form-input"
            placeholder="Ulangi password baru untuk verifikasi"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }}>
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
