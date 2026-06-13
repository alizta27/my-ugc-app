import { ArrowLeft, Share2, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Facebook, Instagram } from "../../components/Icons";
import type { ConnectedPage } from "../../types";
import PostFB from "../../components/content/PostFB";

interface AccountDetailFBProps {
  page: ConnectedPage;
}

export default function AccountDetailFB({ page }: AccountDetailFBProps) {
  const navigate = useNavigate();

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="account-detail-header">
        <button
          onClick={() => navigate("/connect")}
          className="back-btn"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="title">Detail Halaman Facebook</h2>
      </div>

      {/* Main Profile Card */}
      <div className="glass-card account-detail-card">
        <div className="profile-section">
          {/* Avatar */}
          <div className="profile-avatar-wrapper">
            <img
              src={page.avatar}
              className="profile-avatar"
              alt=""
            />
          </div>

          {/* Info */}
          <div className="profile-info">
            <div className="profile-name-row">
              <h3 className="profile-name">{page.name}</h3>
              <div className="platform-badge">
                {page.platform === "facebook" ? (
                  <Facebook size={16} style={{ color: "var(--fb-color)" }} />
                ) : (
                  <Instagram size={16} style={{ color: "#ec4899" }} />
                )}
                <span className="platform-text">{page.platform}</span>
              </div>
            </div>

            <p className={`profile-username ${page.bio ? "with-bio" : "no-bio"}`}>
              {page.platform === "facebook" ? page.username : `@${page.username}`}
            </p>

            {page.bio && (
              <p className="profile-bio">{page.bio}</p>
            )}

            <div className="profile-actions">
              <button className="action-btn-primary">
                <Share2 size={16} /> Bagikan
              </button>
              <button className="action-btn-secondary">
                <Settings size={16} /> Pengaturan
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid-box">
          <div className="stat-item">
            <p className="stat-label">Pengikut</p>
            <p className="stat-val">{page.followers.toLocaleString("id-ID")}</p>
          </div>

          <div className="stat-item">
            <p className="stat-label">Jenis Akun</p>
            <p className="stat-val text-md">Halaman</p>
          </div>

          <div className="stat-item">
            <p className="stat-label">Status</p>
            <p className="stat-val status-active">
              <span className="status-dot" />
              Aktif
            </p>
          </div>
        </div>
      </div>

      {/* Live Facebook Posts embedded here! */}
      <PostFB
        pageId={page.id}
        accessToken={page.accessToken || ""}
        pageName={page.name}
        pageAvatar={page.avatar}
      />
    </div>
  );
}
