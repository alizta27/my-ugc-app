import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ConnectedPage, UploadLog, Platform, User } from '../types';
import { initialPosts, mockSampleMedia } from '../mockData';
import { getConnection, publishPhoto as apiPublishPhoto, startFacebookAuth, fetchPageFromBackend, saveConnection } from '../api/ugc';

interface AppContextProps {
  // Authentication & Profile
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  authTab: 'login' | 'register';
  setAuthTab: (tab: 'login' | 'register') => void;
  loginEmail: string;
  setLoginEmail: (val: string) => void;
  loginPassword: string;
  setLoginPassword: (val: string) => void;
  regName: string;
  setRegName: (val: string) => void;
  regEmail: string;
  setRegEmail: (val: string) => void;
  regPassword: string;
  setRegPassword: (val: string) => void;
  authError: string;
  setAuthError: (val: string) => void;
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;

  // Navigation
  currentView: 'dashboard' | 'connect' | 'upload' | 'posts' | 'analytics' | 'settings' | 'account-detail';
  setCurrentView: (view: 'dashboard' | 'connect' | 'upload' | 'posts' | 'analytics' | 'settings' | 'account-detail') => void;

  // Account Detail
  selectedPage: ConnectedPage | null;
  setSelectedPage: (page: ConnectedPage | null) => void;

  // Pages & Posts
  pages: ConnectedPage[];
  setPages: React.Dispatch<React.SetStateAction<ConnectedPage[]>>;
  posts: UploadLog[];
  setPosts: React.Dispatch<React.SetStateAction<UploadLog[]>>;

  // Upload Form
  postTitle: string;
  setPostTitle: (val: string) => void;
  postCaption: string;
  setPostCaption: (val: string) => void;
  selectedMediaUrl: string;
  setSelectedMediaUrl: (val: string) => void;
  customMediaUrl: string;
  setCustomMediaUrl: (val: string) => void;
  selectedPlatforms: Platform[];
  setSelectedPlatforms: React.Dispatch<React.SetStateAction<Platform[]>>;
  mediaType: 'image' | 'video';
  setMediaType: (val: 'image' | 'video') => void;
  mediaSource: 'sample' | 'custom';
  setMediaSource: (val: 'sample' | 'custom') => void;
  uploadSuccessAlert: boolean;
  setUploadSuccessAlert: (val: boolean) => void;
  activePreviewTab: Platform;
  setActivePreviewTab: (tab: Platform) => void;

  // Filters
  statusFilter: 'all' | 'success' | 'processing' | 'failed';
  setStatusFilter: (filter: 'all' | 'success' | 'processing' | 'failed') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Settings
  settingsName: string;
  setSettingsName: (val: string) => void;
  settingsEmail: string;
  setSettingsEmail: (val: string) => void;
  newPassword: string;
  setNewPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  settingsAlert: { type: 'success' | 'danger'; message: string } | null;
  setSettingsAlert: (alert: { type: 'success' | 'danger'; message: string } | null) => void;

