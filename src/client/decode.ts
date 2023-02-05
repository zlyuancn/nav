import YAML from 'yaml'

export enum EncodeType {
    NONE,
    JSON = 1,
    YAML = 2,
}

// 解析数据
export function DecodeData(data: string, encodeType?: EncodeType): any {
    if (!encodeType) {
        return data;
    }
    switch (encodeType) {
        case EncodeType.JSON:
            return JSON.parse(data)
        case EncodeType.YAML:
            return YAML.parse(data);
        default:
            throw new Error('未定义解析类型:' + encodeType)
    }
}
