import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MyRidesPage from './MyRidesPage';
import AllRidesPage from './AllRidesPage';

// Page principale du dashboard avec les onglets pour les trajets personnels et tous les trajets
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'my' | 'all'>('my');
  const navigate = useNavigate();
  const displayName = localStorage.getItem('capcovoit-displayName') || 'Utilisateur';

  useEffect(() => {
    const tabs = document.querySelectorAll('.tabs');
    if (tabs.length > 0) {
      // @ts-ignore
      M.Tabs.init(tabs);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('capcovoit-displayName');
    localStorage.removeItem('capcovoit-token');
    localStorage.removeItem('capcovoit-user');
    navigate('/');
  };

  return (
    <div>
      <nav className="nav-wrapper">
        <div className="container">
          <a href="#" className="brand-logo"><img src="../../assets/Capgemini_Primary-spade_Capgemini-white.png" alt="logo" className="photo" width="60" height="60"/>CapCovoit</a>
          <ul id="nav-mobile" className="right">
            <li><span>Bonjour {displayName}</span></li>
            <li><a onClick={logout} style={{ cursor: 'pointer' }}>Déconnexion</a></li>
          </ul>
        </div>
      </nav>

      <div className="container" style={{ marginTop: '20px' }}>
        <div className="row">
          <div className="col s12">
            <ul className="tabs">
              <li className="tab col s6">
                <a href="#my-rides" className={activeTab === 'my' ? 'active' : ''} onClick={() => setActiveTab('my')}>
                  Mes trajets
                </a>
              </li>
              <li className="tab col s6">
                <a href="#all-rides" className={activeTab === 'all' ? 'active' : ''} onClick={() => setActiveTab('all')}>
                  Tous les trajets
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="row">
          <div className="col s12">
            {activeTab === 'my' ? <MyRidesPage /> : <AllRidesPage />}
          </div>
        </div>
      </div>
    </div>
  );
}