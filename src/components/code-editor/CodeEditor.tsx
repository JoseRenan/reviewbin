import { Component, useEffect, useState } from 'react'
import { IAceEditorProps } from 'react-ace'

const Editor = (props: IAceEditorProps) => {
  const [newMode, setNewMode] = useState(props.mode)

  useEffect(() => {
    async function importMode() {
      await import(`ace-builds/src-noconflict/mode-${props.mode}`)
      setNewMode(props.mode)
    }
    importMode()
  }, [props.mode])

  if (typeof window !== 'undefined') {
    const Ace = require('react-ace').default
    require('ace-builds/src-noconflict/theme-tomorrow')
    require(`ace-builds/src-noconflict/mode-${newMode}`)
    const modifiedProps = {
      ...props,
      mode: newMode,
      theme: 'tomorrow',
      width: '100%',
      showPrintMargin: false,
      fontSize: 12,
      highlightActiveLine: false,
      style: {
        ...props.style,
        fontFamily: `SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace`,
      },
    }
    return <Ace {...modifiedProps} />
  }

  return null
}

export default class CodeEditor extends Component<IAceEditorProps> {
  state = { mounted: false }

  componentDidMount() {
    this.setState({ mounted: true })
  }

  render = () => (this.state.mounted ? <Editor {...this.props} /> : null)
}
