import 'braft-editor/dist/braft.css'

import * as React from 'react'
import Dropzone from 'react-dropzone'
import { connect } from 'react-redux'

import PropTypes from 'prop-types'

import BraftEditor from 'braft-editor'
import { Dispatch } from 'redux'
import striptags from 'striptags'
import { readTaskPaperFile } from './actions'
import './components.css'
import parse from './parser'

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
      onHTMLChange: this.handleChange
    }

    // const controls = ['undo', 'redo']

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
        <BraftEditor extendControls={extendControls} {...editorProps} ref={(instance) => this.editorInstance = instance}/>
      </div>
    );
  }

  public handleChange = (content:string) => {
    const stripContent = striptags(content, '<p>').replace(/<p>/g, '').replace(/<\/p>/g, '\n')
    window.console.log(stripContent)
  }

  public setContent = (content:string) => {
    const parsed = parse(content)
    const editor = (this.editorInstance as any)
    editor.setContent(this.mapProjectsToHtml(parsed.children))
  }

  public rerender = () => {
    const { store } = this.context
    this.setContent(store.getState().content)
  }

  public mapTaskToHtml = (task: any) => {
    const taskTags = task.tags? task.tags: []

    let lineThrough:boolean = false
    lineThrough = false

    for (const t of taskTags) {
      if (t === 'done' || t.startsWith('done(')) {
        lineThrough = true
      }
    }

    let tags = taskTags.map((t:string) => `@${t}`).join(' ')
    if (tags) {
      tags = `<span style="color:#999999">${tags}</span>`
    }

    if (lineThrough) {
      return `<p>\t- <span style="text-decoration:line-through">${task.value}</span> ${tags}</p>`
    } else {
      return `<p>\t- ${task.value} ${tags}</p>`
    }
  }

  public mapTasksToHtml = (tasks: [any]) => {
    return tasks.map((t) => this.mapTaskToHtml(t)).join('')
  }

  public mapProjectToHtml = (project: any) => {
    const projectHtml = `<p>${project.value}:</p>`
    return projectHtml + this.mapTasksToHtml(project.children)
  }

  public mapProjectsToHtml = (projects: any) => {
    return projects.map((p:any) => this.mapProjectToHtml(p)).join('')
  }
}

export default TaskPaper