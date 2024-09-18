<script lang="ts" setup>
interface Props {
  transparent?: boolean,
  size?: 'md' | 'lg' | 'full'; 
}
const props = withDefaults(defineProps<Props>(),{
  transparent: false,
  size: 'md',
});

const classes = computed(() => ({
  'xl:max-w-[924px] mx-auto px-5': props.size === 'md' ,
  'w-full min-[451px]:px-11 md:py-7 xs:py-5 max-w-[1440px] mx-auto max-[820px]:px-7 max-[450px]:px-5': props.size === 'lg',
  'w-full mx-auto px-5 md:px-7 xl:px-11': props.size === 'full',
}));
</script>
<template>
  <div :class="classes">
    <slot/>
  </div>
</template>
