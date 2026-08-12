import { Route, Switch } from 'wouter';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { GamePage } from './pages/GamePage';

// Здесь живут только маршруты. Сами экраны складывай в src/pages/.
export default function App() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/game/hard"><GamePage mode="hard" /></Route>
      <Route path="/game/pve"><GamePage mode="pve" /></Route>
      <Route path="/game"><GamePage /></Route>
      <Route component={NotFoundPage} />
    </Switch>
  );
}
