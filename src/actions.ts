// Define actions
export enum ActionTypes {
  READ_TASKPAPER_FILE = 'READ_TASKPAPER_FILE', 
  SAVE_TASKPAPER_FILE = 'SAVE_TASKPAPER_FILE',
  CHANGE_CONTENT= 'CHANGE_CONTENT' 
}

interface IReadTaskPaperAction { type: ActionTypes.READ_TASKPAPER_FILE, payload: { content:string }}
interface ISaveTaskPaperAction { type: ActionTypes.SAVE_TASKPAPER_FILE, payload: { content:string }}
interface IChangeContentAction { type: ActionTypes.CHANGE_CONTENT, payload: { content:string }}

export type Action = IReadTaskPaperAction | ISaveTaskPaperAction | IChangeContentAction

// Actions are only description of actions
export const readTaskPaperFile = (fileContent:string) =>  {
    return {
        payload: {
            content: fileContent
        },
        type: ActionTypes.READ_TASKPAPER_FILE
    }
}

// export const changeContent = (changedContent:any) => {
//     return {
//         payload: {
//             content: changedContent
//         },
//         type: ActionTypes.CHANGE_CONTENT
//     }
// }