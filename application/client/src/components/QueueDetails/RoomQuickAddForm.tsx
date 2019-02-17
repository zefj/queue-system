import React, { Component } from 'react';

import * as _ from 'lodash';

import { Button, Form, Input, Icon} from 'antd';

import { connect } from 'react-redux';
import { RootState } from '../../reducers/root-reducer';
import { FormComponentProps } from 'antd/lib/form/Form';
import { getActionStatus } from '../../reducers/status-reducer';
import { StatusActionPayload, StatusActionTypes } from '../../actions/status-actions';
import { handleJoiErrors } from '../../utils/form-handle-joi-errors';
import { createRoom } from '../../actions/rooms-actions';

// TODO: test this
class RoomQuickAddForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    handleSubmit = () => {
        return this.props.form.validateFields((err, values: RoomQuickAddFormFields) => {
            if (!err) {
                this.props.createRoom(values.name).then(() => {
                    this.props.onSuccess && this.props.onSuccess();
                });
            }
        });
    }

    componentDidUpdate(prevProps: Props) {
        const error = this.props.createRoomStatus.error;

        if (!error || typeof error === 'string' || _.isEqual(prevProps.createRoomStatus.error, error)) {
            return;
        }

        if (error.description) {
            return this.props.form.setFields(
                handleJoiErrors(error.description, this.props.form.getFieldValue),
            );
        }

        if (error.error === 'ALREADY-EXISTS') {
            return this.props.form.setFields({
                name: {
                    value: this.props.form.getFieldValue('name'),
                    errors: [new Error('error.name.exists')],
                },
            });
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { status } = this.props.createRoomStatus;

        return (
            <Form
                layout="inline"
                style={{ display: 'flex' }}
            >
                <Form.Item
                    style={{ flex: 1 }}
                    wrapperCol={{ span: 24 }}
                >
                    {
                        getFieldDecorator('name', {
                            rules: [{
                                required: true,
                                message: 'Please input the name',
                            }],
                        })(
                            <Input
                                addonBefore={<Icon type="plus" />}
                                placeholder="My room"
                            />,
                        )
                    }
                </Form.Item>
                <Form.Item
                    style={{ marginRight: 0 }}
                >
                    <Button
                        type="primary"
                        htmlType="button"
                        loading={status === 'started'}
                        onClick={this.handleSubmit}
                    >
                        Create
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

export type RoomQuickAddFormFields = {
    name: string,
};

interface StateProps {
    createRoomStatus: StatusActionPayload;
}

interface DispatchProps {
    createRoom: (name: string) => Promise<any>;
}

export interface OwnProps extends FormComponentProps {
    queueId: number;
    onSuccess: Function | null;
}

type Props = StateProps & DispatchProps & OwnProps;

interface State {
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
    ...ownProps,
    createRoomStatus: getActionStatus(state, StatusActionTypes.CREATE_ROOM),
});

const mapDispatchToProps = (dispatch: ThunkDispatch, ownProps: OwnProps) => ({
    createRoom: (name: string) => dispatch(createRoom(ownProps.queueId, name)),
});

// tslint:disable-next-line:variable-name
export default Form.create<Props>()(
    connect<StateProps, DispatchProps, OwnProps, RootState>(
        mapStateToProps,
        mapDispatchToProps,
    )(RoomQuickAddForm),
);
