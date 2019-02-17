import React, { Component } from 'react';

import { Col, Row } from 'antd';
import { PageHeader } from '../PageHeader/PageHeader';

import RoomsList from './RoomsList';
import QueueInfo from './QueueInfo';

import { Block } from '../Block/Block';

export class QueueDetails extends Component<Props> {
    render() {
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

export interface Props {
    id: number;
}
