<template>
  <img alt="Vue logo" src="../../assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
  <Clock></Clock>
  <BindAttribute></BindAttribute>
  <EventHandling></EventHandling>
  <TwoWayBinding></TwoWayBinding>
  <ConditionalRendering></ConditionalRendering>
  <ListRendering></ListRendering>
  <TodoListApp></TodoListApp>
  <WatchExample></WatchExample>
  <ClassAndStyle></ClassAndStyle>
  <List></List>
  <TodoList></TodoList>
  <EventWithMethod></EventWithMethod>
  <br />
  <DataBind></DataBind>
  <br />
  <ButtonCounter></ButtonCounter>
  <ButtonCounter></ButtonCounter>
  <ButtonCounter></ButtonCounter>
  <BlogPostEventDemo></BlogPostEventDemo>
  <CustomInput
      :model-value="searchText"
      @update:model-value="searchText = $event"
  ></CustomInput>
  <br />
  {{ searchText }}
  <CustomInput
      v-model="searchText"
  ></CustomInput>
  <br />
  {{ searchText }}
  <AlertBox>
    THIS IS ALERT MESSAGE
  </AlertBox>
  <CurrentTab></CurrentTab>
</template>

<script>
import HelloWorld from './HelloWorld.vue'
import Clock from './Clock.vue'
import BindAttribute from './BindAttribute.vue'
import EventHandling from './EventHandling.vue'
import TwoWayBinding from './TwoWayBinding.vue'
import ConditionalRendering from './ConditionalRendering.vue'
import ListRendering from './ListRendering.vue'
import TodoListApp from './TodoListApp.vue'
import WatchExample from './WatchExample.vue'
import ClassAndStyle from './ClassAndStyle.vue'
import List from './List.vue'
import TodoList from './TodoList.vue'
import EventWithMethod from './EventWithMethod.vue'
import DataBind from './DataBind.vue'
import ButtonCounter from './ButtonCounter.vue'
import BlogPostEventDemo from './BlogPostEventDemo.vue'
import CustomInput from './CustomInput.vue'
import AlertBox from './AlertBox.vue'
import CurrentTab from "./CurrentTab.vue";

export default {
  name: 'App',
  components: {
    HelloWorld,
    Clock,
    BindAttribute,
    EventHandling,
    TwoWayBinding,
    ConditionalRendering,
    ListRendering,
    TodoListApp,
    WatchExample,
    ClassAndStyle,
    List,
    TodoList,
    EventWithMethod,
    DataBind,
    ButtonCounter,
    BlogPostEventDemo,
    CustomInput,
    AlertBox,
    CurrentTab
  },
  data: function () {
    return {
      searchText: ''
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
