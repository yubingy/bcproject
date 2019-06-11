import App from './App';
import Account from './pages/Account';
import Create from './pages/Create';
import CreateCertification from './pages/CreateCertification';
import View from './pages/View';
import MyProducts from './pages/MyProducts';
import Update from './pages/Update';
import NotFound from './pages/NotFound';
import Search from './components/Search';

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


const Routes = () => (
  <Router>
    <App>
      <Switch>
        <Route exact path="/" component={MyProducts} />
        <Route exact path="/search" component={Search} />
        <Route exact path="/account" component={Account} />
        <Route exact path="/create" component={Create} />
        <Route exact path="/CreateCertification" component={CreateCertification} />
        <Route exact path="/products/:productId" component={View} />
        <Route exact path="/products/:productId/versions/:versionId" component={View} />
        <Route exact path="/products/:productId/update" component={Update} />
        <Route path="*" component={NotFound} />
      </Switch>
    </App>
  </Router>
);

export default Routes;
