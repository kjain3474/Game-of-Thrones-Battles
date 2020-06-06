import Search from './search';

import React from 'react';
import {Helmet} from 'react-helmet';


function Home(props) {
  return (
    <React.Fragment>
      {(
        <div className="Home">
          <Helmet>
            <title>G.O.T Battles</title>
          </Helmet>

          <div className="home-left">
            <div className="header">
              <Search />
            </div>
          </div>


        </div>
      )}
    </React.Fragment>
  );
}

export default Home;
