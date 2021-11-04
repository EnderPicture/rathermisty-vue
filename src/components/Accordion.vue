<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue";

const enterExpand = (e: Element) => {
  (e as HTMLElement).style.height =
    (e.children[0] as HTMLElement).offsetHeight + "px";
};
const beforeLeaveExpand = (e: Element) => {
  (e as HTMLElement).style.height =
    (e.children[0] as HTMLElement).offsetHeight + "px";
};
const leaveExpand = (e: Element) => {
  (e as HTMLElement).style.height = "0px";
};
const afterEnterExpand = (e: Element) => {
  (e as HTMLElement).style.height = "auto";
};
const afterLeaveExpand = (e: Element) => {
  controledOpen.value = false;
};

const container = ref<HTMLElement>();

const props = defineProps<{
  open: boolean;
}>();

const controledOpen = ref(false);

onMounted(() => {
  controledOpen.value = props.open;
  if (props.open && container.value) {
    container.value.style.height = "auto";
  }
});

watch(
  () => [props.open],
  (newValue) => {
    if (newValue) {
      controledOpen.value = true;
    }
  }
);
</script>

<template>
  <details :open="controledOpen" @click.prevent>
    <summary @click="$emit('toggle-accordion')">
      <slot name="summary"></slot>
    </summary>
    <div class="clip">
      <transition
        name="expand"
        @enter="enterExpand"
        @leave="leaveExpand"
        @before-leave="beforeLeaveExpand"
        @after-enter="afterEnterExpand"
        @after-leave="afterLeaveExpand"
      >
        <div ref="container" class="container" v-if="open">
          <div>
            <slot name="details"></slot>
          </div>
        </div>
      </transition>
    </div>
  </details>
</template>

<style lang="scss" scoped>
summary {
  position: sticky;
  top: 0;
}
.container {
  overflow: hidden;
  height: 0px;
  transform: translateY(0);
}
.clip {
  overflow: hidden;
}

details {
  > summary {
    list-style: none;
  }
}

.expand-enter-active,
.expand-leave-active {
  transition: opacity 0.35s cubic-bezier(0.25, 0, 0.25, 1),
    height 0.35s cubic-bezier(0.25, 0, 0.25, 1),
    transform 0.35s cubic-bezier(0.25, 0, 0.25, 1);
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
