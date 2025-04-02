import React, { useState, useEffect } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import COS from 'cos-js-sdk-v5';
import { request } from '@/utils';

const ImageUploader = ({ onUploadSuccess, initialImage }) => {
    const [uploading, setUploading] = useState(false);
    const [cosClient, setCosClient] = useState(null);
    const [currentImage, setCurrentImage] = useState(initialImage); // 管理当前显示的图片

    // 当初始图片变化时更新当前图片
    useEffect(() => {
        setCurrentImage(initialImage);
    }, [initialImage]);

    // 初始化 COS 客户端
    const initCosClient = async () => {
        try {
            const response = await request.get('/sts/token');
            if (!response || !response.credentials) {
                throw new Error('返回的数据格式不正确');
            }

            const { credentials } = response;
            const client = new COS({
                getAuthorization: (options, callback) => {
                    callback({
                        TmpSecretId: credentials.tmpSecretId,
                        TmpSecretKey: credentials.tmpSecretKey,
                        SecurityToken: credentials.token,
                        StartTime: Math.floor(Date.now() / 1000),
                        ExpiredTime: response.expiredTime,
                    });
                },
            });
            setCosClient(client);
            return client;
        } catch (error) {
            console.error('获取临时密钥失败', error);
            message.error('获取临时密钥失败，请稍后重试');
            return null;
        }
    };

    const handleUpload = async (file) => {
        setUploading(true);

        // 初始化 COS 客户端
        const client = await initCosClient();
        if (!client) {
            message.error('COS 客户端初始化失败，请稍后重试');
            setUploading(false);
            return false;
        }

        const key = `flowers/${Date.now()}_${file.name}`;
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
                    setCurrentImage(imageUrl); // 更新当前显示的图片
                    onUploadSuccess(imageUrl); // 通知父组件
                    message.success('上传成功');
                }
            }
        );
        return false;
    };

    return (
        <div>
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
            {currentImage && ( // 显示当前图片
                <div style={{ marginTop: 16 }}>
                    <img
                        src={currentImage}
                        alt="当前图片"
                        style={{ maxWidth: '100%', maxHeight: 200 }}
                    />
                </div>
            )}
        </div>
    );
};

export default ImageUploader;