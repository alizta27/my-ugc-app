import type { ConnectedPage, UploadLog, ChartDataPoint } from './types';

export const initialPages: ConnectedPage[] = [];

export const initialPosts: UploadLog[] = [
  {
    id: 'post_1',
    title: 'Setup Showcase June 2026',
    caption: 'My updated workspace setup is finally complete! Rocking a minimalist clean white theme. What do you think about the ambient lighting? 💡✨\n\n#desksetup #workspace #minimalist #gamingsetup #techgear',
    mediaUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    status: 'success',
    platforms: ['facebook', 'instagram'],
    createdAt: '2026-06-08T09:15:00Z',
    likes: 342,
    comments: 45,
    reach: 5890
  },
  {
    id: 'post_2',
    title: 'Product Review: mechanical keyboard',
    caption: 'Hands-on review of the latest custom mechanical keyboard. The keystroke sound is purely therapeutic! Sound test inside the video. ⌨️🎙️\n\n#keyboard #customkeyboard #cozyvibes #satisfying',
    mediaUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    status: 'success',
    platforms: ['instagram'],
    createdAt: '2026-06-07T14:20:00Z',
    likes: 512,
    comments: 89,
    reach: 9400
  },
  {
    id: 'post_3',
    title: 'Tips Coding untuk Pemula',
    caption: 'Berikut 3 tips penting buat kalian yang baru mau belajar programming di tahun 2026:\n1. Konsistensi > Durasi\n2. Bangun project nyata\n3. Jangan takut error!\n\nSemangat belajarnya! 💻🚀\n\n#codingtips #developer #javascript #webdev',
    mediaUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    status: 'processing',
    platforms: ['facebook', 'instagram'],
    createdAt: '2026-06-09T04:10:00Z',
    likes: 0,
    comments: 0,
    reach: 0
  },
  {
    id: 'post_4',
    title: 'Promo Flash Sale 6.6',
    caption: 'Dapatkan diskon hingga 50% untuk produk aksesoris meja kerja Anda. Promo hanya berlaku hari ini sampai jam 12 malam! Link di bio. 🛒🔥\n\n#flashsale #workspacedesign #deskinspiration',
    mediaUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    status: 'failed',
    platforms: ['facebook'],
    createdAt: '2026-06-06T03:00:00Z',
    likes: 0,
    comments: 0,
    reach: 0,
    errorMessage: 'Facebook Page Token Expired. Please reconnect your page account.'
  }
];

export const mockSampleMedia = [
  {
    id: 'media_1',
    name: 'Minimalist Desk Setup',
    url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80',
    type: 'image'
  },
  {
    id: 'media_2',
    name: 'Mechanical Keyboard Closeup',
    url: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80',
    type: 'image'
  },
  {
    id: 'media_3',
    name: 'Coding Laptop & Coffee',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
    type: 'image'
  },
  {
    id: 'media_4',
    name: 'Cozy Cafe Workstation',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
    type: 'image'
  },
  {
    id: 'media_5',
    name: 'RGB Gaming Desktop',
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    type: 'image'
  }
];

export const mockAnalyticsHistory: ChartDataPoint[] = [
  { label: '01 Jun', facebook: 120, instagram: 180 },
  { label: '02 Jun', facebook: 150, instagram: 220 },
  { label: '03 Jun', facebook: 190, instagram: 210 },
  { label: '04 Jun', facebook: 240, instagram: 350 },
  { label: '05 Jun', facebook: 220, instagram: 410 },
  { label: '06 Jun', facebook: 310, instagram: 480 },
  { label: '07 Jun', facebook: 420, instagram: 560 },
  { label: '08 Jun', facebook: 380, instagram: 640 },
  { label: '09 Jun', facebook: 490, instagram: 720 },
];
