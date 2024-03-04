<script lang='ts' setup>
import { Permission, JsonWebToken } from '@antify/ant-guard';

const permissions: Permission[] = [
  {
    id: 'CAN_CREATE_USER',
    name: 'Kann Benutzer erstellen'
  }, {
    id: 'CAN_DELETE_USER',
    name: 'Kann Benutzer löschen'
  }
];
const defaultToken: JsonWebToken = {
  id: 'an-user-id',
  isSuperAdmin: false,
  providers: [
    {
      providerId: 'core',
      isAdmin: false,
      permissions: permissions.map(permission => permission.id)
    }, {
      providerId: 'tenant',
      tenantId: '',
      isAdmin: false,
      permissions: permissions.map(permission => permission.id)
    }
  ]
};

onMounted(() => {
  document.title = 'Dev module playground';
});
</script>

<template>
  <div class="w-screen h-screen flex items-center justify-center text-8xl bg-neutral-lighter text-neutral-light">
    <div>Dev module playground</div>
  </div>

  <AntDevModule
    :permissions="permissions"
    :default-token="defaultToken"
  />
</template>
