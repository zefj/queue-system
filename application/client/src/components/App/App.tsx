import React, { Component, ComponentClass } from 'react';
import { Route, NavLink, withRouter, RouteComponentProps, Redirect } from 'react-router-dom';

import { ManagePage } from '../ManagePage/ManagePage';

import { Layout, Menu } from 'antd';
const { Header } = Layout;

export const App = () => ( // tslint:disable-line:variable-name
    <>
        <Route exact path="/" component={() => <Redirect to={'/manage'} />}/>
        <Route path="/manage" component={withHeader(ManagePage)}/>
        <Route path="/attend" component={withHeader(ManagePage)}/>
        <Route path="/display" component={ManagePage}/>
    </>
);

const withHeader = (Component: ComponentClass) => { // tslint:disable-line:variable-name
    return withRouter(props => <HeaderWrapper {...props} ><Component /></HeaderWrapper>);
};

class HeaderWrapper extends Component<RouteComponentProps, {}> {
    render() {
        return (
            <Layout className="App">
                <Header className="header">
                    <div className="logo" />
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        selectedKeys={[`menu-item-${this.props.match.url}`]}
                        style={{ lineHeight: '64px' }}
                    >
                        <Menu.Item key="menu-item-/manage">
                            <NavLink to="/manage">Manage</NavLink>
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
