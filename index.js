const React = require('react')
const PropTypes = require('prop-types')

class Optimistic extends React.Component {
  constructor(props) {
    super(props)
    this.state = { state: props.initialState }
  }

  componentWillUnmount() {
    if (this.promise) this.promise.cancelled = true
  }

  render() {
    return this.props.children({
      state: this.state.state,
      reset: () => {
        if (this.promise) this.promise.cancelled = true
        this.setState({
          state: this.props.initialState,
        })
      },
      updater: (action) =>
        (...args) => {
          this.setState({
            state: this.state.state === Optimistic.NOT_UPDATED_STATE
              ? Optimistic.UPDATED_STATE
              : Optimistic.NOT_UPDATED_STATE,
          })
          this.promise = action(...args)

          return this.promise.catch(() => {
            if (this.promise.cancelled) return

            this.setState({
              state: Optimistic.FAILED_STATE
            })
          })
        }
    })
  }
}

Optimistic.NOT_UPDATED_STATE = 'not updated'
Optimistic.UPDATED_STATE = 'updated'
Optimistic.FAILED_STATE = 'failed'

Optimistic.defaultProps = {
  initialState: Optimistic.NOT_UPDATED_STATE,
}

Optimistic.propTypes = {
  children: PropTypes.func.isRequired,
  initialState: PropTypes.oneOf([
    Optimistic.NOT_UPDATED_STATE,
    Optimistic.UPDATED_STATE,
    Optimistic.FAILED_STATE,
  ])
}

module.exports = Optimistic