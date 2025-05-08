'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Input, Dropdown, Divider, Empty, Spin, InputRef } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

// 搜索结果类型定义
interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'page' | 'document' | 'tool';
  icon?: React.ReactNode;
}

interface GlobalSearchProps {
  className?: string;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ className = '' }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<InputRef>(null);

  // 模拟搜索API调用
  const searchContent = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    // 这里应该替换为实际的API调用
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 300));

    // 模拟搜索结果
    const mockResults: SearchResult[] = [
      {
        id: '1',
        title: '火石设计 HuoS',
        description: '基于接口管理的低代码生成器',
        url: '/',
        type: 'page'
      },
      {
        id: '2',
        title: 'IG CLI',
        description: '插件式 CLI，打造你的专属工具',
        url: '/tools/cli',
        type: 'tool'
      },
      {
        id: '3',
        title: 'IG DESIGN',
        description: '基于 ANT DESIGN 的业务组件库',
        url: '/design',
        type: 'page'
      },
      {
        id: '4',
        title: 'DEVOPS 平台',
        description: '零成本集成项目的 DEVOPS 平台',
        url: '/devops',
        type: 'page'
      },
    ].filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );

    setResults(mockResults);
    setLoading(false);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      searchContent(searchText);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  // 处理搜索结果点击
  const handleResultClick = (url: string) => {
    setOpen(false);
    router.push(url);
  };

  // 处理快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K 或 Ctrl+K 打开搜索
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }

      // Escape 关闭搜索
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  // 搜索结果下拉内容
  const dropdownContent = (
    <div className="bg-white rounded-lg shadow-xl p-4 min-w-[360px] max-w-[480px]">
      <div className="mb-2 text-sm text-gray-500">
        {loading ? '搜索中...' : results.length > 0 ? `找到 ${results.length} 个结果` : ''}
      </div>

      <Divider className="my-2" />

      {loading ? (
        <div className="py-8 flex justify-center">
          <Spin size="large" />
        </div>
      ) : results.length > 0 ? (
        <div className="max-h-[400px] overflow-y-auto">
          {results.map(result => (
            <div
              key={result.id}
              className="p-3 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
              onClick={() => handleResultClick(result.url)}
            >
              <div className="font-medium">{result.title}</div>
              <div className="text-sm text-gray-500">{result.description}</div>
              <div className="text-xs text-gray-400 mt-1">{result.url}</div>
            </div>
          ))}
        </div>
      ) : searchText ? (
        <div className="py-6">
          <Empty description="未找到相关内容" />
        </div>
      ) : (
        <div className="text-center text-gray-500 py-4">
          输入关键词开始搜索
          <div className="text-sm text-gray-400 mt-2">
            支持页面、文档、工具搜索
          </div>
        </div>
      )}

      <Divider className="my-2" />

      <div className="text-xs text-gray-400 flex justify-between">
        <span>按 ESC 关闭</span>
        <span>使用 ↑↓ 导航</span>
        <span>按 Enter 选择</span>
      </div>
    </div>
  );

  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      trigger={['click']}
      dropdownRender={() => dropdownContent}
      placement="bottomRight"
    >
      <div className={`global-search ${className}`}>
        <Input
          ref={inputRef}
          placeholder="搜索全站内容 (Ctrl+K)"
          prefix={<SearchOutlined className="text-gray-400" />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onClick={() => setOpen(true)}
          onPressEnter={() => {
            if (results.length > 0) {
              handleResultClick(results[0].url);
            }
          }}
          className="rounded-lg"
          style={{ width: 220 }}
        />
      </div>
    </Dropdown>
  );
};

export default GlobalSearch; 