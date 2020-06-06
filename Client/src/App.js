import './App.scss';

import React, {lazy} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';


const Home = lazy(() =>
  import('./components/home')
);

const Battles = lazy(() =>
  import('./components/battles')
);

function App() {

  const pages = [
    {
      pageLink: '/',
      view: Home,
      displayName: 'Home',
    },
    {
      pageLink: '/battles/:battleLocation',
      view: Battles,
      displayName: 'Battles',
    },
  ];

  return (
    <div className="App">

      <Router>
        <Route
          render={({location}) => (
            <React.Fragment>
              <Switch location={location}>
                {pages.map((page, index) => {
                  return (
                    <Route
                      exact
                      path={page.pageLink}
                      render={({match}) => (
                        <page.view key={match.params.battleLocation || index} />
                      )}
                      key={index}
                    />
                  );
                })}
                <Redirect to="/" />
              </Switch>
            </React.Fragment>
          )}
        />
      </Router>
    </div>
  );
}



export default App;
