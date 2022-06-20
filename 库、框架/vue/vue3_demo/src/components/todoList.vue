<script setup lang="ts">
import { computed, DirectiveBinding, reactive, ref } from 'vue';

let uid = 0;

interface TodoType {
  /** 待办事项 */
  title: string;
  id: number;
  /** 是否完成 */
  completed: boolean;
}

const todos = reactive<TodoType[]>([]);
const filterTodos = computed(() => {
  switch (visibility.value) {
    case 'all':
      return [...todos];
    case 'active':
      return todos.filter((item) => !item.completed);
    case 'completed':
      return todos.filter((item) => item.completed);
    default:
      break;
  }
});

/** 添加待办事项 */
const newTodo = ref('');
const addTodo = () => {
  if (newTodo.value?.trim()) {
    // 添加待办事项
    todos.push({
      id: uid++,
      title: newTodo.value,
      completed: false,
    });
    newTodo.value = '';
  }
};
// 全部完成
const allDone = computed<boolean>({
  set(val) {
    todos.forEach((item) => (item.completed = val));
  },
  get() {
    return remaining.value === 0;
  },
});

/** 删除 todo */
const deleteTodo = (id: number) => {
  const item = todos.findIndex((item) => item.id === id);

  if (item < 0) return;
  todos.splice(item, 1);
};

/** 编辑 todo */
const editedTodo = ref<TodoType>();
let cacheeditedTodo: string;
const editTodo = (todo: TodoType) => {
  editedTodo.value = todo;
  cacheeditedTodo = todo.title;
};
// 编辑完成
const doneEdit = (todo: TodoType) => {
  if (!editedTodo) return;

  if (!todo.title?.trim()) {
    deleteTodo(todo.id);
  }
  editedTodo.value = undefined;
};
// 取消编辑
const cancelEdit = (todo: TodoType) => {
  if (cacheeditedTodo) {
    todo.title = cacheeditedTodo;
  }
  editedTodo.value = undefined;
};

/** 自定义指令，input 获取焦点 */
const vTodoFocus = (
  el: HTMLInputElement,
  binding: DirectiveBinding<boolean>
) => {
  if (binding.value) {
    el?.focus();
  } else {
    el?.blur();
  }
};

/** 底部统计 */
// 未完成项
const remaining = computed(
  () => todos.filter((item) => !item.completed).length
);
const pluralize = (n: number) => {
  return n === 1 ? 'item' : 'items';
};
// 查看 list
type Visibility = 'all' | 'active' | 'completed';
const visibility = ref<Visibility>('all');
// 删除所有已完成
const removeCompleted = () => {
  todos.filter((item) => item.completed).forEach((item) => deleteTodo(item.id));
};
</script>

<template>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input
        class="new-todo"
        autofocus
        autocomplete="off"
        placeholder="需要做什么?"
        v-model="newTodo"
        @keyup.enter="addTodo"
      />
    </header>
    <section class="main" v-show="todos.length">
      <input
        id="toggle-all"
        class="toggle-all"
        type="checkbox"
        v-model="allDone"
      />
      <label for="toggle-all"></label>
      <ul class="todo-list">
        <li
          class="todo"
          v-for="todo in filterTodos"
          :key="todo.id"
          :class="{ completed: todo.completed, editing: todo == editedTodo }"
        >
          <div class="view">
            <input class="toggle" type="checkbox" v-model="todo.completed" />
            <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
            <button class="destroy" @click="deleteTodo(todo.id)"></button>
          </div>
          <input
            class="edit"
            type="text"
            v-model="todo.title"
            v-todo-focus="todo == editedTodo"
            @blur="doneEdit(todo)"
            @keyup.enter="doneEdit(todo)"
            @keyup.esc="cancelEdit(todo)"
          />
        </li>
      </ul>
    </section>
    <footer class="footer" v-show="todos.length">
      <span class="todo-count">
        <strong>{{ remaining }}</strong>
        {{ pluralize(remaining) }} left
      </span>
      <ul class="filters">
        <li>
          <a
            style="cursor: pointer"
            @click="visibility = 'all'"
            :class="{ selected: visibility == 'all' }"
          >
            All
          </a>
        </li>
        <li>
          <a
            style="cursor: pointer"
            @click="visibility = 'active'"
            :class="{ selected: visibility == 'active' }"
          >
            Active
          </a>
        </li>
        <li>
          <a
            style="cursor: pointer"
            @click="visibility = 'completed'"
            :class="{ selected: visibility == 'completed' }"
          >
            Completed
          </a>
        </li>
      </ul>
      <button
        class="clear-completed"
        @click="removeCompleted"
        v-show="todos.length > remaining"
      >
        Clear completed
      </button>
    </footer>
  </section>
  <footer class="info">
    <p>双击编辑待办事项</p>
  </footer>
</template>

<style lang="scss" scoped></style>
