import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Index from './containers/Index/';


export default class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/:type?/:params?" component={Index} />
      </Switch>
    );
  }
}
