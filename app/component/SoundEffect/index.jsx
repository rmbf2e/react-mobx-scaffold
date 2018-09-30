import Events from 'events'
import React from 'react'

export const emitter = new Events()

class SoundEffect extends React.Component {
  constructor(props) {
    super(props)
    this.successAudio = React.createRef()
    this.failureAudio = React.createRef()
  }

  componentDidMount() {
    emitter.on('success', this.play('success'))
    emitter.on('failure', this.play('failure'))
  }

  // 每次播放，重置audio播放状态重新播放
  play = type => () => {
    const audio = this[`${type}Audio`].current
    if (audio) {
      audio.pause()
      audio.currentTime = 0
      audio.play()
    }
  }

  render() {
    return (
      <div hidden>
        <audio
          ref={this.successAudio}
          preload="auto"
          src="/asset/media/success.m4a"
        >
          <track kind="captions" label="success" />
        </audio>
        <audio
          ref={this.failureAudio}
          preload="auto"
          src="/asset/media/failure.m4a"
        >
          <track kind="captions" label="failure" />
        </audio>
      </div>
    )
  }
}

export default SoundEffect
