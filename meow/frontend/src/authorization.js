import React from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";

// Authorization HOC
// Courtesy of Ricardo Fearing
// https://medium.com/@ricardo_42589/this-is-awesome-470fe9bb6f56
export default function Authorization(ProtectedComponent) {
  class AuthorizedComponent extends React.Component {
    componentWillMount() {
      this.checkAuth(this.props.isAuthenticated);
    }

    componentWillReceiveProps(nextProps) {
      this.checkAuth(nextProps.isAuthenticated);
    }

    checkAuth(isAuthenticated) {
      if (!isAuthenticated) {
        const redirectAfterLogin = this.props.location.pathname;
        this.props.history.push(`/login?next=${redirectAfterLogin}`);
      }
    }

    render() {
      return this.props.isAuthenticated === true ? (
        <ProtectedComponent {...this.props} />
      ) : (
        <h1>Ur dont go here...</h1>
      );
    }
  }

  const mapStateToProps = state => ({
    isAuthenticated: state.default.user.isAuthenticated
  });

  return withRouter(connect(mapStateToProps)(AuthorizedComponent));
}

// export const Any = Authorization(["any", "editor", "upper"]);
// When defining a route, it should be like this:
// <Route level="any" component={Home} />
// <Route level="editor" component={}
