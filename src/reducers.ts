import { Action, ActionTypes } from './actions'

const defaultContent = `Welcome:
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
// Define state
const defaultState = {
    content: defaultContent
}

// Define reducers
export const rootReducer = (state = defaultState, action: Action) => {
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