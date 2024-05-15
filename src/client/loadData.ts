import axios from 'axios'
import { ElNotification } from 'element-plus';

import { DecodeData, EncodeType } from "./decode"
export { EncodeType } from './decode'

interface LoadOptions {
    // 编码类型
    encodeType?: EncodeType,
    // 目标, 会将结果写入到这个值中
    writeTarget?: any,
}

axios.defaults.headers.common['Cache-Control'] = 'no-cache'

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    return response;
}, function (err) {
    let notify = ElNotification({
        type: 'error',
        title: '网络请求错误',
        message: err,
        showClose: false,
        onClick() {
            notify.close();
        }
    });
    return Promise.reject(err);
});

// 加载数据
export async function loadData(path: string, opts?: LoadOptions): Promise<any> {
    let res = await axios.get(path, { responseType: 'text' });
    console.info('网络数据:', path, '\n\n' + res.data);
    let out = DecodeData(res.data, opts?.encodeType);
    if (opts?.writeTarget) Object.assign(opts.writeTarget, out);
    return out
}

// 基础配置路径
interface LoadOptions {
    // 编码类型
    encodeType?: EncodeType,
    // 目标, 会将结果写入到这个值中
    writeTarget?: any,
}

// 加载配置数据
export async function loadConfigData(path: string, opts?: LoadOptions): Promise<any> {
    path = import.meta.env.BASE_URL + path
    let rsp = await loadData(path, opts)
    return rsp
}