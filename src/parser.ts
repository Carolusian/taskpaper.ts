import * as P from 'parsimmon'

// Newline
const NEWLINE = P.string('\n').atLeast(1).or(P.eof)

// Indentation
const INDENT = P.regex(/[\t\s]+/)

// Task tag
const TAG = P.regex(/@([^\(\s]+(\([^\)]*\))?)/, 1)

// String without @tags
const NON_TAG_STRING = P.regex(/(?:[^@\n][^\s\n]*)(?:[ \t]+[^@\n][^\s\n]*)*/)

const TAGS = P.seq(P.regexp(/[\t ]+/), TAG).map(([_, tag]) => tag).many()

// Project definition
const PROJECT = P.seq(
    P.index,
    P.regex(/([^\n]+?):[^\S\n]*/, 1),
    TAGS)
  .skip(NEWLINE)
  .map(([index, value, tags]) => {
    return { type: 'project', value, tags, index }
  })
  .desc('Project definition')

/*
 * Task definition
 *     "- hello @done"
 */
const TASK = P.seq(
    P.index,
    P.string('- '),
    NON_TAG_STRING,
    TAGS
  ).skip(NEWLINE)
  .map(([index, _, value, tags]) => ({ type: 'task', value, tags, index }))
  .desc('Task definition')

/*
 * Note definition
 */

const NOTE = P.seq(
    P.index,
    P.regex(/[^-\n]([^\n]*[^:\n])?\n*/)
  ).map(([index, value]) => ({ type: 'note', value, index }))
  .desc('Note definition')

/*
 * A block
 */

function block(depth = 1, prefix = '') {
    return parentBlock(depth, prefix).or(leafBlock(depth, prefix))
}

function leafBlock(depth = 1, prefix = ''):P.Parser<{}> {
    return P.seq(
        P.string(prefix),
        depth === 1 ? P.string('') : INDENT,
        NOTE)
        // Consolidate into one note node
        .map(([pre, ind, value]) => value)
        .atLeast(1)
        .map(notes => ({
            depth,
            index: notes[0].index,
            type: 'note',
            value: notes.map(n => n.value).join('').trim() + '\n'
        }))
}

function parentBlock(depth = 1, prefix = ''):P.Parser<{}> {
    return P.seq(
        P.string(prefix),
        depth === 1 ? P.string('') : INDENT,
        PROJECT.or(TASK)
    ).chain(([pre, ind, item]) => {
        return block(depth + 1, pre + ind).many()
            .map(children => {
                const out:any = item;
                out.depth = depth
                out.children = children
                return out
            })
    })
}

const parser = block().many()

/*
 * Let's parse something
 */

function parse (str:string) {
  // Remove trailing whitespace characters in each line to make sure the parser works correctly
  const trimmedStr = str.split('\n').map((line:string) => line.trimRight()).join('\n')
  const out = parser.parse(trimmedStr);
  if (out.status) {
    return { type: 'document', depth: 0, children: out.value }
  } else {
    const err = new Error(`Parse error in line ${out.index.line}, expected ${out.expected.join(' or ')}`)
    throw err
  }
}

export default parse 
