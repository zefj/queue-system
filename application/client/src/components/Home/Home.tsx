import React, { Component } from 'react';

import { Layout, Menu, Icon } from 'antd';
const { SubMenu } = Menu;
const { Content, Sider } = Layout;

import './Home.css';

export class Home extends Component {
    render() {
        return (
            <Layout>
                <Sider width={200} style={{ background: '#fff' }}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        style={{ height: '100%', borderRight: 0 }}
                    >
                        <SubMenu key="sub1" title={<span><Icon type="user" />subnav 1</span>}>
                            <Menu.Item key="1">option1</Menu.Item>
                            <Menu.Item key="2">option2</Menu.Item>
                            <Menu.Item key="3">option3</Menu.Item>
                            <Menu.Item key="4">option4</Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub2" title={<span><Icon type="laptop" />Statistics</span>}>
                            <Menu.Item key="5">option5</Menu.Item>
                            <Menu.Item key="6">option6</Menu.Item>
                            <Menu.Item key="7">option7</Menu.Item>
                            <Menu.Item key="8">option8</Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub3" title={<span><Icon type="notification" />Settings</span>}>
                            <Menu.Item key="9">System</Menu.Item>
                            <Menu.Item key="10">Users</Menu.Item>
                            <Menu.Item key="10">Notifications</Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout style={{ padding: '24px 24px' }}>
                    <Content style={{
                        background: '#fff', padding: 24, margin: 0, minHeight: 280,
                    }}
                    >
                        Content
                    </Content>
                </Layout>
            </Layout>
        );
    }
}
