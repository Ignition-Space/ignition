'use client';

import { Typography, Card, Divider } from 'antd';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(
  () => import('@monaco-editor/react'),
  { ssr: false }
);

const { Title, Paragraph } = Typography;

export default function EditorComponentsPage() {
  const sampleCode = `// 示例代码
function greeting(name) {
  return \`Hello, \${name}!\`;
}

console.log(greeting('世界'));
`;

  return (
    <div className="space-y-6">
      <Title level={2}>编辑器组件</Title>
      <Paragraph>
        代码编辑器组件提供了丰富的代码编辑功能，支持语法高亮、代码补全、错误提示等功能。
      </Paragraph>

      <Divider />

      <Card title="Monaco编辑器" className="mb-6">
        <div className="h-64">
          <MonacoEditor
            height="100%"
            language="javascript"
            theme="vs-dark"
            value={sampleCode}
            options={{
              minimap: { enabled: false },
              automaticLayout: true,
              scrollBeyondLastLine: false,
              fontSize: 14,
            }}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="支持的语言" hoverable>
          <ul className="list-disc list-inside">
            <li>JavaScript / TypeScript</li>
            <li>HTML / CSS</li>
            <li>JSON / YAML</li>
            <li>Python / Java</li>
            <li>C / C++ / C#</li>
            <li>以及更多...</li>
          </ul>
        </Card>

        <Card title="主要功能" hoverable>
          <ul className="list-disc list-inside">
            <li>语法高亮</li>
            <li>代码补全</li>
            <li>错误和警告提示</li>
            <li>格式化</li>
            <li>代码折叠</li>
            <li>多光标编辑</li>
          </ul>
        </Card>
      </div>
    </div>
  );
} 