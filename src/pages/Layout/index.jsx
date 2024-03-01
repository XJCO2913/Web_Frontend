import { Layout, Menu, Popconfirm } from 'antd'
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import './index.scss'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import React from 'react';
import useSWR from 'swr';
import { request } from "@/utils"; // 确保引入了你的请求工具或 axios 实例


const { Header, Sider } = Layout

const items = [
  {
    label: '首页',
    key: '/',
    icon: <HomeOutlined />,
  },
  {
    label: '2',
    key: '/2',
    icon: <DiffOutlined />,
  },
  {
    label: '3',
    key: '/3',
    icon: <EditOutlined />,
  },
]

const SELayout = () => {
  const navigate = useNavigate()
  const onMenuClick = (route) => {
    const path = route.key
    navigate(path)
  }

  // 反向高亮：
  const location = useLocation()
  const selectedKeys = location.pathname

  // // 获取个人信息
  // // fetcher 函数用于 SWR 请求数据
  // const fetcher = url => request.get(url).then(res => res.data);
  // // 假设用户信息的 API 路径为 "/api/user/info"
  // const { data: userInfo, error } = useSWR('/api/user/info', fetcher);
  // // 处理用户信息加载或错误状态
  // if (error) return <div>Failed to load user info</div>;
  // if (!userInfo) return <div>Loading...</div>;
  // // 从 userInfo 中提取你需要展示的数据，比如用户名
  // const userName = userInfo.name; // 假设用户信息中包含名字

  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">123</span>
          <span className="user-logout">
            <Popconfirm title="是否确认退出？" okText="退出" cancelText="取消">
              <LogoutOutlined /> 退出
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            theme="dark"
            selectedKeys={selectedKeys}
            onClick={onMenuClick}
            items={items}
            style={{ height: '100%', borderRight: 0 }}></Menu>
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          {/* 二级路由出口 */}
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  )
}

export default SELayout