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

    expect(render(<A />).toJSON().children[0]).toBe('start')
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

    expect(tree.toJSON().children[0]).toBe('updated')
  })

  it('renders failed on reject', () => {
    const action = () => new Promise((res, rej) => {
      setTimeout(rej, 0)
    })
    const A = () =>
      <Optimistic>{
        ({ state, updater }) =>
          <div onClick={updater(action)}>
            {state}
          </div>
      }</Optimistic>

    const tree = render(<A />)
    const promise = tree.toJSON().props.onClick()
    expect(tree.toJSON().children[0]).toBe('updated')

    return promise.then(() => {
      expect(tree.toJSON().children[0]).toBe('failed')
    })
  })

  it('resets the state', () => {
    const action = () => new Promise((res, rej) => {
      setTimeout(rej, 0)
    })
    const A = () =>
      <Optimistic>{
        ({ state, updater, reset }) =>
          <div onClick={state === Optimistic.START_STATE ? updater(action) : reset}>
            {state}
          </div>
      }</Optimistic>

    const tree = render(<A />)
    const promise = tree.toJSON().props.onClick()
    expect(tree.toJSON().children[0]).toBe('updated')

    return promise.then(() => {
      expect(tree.toJSON().children[0]).toBe('failed')

      const promise = tree.toJSON().props.onClick()
      expect(tree.toJSON().children[0]).toBe('start')
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
    expect(tree.toJSON().children[0]).toBe('updated')

    tree.toJSON().props.onReset()
    expect(tree.toJSON().children[0]).toBe('start')

    jest.runAllTimers()

    return promise.then(() => {
      expect(tree.toJSON().children[0]).toBe('start')
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
    expect(tree.toJSON().children[0]).toBe('updated')

    tree.unmount()
    jest.spyOn(console, 'error')
    jest.runAllTimers()

    return promise.then(() => {
      expect(console.error).not.toHaveBeenCalled()
    })
  })
})