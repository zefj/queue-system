import React, { Component } from 'react';

import { Icon, Menu } from 'antd';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

const { SubMenu } = Menu;

type Props = RouteComponentProps;

class ManagePageMenuComponent extends Component<Props> {
    render() {
        return (
            <Menu
                mode="inline"
                selectedKeys={[`menu-item-${this.props.location.pathname}`]}
                defaultOpenKeys={['sub1']}
                style={{ height: '100%', borderRight: 0 }}
            >
                <Menu.Item key={`menu-item-${'/manage/queues'}`}>
                    <Link to={'/manage/queues'}>
                        Queues
                    </Link>
                </Menu.Item>
                <Menu.Item key={`menu-item-${'/manage/rooms'}`}>
                    <Link to={'/manage/rooms'}>
                        Rooms
                    </Link>
                </Menu.Item>
                <Menu.Item key="3">Tickets</Menu.Item>
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
        );
    }
}

// tslint:disable-next-line:variable-name
export const ManagePageMenu = withRouter(props => <ManagePageMenuComponent {...props} />);
