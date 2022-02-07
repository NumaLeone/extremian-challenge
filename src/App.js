import './App.css';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/screens/home/home';

function App() {
  return (
    <Router>
      <Switch>
        <Route path={'/home'} component={Home} />
        <Route path={'/'} component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
