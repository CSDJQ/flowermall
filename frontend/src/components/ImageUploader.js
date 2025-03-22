import React, {useEffect, useState} from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import COS from 'cos-js-sdk-v5';
import { request } from '@/utils';

const ImageUploader = ({ onUploadSuccess }) => {
    const [uploading, setUploading] = useState(false);
    const [cosClient, setCosClient] = useState(null);

    // 初始化 COS 客户端
    const initCosClient = async () => {
        try {
            const response = await request.get('/sts/token'); // 调用后端接口获取临时密钥

            // 检查返回的数据格式
            if (!response || !response.credentials) {
                throw new Error('返回的数据格式不正确');
            }

            const { credentials } = response; // 解构 credentials
            const client = new COS({
                getAuthorization: (options, callback) => {
                    callback({
                        TmpSecretId: credentials.tmpSecretId,
                        TmpSecretKey: credentials.tmpSecretKey,
                        SecurityToken: credentials.token, // 注意字段名是 token
                        StartTime: Math.floor(Date.now() / 1000), // 当前时间戳（秒）
                        ExpiredTime: response.expiredTime, // 过期时间
                    });
                },
            });
            setCosClient(client);
            return client; // 返回初始化后的 COS 客户端
        } catch (error) {
            console.error('获取临时密钥失败', error);
            message.error('获取临时密钥失败，请稍后重试');
            return null;
        }
    };

    useEffect(() => {
        if (cosClient) {
            console.log('COS Client is ready:', cosClient);
        }
    }, [cosClient]);

    const handleUpload = async (file) => {
        setUploading(true);

        // 初始化 COS 客户端
        const client = await initCosClient();
        if (!client) {
            message.error('COS 客户端初始化失败，请稍后重试');
            setUploading(false);
            return false;
        }

        const key = `flowers/${Date.now()}_${file.name}`; // 生成唯一的文件名
        client.putObject(
            {
                Bucket: 'flower-1346990013',
                Region: 'ap-guangzhou',
                Key: key,
                Body: file,
                onProgress: (progressData) => {
                    console.log('上传进度:', JSON.stringify(progressData));
                },
            },
            (err, data) => {
                setUploading(false);
                if (err) {
                    console.error('上传失败', err);
                    message.error('上传失败，请稍后重试');
                } else {
                    const imageUrl = `https://${data.Location}`;
                    onUploadSuccess(imageUrl); // 将上传成功的图片 URL 传递给父组件
                    message.success('上传成功');
                }
            }
        );
        return false; // 阻止默认上传行为
    };

    return (
        <Upload
            beforeUpload={handleUpload}
            listType="picture"
            maxCount={1}
            showUploadList={false}
        >
            <Button icon={<UploadOutlined />} loading={uploading}>
                上传图片
            </Button>
        </Upload>
    );
};

export default ImageUploader;