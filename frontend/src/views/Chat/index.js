import React, { useState } from 'react';
import {
    Input, Button, Card, Divider, Typography,
    Space, message, Spin
} from 'antd';
import { request } from '@/utils';
import style from './Chat.module.scss';
import {ArrowLeftOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";

const { Text, Title } = Typography;

export default function Chat() {
    const [input, setInput] = useState('');
    const [answer, setAnswer] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) {
            message.warning('请输入您的需求');
            return;
        }

        setLoading(true);
        setAnswer([]); // 清空之前的回答内容

        try {
            const response = await request.post('/ai/ask', { input });
            const lines = response.split('\n').filter(line => line.trim());
            setAnswer(lines);
        } catch (error) {
            message.error('请求失败：' + (error.response?.data || '网络错误'));
            setAnswer(['请求失败：' + (error.response?.data || '网络错误')]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={style.container}>
            <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                className={style.backButton}
            >
                返回
            </Button>
            <Card
                title={<Title level={4}>AI 花束推荐</Title>}
                className={style.chatCard}
                extra={
                    <Text type="secondary">
                        输入您的需求，获取个性化花束推荐
                    </Text>
                }
            >
                <form onSubmit={handleSubmit} className={style.inputForm}>
                    <Space.Compact className={style.inputGroup}>
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="请输入需求，如：情人节送女友蓝色花束"
                            disabled={loading}
                            size="large"
                            className={style.inputField}
                        />
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            size="large"
                            className={style.submitButton}
                        >
                            {loading ? '生成中...' : '提交'}
                        </Button>
                    </Space.Compact>
                </form>

                <Divider className={style.divider} />

                <div className={style.answerSection}>
                    {loading ? (
                        <div className={style.loadingState}>
                            <Spin size="large" />
                            <Text type="secondary" style={{ marginTop: 16, display: 'block' }}>
                                正在为您生成推荐...
                            </Text>
                        </div>
                    ) : answer.length > 0 ? (
                        <Card className={style.answerCard}>
                            <Title level={5} className={style.answerTitle}>推荐结果</Title>
                            <div className={style.answerContent}>
                                {answer.map((line, index) => (
                                    <Text key={index} className={style.answerLine}>
                                        {line}
                                    </Text>
                                ))}
                            </div>
                        </Card>
                    ) : (
                        <div className={style.emptyState}>
                            <Text type="secondary">
                                请输入您的需求，AI将为您推荐合适的花束
                            </Text>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}