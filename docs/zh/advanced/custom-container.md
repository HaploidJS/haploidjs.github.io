# 自定义容器

Haploid.js 内置两种容器：**ManualContainer** 和 **RouterContainer**。

容器的作用有两个：

- 注册和管理一系列子应用，为其提供 DOM 挂载点
- 驱动子应用进行装载和卸载

而不同的容器的本质区别仅在于驱动子应用的条件有所不同：_ManualContainer_ 以开发者的意志作为条件，而 _RouterContainer_ 则响应用户对浏览器路由的操作。

如果有其它驱动条件，你完全可以定义自己的容器，下面我们将以 _message_ 作为驱动条件为例实现一个 MessageContainer。

```ts
import { Container } from "haploid";

class MessageContainer extends Container {
  private onMessage: ((event: Event) => void) | null;

  // 自定义的启动函数，默认不需要启动
  public start(): void {
    this.onMessage = (event) => {
      const { appname, action } = event.data;
      if ("activateapp" === action && appname) {
        // 调用父类的activateAppByName函数来激活特定子应用
        this.activateAppByName(appname);
      }
    };

    window.addEventListener("message", this.onMessage, false);
  }

  // 覆写destroy函数，清理资源
  public override destroy(): Promise<void> {
    if (this.onMessage) {
      window.removeEventListener("message", this.onMessage, false);
      this.onMessage = null;
    }

    return super.destroy();
  }
}

const mc = new MessageContainer();
mc.start();
// mc.destroy();
```
