import React, { Component } from 'react';
import { connect } from 'react-redux';

import { RootState } from '../../reducers/root-reducer';

import { Col, Divider, Row } from 'antd';
import { PageHeader } from '../PageHeader/PageHeader';

class QueueDetails extends Component<Props, State> {
    render() {
        return (
            <>
                <PageHeader title={`Queue ${this.props.id}`} />
                <Row>
                    <Col>

                    </Col>
                    rooms list
                </Row>
            </>
        );
    }
}

export interface OwnProps {
    id: string;
}

interface StateProps {}

interface DispatchProps {}

type Props = StateProps & DispatchProps & OwnProps;

interface State {}

const mapStateToProps = (state: RootState, ownProps: OwnProps): StateProps => ({
    ...ownProps,
});

const mapDispatchToProps = (dispatch: ThunkDispatch, ownProps: OwnProps): DispatchProps => ({});

export default connect<StateProps, DispatchProps, OwnProps, RootState>(
    mapStateToProps,
    mapDispatchToProps,
)(QueueDetails);
