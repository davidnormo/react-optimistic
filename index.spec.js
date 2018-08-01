const React = require('react')
const TestRenderer = require('react-test-renderer')
const Optimistic = require('./index')

const render = (x) => TestRenderer.create(x)

describe('react-optimistic', () => {
  it('renders a starting state', () => {
    const A = () =>
      <Optimistic>
        {({ state }) => <div>{state}</div>}
      </Optimistic>

    expect(render(<A />).toJSON().children[0]).toBe(Optimistic.NOT_UPDATED_STATE)
  })

  it('renders optimistic updates', () => {
    const action = () => new Promise((res, rej) => { res() })
    const A = () =>
      <Optimistic>{
        ({ state, updater }) =>
          <div onClick={updater(action)}>
            {state}
          </div>
      }</Optimistic>

    const tree = render(<A />)
    tree.toJSON().props.onClick()

    expect(tree.toJSON().children[0]).toBe(Optimistic.UPDATED_STATE)
  })

  it('resets the state', () => {
    const action = () => new Promise((res, rej) => {
      setTimeout(rej, 0)
    })
    const A = () =>
      <Optimistic>{
        ({ state, updater, reset }) =>
          <div onUpdate={updater(action)} onReset={reset}>
            {state}
          </div>
      }</Optimistic>

    const tree = render(<A />)
    const promise = tree.toJSON().props.onUpdate()
    expect(tree.toJSON().children[0]).toBe(Optimistic.UPDATED_STATE)

    return promise.then(() => {
      expect(tree.toJSON().children[0]).toBe(Optimistic.UPDATED_STATE)

      const promise = tree.toJSON().props.onReset()
      expect(tree.toJSON().children[0]).toBe(Optimistic.NOT_UPDATED_STATE)
    })
  })

  it('resets the state and prevents rejected promise from interfering', () => {
    jest.useFakeTimers()

    const action = () => new Promise((res, rej) => {
      setTimeout(rej, 500)
    })

    const A = () =>
      <Optimistic>{
        ({ state, updater, reset }) =>
          <div onUpdate={updater(action)} onReset={reset}>
            {state}
          </div>
      }</Optimistic>

    const tree = render(<A />)
    const promise = tree.toJSON().props.onUpdate()
    expect(tree.toJSON().children[0]).toBe(Optimistic.UPDATED_STATE)

    tree.toJSON().props.onReset()
    expect(tree.toJSON().children[0]).toBe(Optimistic.NOT_UPDATED_STATE)

    jest.runAllTimers()

    return promise.then(() => {
      expect(tree.toJSON().children[0]).toBe(Optimistic.NOT_UPDATED_STATE)
    })
  })

  it('doesn\'t update if component is unmounted', () => {
    jest.useFakeTimers()

    const action = () => new Promise((res, rej) => {
      setTimeout(rej, 500)
    })

    const A = () =>
      <Optimistic>{
        ({ state, updater, reset }) =>
          <div onUpdate={updater(action)} onReset={reset}>
            {state}
          </div>
      }</Optimistic>

    const tree = render(<A />)
    const promise = tree.toJSON().props.onUpdate()
    expect(tree.toJSON().children[0]).toBe(Optimistic.UPDATED_STATE)

    tree.unmount()
    jest.spyOn(console, 'error')
    jest.runAllTimers()

    return promise.then(() => {
      expect(console.error).not.toHaveBeenCalled()
    })
  })

  it('accepts a initial state prop', () => {
    const action = () => new Promise((res, rej) => {
      setTimeout(res, 100)
    })
    const A = () =>
      <Optimistic initialState={Optimistic.UPDATED_STATE}>{
        ({ state, updater, reset }) =>
          <div onUpdate={updater(action)} onReset={reset}>
            {state}
          </div>
      }</Optimistic>

    const tree = render(<A />)
    expect(tree.toJSON().children[0]).toBe(Optimistic.UPDATED_STATE)

    tree.toJSON().props.onUpdate()
    expect(tree.toJSON().children[0]).toBe(Optimistic.NOT_UPDATED_STATE)

    tree.toJSON().props.onReset()
    expect(tree.toJSON().children[0]).toBe(Optimistic.UPDATED_STATE)
  })

  it('passes request state', () => {
    jest.useFakeTimers()

    const action = () => new Promise((res, rej) => {
      setTimeout(res, 100)
    })
    const failureAction = () => new Promise((res, rej) => {
      setTimeout(rej, 100)
    })
    const A = () =>
      <Optimistic>{
        ({ reqState, updater, reset }) =>
          <div onUpdate={updater(action)} onFail={updater(failureAction)} onReset={reset}>
            {reqState}
          </div>
      }</Optimistic>

    const tree = render(<A />)
    expect(tree.toJSON().children[0]).toBe(Optimistic.NONE_REQUEST_STATE)

    const promise = tree.toJSON().props.onUpdate()
    expect(tree.toJSON().children[0]).toBe(Optimistic.PENDING_REQUEST_STATE)

    jest.runAllTimers()

    return promise.then(() => {
      expect(tree.toJSON().children[0]).toBe(Optimistic.RESOLVED_REQUEST_STATE)

      tree.toJSON().props.onReset()
      expect(tree.toJSON().children[0]).toBe(Optimistic.NONE_REQUEST_STATE)

      const promise2 = tree.toJSON().props.onFail()
      jest.runAllTimers()
      return promise2
    }).then(() => {
      expect(tree.toJSON().children[0]).toBe(Optimistic.REJECTED_REQUEST_STATE)
    })
  })
})