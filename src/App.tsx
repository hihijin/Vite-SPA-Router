import { About } from './pages/About';
import { Root } from './pages/Root';
import { Route } from './router/Route';
import { Router } from './router/Router';

export default function App() {
  return (
    <Router>
      <Route path="/" component={<Root />} />
      <Route path="/about" component={<About />} />
    </Router>
  );
}
