import { Search, Heart, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Posts() {
  const {
    posts,
    setPosts,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery
  } = useApp();

  return (
    <div className="fade-in glass-card">
      <div className="filter-bar">
        {/* Search query */}
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon-inside" />
          <input
            type="text"
            className="form-input"
            placeholder="Cari konten berdasarkan judul..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status tabs */}
        <div className="filter-tabs">
          {(['all', 'success', 'processing', 'failed'] as const).map(status => (
            <button
              key={status}
              className={`filter-tab ${statusFilter === status ? 'active' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {status === 'all' && 'Semua'}
              {status === 'success' && 'Berhasil'}
              {status === 'processing' && 'Diproses'}
              {status === 'failed' && 'Gagal'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Konten & Media</th>
              <th>Platform</th>
              <th>Tanggal Unggah</th>
              <th>Status</th>
              <th>Kinerja Awal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {posts
              .filter(post => {
                const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.caption.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesStatus = statusFilter === 'all' ? true : post.status === statusFilter;
                return matchesSearch && matchesStatus;
              })
              .map(post => (
                <tr key={post.id}>
                  <td>
                    <div className="table-post-info">
                      <img src={post.mediaUrl} className="table-post-thumb" alt="" />
                      <div>
                        <div className="post-title-cell">{post.title}</div>
                        <div className="post-caption-preview">{post.caption}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="platforms-list-badges">
                      {post.platforms.map(p => (
                        <span key={p} className={`platform-mini-badge ${p}`} title={p}>
                          {p === 'facebook' ? 'F' : 'I'}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {new Date(post.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${post.status}`}>
                      {post.status}
                    </span>
                    {post.errorMessage && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '4px', maxWidth: '200px' }}>
                        ⚠️ {post.errorMessage}
                      </p>
                    )}
                  </td>
                  <td>
                    {post.status === 'success' ? (
                      <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Heart size={12} style={{ color: '#f43f5e' }} /> {post.likes}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MessageCircle size={12} style={{ color: '#8b5cf6' }} /> {post.comments}
                        </span>
                      </div>
                    ) : post.status === 'processing' ? (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Menghitung...</span>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>Error</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {post.status === 'failed' && (
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                          onClick={() => {
                            // Simulated retry
                            setPosts(current =>
                              current.map(p => (p.id === post.id ? { ...p, status: 'processing', errorMessage: undefined } : p))
                            );
                            setTimeout(() => {
                              setPosts(current =>
                                current.map(p => (p.id === post.id ? { ...p, status: 'success', likes: 12, comments: 2, reach: 350 } : p))
                              );
                            }, 3000);
                          }}
                        >
                          Retry
                        </button>
                      )}
                      <button
                        className="btn btn-danger"
                        style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                        onClick={() => {
                          if (confirm('Apakah Anda yakin ingin menghapus catatan post ini?')) {
                            setPosts(prev => prev.filter(p => p.id !== post.id));
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            {posts.filter(post => {
              const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.caption.toLowerCase().includes(searchQuery.toLowerCase());
              const matchesStatus = statusFilter === 'all' ? true : post.status === statusFilter;
              return matchesSearch && matchesStatus;
            }).length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  Tidak ada konten yang sesuai dengan filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
