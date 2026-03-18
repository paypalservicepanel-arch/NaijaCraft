/**
 * Minimal hash-router that mimics react-router-dom API.
 * Uses window.location.hash for routing (#/path?query=value).
 */
import {
  Children,
  type ReactElement,
  type ReactNode,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface RouterState {
  path: string;
  search: string;
}

interface RouterContextType extends RouterState {
  navigate: (to: string, options?: { replace?: boolean }) => void;
  _params?: Record<string, string>;
}

const RouterContext = createContext<RouterContextType | null>(null);

function parseHash(): RouterState {
  const raw = window.location.hash.slice(1) || "/";
  const [pathAndSearch] = raw.split("#");
  const [path, search = ""] = pathAndSearch.split("?");
  return { path: path || "/", search };
}

export function HashRouter({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RouterState>(parseHash);

  useEffect(() => {
    const onHashChange = () => setState(parseHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = useCallback(
    (to: string, options?: { replace?: boolean }) => {
      if (options?.replace) {
        window.location.replace(`#${to}`);
      } else {
        window.location.hash = to;
      }
      setState(parseHash());
    },
    [],
  );

  return (
    <RouterContext.Provider value={{ ...state, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter(): RouterContextType {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter must be used within HashRouter");
  return ctx;
}

export function useLocation() {
  const { path, search } = useRouter();
  return { pathname: path, search };
}

export function useNavigate() {
  const { navigate } = useRouter();
  return navigate;
}

export function useParams<T extends Record<string, string>>(): Partial<T> {
  const ctx = useContext(RouterContext);
  if (!ctx) return {} as Partial<T>;
  return (ctx._params || {}) as Partial<T>;
}

export function useSearchParams(): [
  URLSearchParams,
  (p: URLSearchParams) => void,
] {
  const { search, navigate, path } = useRouter();
  const params = new URLSearchParams(search);
  const setParams = (p: URLSearchParams) => {
    navigate(`${path}?${p.toString()}`);
  };
  return [params, setParams];
}

// Route matching
function matchRoute(
  pattern: string,
  path: string,
): { matched: boolean; params: Record<string, string> } {
  if (pattern === "*") return { matched: true, params: {} };
  const patternParts = pattern.split("/").filter(Boolean);
  const pathParts = path.split("/").filter(Boolean);
  if (patternParts.length !== pathParts.length) {
    return { matched: false, params: {} };
  }
  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(":")) {
      params[patternParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
    } else if (patternParts[i] !== pathParts[i]) {
      return { matched: false, params: {} };
    }
  }
  // handle root
  if (pattern === "/" && pathParts.length > 0)
    return { matched: false, params: {} };
  return { matched: true, params };
}

interface RouteProps {
  path: string;
  element: ReactNode;
}

export function Routes({ children }: { children: ReactNode }) {
  const router = useRouter();
  // Find first matching route
  const routeChildren = Children.toArray(
    children,
  ) as ReactElement<RouteProps>[];
  for (const child of routeChildren) {
    if (!isValidElement(child)) continue;
    const { path, element } = child.props as RouteProps;
    const { matched, params } = matchRoute(path, router.path);
    if (matched) {
      return (
        <RouterContext.Provider value={{ ...router, _params: params }}>
          {element}
        </RouterContext.Provider>
      );
    }
  }
  return null;
}

export function Route(_props: RouteProps) {
  // Route is only used as a config node inside Routes - rendered by Routes itself
  return null;
}

export function Navigate({ to, replace }: { to: string; replace?: boolean }) {
  const { navigate } = useRouter();
  useEffect(() => {
    navigate(to, { replace });
  }, [to, replace, navigate]);
  return null;
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: ReactNode;
}

export function Link({ to, children, onClick, className, ...rest }: LinkProps) {
  const { navigate } = useRouter();
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClick?.(e);
    navigate(to);
  };
  return (
    <a href={`#${to}`} onClick={handleClick} className={className} {...rest}>
      {children}
    </a>
  );
}
