import React, { Component, ReactNode, Ref, RefObject } from 'react';
import { connect } from 'react-redux';

import { RootState } from '../../reducers/root-reducer';

import { Avatar, Button, Empty, Input, List, Skeleton } from 'antd';
import { createRoom } from '../../actions/rooms-actions';
import { getQueueRooms } from '../../reducers/queues-reducer';
import { getActionStatus } from '../../reducers/status-reducer';
import { StatusActionPayload, StatusActionTypes } from '../../actions/status-actions';
import { IRoom } from '../../actions/types';
import * as _ from 'lodash';
import { ServerErrorEmpty } from '../ErrorComponents/ServerErrorEmpty';

import Search from 'antd/es/input/Search';
import RoomQuickAddForm from './RoomQuickAddForm';

class RoomsList extends Component<Props, State> {
    private addRoomInput: Search | null;

    constructor(props: Props) {
        super(props);
        this.state = { show_add_room_form: false };

        this.addRoomInput = null;
    }

    componentDidUpdate() {
        this.addRoomInput && this.addRoomInput.focus();
    }

    showNewRoomForm = () => {
        this.setState({ show_add_room_form: true });
    }

    hideNewRoomForm = () => {
        this.setState({ show_add_room_form: false });
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
        let content = null;
        let actions: ReactNode[] = [];

        if (this.state.show_add_room_form) {
            content = (
                <List.Item.Meta
                    title={
                        <RoomQuickAddForm
                            queueId={this.props.queueId}
                            onSuccess={this.hideNewRoomForm}
                        />
                    }
                />
            );
        } else {
            content = (
                    <List.Item.Meta
                        avatar={<Avatar style={{ background: 'white', color: 'initial' }} size="small" icon="plus" />}
                        title={'New room'}
                    />
            );

            actions = [
                <a key="create-room-cta">create</a>,
            ];
        }

        return (
            <div
                role={
                    !this.state.show_add_room_form ? 'button' : undefined
                }
                onClick={this.showNewRoomForm}
            >
                <List.Item actions={actions}>
                    {content}
                </List.Item>
            </div>
        );
    }

    renderList() {
        return (
            <List
                itemLayout="horizontal"
                dataSource={this.props.rooms}
                header={<b>Rooms</b>}
                renderItem={this.renderListItem}
            >
                {this.renderAddNewItem()}
            </List>
        );
    }

    render() {
        if (_.isEmpty(this.props.rooms) && this.props.fetchQueueStatus.status === 'started') {
            return (
                <Skeleton active />
            );
        }

        if (_.isEmpty(this.props.rooms) && !this.state.show_add_room_form) {
            return (
                <Empty description="No rooms yet">
                    <Button
                        htmlType="button"
                        type="primary"
                        onClick={this.showNewRoomForm}
                    >
                        Create now
                    </Button>
                </Empty>
            );
        }

        return this.renderList();
    }
}

interface StateProps {
    rooms: IRoom[] | null;
    fetchQueueStatus: StatusActionPayload;
}

interface DispatchProps {
    createRoom: (name: string) => Promise<any>;
}

export interface OwnProps {
    queueId: number;
}

type Props = StateProps & DispatchProps & OwnProps;

interface State {
    show_add_room_form: boolean;
}

const mapStateToProps = (state: RootState, ownProps: OwnProps): StateProps => ({
    rooms: getQueueRooms(ownProps.queueId, state),
    fetchQueueStatus: getActionStatus(state, StatusActionTypes.FETCH_QUEUE),
});

const mapDispatchToProps = (dispatch: ThunkDispatch, ownProps: OwnProps): DispatchProps => ({
    createRoom: (name: string) => dispatch(createRoom(ownProps.queueId, name)),
});

export default connect<StateProps, DispatchProps, OwnProps, RootState>(
    mapStateToProps,
    mapDispatchToProps,
)(RoomsList);
