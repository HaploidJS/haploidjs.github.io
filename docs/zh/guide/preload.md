# 预先载入

某些应用明确有比较大的使用概率，为了加速页面跳转，可以设置为预先载入。

```ts
container.registerApp({
  name: "foo",
  entry: "https://foo.com/entry",
  activeWhen: "/foo",
  preload: true, // 开关
  preloadDelay: 1000, // 延时
});
```

在开启了 `preload` 选项之后，系统会依赖 _requestIdleCallback_ 找到时机去提前载入子应用的 JS/CSS 资源，拿到生命周期函数，其中`preloadDelay` 选项为延时时间，默认为 0。

假设子应用 A 正在预先载入过程中，用户操作触发激活 A，那么就会复用正在进行的载入过程。

即便预先载入失败，也不影响后面继续尝试激活该应用。

## 智能预载

容器（Container）也提供了一个 `preload` 构造参数，有几种不同的取值类型。

该参数仅对于在注册时未指定 `preload` 参数的应用有效，true 即强制子应用预载，false 即强制子应用不预载。

一旦设置为 `"auto"`，该容器会启动一个基于 **localStorage** 存储的类似 LRU-Cache 的模块，计算子应用的访问热度，并在下次再次注册时执行预载。

```ts
new ManualContainer({
  name: "foo",
  root: "#app",
  preload: "auto",
});
```

你也可以将 `preload` 设置为对象来精细化控制 LRU-Cache：

```ts
new ManualContainer({
  name: "foo",
  root: "#app",
  preload: {
    max: 30, // 最多纪录的条目数量，默认为30
    expire: 7 * 86400 * 1000, // 过期时间，默认为7天
    factor: 0.1, // 权重收敛系数，默认为0.1
    top: 5, // 最多预期热度前5位的应用
    onExceed: (key: string) => {
      console.log(key, "记录溢出");
    },
  },
});
```

**factor** 是一个反函数的系数，热度的计算公式为 **f(x) = expire / (x + expire \* factor)** ，其中 x 为当今距离该子应用 `afterstart` 事件的时间差。在默认取值 0.1 条件下，权重收敛曲线为：

![](/assets/factor-01.png)

在默认取值 0.01 条件下，权重收敛曲线为：

![](/assets/factor-001.png)

也就是说，取值越小，收敛越快，也即意味着距离现在越远的时间点发生的子应用启动行为，对其热度的贡献变化率约小。举一个例子来说：在0.1条件下，昨天访问应用 b 两次带来的热度贡献，大于今天访问 a 一次的热度贡献。但是在 0.01 条件下，很可能相反。

::: tip
目前不支持定制收敛函数。
:::
