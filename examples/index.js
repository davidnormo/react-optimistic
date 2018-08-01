const React = require('react')
const Optimistic = require('../index')
const ReactDOM = require('react-dom')

const successfulAction = () => new Promise((res) => {
  console.log('successful promise created')
  setTimeout(res, 1500)
})

const failedAction = (e) => e.preventDefault() || new Promise((res, rej) => {
  console.log('rejection promise created')
  setTimeout(rej, 1500)
})

const ExampleOne = () =>
  <div>
  <h2>Basic example</h2>
  <Optimistic>
    {({ state, reqState, updater, reset }) =>
      <button
        onClick={updater(successfulAction)}
        onContextMenu={updater(failedAction)}
        onKeyDown={(e) => { e.preventDefault(); reset() } }
        className="optimistic-btn"
        style={{
          background: reqState === Optimistic.REJECTED_REQUEST_STATE ? 'tomato' :
                      state === Optimistic.NOT_UPDATED_STATE ? 'lightGreen' :
                      'orange',
        }}>
        {
          reqState === Optimistic.REJECTED_REQUEST_STATE ? 'Failed state!' :
          state === Optimistic.UPDATED_STATE ? 'Optimistic update!' :
          'Click me'
        }
      </button>}
  </Optimistic>
    <ul>
      <li>click - optimistic update with success after 1.5 secs</li>
      <li>right click - optimistic update with failure after 1.5 secs</li>
      <li>focus button then press any key - reset to starting state</li>
    </ul>
<h3>Code:</h3>
    <code><pre>
{`<Optimistic>
  {({ state, reqState, updater, reset }) =>
    <button
      onClick={updater(successfulAction)}
      onContextMenu={updater(failedAction)}
      onKeyDown={(e) => { e.preventDefault(); reset() } }
      style={{
        background: reqState === Optimistic.REJECTED_REQUEST_STATE ? 'tomato' :
                    state === Optimistic.NOT_UPDATED_STATE ? 'lightGreen' :
                    'orange',
      }}>
      {
        reqState === Optimistic.REJECTED_REQUEST_STATE ? 'Failed state!' :
        state === Optimistic.UPDATED_STATE ? 'Optimistic update!' :
        'Click me'
      }
    </button>}
</Optimistic>`}
</pre></code>
  </div>

const ExampleTwo = () =>
  <div>
    <h2>Throttled Toggle example</h2>
    <p>Prevents click spamming. While promise is pending, it doesn't accept new updates. After the request has resolved/rejected, new updates are accepted.</p>
    <Optimistic>
      {({ state, reqState, updater }) =>
        <div>
          <button
            className="optimistic-btn"
            onClick={reqState === Optimistic.PENDING_REQUEST_STATE
              ? () => {}
              : updater(successfulAction)}
            >
            {state}
          </button>
          <br />
          Request state: {reqState}
        </div>
      }
    </Optimistic>
<h3>Code:</h3>
    <code><pre>
{`<Optimistic>
  {({ state, reqState, updater }) =>
    <div>
      <button onClick={reqState === Optimistic.PENDING_REQUEST_STATE
        ? noop
        : updater(successfulAction)}>
        {state}
      </button>
      <br />
      Request state: {reqState}
    </div>
  }
</Optimistic>`}
</pre></code>
  </div>

const ExampleThree = () =>
  <div>
    <h2>Unthrottled Toggle example</h2>
    <p>Unlike the above example, this one lets you spam updates</p>
    <Optimistic>
      {({ state, reqState, updater }) =>
        <div>
          <button
            className="optimistic-btn"
            onClick={updater(successfulAction)}
            >
            {state}
          </button>
          <br />
          Request state: {reqState}
        </div>
      }
    </Optimistic>
<h3>Code:</h3>
    <code><pre>
{`<Optimistic>
  {({ state, reqState, updater }) =>
    <div>
      <button
        onClick={updater(successfulAction)}
        >
        {state}
      </button>
      <br />
      Request state: {reqState}
    </div>
  }
</Optimistic>`}
</pre></code>
  </div>


ReactDOM.render(
  <div>
    <ExampleOne />
    <ExampleTwo />
    <ExampleThree />
  </div>,
  document.querySelector('#root')
)