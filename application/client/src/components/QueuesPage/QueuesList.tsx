import React, { Component } from 'react';

import * as _ from 'lodash';

import { Button, Empty, Skeleton, Table, Divider, Row, Col } from 'antd';

import { connect } from 'react-redux';
import { createQueue, fetchQueues, removeQueue } from '../../actions/queues';
import { RootState } from '../../reducers/root';
import { IQueueWithStats } from '../../actions/types';
import { getQueues } from '../../reducers/queues';
import { getActionStatus } from '../../reducers/status';
import { StatusActionPayload, StatusActionTypes } from '../../actions/status';

import { ServerErrorEmpty } from '../ErrorComponents/ServerErrorEmpty';
import { ButtonRow } from '../ButtonRow/ButtonRow';

import { NewQueueFormFields, NewQueueForm } from './NewQueueForm';

type Props = {
    queues: IQueueWithStats[] | null,
    fetchQueues: () => {},
    createQueue: (fields: NewQueueFormFields) => Promise<any>,
    removeQueue: (queue: IQueueWithStats) => Promise<any>,
    fetchStatus: StatusActionPayload,
    removeStatus: StatusActionPayload,
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
        if (this.props.fetchStatus.status === 'failed') {
            return (
                <ServerErrorEmpty />
            );
        }

        if (this.props.fetchStatus.status === 'started' && this.props.queues === null) {
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

        // TODO: animate row deletion and addition
        return (
            <Table
                dataSource={this.props.queues as IQueueWithStats[]}
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
                    title="Rooms"
                    dataIndex="rooms_count"
                    key="rooms_count"
                />
                <Table.Column
                    title="Tickets"
                    dataIndex="tickets_count"
                    key="tickets_count"
                />
                <Table.Column
                    align="right"
                    key="action"
                    render={(queue: IQueueWithStats) => {
                        const { status, additional } = this.props.removeStatus;

                        return (
                            <ButtonRow>
                                <Button
                                    type="primary"
                                    htmlType="button"
                                    icon="delete"
                                    onClick={() => {}}
                                >
                                    Details
                                </Button>
                                <Button
                                    htmlType="button"
                                    icon="delete"
                                    // TODO: confirm
                                    loading={(status === 'started' && _.get(additional, 'id') === queue.id)}
                                    onClick={() => this.props.removeQueue(queue)}
                                >
                                    Delete
                                </Button>
                            </ButtonRow>
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
    queues: getQueues(state),
    fetchStatus: getActionStatus(state, StatusActionTypes.FETCH_QUEUES),
    removeStatus: getActionStatus(state, StatusActionTypes.REMOVE_QUEUE),
});

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
    fetchQueues: () => dispatch(fetchQueues()),
    createQueue: (fields: NewQueueFormFields) => dispatch(createQueue(fields.name)),
    removeQueue: (queue: IQueueWithStats) => dispatch(removeQueue(queue)),
});

// tslint:disable-next-line:variable-name
export const QueuesList = connect(
    mapStateToProps,
    mapDispatchToProps,
)(QueuesListComponent);
