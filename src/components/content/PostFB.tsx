import { useEffect, useState, useRef, useCallback } from "react";
import type { GraphPost } from "../../api/ugc";
import { Heart, MessageCircle, Share2, Loader2 } from "lucide-react";

interface PostFBProps {
  pageId: string;
  accessToken: string;
}

export default function PostFB({ pageId, accessToken }: PostFBProps) {
  const [posts, setPosts] = useState<GraphPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const observerTarget = useRef<HTMLDivElement | null>(null);

  const fetchPosts = useCallback(
    async (after?: string) => {
      if (isLoading) return;
      setIsLoading(true);
      setError(null);

      try {
        const url = new URL(`https://graph.facebook.com/v20.0/${pageId}/posts`);
        url.searchParams.append(
          "fields",
          "id,message,full_picture,created_time,shares,comments.summary(true),likes.summary(true)",
        );
        url.searchParams.append("access_token", accessToken);
        url.searchParams.append("limit", "5");
        if (after) {
          url.searchParams.append("after", after);
        }

        const res = await fetch(url.toString());
        const data = await res.json();

        if (data.error) {
          throw new Error(data.error.message || "Failed to fetch posts");
        }

        const newPosts: GraphPost[] = data.data || [];

        setPosts((prev) => (after ? [...prev, ...newPosts] : newPosts));

        // Update cursor for pagination
        if (data.paging && data.paging.cursors && data.paging.cursors.after) {
          // Facebook API returns an empty array when no more posts, or no next link
          if (newPosts.length > 0) {
            setNextCursor(data.paging.cursors.after);
          } else {
            setNextCursor(null);
          }
        } else {
          setNextCursor(null);
        }
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan");
      } finally {
        setIsLoading(false);
      }
    },
    [pageId, accessToken, isLoading],
  );

  // Initial fetch
  useEffect(() => {
    setPosts([]);
    setNextCursor(null);
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId, accessToken]);

  // Intersection Observer for Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextCursor && !isLoading) {
          fetchPosts(nextCursor);
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [nextCursor, isLoading, fetchPosts]);

  return (
    <div style={{ marginTop: "24px" }}>
      <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "16px" }}>
        Konten Live Facebook
      </h3>

      {error && (
        <div
          style={{
            padding: "16px",
            background: "rgba(239, 68, 68, 0.1)",
            color: "var(--danger)",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        >
          Gagal memuat post: {error}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {posts.map((post) => (
          <div
            key={post.id}
            className="glass-card"
            style={{ padding: "16px", display: "flex", gap: "16px" }}
          >
            {post.full_picture ? (
              <img
                src={post.full_picture}
                alt=""
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            ) : (
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                >
                  No Image
                </span>
              </div>
            )}

            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                  marginBottom: "8px",
                }}
              >
                {new Date(post.created_time).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p
                style={{
                  fontSize: "0.95rem",
                  color: "var(--text-primary)",
                  marginBottom: "16px",
                  whiteSpace: "pre-wrap",
                }}
              >
                {post.message || (
                  <span style={{ color: "var(--text-muted)" }}>
                    Tanpa caption
                  </span>
                )}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "24px",
                  color: "var(--text-secondary)",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <Heart size={16} style={{ color: "#f43f5e" }} />
                  <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>
                    {post.likes?.summary?.total_count || 0}
                  </span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <MessageCircle size={16} style={{ color: "#0ea5e9" }} />
                  <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>
                    {post.comments?.summary?.total_count || 0}
                  </span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <Share2 size={16} style={{ color: "#10b981" }} />
                  <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>
                    {post.shares?.count || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading state & Intersection Observer Target */}
      <div
        ref={observerTarget}
        style={{ padding: "24px", textAlign: "center" }}
      >
        {isLoading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              color: "var(--text-secondary)",
            }}
          >
            <Loader2 size={20} className="spinner" />
            <span>Memuat data...</span>
          </div>
        )}
        {!isLoading && !nextCursor && posts.length > 0 && (
          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Tidak ada post lagi
          </span>
        )}
        {!isLoading && !nextCursor && posts.length === 0 && !error && (
          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Belum ada konten dipublikasikan
          </span>
        )}
      </div>
    </div>
  );
}
