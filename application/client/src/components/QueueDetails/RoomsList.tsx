import React, { Component } from 'react';
import { connect } from 'react-redux';

import { RootState } from '../../reducers/root-reducer';

import { Avatar, Button, Empty, List, Skeleton } from 'antd';
import { fetchRoomsForQueue } from '../../actions/rooms-actions';
import { getQueueRooms } from '../../reducers/rooms-reducer';
import { getActionStatus } from '../../reducers/status-reducer';
import { StatusActionPayload, StatusActionTypes } from '../../actions/status-actions';
import { IRoom } from '../../actions/types';
import * as _ from 'lodash';
import { ServerErrorEmpty } from '../ErrorComponents/ServerErrorEmpty';

class RoomsList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchQueueRooms(this.props.queueId);
    }

    renderListItem(room: IRoom) {
        return (
            <List.Item
                actions={[
                    <a>edit</a>, <a>more</a>
                ]}
            >
                <List.Item.Meta
                    avatar={<Avatar size="small" icon="desktop" />}
                    title={room.name}
                />
            </List.Item>
        );
    }

    renderAddNewItem() {
        return (
            <List.Item
                actions={[
                    <a>save</a>
                ]}
            >
                <List.Item.Meta
                    avatar={<Avatar size="small" icon="desktop" />}
                    title={'Add new'}
                />
            </List.Item>
        );
    }

    render() {
        if (this.props.roomFetchStatus.status === 'failed') {
            return (
                <ServerErrorEmpty />
            );
        }

        if (this.props.roomFetchStatus.status === 'started') {
            return (
                <Skeleton active />
            );
        }

        if (_.isEmpty(this.props.rooms)) {
            return (
                <Empty description="No rooms yet">
                    <Button htmlType="button" type="primary">Create now</Button>
                </Empty>
            );
        }

        return (
            <List
                itemLayout="horizontal"
                dataSource={this.props.rooms}
                header={`There is ${(this.props.rooms as []).length} room assigned to this queue:`}
                renderItem={this.renderListItem}
            >
                {this.renderAddNewItem()}
            </List>
        );
    }
}

interface StateProps {
    rooms: IRoom[] | null;
    roomFetchStatus: StatusActionPayload;
}

interface DispatchProps {
    fetchQueueRooms: (queueId: number) => Promise<any>;
}

export interface OwnProps {
    queueId: number;
}

type Props = StateProps & DispatchProps & OwnProps;

interface State {}

const mapStateToProps = (state: RootState, ownProps: OwnProps): StateProps => ({
    rooms: getQueueRooms(state),
    roomFetchStatus: getActionStatus(state, StatusActionTypes.FETCH_QUEUE_ROOMS),
});

const mapDispatchToProps = (dispatch: ThunkDispatch): DispatchProps => ({
    fetchQueueRooms: (queueId: number) => dispatch(fetchRoomsForQueue(queueId)),
});

export default connect<StateProps, DispatchProps, OwnProps, RootState>(
    mapStateToProps,
    mapDispatchToProps,
)(RoomsList);
