import 'braft-editor/dist/braft.css'

import * as React from 'react'
import Dropzone from 'react-dropzone'

import BraftEditor from 'braft-editor'
import { RawDraftContentState } from 'draft-js'
import './components.css'

import { createStore } from 'redux'

// Define state
interface IState {
  content: string
}

const initialState: IState = {
  content: `Welcome:
	- TaskPaper knows about projects, tasks, notes, and tags.
	- It auto-formats these items so that your lists are easier to read.
	- Delete this text when you are ready to start your own lists.
To Create Items:
	- To create a task, type a dash followed by a space.
	- To create a project, type a line ending with a colon.
	- To create a tag, type '@' followed by the tag’s name.
To Organize Items:
	- To indent items press the Tab key.
	- To un-indent items press Shift-Tab.
	- To mark a task done click leading dash.
To Fold, Focus, and Filter Items:
	- To fold/unfold an item click the dot to the left of the item.
	- To focus on a single project select it in the sidebar.
	- To filter your list enter a search in the toolbar search field.
` 
}

// Define actions
enum ActionTypes {
  READ_TASKPAPER_FILE = 'READ_TASKPAPER_FILE', 
  SAVE_TASKPAPER_FILE = 'SAVE_TASKPAPER_FILE'
}

interface IReadTaskPaperAction { type: ActionTypes.READ_TASKPAPER_FILE, payload: { content:string }}
interface ISaveTaskPaperAction { type: ActionTypes.SAVE_TASKPAPER_FILE, payload: { content:string }}

type Action = IReadTaskPaperAction | ISaveTaskPaperAction

// Define reducers
const rootReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case ActionTypes.READ_TASKPAPER_FILE: {
      const contentBody = action.payload.content 
      const ret = {
        ...state, content: contentBody
      }
      return ret
    }
    default: {
      return state
    }
  }
}

const store = createStore(rootReducer)

// Define helpers
const nl2br = (raw:string) => raw.replace(/(?:\r\n|\r|\n)/g, '<br>')

class TaskPaperReader extends React.Component {
  constructor(props:any) {
    super(props)
    this.state = { files: []}
    this.onDrop = this.onDrop.bind(this)
  }

  public onDrop = (files:any) => {
    this.setState({ files })
    // One file a time
    const file1 = files[0]
    const reader = new FileReader()

    // Load file content
    reader.onload = (f:any) => {
      store.dispatch({
        payload: {
          content: f.target.result
        },
        type: ActionTypes.READ_TASKPAPER_FILE
      })
    }
    reader.readAsText(file1)
  }

  public render() {
    return (
      <Dropzone className="TaskPaperReader" onDrop={this.onDrop}>
        Try dropping your taskpaper file here.
      </Dropzone>
    )
  }
}

class TaskPaper extends React.Component<any, any> {
  public editorInstance:BraftEditor|null = null

  public render() {
    const editorProps: BraftEditor.editorProps = {
      contentFormat: 'html',
      height: 500,
      initialContent: nl2br(this.props.content),
      onChange: this.handleChange,
      onRawChange: this.handleRawChange
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
        <TaskPaperReader />
        <BraftEditor controls={controls} extendControls={extendControls} {...editorProps} ref={(instance) => this.editorInstance = instance}/>
      </div>
    );
  }

  public handleChange(content: RawDraftContentState) {
    window.console.log(content)
  }

  public handleRawChange(rawContent: RawDraftContentState) {
    window.console.log(rawContent)
  }
  
  public forceRender() {
    (this.editorInstance as any).setContent(nl2br(store.getState().content))
  }
}

export { store, TaskPaper }