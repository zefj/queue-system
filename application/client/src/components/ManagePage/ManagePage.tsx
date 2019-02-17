import React, { Component } from 'react';

import { Layout } from 'antd';
const { Content, Sider } = Layout;

import './ManagePage.css';
import { ManagePageMenu } from './ManagePageMenu';
import { Route, RouteComponentProps, withRouter } from 'react-router';
import { QueuesList } from '../QueuesPage/QueuesList';
import { QueueDetails } from '../QueueDetails/QueueDetails';

type Props = RouteComponentProps;

type QueueDetailsMatchParams = {
    id: string;
};

class ManagePageComponent extends Component<Props> {
    render() {
        return (
            <Layout>
                <Sider width={200} style={{ background: '#fff' }}>
                    <ManagePageMenu />
                </Sider>
                <Layout style={{ padding: '24px 24px' }}>
                    <Content
                        style={{
                            padding: '20px 100px',
                            margin: 0,
                            minHeight: 280,
                        }}
                    >
                        <Route path={'/manage/queues'} component={() => <QueuesList />}/>
                        <Route
                            path="/manage/queue/:id"
                            component={
                                (props: RouteComponentProps<QueueDetailsMatchParams>) =>
                                    <QueueDetails id={parseInt(props.match.params.id, 10)} />
                            }
                        />
                        <Route path={'/manage/rooms'} component={() => <div>rooms</div>}/>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

// tslint:disable-next-line:variable-name
export const ManagePage = withRouter(props => <ManagePageComponent {...props} />);
