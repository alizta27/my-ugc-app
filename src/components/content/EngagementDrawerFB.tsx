import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import type { PostEngagement } from "../../api/ugc";

interface EngagementDrawerFBProps {
  postId: string;
  accessToken: string;
  createdTime: string;
  onClose: () => void;
}

export default function EngagementDrawerFB({ postId, accessToken, createdTime, onClose }: EngagementDrawerFBProps) {
  const [engagement, setEngagement] = useState<PostEngagement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchEngagement = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const url = new URL(`https://graph.facebook.com/v20.0/${postId}`);
        url.searchParams.append(
          "fields",
          "shares,comments.summary(true),likes.summary(true),reactions.summary(true),reactions.type(LOVE).limit(0).summary(total_count).as(love),reactions.type(WOW).limit(0).summary(total_count).as(wow),reactions.type(HAHA).limit(0).summary(total_count).as(haha),reactions.type(SAD).limit(0).summary(total_count).as(sad),reactions.type(ANGRY).limit(0).summary(total_count).as(angry)"
        );
        url.searchParams.append("access_token", accessToken);

        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error("Gagal mengambil data engagement dari Facebook API");
        }
        
        const data = await response.json();
        if (isMounted) {
          setEngagement(data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchEngagement();

    return () => {
      isMounted = false;
    };
  }, [postId, accessToken]);

  return (
    <div className="engagement-drawer-overlay" onClick={onClose}>
      <div className="engagement-drawer-content" onClick={e => e.stopPropagation()}>
        <div className="drawer-header">
          <h2>Detail Engagement FB</h2>
          <button className="drawer-close" onClick={onClose}>
            &times;
          </button>
        </div>
        
        {isLoading ? (
           <div className="drawer-loading">
             <Loader2 size={32} className="spinner" />
             <p>Mengambil data dari Graph API...</p>
           </div>
        ) : error ? (
           <div className="drawer-error">
             {error}
           </div>
        ) : engagement ? (
          <div className="drawer-body">
            {/* Main Stats */}
            <div className="stats-grid-small">
              <div className="stat-box blue">
                <div className="stat-title">Total Likes</div>
                <div className="stat-value">{engagement.likes?.summary?.total_count || 0}</div>
              </div>
              <div className="stat-box cyan">
                <div className="stat-title">Total Komentar</div>
                <div className="stat-value">{engagement.comments?.summary?.total_count || 0}</div>
              </div>
              <div className="stat-box emerald">
                <div className="stat-title">Total Dibagikan</div>
                <div className="stat-value">{engagement.shares?.count || 0}</div>
              </div>
              <div className="stat-box amber">
                <div className="stat-title">Total Reaksi</div>
                <div className="stat-value">{engagement.reactions?.summary?.total_count || 0}</div>
              </div>
            </div>
            
            {/* Reaction Breakdown */}
            <div className="reaction-breakdown">
              <h4>Rincian Reaksi</h4>
              <div className="reaction-list">
                <div className="reaction-row">
                  <div className="reaction-label"><span className="emoji">❤️</span> <span className="name">Love</span></div>
                  <span className="reaction-count">{engagement.love?.summary?.total_count || 0}</span>
                </div>
                <div className="reaction-row">
                  <div className="reaction-label"><span className="emoji">😆</span> <span className="name">Haha</span></div>
                  <span className="reaction-count">{engagement.haha?.summary?.total_count || 0}</span>
                </div>
                <div className="reaction-row">
                  <div className="reaction-label"><span className="emoji">😲</span> <span className="name">Wow</span></div>
                  <span className="reaction-count">{engagement.wow?.summary?.total_count || 0}</span>
                </div>
                <div className="reaction-row">
                  <div className="reaction-label"><span className="emoji">😢</span> <span className="name">Sad</span></div>
                  <span className="reaction-count">{engagement.sad?.summary?.total_count || 0}</span>
                </div>
                <div className="reaction-row">
                  <div className="reaction-label"><span className="emoji">😡</span> <span className="name">Angry</span></div>
                  <span className="reaction-count">{engagement.angry?.summary?.total_count || 0}</span>
                </div>
              </div>
            </div>

            <div className="publish-time">
              <h4>Waktu Publikasi</h4>
              <div className="time-value">
                {new Date(createdTime).toLocaleString("id-ID", {
                  weekday: 'long', day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
