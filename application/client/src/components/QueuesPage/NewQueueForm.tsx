import React, { Component } from 'react';

import * as _ from 'lodash';

import { Button, Form, Input } from 'antd';

import { connect } from 'react-redux';
import { RootState } from '../../reducers/root';
import { FormComponentProps } from 'antd/lib/form/Form';
import { getActionStatus } from '../../reducers/status';
import { StatusActionPayload, StatusActionTypes } from '../../actions/status';

interface ExternalProps extends FormComponentProps {
    onSubmit: (fields: NewQueueFormFields) => any;
}

interface Props extends ExternalProps {
    createQueueStatus: StatusActionPayload;
}

export type NewQueueFormFields = {
    name: string,
};

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
        const errors = this.props.createQueueStatus.error;

        if (_.isEqual(prevProps.createQueueStatus.error, errors)) {
            return;
        }

        if (errors && typeof errors !== 'string' && errors.description) {
            let newState = {};

            _.forOwn(errors.description, (value, key) => {
                newState = {
                    ...newState,
                    [key]: {
                        value: this.props.form.getFieldValue(key),
                        errors: [new Error(value.key)], // TODO: l10n
                    },
                };
            });

            this.props.form.setFields(newState);
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 6 },
        };

        const formTailLayout = {
            wrapperCol: { span: 5, offset: 4 },
        };

        return (
            <div>
                <Form.Item {...formItemLayout} label="Name">
                    {
                        getFieldDecorator('name', {
                            rules: [{
                                required: true,
                                // max: 32,
                                message: 'Please input the name',
                            }],
                        })(
                            <Input placeholder="My queue" />,
                        )
                    }
                </Form.Item>
                <Form.Item {...formTailLayout}>
                    <Button type="primary" onClick={this.handleSubmit}>
                        Create
                    </Button>
                </Form.Item>
            </div>
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
