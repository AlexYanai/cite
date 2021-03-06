// @flow
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import Home from '../Home';
import Profile from '../Profile';
import Post from '../Post';
import Posts from '../Posts';
import Favorites from '../Favorites';
import Login from '../Login';
import NotFound from '../../components/NotFound';
import Signup from '../Signup';
import { authenticate, unauthenticate } from '../../actions/session';
import MatchAuthenticated from '../../components/MatchAuthenticated';
import RedirectAuthenticated from '../../components/RedirectAuthenticated';
import { Post as Cite } from '../../types';

type Props = {
  authenticate: () => void,
  unauthenticate: () => void,
  isAuthenticated: boolean,
  willAuthenticate: boolean,
  post: Cite
};

class App extends Component {
  componentDidMount() {
    const token = localStorage.getItem('token');

    if (token) {
      this.props.authenticate();
    } else {
      this.props.unauthenticate();
    }
  }

  props: Props;

  render() {
    const { isAuthenticated, willAuthenticate } = this.props;
    const authProps = { isAuthenticated, willAuthenticate };

    return (
      <Router>
        <div style={{ display: 'flex', flex: '1', paddingTop: '4rem', }}>
          <Switch>
            <MatchAuthenticated exact path="/" component={Home} {...authProps} />
            <MatchAuthenticated path="/profile/:id" component={Profile} {...authProps} />
            <MatchAuthenticated path="/posts" component={Posts} {...authProps} />
            <MatchAuthenticated path="/favorites" component={Favorites} {...authProps} />
            <MatchAuthenticated path="/users/:id/posts/:post_id" component={Post} {...authProps} />
            <RedirectAuthenticated path="/login" component={Login} {...authProps} />
            <RedirectAuthenticated path="/signup" component={Signup} {...authProps} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default connect(
  state => ({
    isAuthenticated: state.session.isAuthenticated,
    willAuthenticate: state.session.willAuthenticate
  }),
  { authenticate, unauthenticate }
)(App);