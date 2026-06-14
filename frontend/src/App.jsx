import Layout from './components/Layout.jsx';
import About from './pages/About.jsx';
import Admin from './pages/Admin.jsx';
import Contact from './pages/Contact.jsx';
import Home from './pages/Home.jsx';
import Projects from './pages/Projects.jsx';
import Services from './pages/Services.jsx';

const routes = {
  '/': Home,
  '/projects': Projects,
  '/services': Services,
  '/about': About,
  '/contact': Contact,
  '/admin': Admin,
};

function getPageFromPath(pathname) {
  const normalized = pathname.replace(/\/$/, '') || '/';
  return routes[normalized.toLowerCase()] || Home;
}

export default function App() {
  const Page = getPageFromPath(window.location.pathname);

  return (
    <Layout>
      <Page />
    </Layout>
  );
}
