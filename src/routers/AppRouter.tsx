import React from 'react';
import {
  Route,
  Switch,
} from 'react-router';
import { Main } from '../sider/Main';
import { BrowserRouter } from 'react-router-dom';
import Side from '../sider/Side';

const AppRouter = () => {
  return (<BrowserRouter basename="/">
    <Side tittel="Sykefraværsoppfølging">
      <Switch>
        <Route component={Main} />
      </Switch>
    </Side>
  </BrowserRouter>);
};

export default AppRouter;
