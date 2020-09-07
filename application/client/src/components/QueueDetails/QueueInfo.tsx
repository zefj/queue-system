import React, { Component } from 'react';

import styled from 'styled-components';
import { IQueueWithRooms } from '../../actions/types';
import { StatusActionPayload, StatusActionTypes } from '../../actions/status-actions';
import { RootState } from '../../reducers/root-reducer';
import { getQueue } from '../../reducers/queues-reducer';
import { getActionStatus } from '../../reducers/status-reducer';
import { fetchQueue } from '../../actions/queues-actions';
import { connect } from 'react-redux';
import { ServerErrorEmpty } from '../ErrorComponents/ServerErrorEmpty';
import { Skeleton } from 'antd';

const QueueInfoItem = styled.span`
  display: flex;
  align-items: center;
  padding: 12px 0;
  &:not(:last-child) {
    border-bottom: 1px solid #e8e8e8;
  }
`;

const QueueInfoItemLabel = styled.span`
  font-weight: bold;
  padding-right: 12px;
  flex-basis: 30%;
  text-align: right;
`;

const QueueInfoItemValue = styled.span``;

class QueueInfo extends Component<Props> {
    render() {
        if (!this.props.queue) {
            return (
                <Skeleton title={false} active />
            );
        }

        return (
            <div>
                <QueueInfoItem>
                    <QueueInfoItemLabel>
                        Name
                    </QueueInfoItemLabel>
                    <QueueInfoItemValue>
                        {this.props.queue.name}
                    </QueueInfoItemValue>
                </QueueInfoItem>

                <QueueInfoItem>
                    <QueueInfoItemLabel>
                        Numbering convention m8
                    </QueueInfoItemLabel>
                    <QueueInfoItemValue>
                        {'[X]{1}[0-9]{2}-[1-9]{1}'} (example: X58-1, X82-3)
                    </QueueInfoItemValue>
                </QueueInfoItem>

                <QueueInfoItem>
                    <QueueInfoItemLabel>
                        Created at
                    </QueueInfoItemLabel>
                    <QueueInfoItemValue>
                        {this.props.queue.created_at}
                    </QueueInfoItemValue>
                </QueueInfoItem>
            </div>
        );
    }
}

interface StateProps {
    queue: IQueueWithRooms | undefined;
    fetchQueueStatus: StatusActionPayload;
}

interface DispatchProps {
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
});

export default connect<StateProps, DispatchProps, OwnProps, RootState>(
    mapStateToProps,
    mapDispatchToProps,
)(QueueInfo);
