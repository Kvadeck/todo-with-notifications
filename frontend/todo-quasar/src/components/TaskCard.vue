<script setup lang="ts">

</script>

<template>
  <div class="col-6">
    <q-card flat bordered class="my-card" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'">
      <q-card-section>
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6">Drop the garbage</div>
          </div>
          <div class="col-auto">
            <q-btn color="grey-7" round flat icon="more_vert">
              <q-menu cover auto-close>
                <q-list>
                  <q-item clickable>
                    <q-item-section>Mark as completed</q-item-section>
                  </q-item>
                  <q-item clickable>
                    <q-item-section>Remove Card</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <div class="q-pa-sm q-gutter-sm">
        <q-badge outline color="orange" label="Life" />
        <q-badge outline color="red" label="Work" />
        <q-badge outline color="cyan" label="Family" />
      </div>
    </q-card>
  </div>

</template>

<style scoped>

</style>
