import axios from 'axios';
import provinceCityMapping from 'src/utils/zh-en';
import { GAODE_API } from 'src/apis/index';

// ----------------------------------------------------------------------
// translate function
export function translateName(chineseName) {
    return provinceCityMapping[chineseName] || chineseName;
}

// ----------------------------------------------------------------------
// reverse function for searching city
export const reverseMapping = Object.keys(provinceCityMapping).reduce((acc, chineseName) => {
    const englishName = provinceCityMapping[chineseName];
    acc[englishName] = chineseName;
    return acc;
}, {});

// ----------------------------------------------------------------------
// get province by Gao De api
export async function fetchProvinces() {
    const response = await axios.get(GAODE_API.apiAdmin, {
        params: {
            key: GAODE_API.apiKey,
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

// ----------------------------------------------------------------------
// get city by Gao De api
export async function fetchCitiesByProvince(provinceName) {
    // Use the reverse mapping to find the Chinese name corresponding to the English name
    const chineseProvinceName = reverseMapping[provinceName] || provinceName;

    const response = await axios.get(GAODE_API.apiAdmin, {
        params: {
            key: GAODE_API.apiKey,
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

