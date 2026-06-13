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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <button
          onClick={() => {
            navigate("/connect");
          }}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-secondary)",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            alignItems: "center",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color =
              "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color =
              "var(--text-secondary)";
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Detail Halaman Facebook</h2>
      </div>

      {/* Main Profile Card */}
      <div className="glass-card" style={{ marginBottom: "24px" }}>
        <div
          style={{
            display: "flex",
            gap: "24px",
            alignItems: "start",
            marginBottom: "32px",
          }}
        >
          {/* Avatar */}
          <div style={{ flex: "0 0 auto" }}>
            <img
              src={page.avatar}
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "12px",
                objectFit: "cover",
              }}
              alt=""
            />
          </div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                {page.name}
              </h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "4px 8px",
                  backgroundColor: "var(--primary-glow)",
                  borderRadius: "6px",
                }}
              >
                {page.platform === "facebook" ? (
                  <Facebook size={16} style={{ color: "var(--fb-color)" }} />
                ) : (
                  <Instagram size={16} style={{ color: "#ec4899" }} />
                )}
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textTransform: "capitalize",
                  }}
                >
                  {page.platform}
                </span>
              </div>
            </div>

            <p
              style={{
                fontSize: "0.95rem",
                color: "var(--text-secondary)",
                marginBottom: "16px",
              }}
            >
              {page.platform === "facebook"
                ? page.username
                : `@${page.username}`}
            </p>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                style={{
                  padding: "8px 16px",
                  backgroundColor: "var(--primary)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--primary-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--primary)";
                }}
              >
                <Share2 size={16} /> Bagikan
              </button>
              <button
                style={{
                  padding: "8px 16px",
                  backgroundColor: "transparent",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--text-secondary)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-color)";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }}
              >
                <Settings size={16} /> Pengaturan
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
          }}
        >
          <div
            style={{
              padding: "16px",
              backgroundColor: "rgba(255,255,255,0.02)",
              borderRadius: "12px",
              border: "1px solid var(--border-color)",
            }}
          >
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
                marginBottom: "4px",
              }}
            >
              Pengikut
            </p>
            <p
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              {page.followers.toLocaleString("id-ID")}
            </p>
          </div>

          <div
            style={{
              padding: "16px",
              backgroundColor: "rgba(255,255,255,0.02)",
              borderRadius: "12px",
              border: "1px solid var(--border-color)",
            }}
          >
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
                marginBottom: "4px",
              }}
            >
              Jenis Akun
            </p>
            <p
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              Halaman
            </p>
          </div>

          <div
            style={{
              padding: "16px",
              backgroundColor: "rgba(255,255,255,0.02)",
              borderRadius: "12px",
              border: "1px solid var(--border-color)",
            }}
          >
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
                marginBottom: "4px",
              }}
            >
              Status
            </p>
            <p
              style={{
                fontSize: "0.95rem",
                fontWeight: 700,
                color: "var(--success)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "var(--success)",
                }}
              />
              Aktif
            </p>
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="glass-card">
        <h4
          style={{
            fontSize: "0.95rem",
            fontWeight: 600,
            marginBottom: "16px",
            color: "var(--text-primary)",
          }}
        >
          Informasi Akun
        </h4>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0",
              borderBottom: "1px solid var(--border-color)",
              fontSize: "0.85rem",
            }}
          >
            <span style={{ color: "var(--text-secondary)" }}>ID Halaman</span>
            <span
              style={{
                color: "var(--text-primary)",
                fontFamily: "monospace",
                fontSize: "0.8rem",
              }}
            >
              {page.id}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0",
              borderBottom: "1px solid var(--border-color)",
              fontSize: "0.85rem",
            }}
          >
            <span style={{ color: "var(--text-secondary)" }}>Platform</span>
            <span
              style={{
                color: "var(--text-primary)",
                textTransform: "capitalize",
                fontWeight: 500,
              }}
            >
              {page.platform}
            </span>
          </div>
        </div>
      </div>

      {/* Live Facebook Posts embedded here! */}
      <PostFB pageId={page.id} accessToken={page.accessToken || ''} />
      
    </div>
  );
}
