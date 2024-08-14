import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Platforms from './components/Platforms';
import TrackingTool from './components/TrackingTool';
import CodFolioCard from './components/CodFolioCard';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import 'boxicons/css/boxicons.min.css';

function LandingPage() {
  return (
    <div className="font-sans text-gray-800 leading-relaxed">
      <Header />
      <Hero />
      <Platforms />
      <TrackingTool />
      <CodFolioCard />
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default LandingPage;


// import React from 'react'
// import LoginButton from '../auth/login'
// import { useAuth0 } from '@auth0/auth0-react';
// import { Link } from 'react-router-dom';
// import Dashboard from '../dashboard/Dashboard';

// function LandingPage() {
//   const { loginWithRedirect,user,isAuthenticated,logout } = useAuth0();
//   return (
//     <div>
//       LandingPage<br/> 
//       {
//         isAuthenticated ? (
//           <>
//             <Link to='/dashboard'>
//               <button className='mr-4' onClick={()=><Dashboard />}>
//                 Dashboard 
//               </button>
//             </Link>
//           </>
//         ):(
//           <>
//           </>
//         )
//       }

//       <LoginButton />
//     </div>
//   )
// }

// export default LandingPage