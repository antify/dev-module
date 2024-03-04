<script lang='ts' setup>
import { JsonWebToken, Permission } from '@antify/ant-guard';
import { faUserShield } from '@fortawesome/free-solid-svg-icons';

enum Position {
  topRight = 'top-right',
  bottomRight = 'bottom-right',
  bottomLeft = 'bottom-left',
  topLeft = 'top-left'
}

const props = withDefaults(defineProps<{
  position?: Position,
  permissions?: Permission[],
  defaultToken?: JsonWebToken,
}>(), {
  position: Position.bottomRight,
  permissions: [],
  defaultToken: null
});
const jwtModalOpen = ref(false);

provide<Permission[]>('permissions', props.permissions);
provide<Permission[]>('defaultToken', props.defaultToken);
</script>

<template>
  <div
    class="fixed p-1.5 bg-neutral-light border border-neutral-light rounded-full flex items-center justify-center cursor-pointer hover:drop-shadow-lg transition-all"
    :class="{'top-2.5 right-2.5': position === 'top-right', 'bottom-2.5 right-2.5': position === 'bottom-right', 'bottom-2.5 left-2.5': position === 'bottom-left', 'top-2.5 left-2.5': position === 'top-left'}"
    @click="() => jwtModalOpen = !jwtModalOpen"
  >
    <AntIcon
      :icon="faUserShield"
      size="md"
      class="text-neutral-light-font"
    />
  </div>

  <AntDevJwt v-model:open="jwtModalOpen" />
</template>
