import { Dropdown, Badge } from 'antd';
import { BellOutlined } from '@ant-design/icons'
import styles from './index.less'



const BadgeDropdown = () => {
    const items = [
        {
            label: <a href="https://www.antgroup.com">1st menu item</a>,
            key: '0',
        },
        {
            label: <a href="https://www.aliyun.com">2nd menu item</a>,
            key: '1',
        },
        {
            type: 'divider',
        },
        {
            label: '3rd menu item',
            key: '3',
        },
    ];
    return (
        <Dropdown menu={{ items }} trigger={['click']}>
            <span className={styles.news}>
                <Badge count={11}>
                    <BellOutlined style={{ color: '#fff', padding: '4px' }} />
                </Badge>
            </span>
        </Dropdown>
    )
}

export default BadgeDropdown;