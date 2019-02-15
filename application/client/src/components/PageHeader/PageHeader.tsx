import React, { ReactNode } from 'react';
import { Button, Col, Divider, Row } from 'antd';

export const PageHeader: React.FC<{ title: string, buttons?: ReactNode }> = ({ title, buttons }) => (
    <Row type="flex" justify="space-between" gutter={16}>
        <Col style={{ flexGrow: 1 }}>
            <Divider
                orientation="left"
                style={{
                    marginTop: 0,
                }}
            >
                {title}
            </Divider>
        </Col>
        {
            buttons &&
                <Col style={{ textAlign: 'right' }}>
                    {buttons}
                </Col>
        }
    </Row>
);

interface Props {

}
