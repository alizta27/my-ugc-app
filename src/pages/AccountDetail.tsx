import { useParams, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AccountDetailFB from './account/AccountDetailFB';
import AccountDetailIG from './account/AccountDetailIG';

export default function AccountDetail() {
  const { pages } = useApp();
  const { id } = useParams();

  const selectedPage = pages.find((p) => p.id === id);

  if (!selectedPage) {
    return <Navigate to="/connect" replace />;
  }

  if (selectedPage.platform === 'facebook') {
    return <AccountDetailFB page={selectedPage} />;
  } else if (selectedPage.platform === 'instagram') {
    return <AccountDetailIG page={selectedPage} />;
  }

  return (
    <div className="fade-in glass-card unsupported-platform">
      <h3>Platform tidak didukung</h3>
    </div>
  );
}
