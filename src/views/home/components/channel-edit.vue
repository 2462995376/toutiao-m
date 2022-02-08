<template>
  <div class="channelEdit_contain">
    <van-cell :border="false">
      <div slot="title" class="grid_title">我的频道</div>
      <van-button size="mini" round type="danger" plain @click="isEdit = !isEdit">{{ isEdit ? '完成' : '编辑' }}</van-button>
    </van-cell>

    <van-grid :gutter="10" class="my-grid">
      <van-grid-item v-for="(item, index) in channel" :key="index" class="channel-item my-item" @click="onMyChannelClick(item, index)">
        <van-icon slot="icon" name="clear" v-show="isEdit && !fixChannel.includes(item.id)"></van-icon>
        <span slot="text" class="text" :class="{ active: index === active }">{{ item.name }}</span>
      </van-grid-item>
    </van-grid>
    <van-cell :border="false">
      <div slot="title" class="grid_title">频道推荐</div>
    </van-cell>

    <van-grid :gutter="10" class="recomand-channel">
      <van-grid-item v-for="(value, index) in recomandChannel" :key="index" :text="value.name" class="channel-item recomand-item" icon="plus" @click="onAddChannel(value)" />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addUserChannels, deleteUserChannels } from '@/api/user.js'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage.js'
export default {
  name: 'channelEdit',
  data() {
    return {
      allChannels: [],
      myChannel: this.channel,
      isEdit: false,
      fixChannel: [0]
    }
  },
  created() {
    this.loadAllChannel()
  },
  computed: {
    recomandChannel() {
      return this.allChannels.filter(allChannels => {
        return !this.myChannel.find(myChannel => {
          return myChannel.id === allChannels.id
        })
      })
    },
    ...mapState(['user'])
  },
  props: {
    channel: {
      type: Array,
      require: true
    },
    active: {
      type: Number,
      require: true
    }
  },
  methods: {
    async loadAllChannel() {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (error) {
        this.$toast('数据获取失败')
      }
    },
    async onAddChannel(channel) {
      this.myChannel.push(channel)
      if (this.user) {
        // 将频道数据永久化
        try {
          await addUserChannels([
            {
              id: channel.id,
              seq: this.myChannel.length
            }
          ])
        } catch (error) {
          this.$toast('添加失败，稍后再试')
        }
      } else {
        setItem('TOUTIAO_CHANNEL', this.channel)
      }
    },
    onMyChannelClick(channel, index) {
      if (this.isEdit) {
        if (this.fixChannel.includes(channel.id)) {
          return
        }

        if (index <= this.active) {
          this.$emit('update-active', this.active - 1, true)
        }

        this.myChannel.splice(index, 1)
        this.deleteChannel(channel)
      } else {
        this.$emit('update-active', index, false)
      }
    },
    async deleteChannel(channel) {
      if (this.user) {
        try {
          await deleteUserChannels(channel.id)
        } catch (error) {
          this.$toast('删除失败，稍后再试')
        }
      } else {
        setItem('TOUTIAO_CHANNEL', this.channel)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.channelEdit_contain {
  .grid_title {
    color: #646464;
    font-size: 40px;
  }
  .channel-item {
    height: 86px;
    min-width: 0;
    white-space: nowrap;

    /deep/ .van-grid-item__content {
      background-color: #f5f5f6;
      .van-grid-item__icon-wrapper {
        position: unset;
      }
      .van-grid-item__text {
        color: #222;
        font-size: 28px;
        margin-top: 0;
      }
    }
  }
  /deep/.recomand-channel {
    .van-grid-item__content {
      flex-direction: row;
      .van-icon-plus {
        font-size: 28px;
      }
      .van-grid-item__text {
        margin-top: 0;
      }
    }
  }
  /deep/ .my-grid {
    .text {
      font-size: 28px;
    }
    .active {
      color: red;
    }
    .my-item {
      .van-icon {
        position: absolute;
        right: -14px;
        top: -16px;
        font-size: 30px;
        z-index: 2;
      }
    }
  }
}
</style>
