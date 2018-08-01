# react-optimistic

_A generic, optimistic update helper._

## Intro
A naive, optimistic button.

![naive optimistic button gif](./react-optimistic-naive.gif)

```
import Optimistic from 'react-optimistic'

// ...

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
```

## API

- Optimistic : ReactComponent

  The Optimistic component takes a render prop with the following signature:
  ```
  ({ state: string, reqState : string, updater : function, reset : function }) : ReactElement
  ```

  - props
    - children : function
      - args
        - options : object
          - options.state : string - The current state
          - options.reqState : string - The current state of the promise
          - options.updater : function - A function which takes a function that returns a promise
          - options.reset : function - A 0-arity function used for resetting the state
      - returns
        - ReactElement

    - initialState : string
