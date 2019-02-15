import React, { Component } from 'react';

import { Col, Row } from 'antd';
import { PageHeader } from '../PageHeader/PageHeader';

import RoomsList from './RoomsList';
import QueueInfo from './QueueInfo';

export class QueueDetails extends Component<Props> {
    render() {
        return (
            <>
                <PageHeader title={`Queue ${this.props.id}`} />
                <Row gutter={32}>
                    <Col lg={8} sm={24}>
                        <QueueInfo id={this.props.id} />
                    </Col>
                    <Col lg={8} sm={24}>
                        <RoomsList queueId={this.props.id} />
                    </Col>
                    <Col lg={8} sm={24}>
                        Check the statistax
                    </Col>
                </Row>
            </>
        );
    }
}

export interface Props {
    id: number;
}
