import { useEffect, useState, useRef, useCallback } from "react";
import type { GraphPost } from "../../api/ugc";
import EngagementDrawerFB from "./EngagementDrawerFB";
import { MessageCircle, Share2, Loader2, ThumbsUp, Link as LinkIcon, BarChart2 } from "lucide-react";

interface PostFBProps {
  pageId: string;
  accessToken: string;
  pageName: string;
  pageAvatar: string;
}

export default function PostFB({ pageId, accessToken, pageName, pageAvatar }: PostFBProps) {
  const [posts, setPosts] = useState<GraphPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [activeReactionPopup, setActiveReactionPopup] = useState<string | null>(null);
  const [selectedReactions, setSelectedReactions] = useState<Record<string, { type: string; icon: string; color: string } | undefined>>({});
  const [drawerPost, setDrawerPost] = useState<GraphPost | null>(null);

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleGlobalClick = () => setActiveReactionPopup(null);
    if (activeReactionPopup) {
      window.addEventListener('click', handleGlobalClick);
    }
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [activeReactionPopup]);

  const handleLikePointerDown = (postId: string, e: React.PointerEvent) => {
    e.stopPropagation(); // prevent global click from immediately closing
    longPressTimer.current = setTimeout(() => {
      setActiveReactionPopup(postId);
      longPressTimer.current = null;
    }, 500); // 500ms hold
  };

  const handleLikePointerUp = (postId: string, e: React.PointerEvent) => {
    e.stopPropagation();
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
      // It was a short click, toggle default like
      if (activeReactionPopup !== postId) {
        handleReactionClick(postId, reactions[0]);
      }
    }
  };

  const reactions = [
    { type: "Like", icon: "👍", color: "#2563eb" },
    { type: "Love", icon: "❤️", color: "#f43f5e" },
    { type: "Care", icon: "🥰", color: "#fbbf24" },
    { type: "Haha", icon: "😆", color: "#fbbf24" },
    { type: "Wow", icon: "😲", color: "#fbbf24" },
    { type: "Sad", icon: "😢", color: "#fbbf24" },
    { type: "Angry", icon: "😡", color: "#ea580c" },
  ];

  const handleReactionClick = (postId: string, reaction: { type: string; icon: string; color: string }) => {
    setSelectedReactions((prev) => ({
      ...prev,
      [postId]: prev[postId]?.type === reaction.type ? undefined : reaction,
    }));
    setActiveReactionPopup(null);
  };

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCopyLink = (url: string | undefined) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    alert('Tautan berhasil disalin!');
  };

  const observerTarget = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);

  const fetchPosts = useCallback(
    async (after?: string) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      setIsLoading(true);
      setError(null);

      try {
        const url = new URL(`https://graph.facebook.com/v20.0/${pageId}/posts`);
        url.searchParams.append(
          "fields",
          "id,message,story,created_time,permalink_url,full_picture,attachments,shares,comments.summary(true),likes.summary(true)",
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

        setPosts((prev) => {
          if (!after) return newPosts;
          const existingIds = new Set(prev.map(p => p.id));
          const uniqueNewPosts = newPosts.filter(p => !existingIds.has(p.id));
          return [...prev, ...uniqueNewPosts];
        });

        // Update cursor for pagination
        // Facebook API uses data.paging.next to indicate more data exists
        if (newPosts.length > 0 && data.paging?.next && data.paging?.cursors?.after) {
          setNextCursor(data.paging.cursors.after);
        } else {
          setNextCursor(null);
        }
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan");
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    },
    [pageId, accessToken],
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
    if (!nextCursor) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingRef.current) {
          fetchPosts(nextCursor);
        }
      },
      { threshold: 0.1 },
    );

    const target = observerTarget.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [nextCursor, fetchPosts]);

  return (
    <div style={{ marginTop: "24px" }}>
      <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "16px" }}>
        Konten Live Facebook
      </h3>

      <div className="post-fb-container">
        {posts.map((post) => (
          <div key={post.id} className="glass-card post-card">
            {/* Header: Avatar, Name, Date */}
            <div className="post-header">
               <img src={pageAvatar} alt="" className="post-avatar" />
               <div>
                  <div className="post-header-text">
                    <h4 className="post-page-name">{pageName}</h4>
                    {post.story && (
                      <span className="post-story">
                        {post.story.startsWith(pageName) ? post.story.substring(pageName.length) : ` - ${post.story}`}
                      </span>
                    )}
                  </div>
                  <div className="post-date">
                    {post.permalink_url ? (
                      <a href={post.permalink_url} target="_blank" rel="noreferrer">
                        {new Date(post.created_time).toLocaleDateString("id-ID", {
                          day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                        })}
                      </a>
                    ) : (
                      new Date(post.created_time).toLocaleDateString("id-ID", {
                        day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                      })
                    )}
                  </div>
               </div>
            </div>

            {/* Description / Caption */}
            {post.message && (
              <p className="post-message">
                {post.message}
              </p>
            )}

            {/* Image/Video (Full width like Facebook) */}
            {(() => {
              const videoUrl = post.attachments?.data?.[0]?.media?.source;
              if (videoUrl) {
                return (
                  <div className="post-media-wrapper">
                    <video src={videoUrl} controls />
                  </div>
                );
              }
              if (post.full_picture) {
                return (
                  <div className="post-media-wrapper">
                    <img src={post.full_picture} alt="" />
                  </div>
                );
              }
              return null;
            })()}

            {/* Footer / Actions */}
            <div className="post-footer">
              <div 
                className="post-action"
                onPointerDown={(e) => handleLikePointerDown(post.id, e)}
                onPointerUp={(e) => handleLikePointerUp(post.id, e)}
                onPointerLeave={() => {
                  if (longPressTimer.current) {
                    clearTimeout(longPressTimer.current);
                    longPressTimer.current = null;
                  }
                }}
              >
                {/* Reaction Popup */}
                {activeReactionPopup === post.id && (
                  <div className="reaction-popup" onClick={(e) => e.stopPropagation()}>
                    {reactions.map((reaction) => (
                      <span
                        key={reaction.type}
                        title={reaction.type}
                        className="reaction-item"
                        onClick={() => handleReactionClick(post.id, reaction)}
                      >
                        {reaction.icon}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Like Button Display */}
                <div className="like-btn-display">
                  {selectedReactions[post.id] ? (
                    <span className="like-icon-selected">{selectedReactions[post.id]!.icon}</span>
                  ) : (
                    <ThumbsUp size={16} className="action-icon" />
                  )}
                  <span className="like-text" style={{ color: selectedReactions[post.id] ? selectedReactions[post.id]!.color : "var(--text-secondary)" }}>
                    {selectedReactions[post.id] ? selectedReactions[post.id]!.type : "Suka"} 
                    <span className="like-count-extra">
                      ({(post.likes?.summary?.total_count || 0) + (selectedReactions[post.id] ? 1 : 0)})
                    </span>
                  </span>
                </div>
              </div>
              <div className="post-action" onClick={() => toggleComments(post.id)}>
                <MessageCircle size={16} className="action-icon" />
                <span className="action-count">{post.comments?.summary?.total_count || 0}</span>
              </div>
              <div className="post-action">
                <Share2 size={16} className="action-icon" />
                <span className="action-count">{post.shares?.count || 0}</span>
              </div>
              <div className="post-action align-right" onClick={() => handleCopyLink(post.permalink_url)} title="Salin Tautan">
                <LinkIcon size={16} className="action-icon" />
              </div>
              <div className="post-action" onClick={() => setDrawerPost(post)} title="Detail Engagement">
                <BarChart2 size={16} className="action-icon" />
              </div>
            </div>

            {/* Comments Section */}
            {expandedComments[post.id] && (
              <div className="post-comments">
                <h5 className="comments-title">Komentar</h5>
                {(!post.comments?.data || post.comments.data.length === 0) ? (
                  <p className="no-comments">Tidak ada komentar untuk ditampilkan.</p>
                ) : (
                  <div className="comments-list">
                    {post.comments.data.map((comment) => (
                      <div key={comment.id} className="comment-item">
                        <div className="comment-avatar">
                          <span>{comment.from?.name?.charAt(0) || "U"}</span>
                        </div>
                        <div className="comment-content">
                          <div className="comment-author">{comment.from?.name || "Pengguna"}</div>
                          <div className="comment-text">{comment.message}</div>
                          <div className="comment-time">
                            {new Date(comment.created_time).toLocaleString("id-ID", {
                               day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Loading state & Intersection Observer Target */}
      <div ref={observerTarget} className="post-loading">
        {isLoading && (
          <div className="loading-content">
            <Loader2 size={20} className="spinner" />
            <span>Memuat data...</span>
          </div>
        )}
        {!isLoading && !nextCursor && posts.length > 0 && (
          <span className="end-message">Tidak ada post lagi</span>
        )}
        {!isLoading && !nextCursor && posts.length === 0 && !error && (
          <span className="end-message">Belum ada konten dipublikasikan</span>
        )}
      </div>

      {/* Engagement Drawer Overlay */}
      {drawerPost && (
        <EngagementDrawerFB
          postId={drawerPost.id}
          accessToken={accessToken}
          createdTime={drawerPost.created_time}
          onClose={() => setDrawerPost(null)}
        />
      )}
    </div>
  );
}
