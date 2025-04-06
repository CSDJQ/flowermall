// src/components/DeliveryTimeSection/DeliveryTimeSection.js
import moment from "moment";
import { useState } from "react";
import { Card, Radio, Typography } from "antd";
import style from './DeliveryTimeSection.module.scss';

const DeliveryTimeSection = ({ deliveryTime, setDeliveryTime }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const { Text } = Typography;

    // 生成日期选项
    const dateOptions = [
        { label: '今天', value: moment().format('YYYY-MM-DD') },
        { label: '明天', value: moment().add(1, 'day').format('YYYY-MM-DD') },
        { label: '后天', value: moment().add(2, 'days').format('YYYY-MM-DD') }
    ];

    // 生成时间选项（基于选中的日期）
    const generateTimeOptions = (date) => {
        const isToday = date === moment().format('YYYY-MM-DD');
        const now = moment();
        const options = [];

        // 如果是今天，从当前时间1小时后开始
        const startTime = isToday
            ? moment.max(
                now.clone().add(1, 'hour').startOf('hour'),
                moment(date).hour(7).minute(0) // 确保不早于7:00
            )
            : moment(date).hour(7).minute(0); // 其他日期从7:00开始

        const endTime = moment(date).hour(22).minute(0); // 到22:00结束

        let currentTime = startTime.clone();

        // 确保时间是20分钟的倍数
        const remainder = currentTime.minute() % 20;
        if (remainder !== 0) {
            currentTime.add(20 - remainder, 'minutes');
        }

        while (currentTime.isSameOrBefore(endTime)) {
            options.push({
                label: currentTime.format('HH:mm'),
                value: currentTime.clone().format('YYYY-MM-DD HH:mm') // 存储为字符串
            });
            currentTime.add(20, 'minutes');
        }

        return options;
    };

    return (
        <Card title="送达时间" className={style.deliveryTimeCard}>
            {/* 第一级：选择日期 */}
            <div style={{ marginBottom: 16 }}>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>选择日期</Text>
                <Radio.Group
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    buttonStyle="solid"
                >
                    {dateOptions.map(option => (
                        <Radio.Button key={option.value} value={option.value}>
                            {option.label}
                        </Radio.Button>
                    ))}
                </Radio.Group>
            </div>

            {/* 第二级：选择时间 */}
            {selectedDate && (
                <div>
                    <Text strong style={{ display: 'block', marginBottom: 8 }}>选择时间</Text>
                    <Radio.Group
                        value={deliveryTime && deliveryTime.format('YYYY-MM-DD HH:mm')}
                        onChange={(e) => {
                            // 将字符串转换为 moment 对象
                            setDeliveryTime(moment(e.target.value));
                        }}
                        style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
                    >
                        {generateTimeOptions(selectedDate).map(option => (
                            <Radio.Button
                                key={option.value}
                                value={option.value}
                                style={{ marginBottom: 8 }}
                            >
                                {option.label}
                            </Radio.Button>
                        ))}
                    </Radio.Group>
                </div>
            )}

            <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                最快1小时后送达，最晚可预约晚上10点
            </Text>
        </Card>
    );
};

export default DeliveryTimeSection;