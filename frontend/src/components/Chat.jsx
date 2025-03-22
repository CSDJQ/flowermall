import React, { useState } from 'react';
import {request} from '@/utils';

export default function Chat() {
    const [input, setInput] = useState('');
    const [answer, setAnswer] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await request.post('/ai/ask', { input });
            const lines = response.data.split('\n').filter(line => line.trim());
            setAnswer(lines);
        } catch (error) {
            setAnswer(['请求失败：' + (error.response?.data || '网络错误')]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-container">
            <form onSubmit={handleSubmit}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="请输入需求，如：情人节送女友蓝色花束"
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    {loading ? '生成中...' : '提交'}
                </button>
            </form>
            <div className="answer">
                {answer.map((line, index) => (
                    <p key={index}>{line}</p>
                ))}
            </div>
        </div>
    );
}