import React, { Component } from 'react';

import * as _ from 'lodash';

import { Button, Empty, Skeleton, Table, Divider, Row, Col } from 'antd';

import { connect } from 'react-redux';
import { createQueue, fetchQueues } from '../../actions/queues';
import { RootState } from '../../reducers/root';
import { QueueInterface } from '../../actions/types';
import { getQueues } from '../../reducers/queues';
import { getActionStatus } from '../../reducers/status';
import { StatusActionPayload, StatusActionTypes } from '../../actions/status';

import { ServerErrorEmpty } from '../ErrorComponents/ServerErrorEmpty';

import { NewQueueFormFields, NewQueueForm } from './NewQueueForm';
import { Promise } from 'q';

type Props = {
    queues: QueueInterface[] | undefined,
    fetchQueues: () => {},
    createQueue: (fields: NewQueueFormFields) => Promise<any>,
    fetchStatus: StatusActionPayload,
};

type State = {
    new_form: boolean,
};

class QueuesListComponent extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { new_form: false } as State;

        this.handleNewQueueClick = this.handleNewQueueClick.bind(this);
    }

    componentDidMount() {
        this.props.fetchQueues();
    }

    handleNewQueueClick() {
        this.setState({ new_form: !this.state.new_form });
    }

    getContent() {
        if (this.props.fetchStatus.status === 'errored') {
            return (
                <ServerErrorEmpty />
            );
        }

        if (this.props.fetchStatus.status === 'started' || this.props.queues === null) {
            return (
                <Skeleton active/>
            );
        }

        if (_.isEmpty(this.props.queues)) {
            return (
                <Empty description="No queues yet">
                    <Button htmlType="button" type="primary">Create now</Button>
                </Empty>
            );
        }

        return (
            <Table
                dataSource={this.props.queues}
                pagination={{ pageSize: 10 }}
            >
                <Table.Column
                    title="Name"
                    dataIndex="name"
                    key="name"
                />
                <Table.Column
                    title="Created at"
                    dataIndex="created_at"
                    key="created_at"
                />
                <Table.Column
                    align="right"
                    key="action"
                    render={(queue: QueueInterface) => {
                        return (
                            <span>
                                <Button htmlType="button">Delete</Button>
                            </span>
                        );
                    }}
                />
            </Table>
        );
    }

    render() {
        return (
            <div>
                <Row>
                    <Col span={22}>
                        <Divider orientation="left" style={{ marginTop: 0 }}>Queues</Divider>
                    </Col>
                    <Col span={2} style={{ textAlign: 'right' }}>
                        <Button
                            type="primary"
                            htmlType="button"
                            style={{ marginBottom: 16 }}
                            onClick={this.handleNewQueueClick}
                        >
                            New queue
                        </Button>
                    </Col>
                </Row>

                {
                    this.state.new_form &&
                        <NewQueueForm
                            onSubmit={(fields: NewQueueFormFields) => {
                                this.props.createQueue(fields).then(() => this.setState({ new_form: false }));
                            }}
                        />
                }

                { this.getContent() }
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    queues: getQueues(state) as QueueInterface[] || null,
    fetchStatus: getActionStatus(state, StatusActionTypes.FETCH_QUEUES),
});

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
    fetchQueues: () => dispatch(fetchQueues()),
    createQueue: (fields: NewQueueFormFields) => dispatch(createQueue(fields.name)),
});

// tslint:disable-next-line:variable-name
export const QueuesList = connect(
    mapStateToProps,
    mapDispatchToProps,
)(QueuesListComponent);
