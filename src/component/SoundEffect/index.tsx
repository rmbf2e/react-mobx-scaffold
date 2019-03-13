import Events from 'events'
import React, { RefObject } from 'react'

export const emitter = new Events()

export class SoundEffect extends React.Component {
  public successAudio: RefObject<HTMLAudioElement>
  public failureAudio: RefObject<HTMLAudioElement>
  public playSuccess: () => void
  public playFailure: () => void

  constructor(props: object) {
    super(props)
    this.successAudio = React.createRef()
    this.failureAudio = React.createRef()
    this.playSuccess = this.play('success')
    this.playFailure = this.play('failure')
  }

  public componentDidMount() {
    emitter.on('success', this.playSuccess)
    emitter.on('failure', this.playFailure)
  }

  public componentWillUnmount() {
    emitter.removeListener('success', this.playSuccess)
    emitter.removeListener('failure', this.playFailure)
  }

  // 每次播放，重置audio播放状态重新播放
  public play = (type: 'success' | 'failure') => () => {
    const map = {
      success: this.successAudio,
      failure: this.failureAudio,
    }
    const audio: HTMLAudioElement | null = map[type].current
    if (!!audio) {
      audio.pause()
      audio.currentTime = 0
      audio.play()
    }
  }

  public render() {
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
