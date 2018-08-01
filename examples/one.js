const React = require('react')
const Optimistic = require('../index')
const ReactDOM = require('react-dom')

console.log(Optimistic)

const successfulAction = () => new Promise((res) => {
  console.log('successful')
  setTimeout(res, 1500)
})

const failedAction = (e) => e.preventDefault() || new Promise((res, rej) => {
  console.log('failure')
  setTimeout(rej, 1500)
})

const ExampleOne = () =>
  <Optimistic>
    {({ state, updater, reset }) =>
      <button
        onClick={updater(successfulAction)}
        onContextMenu={updater(failedAction)}
        onKeyDown={(e) => { e.preventDefault(); reset() } }
        style={{
          background: state === Optimistic.START_STATE ? 'lightGreen' :
                      state === Optimistic.FAILED_STATE ? 'tomato' :
                      'orange',
          padding: '10px',
          cursor: 'pointer',
          border: '1px solid #555',
          borderRadius: '2px',
          userSelect: 'none',
        }}>
        {
          state === Optimistic.START_STATE ? 'Click me' :
          state === Optimistic.UPDATED_STATE ? 'Optimistic update!' :
          'Failed state!'
        }
      </button>}
  </Optimistic>

ReactDOM.render(<ExampleOne />, document.querySelector('#root'))