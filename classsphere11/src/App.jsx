import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'  
import Hero from './components/Hero'  
import IntroAI from './components/IntroAI'
import ISS from './components/ISS'
import CommandCenter from './components/CommandCenter'  
import EcosystemHub from './components/EcosystemHub'
import FinalClosure from './components/FinalClosure'
import InsightsEngine from './components/InsightsEngine'
import GuardianPortal from './components/GuardianPortal'
import GlobalFooter from './components/GlobalFooter'
import About from './pages/About'
import Services from './pages/Services'
import Contact from './pages/Contact'
import ScrollToTop from './components/ScrollToTop'
import ClassSphereAI from './pages/ClassSphereAI'
import ClassSpherePlus from './pages/ClassSpherePlus'
import AddOns from './pages/AddOns'
import NotebookLM from './pages/NotebookLM'
import Gems from './pages/Gems'
import Architecture from './pages/Architecture'
import Access from './pages/Access'
import Demo from './pages/Demo'
import Insights from './pages/Insights'
import Portals from './pages/Portals'
import Security from './pages/Security'
import Compliance from './pages/Compliance'
import Privacy from './pages/Privacy'
import Encryption from './pages/Encryption'
import Pilot from './pages/Pilot'
import Sales from './pages/Sales'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import RoleSelection from './pages/RoleSelection'
import Dashboard from './dashboard/Dashboard'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'

import GlobalAlertModal from './components/GlobalAlertModal'

const LandingRedirect = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const AppContent = () => {
  const location = useLocation();
  const hideNavAndFooter = ['/dashboard', '/login', '/signup', '/select-role'].includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      {!hideNavAndFooter && <Navbar />}
      <Routes>
        <Route path="/" element={
          <LandingRedirect>
            <>
              <Hero />
              <IntroAI />
              <ISS />
              <CommandCenter />
              <EcosystemHub />
              <InsightsEngine />
              <GuardianPortal />
              <FinalClosure />
            </>
          </LandingRedirect>
        } />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/ai" element={<ClassSphereAI />} />
        <Route path="/plus" element={<ClassSpherePlus />} />
        <Route path="/addons" element={<AddOns />} />
        <Route path="/notebooklm" element={<NotebookLM />} />
        <Route path="/gems" element={<Gems />} />
        <Route path="/architecture" element={<Architecture />} />
        <Route path="/access" element={<Access />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/portals" element={<Portals />} />
        <Route path="/security" element={<Security />} />
        <Route path="/compliance" element={<Compliance />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/encryption" element={<Encryption />} />
        <Route path="/pilot" element={<Pilot />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/login" element={<LandingRedirect><Login /></LandingRedirect>} />
        <Route path="/signup" element={<LandingRedirect><SignUp /></LandingRedirect>} />
        <Route path="/select-role" element={<RoleSelection />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
      {!hideNavAndFooter && <GlobalFooter />}
    </>
  );
}

const App = () => {
  return (
    <div>
      <Router>
        <AppContent />
      </Router>
      <GlobalAlertModal />
    </div>
  )
}

export default App
