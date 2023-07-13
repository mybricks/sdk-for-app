---
title: 应用开发SDK
description: 基于此SDK，快速开发aPaaS应用
keywords: [Mybricks,Mybricks低代码,低代码,无代码,图形化编程]
---

# SDK
> **@mybricks/sdk-for-app** 是开发 aPaaS应用专属APP，内部封装了涵盖 **前端界面、后端接口** 两大领域的给类能力，开发者基于此SDK，即可快速实现一款托管在aPaaS平台上的低代码搭建系统

## UI
基本使用如下：

```jsx
import { View } from '@mybricks/sdk-for-app/ui';
import Designer from './path/to/设计器配置';

export default function App() {
  return (
    <View
      onLoad={(appData) => {
        // 这里会返回关于搭建需要的全量数据：用户、json等等
        return <Designer appData={appData} />;
      }}
    />
  );
}
```

## API
管理后端接口类的封装均内聚在 **API** 这个顶层对象内，您可在**前端界面**或者**后端接口**中直接调用，使用姿势保持一致。例如：

### 前端界面中使用：

```jsx
import { Locker, Toolbar } from '@mybricks/sdk-for-app/ui';
// 导出API对象，直接调用相关领域方法
import API from '@mybricks/sdk-for-app/api';

export default function MyDesigner({ appData }) {
  const save = async (param) => {
    const param = {} // 要保存的数据
    // 调用SDK内部能力进行保存
    await API.File.save(param)
  }
  return (
    <div className={`${css.view} fangzhou-theme`}>
      <Toolbar>
        <Toolbar.Save onClick={save} />
      </Toolbar>
      <!-- 其他代码 -->
    </div>
  );
}
```

### 后端接口中使用

```ts
// 导出API对象，直接调用相关领域方法
import API from '@mybricks/sdk-for-app/api';

@Post('/publish')
async publish(@Body() body: any) {
  const param = {} // 要发布的参数
  // 调用API内的File域的发布方法进行保存
  const url = await API.File.publish(param);

  return {
    code: 1,
    message: '发布完成'
  };
}
```
