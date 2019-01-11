import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Index from './containers/Index/';
import Detail from './containers/Detail/';


export default class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/movie/:id" component={Detail} />
        <Route path="/:type?/:params?" component={Index} />
      </Switch>
    );
  }
}
