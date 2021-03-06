<template>
  <div>
    <b-input-group>
      <b-form-input
        v-model="model"
        type="number"
        :min="min"
        :max="max"
        :step="step"
      />
    </b-input-group>
    <vue-slider
      v-if="useSlider"
      v-model="model"
      :min="min"
      :max="max"
      :interval="step"
      class="mt-2"
    />
  </div>
</template>

<script>
export default {
  name: 'NumberFilter',
  props: {
    /**
     * The minimum allowed filter value.
     */
    min: {
      type: Number,
      default: () => Number.MIN_SAFE_INTEGER
    },
    /**
     * The maximum allowed filter value.
     */
    max: {
      type: Number,
      default: () => Number.MAX_SAFE_INTEGER
    },
    /**
     * Step size when using browser UI controls.
     */
    step: {
      type: Number,
      default: () => 1
    },
    /**
     * The number to be used in filtering items.
     * @model
     */
    value: {
      type: Number,
      default: () => 0
    },
    /**
     * Whether to use an additional UI slider to set the input value.
     */
    useSlider: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      /**
       * v-model return value
       *
       * @event input
       * @property {Array} Returns new array without the deleted item
       */
      set (value) {
        if (typeof value === 'string' && value === '') {
          this.$emit('input', undefined)
        } else {
          value = Math.min(Math.max(value, this.min), this.max)
          /**
          * v-model return value
          *
          * @event input
          * @property {Float} Returns new filter value or NaN
          */
          this.$emit('input', parseFloat(value))
        }
      }
    }
  }
}
</script>

<docs>
Browser number input filter with additional options.
### Usage
```jsx
const model = 5
<NumberFilter
  v-bind:collapses="false"
  v-bind:maxVisibleOptions="5"
  v-model="model"
  v-bind:min="0"
  v-bind:max="10"
  v-bind:step="2"
  v-bind:useSlider="true"
  label="Number"
  name="number">
</NumberFilter>
<div>{{model}}</div>
```
</docs>
