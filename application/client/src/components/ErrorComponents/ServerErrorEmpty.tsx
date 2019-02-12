import React, { FunctionComponent } from 'react';
import { Empty, Icon } from 'antd';

import styles from './ServerErrorEmpty.module.scss';

// tslint:disable-next-line:variable-name
export const ServerErrorEmpty: FunctionComponent<{}> = () => (
    <Empty
        image={
            <Icon
                type="close-circle"
                style={{ height: '4.5em' }}
                className={styles.serverErrorEmpty}
            />
        }
        description="Whoops, there's been an unexpected server error. Try again in a moment!"
    />
);
