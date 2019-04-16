import React from "react";
import { getMe } from "../api";
import { withRouter } from "react-router";

// Authorization HOC
// Courtesy of Ricardo Fearing
// https://medium.com/@ricardo_42589/this-is-awesome-470fe9bb6f56
export const RoleAuth = allowedRole => (
  WrappedComponent,
  FallbackComponent = null,
  in_group = []
) => {
  return class AuthorizedComponent extends React.PureComponent {
    state = { groups: in_group };

    componentDidMount() {
      if (in_group.length === 0)
        getMe().then(res => {
          this.setState({ groups: res.data.groups });
        });
    }
    render() {
      console.log(this.state);
      if (this.state.groups.some(x => x.name === allowedRole)) {
        return <WrappedComponent {...this.props} />;
      } else {
        return FallbackComponent ? <FallbackComponent {...this.props} /> : null;
      }
    }
  };
};

export const RoleAuthJSXLiteral = allowedRole => Literal => {
  return class AuthorizedComponent extends React.PureComponent {
    state = { groups: [] };

    componentDidMount() {
      getMe().then(res => {
        this.setState({ groups: res.data.groups });
      });
    }

    render() {
      if (this.state.groups.some(x => x.name === allowedRole)) {
        return React.createElement(Literal);
      } else {
        return false;
      }
    }
  };
};

export const RoleAuthRoute = allowedRole => (WrappedComponent, FallbackComponent = null) => {
  const AuthComp = class AuthorizedComponent extends React.PureComponent {
    state = { groups: [] };

    isAllowedRole = roles => {
      return roles.some(x => x.name === allowedRole);
    };

    componentDidMount() {
      getMe().then(res => {
        const { groups } = res.data;

        if (!this.isAllowedRole(groups)) {
          const redirectAfterLogin = this.props.location.pathname;
          this.props.history.push(`/login?next=${redirectAfterLogin}`);
        }
        this.setState({ groups });
      });
    }
    render() {
      if (this.isAllowedRole(this.state.groups)) {
        return <WrappedComponent {...this.props} />;
      } else {
        return FallbackComponent ? <FallbackComponent {...this.props} /> : null;
      }
    }
  };
  return withRouter(AuthComp);
};

// export const Any = Authorization(["any", "editor", "upper"]);
// When defining a route, it should be like this:
// <Route level="any" component={Home} />
// <Route level="editor" component={}
