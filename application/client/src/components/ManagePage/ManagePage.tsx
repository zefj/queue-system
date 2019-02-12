import React, { Component } from 'react';

import { Layout } from 'antd';
const { Content, Sider } = Layout;

import './ManagePage.css';
import { ManagePageMenu } from './ManagePageMenu';
import { Route, RouteComponentProps, withRouter } from 'react-router';
import { QueuesList } from '../QueuesPage/QueuesList';

type Props = RouteComponentProps;

class ManagePageComponent extends Component<Props> {
    render() {
        return (
            <Layout>
                <Sider width={200} style={{ background: '#fff' }}>
                    <ManagePageMenu />
                </Sider>
                <Layout style={{ padding: '24px 24px' }}>
                    <Content style={{
                        background: '#fff', padding: 24, margin: 0, minHeight: 280,
                    }}>
                        <Route path={'/manage/queues'} component={() => <QueuesList />}/>
                        <Route path={'/manage/rooms'} component={() => <div>rooms</div>}/>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

// tslint:disable-next-line:variable-name
export const ManagePage = withRouter(props => <ManagePageComponent {...props} />);
