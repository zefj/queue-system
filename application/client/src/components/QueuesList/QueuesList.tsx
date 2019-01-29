import React, { Component } from 'react';

import * as _ from 'lodash';

import { Button, Empty, List, Skeleton } from 'antd';
import { connect } from 'react-redux';
import { fetchQueues } from '../../actions/queues';
import { RootState } from '../../reducers/root';
import { QueueInterface } from '../../actions/types';
import { getQueues } from '../../reducers/queues';
import { inProgress } from '../../reducers/status';
import { StatusActionTypes } from '../../actions/status';

type Props = {
    queues: QueueInterface[] | null,
    fetchQueues: () => {},
    isFetching: boolean,
};

class QueuesListComponent extends Component<Props> {
    componentDidMount() {
        this.props.fetchQueues();
    }

    renderListItem(queue: QueueInterface) {
        return (
            <List.Item>{queue.name}</List.Item>
        );
    }

    render() {
        if (this.props.isFetching || this.props.queues === null) {
            return (
                <Skeleton active />
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
            <div>
                <h3 style={{ marginBottom: 16 }}>Default Size</h3>
                <List
                    bordered
                    dataSource={this.props.queues}
                    renderItem={(queue: QueueInterface) => this.renderListItem(queue)}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    queues: getQueues(state),
    isFetching: inProgress(state, StatusActionTypes.FETCH_QUEUES),
});

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
    fetchQueues: () => dispatch(fetchQueues()),
});

// tslint:disable-next-line:variable-name
export const QueuesList = connect(
    mapStateToProps,
    mapDispatchToProps,
)(QueuesListComponent);
