<template>
  <div class="app-container">
    <div class="tree_left">
      <h4>{{ title }}</h4>
      <el-tree
        :data="data"
        :props="defaultProps"
        @node-click="handleNodeClick"
      />
    </div>
    <PageRight />
  </div>
</template>

<script>
import PageRight from './components/left'

export default {
  components: { PageRight },
  data() {
    return {
      title: '部门选择',
      data: [
        {
          label: '一级 1',
          children: [
            {
              label: '二级 1-1',
              children: [
                {
                  label: '三级 1-1-1'
                }
              ]
            }
          ]
        },
        {
          label: '一级 2',
          children: [
            {
              label: '二级 2-1',
              children: [
                {
                  label: '三级 2-1-1'
                }
              ]
            },
            {
              label: '二级 2-2',
              children: [
                {
                  label: '三级 2-2-1'
                }
              ]
            }
          ]
        },
        {
          label: '一级 3',
          children: [
            {
              label: '二级 3-1',
              children: [
                {
                  label: '三级 3-1-1'
                }
              ]
            },
            {
              label: '二级 3-2',
              children: [
                {
                  label: '三级 3-2-1'
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    handleNodeClick(data) {
      console.log(data)
    }
  }
}
</script>
<style scoped>
.app-container {
  width: 100%;
  height: 100%;
  display: flex;
  min-height: calc(100vh - 84px);
}
.tree_left {
  width: 20%;
  height: 100%;
  border-right: 1px solid #ccc;
  min-height: calc(100vh - 84px);
}
</style>
