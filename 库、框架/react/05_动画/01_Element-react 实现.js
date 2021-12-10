/**
 * @deprecated
 */
class Transition extends React.Component {
  constructor(props) {
    super(props);

    const { children } = props; // 需要动画的元素

    this.state = {
      children: children && this.enhanceChildren(children),
    };

    this.didEnter = this.didEnter.bind(this);
    this.didLeave = this.didLeave.bind(this);
  }

  // 已挂载的组件接收新的 props 之前被调用。
  componentWillReceiveProps(nextProps) {
    const children =
      React.isValidElement(this.props.children) &&
      React.Children.only(this.props.children);
    const nextChildren =
      React.isValidElement(nextProps.children) &&
      React.Children.only(nextProps.children);

    if (!nextProps.name) {
      this.setState({
        children: nextChildren,
      });
      return;
    }

    if (this.isViewComponent(nextChildren)) {
      this.setState({
        children: this.enhanceChildren(nextChildren, {
          show: children ? children.props.show : true,
        }),
      });
    } else {
      if (nextChildren) {
        this.setState({
          children: this.enhanceChildren(nextChildren),
        });
      }
    }
  }

  // 更新后会被立即调用。
  componentDidUpdate(preProps) {
    if (!this.props.name) return;

    const children =
      React.isValidElement(this.props.children) && // 验证对象是否为 React 元素
      React.Children.only(this.props.children); // 验证 children 是否只有一个子节点
    const preChildren =
      React.isValidElement(preProps.children) && // 上一个子元素
      React.Children.only(preProps.children);

    if (this.isViewComponent(children)) {
      if ((!preChildren || !preChildren.props.show) && children.props.show) {
        this.toggleVisible();
      } else if (
        preChildren &&
        preChildren.props.show &&
        !children.props.show
      ) {
        this.toggleHidden();
      }
    } else {
      if (!preChildren && children) {
        this.toggleVisible(); // 进入动画
      } else if (preChildren && !children) {
        this.toggleHidden();
      }
    }
  }

  enhanceChildren(children, props) {
    return React.cloneElement(
      children,
      Object.assign(
        {
          ref: (el) => {
            this.el = el;
          },
        },
        props
      )
    );
  }

  // 动画的类
  get transitionClass() {
    const { name } = this.props;

    return {
      enter: `${name}-enter`,
      enterActive: `${name}-enter-active`,
      enterTo: `${name}-enter-to`,
      leave: `${name}-leave`,
      leaveActive: `${name}-leave-active`,
      leaveTo: `${name}-leave-to`,
    };
  }

  isViewComponent(element) {
    return element && element.type._typeName === 'View';
  }

  /* css animation fix when animation applyied to .{action} instanceof .{action}-active */

  animateElement(element, action, active, fn) {
    element.classList.add(active);

    const styles = getComputedStyle(element);
    const duration =
      parseFloat(styles['animationDuration']) ||
      parseFloat(styles['transitionDuration']);

    element.classList.add(action);

    if (duration === 0) {
      const styles = getComputedStyle(element);
      const duration =
        parseFloat(styles['animationDuration']) ||
        parseFloat(styles['transitionDuration']);

      clearTimeout(this.timeout);

      this.timeout = setTimeout(() => {
        fn();
      }, duration * 1000);
    }

    element.classList.remove(action, active);
  }

  didEnter(e) {
    const childDOM = ReactDOM.findDOMNode(this.el); // 如果组件已经被挂载到 DOM 上，此方法会返回浏览器中相应的原生 DOM 元素

    if (!e || e.target !== childDOM) return;

    const { onAfterEnter } = this.props;
    const { enterActive, enterTo } = this.transitionClass;

    childDOM.classList.remove(enterActive, enterTo);

    childDOM.removeEventListener('transitionend', this.didEnter);
    childDOM.removeEventListener('animationend', this.didEnter);

    onAfterEnter && onAfterEnter();
  }

  didLeave(e) {
    const childDOM = ReactDOM.findDOMNode(this.el);
    if (!e || e.target !== childDOM) return;

    const { onAfterLeave, children } = this.props;
    const { leaveActive, leaveTo } = this.transitionClass;

    new Promise((resolve) => {
      if (this.isViewComponent(children)) {
        childDOM.removeEventListener('transitionend', this.didLeave);
        childDOM.removeEventListener('animationend', this.didLeave);

        requestAnimationFrame(() => {
          childDOM.style.display = 'none';
          childDOM.classList.remove(leaveActive, leaveTo);

          requestAnimationFrame(resolve);
        });
      } else {
        this.setState({ children: null }, resolve);
      }
    }).then(() => {
      onAfterLeave && onAfterLeave();
    });
  }

  // 进入动画
  toggleVisible() {
    debugger;
    const { onEnter } = this.props;
    const { enter, enterActive, enterTo, leaveActive, leaveTo } =
      this.transitionClass; // 进入动画类
    const childDOM = ReactDOM.findDOMNode(this.el); // 获取组件的 DOM

    childDOM.addEventListener('transitionend', this.didEnter);
    childDOM.addEventListener('animationend', this.didEnter);

    // this.animateElement(childDOM, enter, enterActive, this.didEnter);

    requestAnimationFrame(() => {
      // when hidden transition not end 隐藏转换未结束时
      if (childDOM.classList.contains(leaveActive)) {
        childDOM.classList.remove(leaveActive, leaveTo);

        childDOM.removeEventListener('transitionend', this.didLeave);
        childDOM.removeEventListener('animationend', this.didLeave);
      }

      childDOM.style.display = '';
      childDOM.classList.add(enter, enterActive);

      onEnter && onEnter();

      requestAnimationFrame(() => {
        childDOM.classList.remove(enter);
        childDOM.classList.add(enterTo);
      });
    });
  }

  toggleHidden() {
    const { onLeave } = this.props;
    const { leave, leaveActive, leaveTo, enterActive, enterTo } =
      this.transitionClass;
    const childDOM = ReactDOM.findDOMNode(this.el);

    childDOM.addEventListener('transitionend', this.didLeave);
    childDOM.addEventListener('animationend', this.didLeave);

    // this.animateElement(childDOM, leave, leaveActive, this.didLeave);

    requestAnimationFrame(() => {
      // when enter transition not end
      if (childDOM.classList.contains(enterActive)) {
        childDOM.classList.remove(enterActive, enterTo);

        childDOM.removeEventListener('transitionend', this.didEnter);
        childDOM.removeEventListener('animationend', this.didEnter);
      }

      childDOM.classList.add(leave, leaveActive);

      onLeave && onLeave();

      requestAnimationFrame(() => {
        childDOM.classList.remove(leave);
        childDOM.classList.add(leaveTo);
      });
    });
  }

  render() {
    // 渲染函数直接渲染子元素
    return this.state.children || null;
  }
}

window.Transition = Transition;
