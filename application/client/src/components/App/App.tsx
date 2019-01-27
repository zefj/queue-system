import React, { Component, ComponentClass } from 'react';
import { Route, NavLink, withRouter, RouteComponentProps } from 'react-router-dom';

import { Home } from '../Home/Home';

import { Layout, Menu } from 'antd';
const { Header } = Layout;

export const App = () => ( // tslint:disable-line:variable-name
    <>
        <Route exact path="/" component={withHeader(Home)}/>
        <Route exact path="/attend" component={withHeader(Home)}/>
        <Route exact path="/display" component={Home}/>
    </>
);

const withHeader = (Component: ComponentClass) => { // tslint:disable-line:variable-name
    return withRouter(props => <HeaderWrapper {...props} ><Component /></HeaderWrapper>);
}; // tslint:disable-line:variable-name

class HeaderWrapper extends Component<RouteComponentProps, {}> {
    render() {
        return (
            <Layout className="App">
                <Header className="header">
                    <div className="logo" />
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        selectedKeys={[`menu-item-${this.props.location.pathname}`]}
                        style={{ lineHeight: '64px' }}
                    >
                        <Menu.Item key="menu-item-/">
                            <NavLink to="/">Manage</NavLink>
                        </Menu.Item>
                        <Menu.Item key="menu-item-/attend">
                            <NavLink to="/attend">Attend</NavLink>
                        </Menu.Item>
                        <Menu.Item key="menu-item-/display">
                            <NavLink to="/display">Display</NavLink>
                        </Menu.Item>
                    </Menu>
                </Header>
                { this.props.children }
            </Layout>
        );
    }
}
