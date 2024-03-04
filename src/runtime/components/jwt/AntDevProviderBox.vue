<script lang='ts' setup>
import { Permission } from '@antify/ant-guard';
import { faMultiply } from '@fortawesome/free-solid-svg-icons';

const emit = defineEmits([
  'update:providerId',
  'update:tenantId',
  'update:permissions',
  'remove'
]);
const props = withDefaults(defineProps<{
  isAdmin: boolean,
  permissions: string[],
  providerId: string,
  tenantId?: string
}>(), {
  permissions: [],
  tenantId: ''
});
const allPermissions = inject<Permission[]>('permissions')
  .map((item) => ({
    value: item.id,
    label: item.name
  }));
const _permissions = computed({
  get() {
    return props.permissions;
  },
  set(val) {
    emit('update:permissions', val);
  }
});
const _providerId = computed({
  get() {
    return props.providerId;
  },
  set(val) {
    emit('update:providerId', val);
  }
});
const _tenantId = computed({
  get() {
    return props.tenantId;
  },
  set(val) {
    emit('update:tenantId', val);
  }
});
const _isAdmin = computed({
  get() {
    return props.isAdmin;
  },
  set(val) {
    emit('update:isAdmin', val);
  }
});

function selectAll() {
  emit('update:permissions', allPermissions.map((permission) => permission.value));
}

function unselectAll() {
  emit('update:permissions', []);
}
</script>

<template>
  <div class="bg-neutral-lighter p-2 rounded flex flex-col space-y-2 border border-neutral-light">
    <div class="flex justify-end">
      <AntButton
        :icon-left="faMultiply"
        size="sm"
        outlined
        @click="() => $emit('remove')"
      />
    </div>

    <AntCheckbox
      v-model="_isAdmin"
      label="Admin"
    />

    <AntTextInput
      v-model:value="_providerId"
      label="Provider ID"
      autofocus
    />

    <AntTextInput
      v-model:value="_tenantId"
      label="Tenant ID"
    />

    <div>
      <AntField label="Permissions">
        <div class="mb-2 flex space-x-2.5">
          <AntButton
            size="sm"
            @click="selectAll"
          >
            Select all
          </AntButton>

          <AntButton
            size="sm"
            @click="unselectAll"
          >
            Unselect all
          </AntButton>
        </div>
      </AntField>

      <AntCheckboxGroup
        v-model="_permissions"
        :checkboxes="allPermissions"
      />
    </div>
  </div>
</template>
