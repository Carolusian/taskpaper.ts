import 'braft-editor/dist/braft.css'

import * as React from 'react'
import Dropzone from 'react-dropzone'
import { connect } from 'react-redux'

import PropTypes from 'prop-types'

import BraftEditor from 'braft-editor'
import { RawDraftContentState } from 'draft-js'
import { Dispatch } from 'redux'
import { readTaskPaperFile } from './actions'
import './components.css'
// import parse from './parser'

// Define helpers
const nl2br = (raw:string) => raw.replace(/(?:\r\n|\r|\n)/g, '<br>')

interface ITaskPaperReaderProps {
  dispatch: Dispatch
}

class TaskPaperReader extends React.Component<ITaskPaperReaderProps, {}> {
  constructor(props:ITaskPaperReaderProps) {
    super(props)
    this.state = { files: []}
    this.onDrop = this.onDrop.bind(this)
  }

  public onDrop = (files:File[]) => {
    this.setState({ files })
    // One file a time
    const file1 = files[0]
    const reader = new FileReader()

    // Load file content
    reader.onload = (f:any) => {
      this.props.dispatch(readTaskPaperFile(f.target.result))
    }
    reader.readAsText(file1)
  }

  public render() {
    return (
      <Dropzone className="TaskPaperReader" onDrop={this.onDrop}>
        Drop your taskpaper file here.
      </Dropzone>
    )
  }
}

const ConnectedTaskPaperReader = connect()(TaskPaperReader)

class TaskPaper extends React.Component<any, any> {

  public static contextTypes = {
    store: PropTypes.object
  }

  public editorInstance: BraftEditor | null 

  constructor(props:any) {
    super(props)
    this.editorInstance = null
  }

  public render() {
    const { store } = this.context
    store.subscribe(this.rerender)

    const editorProps: BraftEditor.editorProps = {
      contentFormat: 'html',
      height: 500,
      initialContent: nl2br(store.getState().content),
      onChange: this.handleChange
    }

    const controls = ['undo', 'redo']

    const extendControls = [
      {
        className: 'preview-button',
        hoverTitle: 'Done task!',
        onClick: () => window.console.log('Hello World!'),
        text: 'Done',
        type: 'button',
      }
    ]

    return (
      <div className="TaskPaper">
        <ConnectedTaskPaperReader />
        <BraftEditor controls={controls} extendControls={extendControls} {...editorProps} ref={(instance) => this.editorInstance = instance}/>
      </div>
    );
  }

  public handleChange = (content: RawDraftContentState) => {
    window.console.log(content)
  }

  public setContent = (content:string) => {
    (this.editorInstance as any).setContent(nl2br(content))
  }

  public rerender = () => {
    const { store } = this.context
    this.setContent(store.getState().content)
  }
}

export default TaskPaper