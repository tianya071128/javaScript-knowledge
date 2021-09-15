<template>
  <div id="app">
    <el-button type="danger">
      危险按钮
    </el-button>

    <svg-icon iconClass="component" class="icon" />
    <div
      class="test-asdf-asdf-asgasd-gasdf-asdgasd-gasdfgasd"
      w="22"
      h="33"
      size="saf"
    >
      123
    </div>
    <small id="helper id" class="form-text text-muted">
      A longish piece of text here
    </small>
    <p
      *ngIf="this.parent.descriptors && this.parent.descriptors.length"
      class="post-meta"
    >
      <span
        class="post-meta__item"
        *ngFor="let descriptor of this.parent.descriptors"
      >
        Another piece of text here
      </span>
    </p>
  </div>
</template>

<script>
export default {
  name: 'app',
  mounted() {
    const fn = x => {
      console.log(x);
    };
    console.log(222, fn);
  }
};
</script>

<style lang="scss">
.test {
  font-size: 16px;
  display: flex;
}
</style>
