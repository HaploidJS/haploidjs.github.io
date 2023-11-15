# Custom Container

Haploid.js has two built-in containers: **ManualContainer** and **RouterContainer**.

There are two functions of containers:

- Register and manage a set of sub-applications, providing them with DOM mount points;
- Drives the sub-application to load and unload

The only essential difference between different containers is that the conditions that drive sub-applications are different: _ManualContainer_ is conditional on the developer's wishes, while _RouterContainer_ responds to the user's actions on browser routing.

If there are other driver conditions, you can define your own container. We will implement a MessageContainer using _message_ as the driver condition:

```ts
import { Container } from "haploid";

class MessageContainer extends Container {
  private onMessage: ((event: Event) => void) | null;

  // A custom startup function that does not need to be started by default
  public start(): void {
    this.onMessage = (event) => {
      const { appname, action } = event.data;
      if ("activateapp" === action && appname) {
        // Use the activateAppByName function of the parent class to activate a specific sub-application
        this.activateAppByName(appname);
      }
    };

    window.addEventListener("message", this.onMessage, false);
  }

  // Override destroy function, cleanup
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
