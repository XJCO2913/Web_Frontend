import axios from 'axios';
import provinceCityMapping from '@/utils/zh-en'

// translate function
export function translateName(chineseName) {
    return provinceCityMapping[chineseName] || chineseName;
}

// reverse function for searching city
export const reverseMapping = Object.keys(provinceCityMapping).reduce((acc, chineseName) => {
    const englishName = provinceCityMapping[chineseName];
    acc[englishName] = chineseName;
    return acc;
}, {});

// get province by Gao De api
export async function fetchProvinces() {
    const response = await axios.get(`https://restapi.amap.com/v3/config/district`, {
        params: {
            key: '03eceb9420e057a98616285039c15367',
            keywords: '中国',
            subdistrict: 1,
        },
    });
    return response.data.districts[0].districts.map(district => ({
        value: translateName(district.name),
        label: translateName(district.name),
        isLeaf: false,
    }));
}

// get city by Gao De api
export async function fetchCitiesByProvince(provinceName) {
    // Use the reverse mapping to find the Chinese name corresponding to the English name
    const chineseProvinceName = reverseMapping[provinceName] || provinceName;

    const response = await axios.get(`https://restapi.amap.com/v3/config/district`, {
        params: {
            key: '03eceb9420e057a98616285039c15367',
            keywords: chineseProvinceName,
            subdistrict: 1,
        },
    });
    return response.data.districts[0].districts.map(district => ({
        value: translateName(district.name),
        label: translateName(district.name),
        isLeaf: true,
    }));
}
