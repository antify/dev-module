<script lang='ts' setup>
import { Permission, useGuard, JsonWebToken } from '@antify/ant-guard';
import AntDevProviderBox from './AntDevProviderBox.vue';
import { useNuxtApp } from 'nuxt/app';
import { format, getUnixTime } from 'date-fns';
import { faPlus, faMultiply } from '@fortawesome/free-solid-svg-icons';

const permissions = inject<Permission[]>('permissions');
const defaultToken = inject<Permission[]>('defaultToken');
const props = defineProps<{
  open: boolean
}>();
const emit = defineEmits(['update:open']);
const guard = await useGuard(useNuxtApp().ssrContext?.event);
const _token = ref<JsonWebToken>(guard.getToken() || createToken());
const { status, execute } = useFetch(
  '/api/dev-module/create-jwt',
  {
    method: 'POST',
    body: _token,
    immediate: false,
    watch: false,
    onResponse() {
      guard.reset();

      _token.value = guard.getToken();
    }
  }
);
const _open = computed({
  get() {
    return props.open;
  },
  set(val) {
    emit('update:open', val);
  }
});

watch(_open, (val) => {
  if (val) {
    guard.reset();
    _token.value = guard.getToken() || createToken();
  }
});

async function login() {
  await execute();
}

async function logout() {
  guard.logoutUser();
  _token.value = createToken();
}

function reset() {
  _token.value = defaultToken || createToken({
    providers: [
      createEmptyProvider({ 'providerId': 'core' }),
      createEmptyProvider({ 'providerId': 'tenant' })
    ]
  });
}

function createToken(data: JsonWebToken = {}): JsonWebToken {
  return {
    ...{
      id: '',
      isSuperAdmin: false,
      providers: [
        createEmptyProvider()
      ]
    },
    ...data
  };
}

function createEmptyProvider(data = {}) {
  return {
    ...{
      isAdmin: false,
      providerId: '',
      tenantId: '',
      permissions: []
    }, ...data
  };
}

function addProvider(data = {}) {
  _token.value.providers.push(createEmptyProvider(data));
}

function removeProvider(index) {
  _token.value.providers.splice(index, 1);
}

const iat = computed({
  get() {
    if (!_token.value.iat) {
      return null;
    }

    return format(new Date(_token.value.iat * 1000), 'yyyy-MM-dd\'T\'HH:mm:ss');
  },
  set(val) {
    _token.value.iat = getUnixTime(new Date(val));
  }
});

const exp = computed({
  get() {
    if (!_token.value.exp) {
      return null;
    }

    return format(new Date(_token.value.exp * 1000), 'yyyy-MM-dd\'T\'HH:mm:ss');
  },
  set(val) {
    _token.value.exp = getUnixTime(new Date(val));
  }
});
</script>

<template>
  <AntModal
    v-model:open="_open"
    title="Generate JWT"
    :fullscreen="true"
  >
    <div class="flex justify-between space-x-4">
      <div class="flex flex-col space-y-2 flex-grow">
        <AntTextInput
          v-model:value="_token.id"
          label="ID"
        />

        <AntCheckbox
          v-model="_token.isSuperAdmin"
          label="Superadmin"
        />

        <div>Providers</div>

        <div class="flex flex-wrap">
          <AntDevProviderBox
            v-for="(provider, index) of _token.providers"
            v-model:is-admin="provider.isAdmin"
            v-model:provider-id="provider.providerId"
            v-model:tenant-id="provider.tenantId"
            v-model:permissions="provider.permissions"
            class="mb-4 mr-4"
            @remove="() => removeProvider(index)"
          />

          <div class="flex items-center mb-4">
            <AntButton
              primary
              :icon-left="faPlus"
              @click="addProvider"
            />
          </div>
        </div>
      </div>

      <div class="w-2/5 flex-shrink-0 space-y-2">
        <!-- TODO:: Replace with ui module's date input field -->
        <AntInput
          v-model:value="iat"
          label="Issued at"
          type="datetime-local"
        />
        <AntInput
          v-model:value="exp"
          label="Expired at"
          type="datetime-local"
        />

        <div class="bg-neutral-lighter rounded border border-neutral-light">
          <pre class="p-2">{{ _token }}</pre>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <div class="flex space-x-2.5">
          <AntButton @click="logout">Logout</AntButton>
          <AntButton @click="reset">Set default data</AntButton>
          <AntButton
            color-type="primary"
            :disabled="status === 'pending'"
            @click="login"
          >
            Login
          </AntButton>
        </div>
      </div>
    </template>
  </AntModal>
</template>
