/**
 * TypeScript 提供一些工具类型来帮助常见的类型转换。这些类型是全局可见的。
 */

// 1. Partial<Type>：将类型 Type 的属性全部变成可选的，返回类型表示输入类型的所有子类型
{
  interface Todo {
    title: string;
    description: string;
  }
  let todo: Partial<Todo> = {
    title: '1',
  };

  // 源码
  type Partial<T> = {
    // keyof T：获取 T 所有的键 -- in：遍历 keyof T 所有的键 -- T[P]：获取 T 指定键 P 的值
    [P in keyof T]?: T[P];
  };
}

// 2. Required<Type>：将类型 Type 的属性全部变成必选，与之相反的是 Partial
{
  interface Props {
    a?: number;
    b?: string;
  }
  const obj: Props = { a: 5 }; // OK
  const obj2: Required<Props> = { a: 5 }; // Error: property 'b' missing

  // 源码
  type Required<T> = {
    // -?：将可选修饰符删除(https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#mapping-modifiers)
    [P in keyof T]-?: T[P];
  };
}

// 3. Readonly<Type>：将类型 Type 的属性全部变成只读，也就意味着这些属性不能被重新赋值。
{
  interface Todo {
    title: string;
  }
  const todo: Readonly<Todo> = {
    title: 'Delete inactive users',
  };
  todo.title = 'Hello'; // Error: cannot reassign a readonly property

  // 源码
  type Readonly<T> = {
    readonly [P in keyof T]: T[P]; // 映射类型添加 readonly 修饰符
  };
}

// 4. Record<Keys, Type>：构造一个类型，其属性名的类型为 Keys，属性值的类型为 Type
{
  interface PageInfo {
    title: string;
  }

  type Page = 'home' | 'about' | 'contact';

  const x: Record<Page, PageInfo> = {
    about: { title: 'about' }, // 属性值的类型为 PageInfo
    contact: { title: 'contact' },
    home: { title: 'home' },
  };

  type key = keyof any; // type key = string | number | symbol
  /**
   * 源码
   *  keyof any：表示能够作为对象的 key 的类型
   *  K extends keyof any：表示 K 约束在 string | number | symbol 范围
   *  [P in K]: T：遍历传入的 K 的类型(一般为联合类型)，值为 T
   */
  type Record<K extends keyof any, T> = {
    [P in K]: T;
  };
}

// 5. Pick<Type, Keys>：从类型Type中挑选部分属性Keys来构造类型。
{
  interface Todo {
    title: string;
    description: string;
    completed: boolean;
  }
  type TodoPreview = Pick<Todo, 'title' | 'completed'>;
  const todo: TodoPreview = {
    title: 'Clean room',
    completed: false,
  };

  /**
   * keyof T：获取 T 所有的键
   * K extends keyof T：约束 K 为类型 T 的某个键
   * [P in K]：遍历 K(可以传入联合类型)
   */
  type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
  };
}

// 6. Omit<Type, Keys>：从类型Type中获取所有属性，然后从中剔除Keys属性后构造一个类型。
{
  interface Todo {
    title: string;
    description: string;
    completed: boolean;
  }

  type TodoPreview = Omit<Todo, 'description'>;

  const todo: TodoPreview = {
    title: 'Clean room',
    completed: false,
  };
}

// 参考 -- http://www.patrickzhong.com/TypeScript/zh/reference/utility-types.html#nonnullabletype
