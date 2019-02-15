import React, { Component } from 'react';

import * as _ from 'lodash';

import { Button, Form, Input } from 'antd';

import { connect } from 'react-redux';
import { RootState } from '../../reducers/root';
import { FormComponentProps } from 'antd/lib/form/Form';
import { getActionStatus } from '../../reducers/status';
import { StatusActionPayload, StatusActionTypes } from '../../actions/status';
import { handleJoiErrors } from '../../utils/form-handle-joi-errors';

interface ExternalProps extends FormComponentProps {
    onSubmit: (fields: NewQueueFormFields) => any;
}

interface Props extends ExternalProps {
    createQueueStatus: StatusActionPayload;
}

export type NewQueueFormFields = {
    name: string,
};

// TODO: test this
class NewQueueFormComponent extends Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    handleSubmit = () => {
        return this.props.form.validateFields((err, values: NewQueueFormFields) => {
            if (!err) {
                this.props.onSubmit(values);
            }
        });
    }

    componentDidUpdate(prevProps: Props) {
        const error = this.props.createQueueStatus.error;

        if (!error || typeof error === 'string' || _.isEqual(prevProps.createQueueStatus.error, error)) {
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
        const { status } = this.props.createQueueStatus;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const formTailLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };

        // TODO: style this better
        return (
            <Form style={{ maxWidth: '600px' }}>
                <Form.Item {...formItemLayout} label="Name">
                    {
                        getFieldDecorator('name', {
                            rules: [{
                                required: true,
                                message: 'Please input the name',
                            }],
                        })(
                            <Input placeholder="My queue" />,
                        )
                    }
                </Form.Item>
                <Form.Item {...formTailLayout}>
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

const mapStateToProps = (state: RootState, props: ExternalProps) => ({
    ...props,
    createQueueStatus: getActionStatus(state, StatusActionTypes.CREATE_QUEUE),
});

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
});

// tslint:disable-next-line:variable-name
export const NewQueueForm = Form.create<Props>()(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(NewQueueFormComponent),
);
