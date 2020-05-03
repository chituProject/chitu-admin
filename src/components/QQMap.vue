<template>
  <div id="qqmap" ref="map"></div>
</template>

<script>
import maps from 'qqmap'
import { debounce } from 'lodash'

export default {
  props: {
    longitude: {
      type: Number | String,
      required: false,
      default: 116.23
    },
    latitude: {
      type: Number | String,
      required: false,
      default: 39.54
    },
    zoom: {
      type: Number,
      default: 10
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      map: null,
      marker: null,
      position: null,
      listener: [],
      unwatch: []
    }
  },
  watch: {
    longitude (val) {
      const num = +val
      if (Number.isNaN(num)) return
      this.position = new maps.LatLng(this.latitude, num)
    },
    latitude (val) {
      const num = +val
      if (Number.isNaN(num)) return
      this.position = new maps.LatLng(num, this.longitude)
    }
  },
  mounted () {
    maps.init(this.$config.mapKey, () => {
      const center = new maps.LatLng(this.latitude, this.longitude)
      this.map = new maps.Map(this.$refs.map, {
        zoom: this.zoom,
        center
      })
      this.marker = new maps.Marker({
        map: this.map,
        position: center,
        draggable: !this.disabled
      })
      this.listener.push(maps.event.addListener(this.map, 'click', (event) => {
        this.setMarker(event.latLng)
        this.$emit('update:latitude', event.latLng.getLat())
        this.$emit('update:longitude', event.latLng.getLng())
      }))
      this.listener.push(maps.event.addListener(this.marker, 'dragend', (event) => {
        this.$emit('update:latitude', event.latLng.getLat())
        this.$emit('update:longitude', event.latLng.getLng())
      }))
      this.unwatch.push(this.$watch('position', debounce(() => this.setMarker(this.position), 300)))
      this.unwatch.push(this.$watch('zoom', debounce(() => this.map.zoomTo(this.zoom))))
    })
  },
  methods: {
    setMarker (center, positionMap = true) {
      if (this.map && this.marker && !this.disabled) {
        setTimeout(() => this.map.panTo(center), 300)
        this.marker.setPosition(center)
      }
    }
  },
  beforeDestroy () {
    this.listener.forEach(lis => {
      maps.event.removeListener(lis)
    })
    this.unwatch.forEach(un => un())
  }
}
</script>

<style scoped>
#qqmap {
  height: 400px;
}
</style>
