import React from "react";
import { getMe } from "../api";

// Authorization HOC
// Courtesy of Ricardo Fearing
// https://medium.com/@ricardo_42589/this-is-awesome-470fe9bb6f56
export const RoleAuth = allowedRole => (WrappedComponent, FallbackComponent = null) => {
  return class AuthorizedComponent extends React.PureComponent {
    state = { groups: [] };

    componentDidMount() {
      getMe().then(res => {
        this.setState({ groups: res.data.groups });
      });
    }

    render() {
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

// export const Any = Authorization(["any", "editor", "upper"]);
// When defining a route, it should be like this:
// <Route level="any" component={Home} />
// <Route level="editor" component={}