  // Handlers
  handleToggleConnection: (id: string) => void;
  handlePublishPost: (e: React.FormEvent) => Promise<void>;
  handleSaveSettings: (e: React.FormEvent) => void;
  handleLogin: (e: React.FormEvent) => void;
  handleRegister: (e: React.FormEvent) => void;
  handleLogout: () => void;
  getInitialPages: () => ConnectedPage[];
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const getInitialPages = (): ConnectedPage[] => {
  const conn = getConnection();
  const pages: ConnectedPage[] = [];

  // 1. Facebook Page
  if (conn) {
    pages.push({
      id: conn.page.id,
      platform: 'facebook',
      name: conn.page.name,
      username: conn.page.name.toLowerCase().replace(/\s+/g, '.'),
      avatar: conn.page.picture || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      isConnected: true,
      connectedAt: conn.connectedAt,
      followers: conn.followers_count ?? conn.followers ?? 0
    });
  } else {
    pages.push({
      id: 'facebook_disconnected',
      platform: 'facebook',
      name: 'Facebook Page',
      username: 'Belum Terhubung',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      isConnected: false,
      followers: 0
    });
  }

  // 2. Instagram Account
  if (conn && conn.igBusinessId) {
    pages.push({
      id: conn.igBusinessId,
      platform: 'instagram',
      name: 'Instagram Bisnis',
      username: conn.page.name.toLowerCase().replace(/\s+/g, '_') + '_ig',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isConnected: true,
      connectedAt: conn.connectedAt,
      followers: 8920
    });
  } else {
    pages.push({
      id: 'instagram_disconnected',
      platform: 'instagram',
      name: 'Instagram Business',
      username: 'Belum Terhubung',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isConnected: false,
      followers: 0
    });
  }

  return pages;
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Authentication & Profile States
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('creator@techgear.academy');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [currentUser, setCurrentUser] = useState<User>({
    id: 'user_1',
    name: 'Alizta Pratama',
    email: 'creator@techgear.academy',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  });

  // Navigation State
  const [currentView, setCurrentView] = useState<'dashboard' | 'connect' | 'upload' | 'posts' | 'analytics' | 'settings' | 'account-detail'>('dashboard');

  // Account Detail State
  const [selectedPage, setSelectedPage] = useState<ConnectedPage | null>(null);

  // Core App States
  const [pages, setPages] = useState<ConnectedPage[]>(() => getInitialPages());
  const [posts, setPosts] = useState<UploadLog[]>(initialPosts);

  // Upload Form States
  const [postTitle, setPostTitle] = useState('');
  const [postCaption, setPostCaption] = useState('');
  const [selectedMediaUrl, setSelectedMediaUrl] = useState(mockSampleMedia[0].url);
  const [customMediaUrl, setCustomMediaUrl] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['instagram']);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaSource, setMediaSource] = useState<'sample' | 'custom'>('sample');
  const [uploadSuccessAlert, setUploadSuccessAlert] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<Platform>('instagram');

  // Content Filter States
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'processing' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Settings State
  const [settingsName, setSettingsName] = useState(currentUser.name);
  const [settingsEmail, setSettingsEmail] = useState(currentUser.email);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [settingsAlert, setSettingsAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

  // Sync settings inputs when currentUser changes
  useEffect(() => {
    setSettingsName(currentUser.name);
    setSettingsEmail(currentUser.email);
  }, [currentUser]);

  // Auto-connect dari backend saat app pertama dibuka - selalu fetch dari FB untuk data terbaru
  useEffect(() => {
    const initializeConnection = async () => {
      const conn = await fetchPageFromBackend();
      if (conn) {
        saveConnection(conn);
        setPages(getInitialPages());
      }
    };

    void initializeConnection();
  }, []);

  // Static token Connection — redirect ke endpoint /api/auth/facebook
  const handleToggleConnection = (id: string) => {
    const page = pages.find(p => p.id === id);
    if (!page) return;

    if (page.isConnected) {
      // Disconnect: hapus dari localStorage
      if (confirm(`Putuskan koneksi ke ${page.name}?`)) {
        localStorage.removeItem('ugc_fb_connection');
        setPages(getInitialPages());
      }
    } else {
      // Connect: redirect ke static auth endpoint
      startFacebookAuth();
    }
  };

  // Real Publish — call API
  const handlePublishPost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedPlatforms.length === 0) {
      alert('Silakan pilih minimal satu platform target (Facebook / Instagram)!');
      return;
    }

    // Check koneksi
    const conn = getConnection();
    if (!conn) {
      alert('Hubungkan akun Facebook terlebih dahulu!');
      setCurrentView('connect');
      return;
    }

    const mediaUrl = mediaSource === 'sample' ? selectedMediaUrl : (customMediaUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800');

    const newPost: UploadLog = {
      id: `post_${Date.now()}`,
      title: postTitle || 'Untitled UGC Post',
      caption: postCaption,
      mediaUrl: mediaUrl,
      mediaType: mediaType,
      status: 'processing',
      platforms: [...selectedPlatforms],
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      reach: 0
    };

    setPosts(prevPosts => [newPost, ...prevPosts]);
    setUploadSuccessAlert(true);

    // Reset upload form
    setPostTitle('');
    setPostCaption('');
    setCustomMediaUrl('');
    setMediaSource('sample');

    // Scroll to top of the content area
    const area = document.querySelector('.workspace');
    if (area) area.scrollTop = 0;

    // Call API
    const platforms = [...selectedPlatforms];
    void platforms.map(async (platform) => {
      try {
        await apiPublishPhoto({
          ig_user_id: conn.igBusinessId || '0',
          page_id: conn.page.id,
          page_access_token: conn.page.access_token,
          image_url: mediaUrl,
          caption: postCaption,
        });

        if (platform === 'instagram') {
          setPosts(prevPosts => prevPosts.map(p =>
            p.id === newPost.id ? { ...p, status: 'success', likes: Math.floor(Math.random() * 100) + 15, comments: Math.floor(Math.random() * 10) + 2, reach: Math.floor(Math.random() * 1500) + 200 } : p
          ));
        }
      } catch (err) {
        setPosts(prevPosts => prevPosts.map(p =>
          p.id === newPost.id ? {
            ...p,
            status: 'failed',
            errorMessage: err instanceof Error ? err.message : 'Publish failed'
          } : p
        ));
      }
    });

    // Simulasi Facebook success (API saat ini hanya IG)
    if (!platforms.includes('instagram')) {
      setPosts(prevPosts => prevPosts.map(p =>
        p.id === newPost.id ? { ...p, status: 'success' } : p
      ));
    }
  };

  // Clear success notification
  useEffect(() => {
    if (uploadSuccessAlert) {
      const timer = setTimeout(() => {
        setUploadSuccessAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [uploadSuccessAlert]);

  // Auth Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail && loginPassword) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Email dan password harus diisi!');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (regName && regEmail && regPassword) {
      setCurrentUser({
        id: `user_${Date.now()}`,
        name: regName,
        email: regEmail,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      });
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Semua field harus diisi!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Settings Save Handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      setSettingsAlert({ type: 'danger', message: 'Konfirmasi password baru tidak cocok!' });
      return;
    }

    setCurrentUser(prev => ({
      ...prev,
      name: settingsName,
      email: settingsEmail
    }));

    setSettingsAlert({ type: 'success', message: 'Profil berhasil diperbarui!' });
    setNewPassword('');
    setConfirmPassword('');

    setTimeout(() => {
      setSettingsAlert(null);
    }, 4000);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        authTab,
        setAuthTab,
        loginEmail,
        setLoginEmail,
        loginPassword,
        setLoginPassword,
        regName,
        setRegName,
        regEmail,
        setRegEmail,
        regPassword,
        setRegPassword,
        authError,
        setAuthError,
        currentUser,
        setCurrentUser,
        currentView,
        setCurrentView,
        selectedPage,
        setSelectedPage,
        pages,
        setPages,
        posts,
        setPosts,
        postTitle,
        setPostTitle,
        postCaption,
        setPostCaption,
        selectedMediaUrl,
        setSelectedMediaUrl,
        customMediaUrl,
        setCustomMediaUrl,
        selectedPlatforms,
        setSelectedPlatforms,
        mediaType,
        setMediaType,
        mediaSource,
        setMediaSource,
        uploadSuccessAlert,
        setUploadSuccessAlert,
        activePreviewTab,
        setActivePreviewTab,
        statusFilter,
        setStatusFilter,
        searchQuery,
        setSearchQuery,
        settingsName,
        setSettingsName,
        settingsEmail,
        setSettingsEmail,
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        settingsAlert,
        setSettingsAlert,
        handleToggleConnection,
        handlePublishPost,
        handleSaveSettings,
        handleLogin,
        handleRegister,
        handleLogout,
        getInitialPages
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
