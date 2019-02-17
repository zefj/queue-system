import React, { Component } from 'react';

import { Col, Row } from 'antd';
import { PageHeader } from '../PageHeader/PageHeader';

import RoomsList from './RoomsList';
import QueueInfo from './QueueInfo';

import { Block } from '../Block/Block';
import { IQueueWithRooms } from '../../actions/types';
import { StatusActionPayload, StatusActionTypes } from '../../actions/status-actions';
import { RootState } from '../../reducers/root-reducer';
import { getQueue } from '../../reducers/queues-reducer';
import { getActionStatus } from '../../reducers/status-reducer';
import { fetchQueue } from '../../actions/queues-actions';
import { connect } from 'react-redux';
import { ServerErrorEmpty } from '../ErrorComponents/ServerErrorEmpty';

class QueueDetails extends Component<Props> {
    componentDidMount() {
        this.props.fetchQueue(this.props.id);
    }

    render() {
        if (this.props.fetchQueueStatus.status === 'failed') {
            return (
                <ServerErrorEmpty />
            );
        }

        return (
            <>
                <PageHeader title={`Queue ${this.props.id}`} />
                <Row gutter={32} type="flex" justify="space-around">
                    <Col lg={8} sm={24}>
                        <Block>
                            <QueueInfo id={this.props.id} />
                        </Block>
                    </Col>
                    <Col lg={8} sm={24}>
                        <Block>
                            <RoomsList queueId={this.props.id} />
                        </Block>
                    </Col>
                    <Col lg={8} sm={24}>
                        <Block>
                            Check the statistax
                        </Block>
                    </Col>
                </Row>
            </>
        );
    }
}

interface StateProps {
    queue: IQueueWithRooms | undefined;
    fetchQueueStatus: StatusActionPayload;
}

interface DispatchProps {
    fetchQueue: (queueId: number) => Promise<any>;
}

export interface OwnProps {
    id: number;
}

type Props = StateProps & DispatchProps & OwnProps;

interface State {}

const mapStateToProps = (state: RootState, ownProps: OwnProps): StateProps => ({
    queue: getQueue(ownProps.id, state),
    fetchQueueStatus: getActionStatus(state, StatusActionTypes.FETCH_QUEUE),
});

const mapDispatchToProps = (dispatch: ThunkDispatch): DispatchProps => ({
    fetchQueue: (id: number) => dispatch(fetchQueue(id)),
});

export default connect<StateProps, DispatchProps, OwnProps, RootState>(
    mapStateToProps,
    mapDispatchToProps,
)(QueueDetails);
