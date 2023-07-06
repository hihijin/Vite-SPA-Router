# React와 History API 사용하여 SPA Router 기능 구현하기

**1) 해당 주소로 진입했을 때 아래 주소에 맞는 페이지가 렌더링 되어야 한다.**

- `/` → `root` 페이지
- `/about` → `about` 페이지

**2) 버튼을 클릭하면 해당 페이지로, 뒤로 가기 버튼을 눌렀을 때 이전 페이지로 이동해야 한다.**

- 힌트) `window.onpopstate`, `window.location.pathname` History API(`pushState`)

**3) Router, Route 컴포넌트를 구현해야 하며, 형태는 아래와 같아야 한다.**
```ts
ReactDOM.createRoot(container).render(
  <Router>
    <Route path="/" component={<Root />} />
    <Route path="/about" component={<About />} />
  </Router>
);
```
**4) 최소한의 push 기능을 가진 useRouter Hook을 작성한다.**
```ts
const { push } = useRouter();
```

---

### **실행 방법**

```bash
npm install
npm run dev
```



### 폴더 구조
```
📦 src
├── 📂 hook
│   ├── 📄 usePath.ts
│   └── 📄 useRouter.ts
├── 📂 router
│   ├── 📄 Router.tsx
│   └── 📄 Route.tsx
├── 📂 pages
│   ├── 📄 Root.tsx
│   └── 📄 About.tsx
├── 📄 App.tsx
└── 📄 main.tsx
```

---

### 1. Router 컴포넌트는 현재 경로를 상태로 관리하며, popstate 이벤트를 감지하여 경로가 변경될 때마다 현재 경로를 업데이트합니다.
```ts
import { RouteProps } from './Route';

interface RouterProps {
  children: React.ReactElement<RouteProps>[];
}

export const Router = ({ children }: RouterProps) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  return <>{children}</>;
};
```
### 2. Router로직을 usePath라는 hook으로 분리
usePath에서는 path의 상태관리와 eventListenr등록하는 로직을 함께 분리해주었다.
popstate 이벤트가 발생할때마다 window.location.pathname으로 path 값을 update 해준다.
```ts
//usePath.ts
import {
  useEffect,
  useState,
} from 'react';

export const usePath = () => {
  const [path, setPath] = useState(window.location.pathname);

  const updatePath = () => {
    setPath(window.location.pathname);
  };

  useEffect(() => {
    window.addEventListener("popstate", updatePath);
    return () => {
      window.removeEventListener("popstate", updatePath);
    };
  }, []);

  return path;
};
```
```ts
//Router.tsx
import { usePath } from '../hook/usePath';
import { RouteProps } from './Route';

interface RouterProps {
  children: React.ReactElement<RouteProps>[];
}
export const Router = ({ children }: RouterProps) => {
  const currentPath = usePath();
  return (
    <>
      {children?.map((router: React.ReactElement<RouteProps>) => {
        if (router.props.path == currentPath) return router;
      })}
    </>
  );
};
```

### 3. Route 컴포넌트는 현재 경로와 주어진 path를 비교하여 해당하는 컴포넌트를 렌더링합니다.
```ts
export interface RouteProps {
  path: string;
  component: React.ReactNode;
}
export const Route = ({ path, component }: RouteProps) => {
  const currentPath = window.location.pathname;

  if (currentPath === path) {
    return <>{component}</>;
  }

  return null;
};

```
>url의 변경 여부는 window.location.pathname의 변화 여부로 알 수 있다. 참고로 window.location.pathname으로도 url을 변경할 수 있다. 하지만 이렇게 변경을 하면 새로고침이 일어난다.
>
>새로고침이 일어나지 않고 컴포넌트를 변경하기 위해서는 history.pushState를 사용해야한다. pushState는 url을 변경하지만 새로고침은 일어나지 않는다. 
pathname을 살펴보고 일치하는 url에 대해서 컴포넌트를 랜더링하는 방식으로 SPA를 구현하고 있다.


### 4. useRouter 커스텀 Hook은 push 함수를 반환하는데, 이를 사용하여 버튼 클릭 시 다른 페이지로 이동할 수 있습니다.
```ts
//useRouter.tsx
export const useRouter = () => {
  const push = (path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("popstate"));
  };

  return { push };
};
```

### 5. Root 컴포넌트와 About 컴포넌트는 간단한 페이지 컴포넌트 구현
```ts
//Root.tsx
import { useRouter } from '../hook/useRouter';

export const Root = () => {
  const { push } = useRouter();
  return (
    <>
      <button>Root Page</button>
      <button onClick={() => push("/about")}>Go to About</button>
    </>
  );
};
```
```ts
//About.tsx
import { useRouter } from '../hook/useRouter';

export const About = () => {
  const { push } = useRouter();
  return (
    <>
      <button onClick={() => push("/")}>Go to Root</button>
      <button>About Page</button>
    </>
  );
};
```

### 6. App 컴포넌트에서 Router, Route 컴포넌트 렌더링
```ts
//App.tsx
import { About } from './pages/About';
import { Root } from './pages/Root';
import { Route } from './router/Route';
import { Router } from './router/Router';

export default function App() {
  return (
    <Router>
      <Route path="/" component={<Root />} />
      <Route path="/about" component={<About />} />
    </Router>
  );
}
```

#### 시연화면 GIF
![ezgif com-crop](https://github.com/hihijin/Vite-SPA-Router/assets/117073214/cf473637-24ec-4aee-9fb3-7a664fa11fdc)
